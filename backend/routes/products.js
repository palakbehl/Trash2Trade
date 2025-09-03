import express from 'express';
import DIYProduct from '../models/DIYProduct.js';
import Order from '../models/Order.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all DIY products
router.get('/', async (req, res) => {
  try {
    const { category, search, status = 'active', limit = 20, page = 1 } = req.query;
    
    let filter = { status };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await DIYProduct.find(filter)
      .populate('sellerId', 'name email isVerified')
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await DIYProduct.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get product by ID
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await DIYProduct.findById(productId)
      .populate('sellerId', 'name email phone isVerified');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user's products
router.get('/seller/my', authenticateToken, async (req, res) => {
  try {
    const products = await DIYProduct.find({ sellerId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create new DIY product
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      category, 
      condition, 
      materials, 
      location, 
      images 
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !category || !condition || !materials || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }

    const productData = {
      sellerId: req.user.userId,
      title,
      description,
      price: parseFloat(price),
      category,
      condition,
      materials,
      location,
      images: images || [],
      status: 'active',
      isAvailable: true,
      views: 0,
      likes: 0
    };

    const newProduct = new DIYProduct(productData);
    await newProduct.save();

    await newProduct.populate('sellerId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update DIY product
router.put('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const product = await DIYProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if user owns the product or is admin
    if (product.sellerId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to update this product' 
      });
    }

    // Remove fields that shouldn't be updated directly
    delete updates.sellerId;
    delete updates.views;
    delete updates.likes;
    delete updates.createdAt;

    const updatedProduct = await DIYProduct.findByIdAndUpdate(
      productId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).populate('sellerId', 'name email');

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Like/Unlike product
router.post('/:productId/like', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await DIYProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // For simplicity, just increment likes
    // In a real app, you'd track which users liked which products
    product.likes += 1;
    await product.save();

    res.json({
      success: true,
      message: 'Product liked successfully',
      likes: product.likes
    });

  } catch (error) {
    console.error('Like product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to like product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create order for product
router.post('/:productId/order', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity = 1, shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Shipping address is required' 
      });
    }

    const product = await DIYProduct.findById(productId).populate('sellerId');
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    if (!product.isAvailable || product.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: 'Product is not available for purchase' 
      });
    }

    if (product.sellerId._id.toString() === req.user.userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot order your own product' 
      });
    }

    const totalAmount = product.price * quantity;
    const platformFee = Math.round(totalAmount * 0.05); // 5% platform fee
    const sellerAmount = totalAmount - platformFee;

    const orderData = {
      buyerId: req.user.userId,
      sellerId: product.sellerId._id,
      productId: productId,
      quantity,
      totalAmount,
      platformFee,
      sellerAmount,
      shippingAddress,
      status: 'pending'
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    await newOrder.populate('buyerId sellerId productId', 'name email title');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete product
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await DIYProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if user owns the product or is admin
    if (product.sellerId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to delete this product' 
      });
    }

    await DIYProduct.findByIdAndDelete(productId);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
