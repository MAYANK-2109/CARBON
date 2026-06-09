/**
 * @module server
 * @description Express application entry point.
 * Configures middleware stack, mounts API routes, and starts the server.
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/environment';
import { connectDatabase } from './config/database';
import { generalLimiter } from './middleware/rate-limiter.middleware';
import { errorHandler } from './middleware/error.middleware';

// Feature routes
import authRoutes from './features/auth/auth.routes';
import calculatorRoutes from './features/calculator/calculator.routes';
import historyRoutes from './features/history/history.routes';
import tipsRoutes from './features/tips/tips.routes';
import chatRoutes from './features/chat/chat.routes';

const app = express();

// ─── Security Middleware ─────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Parsing Middleware ──────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ─── Rate Limiting ───────────────────────────────────────
app.use('/api', generalLimiter);

// ─── API Routes ──────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/calculate', calculatorRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/chat', chatRoutes);

// ─── Health Check ────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// ─── Error Handler (must be last) ────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────
async function start(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════╗
║  🌍 Carbon Footprint Assistant — API Server      ║
║  ─────────────────────────────────────────────── ║
║  Environment: ${env.NODE_ENV.padEnd(33)}║
║  Port:        ${String(env.PORT).padEnd(33)}║
║  API:         http://localhost:${env.PORT}/api${' '.repeat(12)}║
╚══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
