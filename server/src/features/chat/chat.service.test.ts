import { describe, it, expect, vi } from 'vitest';
import { generateChatResponse } from './chat.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

vi.mock('@google/generative-ai', () => {
  const generateContent = vi.fn().mockResolvedValue({
    response: { text: () => 'Mocked AI Response' }
  });
  const getGenerativeModel = vi.fn().mockReturnValue({ generateContent });
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel
    }))
  };
});

describe('Chat Service', () => {
  it('generates a chat response', async () => {
    const messages = [{ role: 'user' as const, content: 'Hello' }];
    const response = await generateChatResponse(messages);
    expect(response).toBe('Mocked AI Response');
  });
  
  it('generates a chat response with context', async () => {
    const messages = [{ role: 'user' as const, content: 'Hello' }];
    const context = { totalCo2eKg: 10 };
    const response = await generateChatResponse(messages, context);
    expect(response).toBe('Mocked AI Response');
  });
});
