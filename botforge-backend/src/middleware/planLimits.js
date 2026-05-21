import prisma from '../lib/prisma.js';

const PLAN_LIMITS = {
  free:    { conversations: 500,   websites: 1  },
  starter: { conversations: 5000,  websites: 3  },
  pro:     { conversations: 25000, websites: 10 },
  agency:  { conversations: null,  websites: null },
};

export const checkPlanLimits = async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      include: { _count: { select: { websites: true } } }
    });

    if (!user) return next();

    const limits = PLAN_LIMITS[user.plan];

    // Agency — unlimited
    if (!limits.websites) return next();

    // ✅ Website limit check — POST /websites pe
    if (req.method === 'POST' && !req.params.id) {
      if (user._count.websites >= limits.websites) {
        return res.status(429).json({
          success: false,
          message: `❌ Plan limit reached! Your ${user.plan} plan allows only ${limits.websites} website(s). Please upgrade your plan.`,
          upgrade_required: true,
          current: user._count.websites,
          limit: limits.websites,
        });
      }
    }

    // ✅ Conversation limit check
    if (user.monthly_conversations >= limits.conversations) {
      return res.status(429).json({
        success: false,
        message: `❌ Monthly conversation limit reached (${limits.conversations}). Please upgrade your plan.`,
        upgrade_required: true,
        current_usage: user.monthly_conversations,
        limit: limits.conversations,
      });
    }

    next();
  } catch (err) {
    console.error('Plan limit check error:', err);
    next();
  }
};