import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import websiteRoutes from './routes/websites.js';
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Pehle JSON parsing
app.use(express.json());

// ✅ Phir CORS
app.use('/api/v1/chat', cors({ origin: '*' }));
app.use('/api/v1/admin', cors({ origin: '*', credentials: false }));
app.use(cors({ origin: '*', credentials: false }));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// ✅ Phir routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/websites', websiteRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/admin', adminRoutes);  // ← Admin route yahan

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'BotForge running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});