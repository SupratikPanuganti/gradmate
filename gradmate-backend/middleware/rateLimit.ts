import { rateLimit } from 'express-rate-limit';

// General API rate limit
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for AI endpoints
export const aiEndpointLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 requests per hour
  message: 'Too many AI requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict limit for email generation
export const emailGenerationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // Limit each IP to 10 requests per day
  message: 'Daily email generation limit reached, please try again tomorrow',
  standardHeaders: true,
  legacyHeaders: false,
}); 