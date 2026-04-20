import User from '../Models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '180d' });
};

export const register = async (req, res) => {
  try {
    const { username, email, password, profileImage } = req.body;

    // validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }

    // check existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // check existing username
    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // create user
    const user = new User({
      username,
      email,
      password,
      profileImage,
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
