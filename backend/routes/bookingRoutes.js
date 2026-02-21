import { Router } from 'express';
import {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import {
  bookingCreateSchema,
  statusUpdateSchema,
  validateBody,
} from '../middleware/validate.js';

const router = Router();

router.post('/', validateBody(bookingCreateSchema), createBooking);
router.patch('/:id/status', validateBody(statusUpdateSchema), updateBookingStatus);
router.get('/', getBookingsByEmail);

export default router;
