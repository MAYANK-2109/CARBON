/**
 * @module features/chat/chat.service.test
 * @description Unit tests for the Gemini AI chat service.
 * Mocks the correct @google/genai SDK (not the legacy @google/generative-ai).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the correct package that chat.service.ts actually imports
vi.mock('@google/genai', () => {
  const generateContent = vi.fn().mockResolvedValue({
    text: 'Mocked AI Response',
  });
  const models = { generateContent };
  const GoogleGenAI = vi.fn().mockImplementation(() => ({ models }));
  
  // Attach mock reference to the constructor so tests can access it
  (GoogleGenAI as any).mockGenerateContent = generateContent;

  return {
    GoogleGenAI,
  };
});

// Mock environment so the AI client is initialized (non-placeholder key)
vi.mock('../../config/environment', () => ({
  env: {
    GEMINI_API_KEY: 'test-api-key-that-is-not-placeholder',
    NODE_ENV: 'test',
    isProduction: false,
  },
}));

// Import the mocked class and the service under test
import { GoogleGenAI } from '@google/genai';
import { generateChatResponse } from './chat.service';

const mockGenerateContent = (GoogleGenAI as any).mockGenerateContent;

const fullSummary = {
  totalCo2eKg: 50,
  byCategory: { travel: 20, energy: 15, diet: 15 },
  recordCount: 10,
  period: {
    start: '2025-01-01T00:00:00.000Z',
    end: '2025-01-31T23:59:59.000Z',
  },
};

describe('Chat Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Restore default mock implementation
    mockGenerateContent.mockReset();
    mockGenerateContent.mockResolvedValue({
      text: 'Mocked AI Response',
    });
  });

  it('generates a chat response without context', async () => {
    const messages = [{ role: 'user' as const, content: 'Hello' }];
    const response = await generateChatResponse(messages, null);
    expect(response).toBe('Mocked AI Response');
  });

  it('generates a chat response with full emission context', async () => {
    const messages = [{ role: 'user' as const, content: 'How can I reduce my emissions?' }];
    const response = await generateChatResponse(messages, fullSummary);
    expect(response).toBe('Mocked AI Response');
  });

  it('generates a chat response where energy is the best (lowest) category', async () => {
    // Energy = 5, travel = 20, diet = 15 → getBestCategory returns 'Energy'
    const energyBestSummary = {
      totalCo2eKg: 40,
      byCategory: { travel: 20, energy: 5, diet: 15 },
      recordCount: 3,
      period: { start: '2025-01-01T00:00:00.000Z', end: '2025-01-31T23:59:59.000Z' },
    };
    const messages = [{ role: 'user' as const, content: 'What is my best category?' }];
    const response = await generateChatResponse(messages, energyBestSummary);
    expect(response).toBe('Mocked AI Response');
  });

  it('handles empty message history gracefully', async () => {
    const response = await generateChatResponse([], null);
    // Should not throw; returns the mocked AI response
    expect(typeof response).toBe('string');
  });

  it('includes multi-turn conversation in the request', async () => {
    const messages = [
      { role: 'user' as const, content: 'First message' },
      { role: 'model' as const, content: 'First reply' },
      { role: 'user' as const, content: 'Second message' },
    ];

    await generateChatResponse(messages, null);

    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gemini-2.5-flash',
        contents: expect.arrayContaining([
          expect.objectContaining({ role: 'user' }),
          expect.objectContaining({ role: 'model' }),
        ]),
      })
    );
  });

  it('falls back gracefully when Gemini API throws an error', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('Network error'));

    const messages = [{ role: 'user' as const, content: 'travel tips' }];
    const response = await generateChatResponse(messages, null);

    // Should fall back to demo mode response
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });
});

// ─── Demo-mode branch coverage ───────────────────────────────────────────────
// These tests force the API to throw so the catch block executes getMockChatResponse,
// covering the energy, diet, and default keyword branches.

describe('Chat Service — demo mode keyword branches', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset();
  });

  it('falls back with energy-keyword tips', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('No key'));
    const messages = [{ role: 'user' as const, content: 'How can I reduce my electricity consumption?' }];
    const result = await generateChatResponse(messages, null);
    // The [Gemini Error] fallback string will contain getMockChatResponse output which has "energy"
    expect(result.toLowerCase()).toContain('energy');
  });

  it('falls back with diet-keyword tips', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('No key'));
    const messages = [{ role: 'user' as const, content: 'How does eating beef affect my footprint?' }];
    const result = await generateChatResponse(messages, null);
    expect(result.toLowerCase()).toContain('beef');
  });

  it('falls back with default tips for unrecognised question', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('No key'));
    const messages = [{ role: 'user' as const, content: 'hello there' }];
    const result = await generateChatResponse(messages, null);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('falls back with context stats note when summary is provided', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('No key'));
    const summary = {
      totalCo2eKg: 100,
      byCategory: { travel: 50, energy: 30, diet: 20 },
      recordCount: 5,
      period: { start: '2025-01-01T00:00:00.000Z', end: '2025-01-31T23:59:59.000Z' },
    };
    const messages = [{ role: 'user' as const, content: 'help me reduce energy usage' }];
    const result = await generateChatResponse(messages, summary);
    expect(result.toLowerCase()).toContain('100.0 kg');
  });
});
