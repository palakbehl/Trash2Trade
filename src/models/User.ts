import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'collector' | 'admin';
  subtype?: 'trash-generator' | 'ngo-business' | 'diy-marketplace';
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  greenCoins: number;
  ecoScore?: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'collector', 'admin'],
    required: true,
    default: 'user'
  },
  subtype: {
    type: String,
    enum: ['trash-generator', 'ngo-business', 'diy-marketplace'],
    required: function(this: IUser) {
      return this.role === 'user';
    }
  },
  address: {
    type: String,
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  greenCoins: {
    type: Number,
    default: 0,
    min: 0
  },
  ecoScore: {
    type: Number,
    default: 0,
    min: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ subtype: 1 });
UserSchema.index({ coordinates: '2dsphere' });

export default mongoose.model<IUser>('User', UserSchema);

