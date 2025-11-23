import { Router } from 'express';
import {
  createLink,
  getAllLinks,
  getLinkStats,
  deleteLink,
  redirectToUrl
} from '../controllers/linkController.js';
import { validateCreateLink } from '../middlewares/validate.js';
import { apiRateLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Route to create link
router.post('/api/links', apiRateLimiter, validateCreateLink, createLink);

// Route to get all links
router.get('/api/links', getAllLinks);

// Route to get link stats
router.get('/api/links/:code', getLinkStats);

// Route to delete link
router.delete('/api/links/:code', deleteLink);

// Route to redirect to original URL 
router.get('/:code', redirectToUrl);

export default router;
