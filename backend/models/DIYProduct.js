import mongoose from 'mongoose';

const DIYProductSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['upcycled', 'eco-friendly', 'recycled', 'diy', 'home-decor', 'lighting', 'storage'],
    required: true
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair'],
    required: true
  },
  materials: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive'],
    default: 'active'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Create indexes
DIYProductSchema.index({ sellerId: 1 });
DIYProductSchema.index({ category: 1 });
DIYProductSchema.index({ status: 1 });
DIYProductSchema.index({ price: 1 });
DIYProductSchema.index({ createdAt: -1 });
DIYProductSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('DIYProduct', DIYProductSchema);
