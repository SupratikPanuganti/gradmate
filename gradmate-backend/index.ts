import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { generalLimiter, aiEndpointLimiter, emailGenerationLimiter } from './middleware/rateLimit';
import { authenticateUser } from './middleware/auth';
import logger from './services/logger';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Initialize Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Import routes
import essayRoutes from './routes/essay';
import emailRoutes from './routes/email';
import ideasRoutes from './routes/ideas';
import profileRoutes from './routes/profile';

// Apply rate limits to specific routes
app.use('/api/essay', aiEndpointLimiter, authenticateUser, essayRoutes);
app.use('/api/email', emailGenerationLimiter, authenticateUser, emailRoutes);
app.use('/api/ideas', aiEndpointLimiter, authenticateUser, ideasRoutes);
app.use('/api/profile', authenticateUser, profileRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', { error: err.message, stack: err.stack });
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
}); 