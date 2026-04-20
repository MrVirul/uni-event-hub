import * as userService from '../services/userService.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password, profileImage } = req.body;

    // Validation (Request level)
    if (!username || !email || !password) {
      const error = new Error('All fields are required');
      error.status = 400;
      throw error;
    }

    if (password.length < 8) {
      const error = new Error('Password must be at least 8 characters long');
      error.status = 400;
      throw error;
    }

    if (username.length < 3) {
      const error = new Error('Username must be at least 3 characters long');
      error.status = 400;
      throw error;
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
    // Pass the error to the global error handler
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation (Request level)
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      throw error;
    }

    // Call service for business logic
    const { user, token } = await userService.loginUser({ email, password });

    res.status(200).json({
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    // Pass the error to the global error handler
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming auth middleware sets req.user

    // Call service for business logic
    const user = await userService.getUserProfile(userId);

    res.status(200).json({
      message: 'User profile retrieved successfully',
      user,
    });
  } catch (error) {
    // Pass the error to the global error handler
    next(error);
  }
};
