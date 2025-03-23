import mongoose from 'mongoose';
import type { IUser, IUserInput } from './user.model';
import { config } from '../config';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String,
    unique: true
  },
  googleAccessToken: {
    type: String,
  },
  googleRefreshToken: {
    type: String,
  },
  googleProfile: {
    type: Object,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpires: {
    type: Date,
  }
}, {
  timestamps: true
});

const UserModel = mongoose.model<IUser>('User', userSchema);

export class UserDao {

  async createUser(userInput: IUserInput): Promise<IUser> {
    const user = new UserModel(userInput);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id).select('-password');
  }

  async updateVerificationToken(userId: string, token: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      emailVerificationToken: token,
      emailVerificationExpires: new Date(Date.now() + config.verification.expirationTime) // 24 hours
    });
  }

  async getUserByVerificationToken(token: string): Promise<IUser | null> {
    return await UserModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
  }

  async markEmailAsVerified(user: IUser): Promise<void> {
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
  }
} 