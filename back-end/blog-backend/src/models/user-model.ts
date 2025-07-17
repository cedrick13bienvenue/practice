import mongoose, { Schema, model } from 'mongoose';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    gender: { type: String, enum: Object.values(Gender), required: true },
    role: { type: String, enum: Object.values(Role), default: Role.User }, // ✅ NEW
  },
  { timestamps: true }
);

export const UserModel = model('users', userSchema);
