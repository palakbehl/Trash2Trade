import mongoose, { Schema, Document } from 'mongoose';

export interface IWasteRequest extends Document {
  userId: string;
  wasteType: 'plastic' | 'paper' | 'metal' | 'e-waste' | 'organic' | 'mixed' | 'cardboard' | 'glass';
  quantity: number;
  description?: string;
  images?: string[];
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  preferredTime: Date;
  status: 'pending' | 'assigned' | 'collected' | 'completed' | 'cancelled';
  collectorId?: string;
  scheduledDate?: Date;
  estimatedPrice: number;
  actualPrice?: number;
  greenCoinsEarned?: number;
  estimatedValue: number;
  greenCoins: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WasteRequestSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wasteType: {
    type: String,
    enum: ['plastic', 'paper', 'metal', 'e-waste', 'organic', 'mixed', 'cardboard', 'glass'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  address: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  preferredTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'collected', 'completed', 'cancelled'],
    default: 'pending'
  },
  collectorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  scheduledDate: {
    type: Date
  },
  estimatedPrice: {
    type: Number,
    required: true,
    min: 0
  },
  actualPrice: {
    type: Number,
    min: 0
  },
  greenCoinsEarned: {
    type: Number,
    min: 0
  },
  estimatedValue: {
    type: Number,
    required: true,
    min: 0
  },
  greenCoins: {
    type: Number,
    required: true,
    min: 0
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create indexes
WasteRequestSchema.index({ userId: 1 });
WasteRequestSchema.index({ collectorId: 1 });
WasteRequestSchema.index({ status: 1 });
WasteRequestSchema.index({ wasteType: 1 });
WasteRequestSchema.index({ coordinates: '2dsphere' });
WasteRequestSchema.index({ createdAt: -1 });
WasteRequestSchema.index({ scheduledDate: 1 });

export default mongoose.model<IWasteRequest>('WasteRequest', WasteRequestSchema);

