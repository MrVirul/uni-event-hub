import express from 'express';

const router = express.Router();

router.get('/login', async (req, res) => {
  res.send('login');
});

router.get('/register', async (req, res) => {
  res.send('register');
});

export default router;
