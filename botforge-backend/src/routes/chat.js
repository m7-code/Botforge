import express from 'express';
import prisma from '../lib/prisma.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { success: false, error: 'Too many messages, try again later' }
});

// GET /api/v1/chat/:bot_id/config
router.get('/:bot_id/config', async (req, res) => {
  try {
    const website = await prisma.websites.findFirst({
      where: { bot_id: req.params.bot_id },
      include: { bot_config: true }
    });
    if (!website || website.status !== 'ready') {
      return res.status(404).json({ success: false, error: 'Bot not found' });
    }
    return res.json({
      success: true,
      data: {
        bot_name: website.bot_config?.bot_name || 'AI Assistant',
        greeting: website.bot_config?.greeting || 'Hello! How can I help you?',
        accent_color: website.bot_config?.accent_color || '#0F2A4A',
        position: website.bot_config?.position || 'bottom_right',
        website_name: website.name,
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/chat/:bot_id/start
router.post('/:bot_id/start', async (req, res) => {
  try {
    const website = await prisma.websites.findFirst({
      where: { bot_id: req.params.bot_id, status: 'ready' }
    });
    if (!website) return res.status(404).json({ success: false, error: 'Bot not found' });

    const conversation = await prisma.conversations.create({
      data: {
        websiteId: website.id,
        visitor_ip: req.ip,
      }
    });

    return res.json({ success: true, data: { conversation_id: conversation.id } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/chat/:bot_id/message
router.post('/:bot_id/message', chatLimiter, async (req, res) => {
  const { conversation_id, message } = req.body;

  if (!conversation_id || !message) {
    return res.status(400).json({ success: false, error: 'conversation_id and message required' });
  }

  try {
    const website = await prisma.websites.findFirst({
      where: { bot_id: req.params.bot_id, status: 'ready' },
      include: { bot_config: true }
    });
    if (!website) return res.status(404).json({ success: false, error: 'Bot not found' });

    const conversation = await prisma.conversations.findUnique({
      where: { id: conversation_id }
    });
    if (!conversation) return res.status(404).json({ success: false, error: 'Conversation not found' });

    // Simple search — message words se chunks dhundo
    const keywords = message.toLowerCase().split(' ')
      .filter(w => w.length > 3)
      .slice(0, 5);

    let chunks = [];
    if (keywords.length > 0) {
      chunks = await prisma.content_chunks.findMany({
        where: {
          websiteId: website.id,
          OR: keywords.map(k => ({
            content: { contains: k, mode: 'insensitive' }
          }))
        },
        take: 5,
        orderBy: { id: 'asc' }
      });
    }

    // Agar koi chunks nahi mile to random lo
    if (chunks.length === 0) {
      chunks = await prisma.content_chunks.findMany({
        where: { websiteId: website.id },
        take: 3,
      });
    }

    const context = chunks.map(c => c.content).join('\n\n');
    const botName = website.bot_config?.bot_name || 'AI Assistant';
    const tone = website.bot_config?.tone || 'professional';

    // OpenAI call
    const OPENAI_KEY = process.env.OPENAI_API_KEY;

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (!OPENAI_KEY || OPENAI_KEY === 'sk-your-key-here') {
      // Demo mode — OpenAI key nahi hai
      const demoResponse = chunks.length > 0
        ? `Based on our website content: ${chunks[0].content.slice(0, 200)}...`
        : `I'm ${botName}. I can help you with questions about ${website.name}. Please ask me anything!`;

      const words = demoResponse.split(' ');
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ token: word + ' ' })}\n\n`);
        await new Promise(r => setTimeout(r, 50));
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();

      // Save messages
      await prisma.messages.create({ data: { conversationId: conversation_id, role: 'user', content: message } });
      await prisma.messages.create({ data: { conversationId: conversation_id, role: 'assistant', content: demoResponse } });
      return;
    }

    // Real OpenAI streaming
    const systemPrompt = `You are ${botName}, an AI assistant for ${website.name}. 
Tone: ${tone}. 
Answer ONLY from the context below. If the answer is not in the context, say you are not sure and suggest contacting support.

CONTEXT:
${context}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    let fullResponse = '';
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

      for (const line of lines) {
        const data = line.replace('data: ', '');
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const token = parsed.choices?.[0]?.delta?.content || '';
          if (token) {
            fullResponse += token;
            res.write(`data: ${JSON.stringify({ token })}\n\n`);
          }
        } catch {}
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

    // Save messages
    await prisma.messages.create({ data: { conversationId: conversation_id, role: 'user', content: message } });
    await prisma.messages.create({ data: { conversationId: conversation_id, role: 'assistant', content: fullResponse } });

  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

export default router;