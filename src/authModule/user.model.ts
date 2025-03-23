import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;  
  username: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserInput {
  username: string;
  email: string;
  password: string;
} 