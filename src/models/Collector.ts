import mongoose, { Schema, Document } from 'mongoose';

export interface ICollector extends Document {
  userId: string;
  vehicleType: 'bike' | 'auto' | 'truck' | 'van';
  vehicleNumber: string;
  licenseNumber: string;
  aadharNumber: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  serviceAreas: string[];
  isActive: boolean;
  rating: number;
  totalPickups: number;
  totalEarnings: number;
  completionRate: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  documents: {
    license: string;
    aadhar: string;
    vehicle: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CollectorSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'auto', 'truck', 'van'],
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  licenseNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  aadharNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^\d{12}$/
  },
  bankDetails: {
    accountNumber: {
      type: String,
      required: true,
      trim: true
    },
    ifscCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    bankName: {
      type: String,
      required: true,
      trim: true
    }
  },
  serviceAreas: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalPickups: {
    type: Number,
    default: 0,
    min: 0
  },
  totalEarnings: {
    type: Number,
    default: 0,
    min: 0
  },
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  documents: {
    license: {
      type: String,
      required: true,
      trim: true
    },
    aadhar: {
      type: String,
      required: true,
      trim: true
    },
    vehicle: {
      type: String,
      required: true,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Create indexes
CollectorSchema.index({ userId: 1 });
CollectorSchema.index({ isActive: 1 });
CollectorSchema.index({ verificationStatus: 1 });
CollectorSchema.index({ serviceAreas: 1 });
CollectorSchema.index({ rating: -1 });

export default mongoose.model<ICollector>('Collector', CollectorSchema);

