import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// Sab routes pe dono middleware
router.use(authenticateToken, requireAdmin);

// ── GET /api/v1/admin/users ─────────────────────────────────────────────────
// Sab users ki list
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        is_admin: true,
        monthly_conversations: true,
        createdAt: true,
        _count: { select: { websites: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, data: { users } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/v1/admin/users/:id/plan ──────────────────────────────────────
// Kisi bhi user ka plan change karo
router.patch('/users/:id/plan', async (req, res) => {
  try {
    const { plan } = req.body;
    const validPlans = ['free', 'starter', 'pro', 'agency'];

    if (!validPlans.includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const user = await prisma.users.update({
      where: { id: parseInt(req.params.id) },
      data: { plan },
      select: { id: true, name: true, email: true, plan: true }
    });

    return res.json({ success: true, data: { user }, message: `Plan updated to ${plan}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/v1/admin/users/:id/admin ─────────────────────────────────────
// Kisi ko admin banao ya hatao
router.patch('/users/:id/admin', async (req, res) => {
  try {
    const { is_admin } = req.body;

    const user = await prisma.users.update({
      where: { id: parseInt(req.params.id) },
      data: { is_admin: Boolean(is_admin) },
      select: { id: true, name: true, email: true, is_admin: true }
    });

    return res.json({ success: true, data: { user }, message: `Admin status updated` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/v1/admin/users/:id ──────────────────────────────────────────
// User delete karo
router.delete('/users/:id', async (req, res) => {
  try {
    // Apne aap ko delete mat karo
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }

    await prisma.users.delete({ where: { id: parseInt(req.params.id) } });
    return res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/v1/admin/stats ─────────────────────────────────────────────────
// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalWebsites, totalConversations, planCounts] = await Promise.all([
      prisma.users.count(),
      prisma.websites.count(),
      prisma.conversations.count(),
      prisma.users.groupBy({
        by: ['plan'],
        _count: { plan: true }
      })
    ]);

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalWebsites,
        totalConversations,
        planCounts,
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;