import express from 'express';
import {
  createClub,
  getClubs,
  getMyClubs,
  getClub,
  updateClub,
  deleteClub,
} from '../controller/clubController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getClubs);
router.get('/my/all', protect, getMyClubs);
router.get('/:id', getClub);

// Protected routes
router.post('/', protect, createClub);
router.put('/:id', protect, updateClub);
router.delete('/:id', protect, deleteClub);

export default router;
