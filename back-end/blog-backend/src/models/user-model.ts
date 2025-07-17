import mongoose, { Schema, model } from 'mongoose';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    gender: { type: String, enum: Object.values(Gender), required: true },
  },
  { timestamps: true } // createdAt and updatedAt handled automatically
);

export const UserModel = model('users', userSchema);
