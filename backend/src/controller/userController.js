import * as userService from '../services/userService.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, profileImage } = req.body;

    // Validation (Request level)
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }

    // Call service for business logic
    const { user, token } = await userService.registerUser({
      username,
      email,
      password,
      profileImage,
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (error) {
    console.error('Error in user registration:', error);

    // Handle specific business logic errors
    if (error.message === 'Email already exists' || error.message === 'Username already exists') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error' });
  }
};
