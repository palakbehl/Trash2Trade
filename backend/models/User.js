import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
  password: {
    type: String,
    // Not required for demo purposes, but should be required in production
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
    required: function() {
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

export default mongoose.model('User', UserSchema);
