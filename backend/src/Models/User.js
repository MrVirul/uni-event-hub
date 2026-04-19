import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 8,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },

  profileImage: {
    type: String,
    default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${username}',
    //       function () {
    //   if (this.gender === 'male') {
    //     return 'https://api.dicebear.com/9.x/lorelei/svg?seed=Alexander';
    //   }
    //   if (this.gender === 'female') {
    //     return 'https://api.dicebear.com/9.x/lorelei/svg?seed=Caleb';
    //   }
    // },
  },
});

const User = mongoose.model('User', userSchema);

export default User;
