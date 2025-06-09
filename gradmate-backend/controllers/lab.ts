import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const getLabs = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('labs')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch labs' });
  }
};

export const getLabProfessors = async (req: Request, res: Response) => {
  try {
    const { labId } = req.params;
    const { data, error } = await supabase
      .from('professors')
      .select('*')
      .eq('lab_id', labId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lab professors' });
  }
}; 