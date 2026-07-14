import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';
import prisma from './lib/prisma.js';          // ✅ ADD THIS

import authRoutes from './routes/auth.js';
import websiteRoutes from './routes/websites.js';
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/admin.js';
import usageRoutes from './routes/usage.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. JSON body parser
app.use(express.json());

// 2. Global CORS (sab routes ke liye)
app.use(cors({ origin: '*', credentials: false }));

// 3. Global rate limiter
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// 4. Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/websites', websiteRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/usage', usageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'BotForge running!' });
});

// 5. Monthly conversation reset (every 1st of month at midnight)
cron.schedule('0 0 1 * *', async () => {
  try {
    await prisma.users.updateMany({
      data: { monthly_conversations: 0 },
    });
    console.log('✅ Monthly conversation counters reset.');
  } catch (err) {
    console.error('❌ Monthly reset error:', err);
  }
});

// 6. Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});