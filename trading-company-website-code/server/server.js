import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import messagesRoutes from './routes/messages.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: 'http://127.0.0.1:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

let dbInitialized = false;
const dbInitPromise = initDb().then(() => {
  dbInitialized = true;
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// Middleware to ensure DB is ready before routing in Serverless
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await dbInitPromise;
    } catch (err) {
      return res.status(500).json({ error: 'Database initialization failed' });
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/messages', messagesRoutes);

// Only start listening if not running in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  dbInitPromise.then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://127.0.0.1:${PORT}`);
    });
  });
}

export default app;
