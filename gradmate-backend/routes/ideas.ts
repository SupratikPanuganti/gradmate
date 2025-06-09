import express from 'express';
import { supabase } from '../lib/supabase';

const router = express.Router();

// Generate essay ideas
router.post('/generate', async (req, res) => {
  try {
    const { userId, labId, professorId } = req.body;

    if (!userId || !labId || !professorId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get student profile
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get lab and professor info
    const { data: lab } = await supabase
      .from('labs')
      .select('*')
      .eq('id', labId)
      .single();

    const { data: professor } = await supabase
      .from('professors')
      .select('*')
      .eq('id', professorId)
      .single();

    if (!lab || !professor) {
      return res.status(404).json({ error: 'Lab or professor not found' });
    }

    // TODO: Implement AI idea generation logic here
    // This is where you'll add your AI integration

    // Mock idea generation
    const ideas = [
      {
        title: 'The Impact of [Research Area] on [Field]',
        description: 'An analysis of how recent developments in [Research Area] are shaping the future of [Field], with a focus on [Professor\'s] work.',
        keyPoints: [
          'Historical context of the research area',
          'Current challenges and opportunities',
          'Future implications and potential applications'
        ]
      },
      {
        title: 'My Journey in [Research Area]',
        description: 'A personal narrative exploring my interest in [Research Area] and how it aligns with [Lab\'s] research goals.',
        keyPoints: [
          'Personal motivation and background',
          'Relevant coursework and experience',
          'Future goals and aspirations'
        ]
      },
      {
        title: 'Innovations in [Research Area]',
        description: 'A discussion of recent innovations in [Research Area] and their potential impact on [Field].',
        keyPoints: [
          'Overview of current innovations',
          'Analysis of potential impact',
          'Personal interest and connection'
        ]
      }
    ];

    // Store ideas in database
    const { data: savedIdeas, error } = await supabase
      .from('essay_ideas')
      .insert(
        ideas.map(idea => ({
          student_id: student.id,
          lab_id: labId,
          professor_id: professorId,
          title: idea.title,
          description: idea.description,
          key_points: idea.keyPoints
        }))
      )
      .select();

    if (error) {
      throw error;
    }

    res.json(savedIdeas);
  } catch (error) {
    console.error('Error generating ideas:', error);
    res.status(500).json({ error: 'Failed to generate ideas' });
  }
});

export default router; 