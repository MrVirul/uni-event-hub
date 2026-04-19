import express from 'express';
import User from '../models/userModel.js';

Router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    if (username.length < 3) {
      return req.status(400).json({ message: 'Username must be at least 3 characters long' });
    }
    //check if user already exists
    const existingEMAIL = await User.findOne({ $or: [{ email }] });
    if (existingEMAIL) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingUserName = await User.findOne({ $or: [{ username }] });
    if (existingUserName) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }

  await user.save();
});

export default Router;
