/**
 * @module server
 * @description Express application entry point.
 * Configures middleware stack, mounts API routes, and starts the server.
 */

import http from 'http';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { env } from './config/environment';
import { connectDatabase } from './config/database';
import { generalLimiter } from './middleware/rate-limiter.middleware';
import { errorHandler } from './middleware/error.middleware';
import { requestId } from './middleware/request-id.middleware';
import { httpLogger } from './middleware/http-logger.middleware';
import { logger } from './utils/logger';
import { setupSwagger } from './config/swagger';

// Feature routes
import authRoutes from './features/auth/auth.routes';
import calculatorRoutes from './features/calculator/calculator.routes';
import historyRoutes from './features/history/history.routes';
import tipsRoutes from './features/tips/tips.routes';
import chatRoutes from './features/chat/chat.routes';

const app = express();

// ─── Observability Middleware ─────────────────────────────
app.use(requestId);
app.use(httpLogger);

// ─── Security Middleware ─────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "http://localhost:*"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
}));

// Split CORS_ORIGIN by comma to support multiple origins, and fallback to localhost
const allowedOrigins = (env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, '')); // trim and remove trailing slashes

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // Check if the origin matches our allowed list, localhost, or any vercel.app subdomain
    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.startsWith('http://localhost:');

    if (isAllowed) {
      callback(null, origin);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
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

// ─── API v1 Routes ───────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/calculate', calculatorRoutes);
app.use('/api/v1/history', historyRoutes);
app.use('/api/v1/tips', tipsRoutes);
app.use('/api/v1/chat', chatRoutes);

// Legacy aliases for backward compatibility
app.use('/api/auth', authRoutes);
app.use('/api/calculate', calculatorRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/chat', chatRoutes);

// ─── Health Check ────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res
    .set('Cache-Control', 'no-store')
    .status(200)
    .json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: 'v1',
      },
    });
});

// ─── API Docs (dev only) ─────────────────────────────────
if (!env.isProduction) setupSwagger(app);

// ─── Error Handler (must be last) ────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────
async function start(): Promise<void> {
  try {
    await connectDatabase();

    const server = http.createServer(app);

    server.listen(env.PORT, () => {
      logger.info('Server started', {
        port: env.PORT,
        env: env.NODE_ENV,
        api: `http://localhost:${env.PORT}/api`,
      });
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

    // ─── Graceful Shutdown ──────────────────────────────
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(async () => {
        try {
          await mongoose.connection.close();
          logger.info('MongoDB connection closed');
          process.exit(0);
        } catch (err) {
          logger.error('Error during shutdown', { err });
          process.exit(1);
        }
      });
      // Force-kill if it takes too long
      setTimeout(() => {
        logger.error('Shutdown timeout — forcing exit');
        process.exit(1);
      }, 10_000).unref();
    };

    process.on('SIGTERM', () => { shutdown('SIGTERM').catch(console.error); });
    process.on('SIGINT',  () => { shutdown('SIGINT').catch(console.error); });

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

start();

export default app;
