import { api } from '../../lib/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Send chat messages to the server and receive a reply.
 * @param userId - optional user identifier (included for future auth extensions)
 * @param messages - array of chat messages (including the latest user message)
 * @returns response containing the assistant reply
 */
export async function sendMessage(
  userId: string | undefined,
  messages: ChatMessage[]
): Promise<{ reply: string }> {
  const response = await api.post<{ success: boolean; data: { reply: string } }>('/chat/message', {
    messages,
    userId,
  });

  return response.data.data;
}
