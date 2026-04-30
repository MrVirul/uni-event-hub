import User from '../Models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (userData) => {
  const { name, email, studentNumber, phoneNumber, password, profileImage } = userData;

  // Check existing email
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    const error = new Error('Email already exists');
    error.status = 400;
    throw error;
  }

  // Check existing student number
  const existingStudentNumber = await User.findOne({ studentNumber });
  if (existingStudentNumber) {
    const error = new Error('Student number already exists');
    error.status = 400;
    throw error;
  }

  // Create user
  const user = new User({
    name,
    email,
    studentNumber,
    phoneNumber,
    password,
    profileImage,
  });

  await user.save();

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      studentNumber: user.studentNumber,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profileImage: user.profileImage,
    },
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      studentNumber: user.studentNumber,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profileImage: user.profileImage,
    },
    token,
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return user;
};
