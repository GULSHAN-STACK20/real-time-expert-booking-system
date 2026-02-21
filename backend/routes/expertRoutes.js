import { Router } from 'express';
import { getExpertDetails, listExperts } from '../controllers/expertController.js';

const router = Router();

router.get('/', listExperts);
router.get('/:id', getExpertDetails);

export default router;
