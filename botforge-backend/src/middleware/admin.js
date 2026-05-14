import prisma from '../lib/prisma.js';

export const requireAdmin = async (req, res, next) => {
  try {
    // authenticateToken pehle run ho chuka hoga
    const user = await prisma.users.findUnique({
      where: { id: req.user.id }
    });

    if (!user || !user.is_admin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    req.adminUser = user;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};