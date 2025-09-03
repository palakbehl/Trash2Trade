import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteRequest'
  },
  type: {
    type: String,
    enum: ['earning', 'spending', 'withdrawal', 'platform_fee', 'pickup', 'purchase', 'reward', 'penalty'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  greenCoins: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  relatedId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes
TransactionSchema.index({ userId: 1 });
TransactionSchema.index({ collectorId: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });

export default mongoose.model('Transaction', TransactionSchema);
