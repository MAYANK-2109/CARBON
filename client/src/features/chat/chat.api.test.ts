/**
 * @module features/chat/chat.api.test
 * @description Unit tests for the chat API layer.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../lib/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

import { sendMessage } from './chat.api';
import { api } from '../../lib/api';

const mockPost = vi.mocked(api.post);

describe('chat.api — sendMessage', () => {
  it('sends messages to /chat/message endpoint', async () => {
    mockPost.mockResolvedValueOnce({
      data: { success: true, data: { reply: 'Great question!' } },
    } as Parameters<typeof mockPost.mockResolvedValueOnce>[0]);

    const messages = [{ role: 'user' as const, content: 'Hello' }];
    const result = await sendMessage('user-123', messages);

    expect(mockPost).toHaveBeenCalledWith('/chat/message', {
      messages,
      userId: 'user-123',
    });
    expect(result).toEqual({ reply: 'Great question!' });
  });

  it('works when userId is undefined', async () => {
    mockPost.mockResolvedValueOnce({
      data: { success: true, data: { reply: 'Sure!' } },
    } as Parameters<typeof mockPost.mockResolvedValueOnce>[0]);

    const result = await sendMessage(undefined, [{ role: 'user', content: 'Test' }]);
    expect(result.reply).toBe('Sure!');
  });
});
