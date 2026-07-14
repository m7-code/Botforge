import prisma from '../lib/prisma.js';

const PLAN_LIMITS = {
  free:    { conversations: 0,    websites: 0 },
  starter: { conversations: 5000,  websites: 3 },
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

    const userPlan = user.plan || 'free';   // agar null ya undefined hai to free maano
    const limits = PLAN_LIMITS[userPlan];

    if (!limits) {
      return res.status(403).json({
        success: false,
        message: 'Unknown plan. Please contact support.',
      });
    }

    // Free plan – koi bhi access nahi
    if (userPlan === 'free') {
      return res.status(403).json({
        success: false,
        message: 'Free plan is no longer available. Please upgrade to continue.',
        upgrade_required: true,
      });
    }

    // Agency – unlimited
    if (!limits.websites) return next();

    // Website creation limit
    if (req.method === 'POST' && !req.params.id) {
      if (user._count.websites >= limits.websites) {
        return res.status(429).json({
          success: false,
          message: `Plan limit reached! Your ${userPlan} plan allows only ${limits.websites} website(s). Please upgrade.`,
          upgrade_required: true,
          current: user._count.websites,
          limit: limits.websites,
        });
      }
    }

    // Conversation limit
    if (user.monthly_conversations >= limits.conversations) {
      return res.status(429).json({
        success: false,
        message: `Plan limit reached! Your ${userPlan} plan allows only ${limits.conversations} monthly conversation(s). Please upgrade.`,
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