import { Router } from 'express';
import { generateEmail } from '../controllers/email';

const router = Router();

router.post('/generate', generateEmail);

export default router; 