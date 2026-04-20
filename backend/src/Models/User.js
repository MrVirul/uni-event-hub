import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    minlength: 8,
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
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  profileImage: {
    type: String,
    default: function () {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.username}`;
    },
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

//hashong the password before saving the user
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare user password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
