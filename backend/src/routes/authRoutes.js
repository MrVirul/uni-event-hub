import express from 'express';
import { register } from '../controller/userController.js';

const router = express.Router();

router.get('/login', async (req, res) => {
  res.send('login stub');
});

router.post('/register', register);

export default router;
