import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  uploadEventImage,
} from '../controller/eventController.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', protect, upload.single('image'), createEvent);
router.put('/:id', protect, upload.single('image'), updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/upload', protect, upload.single('image'), uploadEventImage);

export default router;
