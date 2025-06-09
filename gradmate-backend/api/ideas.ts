import { Router } from 'express';
import { generateIdeas } from '../controllers/ideas';

const router = Router();

router.post('/generate', generateIdeas);

export default router; 