import { Request, Response } from 'express';
import { AIService } from '../services/ai';

const aiService = new AIService();

export const generateIdeas = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const ideas = await AIService.generateIdeas(userId);
    res.json({ ideas });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate ideas' });
  }
}; 