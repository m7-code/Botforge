import express from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const websiteSchema = z.object({
  url: z.string().url(),
  name: z.string().optional(),
});

// GET /api/v1/websites
router.get('/', authenticateToken, async (req, res) => {
  try {
    const websites = await prisma.websites.findMany({
      where: { userId: req.user.id },
      include: { bot_config: true },
    });
    return res.json({ success: true, data: { websites }, message: 'Websites fetched' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/v1/websites
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { url, name } = websiteSchema.parse(req.body);

    const website = await prisma.websites.create({
      data: {
        userId: req.user.id,
        url,
        name: name || url,
        status: 'pending',
      },
    });

    // Bot config auto create
    await prisma.bot_configs.create({
      data: {
        websiteId: website.id,
        greeting: 'Hello! How can I help you today?',
        tone: 'professional',
        position: 'bottom_right',
      },
    });

    // Crawl automatically shuru karo
    const { crawlWebsite } = await import('../jobs/crawlWebsite.js');
    crawlWebsite(website.id).catch(console.error);

    return res.status(201).json({ success: true, data: { website }, message: 'Website added' });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, message: err.issues?.[0]?.message || 'Validation error' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/websites/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const website = await prisma.websites.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: { bot_config: true },
    });
    if (!website) return res.status(404).json({ success: false, message: 'Website not found' });
    return res.json({ success: true, data: { website }, message: 'Website fetched' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/v1/websites/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const website = await prisma.websites.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!website) return res.status(404).json({ success: false, message: 'Website not found' });

    await prisma.websites.delete({ where: { id: website.id } });
    return res.json({ success: true, message: 'Website deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/v1/websites/:id/recrawl
router.post('/:id/recrawl', authenticateToken, async (req, res) => {
  try {
    const website = await prisma.websites.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!website) return res.status(404).json({ success: false, message: 'Website not found' });

    // Purane chunks delete 
    await prisma.content_chunks.deleteMany({ where: { websiteId: website.id } });

    // Status pending
    await prisma.websites.update({
      where: { id: website.id },
      data: { status: 'pending', pages_crawled: 0 },
    });

    // Crawl shuru 
    const { crawlWebsite } = await import('../jobs/crawlWebsite.js');
    crawlWebsite(website.id).catch(console.error);

    return res.json({ success: true, message: 'Recrawl started' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;