/**
 * @module features/chat/chat.service.no-key.test
 * @description Tests for chat service when no valid API key is configured.
 * Uses a separate file to avoid module hoisting conflicts.
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock with NO valid API key so the `ai` module-level variable is null
vi.mock('@google/genai', () => {
  const generateContent = vi.fn();
  const models = { generateContent };
  const GoogleGenAI = vi.fn().mockImplementation(() => ({ models }));
  (GoogleGenAI as any).mockGenerateContent = generateContent;
  return { GoogleGenAI };
});

vi.mock('../../config/environment', () => ({
  env: {
    GEMINI_API_KEY: 'your_gemini_api_key_here', // placeholder → ai will be null
    NODE_ENV: 'test',
    isProduction: false,
  },
}));

// Dynamically import so the mock above is applied to the module's top-level init
let generateChatResponse: (history: any[], summary: any) => Promise<string>;

beforeAll(async () => {
  const mod = await import('./chat.service');
  generateChatResponse = mod.generateChatResponse;
});

describe('Chat Service — no API key (demo mode)', () => {
  it('returns a demo response for travel queries without calling the API', async () => {
    const messages = [{ role: 'user' as const, content: 'How do I reduce travel emissions?' }];
    const result = await generateChatResponse(messages, null);
    // getMockChatResponse is called directly (ai === null path)
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result.toLowerCase()).toContain('travel');
  });

  it('returns default demo response for unrecognised query', async () => {
    const messages = [{ role: 'user' as const, content: 'What is the weather today?' }];
    const result = await generateChatResponse(messages, null);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes footprint stats note when emission summary is provided', async () => {
    const summary = {
      totalCo2eKg: 75,
      byCategory: { travel: 40, energy: 20, diet: 15 },
      recordCount: 3,
      period: { start: '2025-01-01T00:00:00.000Z', end: '2025-01-31T23:59:59.000Z' },
    };
    const messages = [{ role: 'user' as const, content: 'What are my biggest emissions?' }];
    const result = await generateChatResponse(messages, summary);
    // Should mention the footprint figure
    expect(result).toContain('75.0 kg');
  });
});
