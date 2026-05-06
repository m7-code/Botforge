import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import websiteRoutes from './routes/websites.js';
import chatRoutes from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing
app.use(express.json());

// CORS — Chat routes ke liye sab allow
app.use('/api/v1/chat', cors({ origin: '*' }));

// Baaki routes ke liye
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));

// Global rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/websites', websiteRoutes);
app.use('/api/v1/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'BotForge running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});