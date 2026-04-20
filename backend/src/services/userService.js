import User from '../Models/User.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData) => {
  const { username, email, password, profileImage } = userData;

  // Check existing email
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error('Email already exists');
  }

  // Check existing username
  const existingUserName = await User.findOne({ username });
  if (existingUserName) {
    throw new Error('Username already exists');
  }

  // Create user
  const user = new User({
    username,
    email,
    password,
    profileImage,
  });

  await user.save();

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
    token,
  };
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '180d' });
};
