import { Request, Response } from 'express';
import { AIService } from '../services/ai';

const aiService = new AIService();

export const analyzeEssay = async (req: Request, res: Response) => {
  try {
    const { essay, userId } = req.body;
    const analysis = await AIService.analyzeEssay(essay, userId);
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze essay' });
  }
}; 