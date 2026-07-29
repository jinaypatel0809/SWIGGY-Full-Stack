import mongoose from 'mongoose'

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+[1-9]\d{7,14}$/, 'Enter phone number in international format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Account', accountSchema)
