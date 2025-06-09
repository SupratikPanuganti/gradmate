import { Request, Response } from 'express';
import { AIService } from '../services/ai';

const aiService = new AIService();

export const generateEmail = async (req: Request, res: Response) => {
  try {
    const { userId, labId, professorId } = req.body;
    const email = await AIService.generateEmail(userId, labId, professorId);
    res.json({ email });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate email' });
  }
}; 