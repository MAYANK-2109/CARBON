/**
 * @module features/chat/chat.controller
 * @description Express handlers for carbon minimization chat assistant.
 */

import type { Request, Response, NextFunction } from 'express';
import { generateChatResponse } from './chat.service';
import { getSummary } from '../history/history.service';

/**
 * Handle POST request for AI Assistant chat.
 */
export async function handleChat(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({
        success: false,
        message: 'Invalid request: "messages" list is required.',
      });
      return;
    }

    // Get current user context (current month carbon summary)
    const userId = req.user?.userId;
    let summary = null;

    if (userId) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date();
      endOfMonth.setHours(23, 59, 59, 999);

      try {
        summary = await getSummary(userId, startOfMonth, endOfMonth);
      } catch (err) {
        console.warn('Failed to load user footprint for chat context:', err);
      }
    }

    const reply = await generateChatResponse(messages, summary);

    res.status(200).json({
      success: true,
      data: {
        reply,
      },
    });
  } catch (error) {
    next(error);
  }
}
