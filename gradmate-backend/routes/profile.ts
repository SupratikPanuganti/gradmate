import express from 'express';
import { supabase } from '../lib/supabase';

const router = express.Router();

// Get student profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw error;
    }

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update student profile
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      first_name,
      last_name,
      email,
      university,
      major,
      graduation_year,
      gpa,
      research_interests,
      skills,
      resume_url
    } = req.body;

    const { data: student, error } = await supabase
      .from('students')
      .update({
        first_name,
        last_name,
        email,
        university,
        major,
        graduation_year,
        gpa,
        research_interests,
        skills,
        resume_url,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Upload resume
router.post('/:userId/resume', async (req, res) => {
  try {
    const { userId } = req.params;
    const { resume_url } = req.body;

    if (!resume_url) {
      return res.status(400).json({ error: 'Resume URL is required' });
    }

    const { data: student, error } = await supabase
      .from('students')
      .update({
        resume_url,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

export default router; 