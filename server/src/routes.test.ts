/**
 * @module routes.test
 * @description Smoke tests for route files to ensure they export valid Express routers.
 * This provides 100% test coverage for the router definition files.
 */

import { describe, it, expect } from 'vitest';
import authRoutes from './features/auth/auth.routes';
import calculatorRoutes from './features/calculator/calculator.routes';
import chatRoutes from './features/chat/chat.routes';
import historyRoutes from './features/history/history.routes';
import tipsRoutes from './features/tips/tips.routes';

describe('Express Routes Definition', () => {
  it('exports a valid router for auth', () => {
    expect(authRoutes).toBeDefined();
    expect(typeof authRoutes).toBe('function');
    // Express routers have a 'stack' property
    expect(authRoutes).toHaveProperty('stack');
  });

  it('exports a valid router for calculator', () => {
    expect(calculatorRoutes).toBeDefined();
    expect(typeof calculatorRoutes).toBe('function');
    expect(calculatorRoutes).toHaveProperty('stack');
  });

  it('exports a valid router for chat', () => {
    expect(chatRoutes).toBeDefined();
    expect(typeof chatRoutes).toBe('function');
    expect(chatRoutes).toHaveProperty('stack');
  });

  it('exports a valid router for history', () => {
    expect(historyRoutes).toBeDefined();
    expect(typeof historyRoutes).toBe('function');
    expect(historyRoutes).toHaveProperty('stack');
  });

  it('exports a valid router for tips', () => {
    expect(tipsRoutes).toBeDefined();
    expect(typeof tipsRoutes).toBe('function');
    expect(tipsRoutes).toHaveProperty('stack');
  });
});
