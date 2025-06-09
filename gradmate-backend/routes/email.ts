import express from 'express';
import { supabase } from '../lib/supabase';

const router = express.Router();

// Generate email
router.post('/generate', async (req, res) => {
  try {
    const { userId, labId, professorId, type } = req.body;

    if (!userId || !labId || !professorId || !type) {
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

    // TODO: Implement AI email generation logic here
    // This is where you'll add your AI integration

    // Mock email generation
    const email = {
      subject: `Interest in ${lab.name} Research Position`,
      body: `Dear Professor ${professor.last_name},

I hope this email finds you well. I am writing to express my interest in the research opportunities available in your ${lab.name} laboratory at ${lab.university}.

As a ${student.major} student at ${student.university}, I have developed a strong interest in ${lab.research_areas}. Your work on ${lab.research_areas} particularly caught my attention, and I would be honored to contribute to your research team.

I have attached my resume for your review. I would welcome the opportunity to discuss how my skills and interests align with your research goals.

Thank you for your time and consideration.

Best regards,
${student.first_name} ${student.last_name}`,
      suggestions: [
        'Consider mentioning specific papers from the lab',
        'Add more details about relevant coursework',
        'Include specific research interests'
      ]
    };

    res.json(email);
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
});

export default router; 