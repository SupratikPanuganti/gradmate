/**
 * @apiDefine GradMateAPI
 * @apiName GradMate API
 * @apiDescription RESTful API for GradMate - A platform helping students manage research lab applications with AI features
 * 
 * @apiBasePath /api/v1
 */

import express from 'express';
import { authenticateUser } from '../middleware/auth';
import { aiEndpointLimiter, emailGenerationLimiter } from '../middleware/rateLimit';
import * as profileController from '../controllers/profile';
import * as essayController from '../controllers/essay';
import * as emailController from '../controllers/email';
import * as ideasController from '../controllers/ideas';
import * as labController from '../controllers/lab';
import * as outreachController from '../controllers/outreach';

const router = express.Router();

/**
 * @api {get} /api/v1/profiles/:userId Get Student Profile
 * @apiName GetProfile
 * @apiGroup Profile
 * @apiParam {String} userId User's unique ID
 * @apiSuccess {Object} profile Student profile data
 */
router.get('/v1/profiles/:userId', authenticateUser, profileController.getProfile);

/**
 * @api {put} /api/v1/profiles/:userId Update Student Profile
 * @apiName UpdateProfile
 * @apiGroup Profile
 * @apiParam {String} userId User's unique ID
 * @apiParam {String} first_name First name
 * @apiParam {String} last_name Last name
 * @apiParam {String} email Email
 * @apiParam {String} university University
 * @apiParam {String} major Major
 * @apiParam {Number} graduation_year Graduation year
 * @apiParam {Number} gpa GPA
 * @apiParam {Array} research_interests Research interests
 * @apiParam {Array} skills Skills
 * @apiSuccess {Object} profile Updated student profile
 */
router.put('/v1/profiles/:userId', authenticateUser, profileController.updateProfile);

/**
 * @api {post} /api/v1/essays/analyze Analyze Essay
 * @apiName AnalyzeEssay
 * @apiGroup Essay
 * @apiParam {String} essay Essay text
 * @apiParam {String} userId User's unique ID
 * @apiSuccess {Object} analysis Essay analysis results
 */
router.post('/v1/essays/analyze', aiEndpointLimiter, authenticateUser, essayController.analyzeEssay);

/**
 * @api {post} /api/v1/emails/generate Generate Email
 * @apiName GenerateEmail
 * @apiGroup Email
 * @apiParam {String} userId User's unique ID
 * @apiParam {String} labId Lab's unique ID
 * @apiParam {String} professorId Professor's unique ID
 * @apiSuccess {Object} email Generated email content
 */
router.post('/v1/emails/generate', emailGenerationLimiter, authenticateUser, emailController.generateEmail);

/**
 * @api {post} /api/v1/ideas/generate Generate Essay Ideas
 * @apiName GenerateIdeas
 * @apiGroup Ideas
 * @apiParam {String} userId User's unique ID
 * @apiParam {String} labId Lab's unique ID
 * @apiParam {String} professorId Professor's unique ID
 * @apiSuccess {Array} ideas Generated essay ideas
 */
router.post('/v1/ideas/generate', aiEndpointLimiter, authenticateUser, ideasController.generateIdeas);

/**
 * @api {get} /api/v1/labs Get Labs
 * @apiName GetLabs
 * @apiGroup Labs
 * @apiSuccess {Array} labs List of labs
 */
router.get('/v1/labs', labController.getLabs);

/**
 * @api {get} /api/v1/labs/:labId/professors Get Lab Professors
 * @apiName GetLabProfessors
 * @apiGroup Labs
 * @apiParam {String} labId Lab's unique ID
 * @apiSuccess {Array} professors List of professors in the lab
 */
router.get('/v1/labs/:labId/professors', labController.getLabProfessors);

/**
 * @api {post} /api/v1/outreach/log Log Outreach
 * @apiName LogOutreach
 * @apiGroup Outreach
 * @apiParam {String} userId User's unique ID
 * @apiParam {String} labId Lab's unique ID
 * @apiParam {String} professorId Professor's unique ID
 * @apiParam {String} status Outreach status
 * @apiParam {String} notes Additional notes
 * @apiSuccess {Object} log Created outreach log
 */
router.post('/v1/outreach/log', authenticateUser, outreachController.logOutreach);

export default router; 