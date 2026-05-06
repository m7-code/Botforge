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

    // Keywords se chunks dhundo
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

    if (chunks.length === 0) {
      chunks = await prisma.content_chunks.findMany({
        where: { websiteId: website.id },
        take: 3,
      });
    }

    const context = chunks.map(c => c.content).join('\n\n');
    const botName = website.bot_config?.bot_name || 'AI Assistant';
    const tone = website.bot_config?.tone || 'professional';

    const AI_KEY = process.env.AI_API_KEY;
    const AI_BASE_URL = process.env.AI_BASE_URL;
    const AI_MODEL = process.env.AI_MODEL || 'gemini-2.5-flash';

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Agar key nahi hai — Demo mode
    if (!AI_KEY || AI_KEY === 'your-key-here') {
      const demoResponse = chunks.length > 0
        ? `Based on our website: ${chunks[0].content.slice(0, 200)}...`
        : `I'm ${botName}. How can I help you with ${website.name}?`;

      for (const word of demoResponse.split(' ')) {
        res.write(`data: ${JSON.stringify({ token: word + ' ' })}\n\n`);
        await new Promise(r => setTimeout(r, 40));
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();

      await prisma.messages.create({ data: { conversationId: conversation_id, role: 'user', content: message } });
      await prisma.messages.create({ data: { conversationId: conversation_id, role: 'assistant', content: demoResponse } });
      return;
    }

    // Real AI Streaming
    
    const systemPrompt = `You are ${botName}, a helpful AI assistant for ${website.name}.
Tone: ${tone}.

INSTRUCTIONS:
1. If the user is just greeting you (e.g., 'hi', 'hello', 'hey', 'salam'), respond politely and ask how you can help them with ${website.name}.
2. For any specific questions, answer ONLY using the information provided in the CONTEXT below.
3. If the user's question cannot be answered using the CONTEXT, do not guess. Simply say you are not sure and suggest contacting support.

CONTEXT:
${context}`;

    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI API Error:', errText);
      res.write(`data: ${JSON.stringify({ error: 'AI service error' })}\n\n`);
      res.end();
      return;
    }

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

    await prisma.messages.create({ data: { conversationId: conversation_id, role: 'user', content: message } });
    await prisma.messages.create({ data: { conversationId: conversation_id, role: 'assistant', content: fullResponse } });

  } catch (err) {
    console.error('Chat error:', err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

export default router;