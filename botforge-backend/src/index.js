import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import websiteRoutes from './routes/websites.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CORS Configuration (Sab se upar rakhein)
const allowedOrigins = [
  process.env.FRONTEND_URL, // http://localhost:5173
  'http://localhost:5173'    // Fallback agar env na milay
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body parsing
app.use(express.json());

// 3. Global rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// 4. Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/websites', websiteRoutes);

// Chat route ke liye agar special CORS chahiye toh specific route pe dein
// Lekin filhaal global CORS hi sab handle kar lega

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'BotForge running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});