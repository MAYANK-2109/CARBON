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
  const response = await fetch('/api/chat/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // If authentication token is stored in a cookie, it will be sent automatically.
    },
    body: JSON.stringify({ messages, userId }),
    credentials: 'include',
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Chat API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  // Expected shape: { success: true, data: { reply: string } }
  return data.data;
}
