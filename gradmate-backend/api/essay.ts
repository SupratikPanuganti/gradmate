import { Router } from 'express';
import { analyzeEssay } from '../controllers/essay';

const router = Router();

router.post('/analyze', analyzeEssay);

export default router; 