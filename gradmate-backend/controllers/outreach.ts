import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const logOutreach = async (req: Request, res: Response) => {
  try {
    const { userId, labId, professorId, status, notes } = req.body;
    const { data, error } = await supabase
      .from('outreach_logs')
      .insert([
        {
          user_id: userId,
          lab_id: labId,
          professor_id: professorId,
          status,
          notes,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log outreach' });
  }
}; 