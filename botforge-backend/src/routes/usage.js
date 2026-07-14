import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/usage — current user ka conversation usage
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        plan: true,
        monthly_conversations: true,   // already stored
      },
    });

    const PLAN_LIMITS = {
      free:    0,
      starter: 5000,
      pro:     25000,
      agency:  Infinity,   // unlimited
    };

    const limit = PLAN_LIMITS[user.plan] ?? 0;
    const used = user.monthly_conversations;

    return res.json({
      success: true,
      data: {
        plan: user.plan,
        used,
        limit: limit === Infinity ? 'Unlimited' : limit,
        remaining: limit === Infinity ? 'Unlimited' : Math.max(0, limit - used),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;