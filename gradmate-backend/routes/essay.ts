import express from 'express';
import { supabase } from '../lib/supabase';

const router = express.Router();

// Analyze essay
router.post('/analyze', async (req, res) => {
  try {
    const { essay, userId } = req.body;

    if (!essay || !userId) {
      return res.status(400).json({ error: 'Essay and userId are required' });
    }

    // TODO: Implement AI analysis logic here
    // This is where you'll add your AI integration

    // Store the analysis in the database
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Mock analysis result
    const analysis = {
      scores: [
        { category: 'Structure', score: 8, description: 'Good structure with clear paragraphs' },
        { category: 'Clarity', score: 7, description: 'Clear writing with some room for improvement' },
        { category: 'Style', score: 9, description: 'Excellent use of language and style' },
        { category: 'Impact', score: 8, description: 'Strong emotional impact' }
      ],
      suggestions: [
        'Consider adding more specific examples',
        'Strengthen the conclusion',
        'Add more personal anecdotes'
      ]
    };

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing essay:', error);
    res.status(500).json({ error: 'Failed to analyze essay' });
  }
});

export default router; 