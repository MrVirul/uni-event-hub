import express from 'express';
const router = express.Router();
import {
  createBooking,
  getBookingHistory,
  updateBookingStatus,
  updateBookingDetails,
  deleteBooking,
  getEventBookings,
} from '../controller/bookingController.js';

import { protect } from '../middleware/authMiddleware.js';

router.post('/', protect, createBooking);
router.get('/history', protect, getBookingHistory);
router.get('/event/:eventId', protect, getEventBookings);
router.patch('/:id', protect, updateBookingStatus);
router.put('/:id/details', protect, updateBookingDetails);
router.delete('/:id', protect, deleteBooking);

export default router;
