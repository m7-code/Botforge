import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import websiteRoutes from './routes/websites.js';
import chatRoutes from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Chat routes — sab origins allow (widget kisi bhi site pe ho sakta)
app.use('/api/v1/chat', cors({ origin: '*' }));

// Baaki routes
app.use(cors({ origin: '*', credentials: false }));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/websites', websiteRoutes);
app.use('/api/v1/chat', chatRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'BotForge running!' });
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});