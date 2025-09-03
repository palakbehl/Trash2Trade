import express from 'express';
import WasteRequest from '../models/WasteRequest.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all waste requests (for collectors)
router.get('/requests', authenticateToken, async (req, res) => {
  try {
    const { status, userId, collectorId } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (collectorId) filter.collectorId = collectorId;

    const requests = await WasteRequest.find(filter)
      .populate('userId', 'name email phone address')
      .populate('collectorId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('Get waste requests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch waste requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get pending waste requests (for collectors to pick up)
router.get('/requests/pending', authenticateToken, async (req, res) => {
  try {
    const requests = await WasteRequest.find({ status: 'pending' })
      .populate('userId', 'name email phone address coordinates')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pending requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user's waste requests
router.get('/requests/my', authenticateToken, async (req, res) => {
  try {
    const requests = await WasteRequest.find({ userId: req.user.userId })
      .populate('collectorId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create new waste request
router.post('/requests', authenticateToken, async (req, res) => {
  try {
    const { wasteType, quantity, description, images, address, coordinates, preferredTime } = req.body;

    // Validate required fields
    if (!wasteType || !quantity || !address || !coordinates || !preferredTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }

    // Calculate estimated price and green coins
    const estimatedPrice = calculateEstimatedPrice(wasteType, quantity);
    const greenCoins = Math.floor(estimatedPrice * 2); // 2 green coins per rupee

    const requestData = {
      userId: req.user.userId,
      wasteType,
      quantity,
      description,
      images,
      address,
      coordinates,
      preferredTime: new Date(preferredTime),
      status: 'pending',
      estimatedPrice,
      estimatedValue: estimatedPrice,
      greenCoins
    };

    const newRequest = new WasteRequest(requestData);
    await newRequest.save();

    // Populate user data for response
    await newRequest.populate('userId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Waste pickup request created successfully',
      request: newRequest
    });

  } catch (error) {
    console.error('Create waste request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create waste request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Accept waste request (for collectors)
router.post('/requests/:requestId/accept', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { scheduledDate } = req.body;

    // Verify user is a collector
    const user = await User.findById(req.user.userId);
    if (user.role !== 'collector') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only collectors can accept requests' 
      });
    }

    const request = await WasteRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found' 
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Request is not available for acceptance' 
      });
    }

    // Update request
    request.status = 'assigned';
    request.collectorId = req.user.userId;
    request.scheduledDate = new Date(scheduledDate);
    await request.save();

    await request.populate('userId collectorId', 'name email phone');

    res.json({
      success: true,
      message: 'Request accepted successfully',
      request
    });

  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to accept request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Complete waste request (for collectors)
router.post('/requests/:requestId/complete', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { actualPrice } = req.body;

    const request = await WasteRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found' 
      });
    }

    if (request.collectorId.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only complete your own requests' 
      });
    }

    if (request.status !== 'assigned' && request.status !== 'collected') {
      return res.status(400).json({ 
        success: false, 
        message: 'Request cannot be completed in its current status' 
      });
    }

    // Update request
    request.status = 'completed';
    request.actualPrice = actualPrice || request.estimatedPrice;
    request.completedAt = new Date();
    request.greenCoinsEarned = request.greenCoins;
    await request.save();

    // Create transaction for user
    const transaction = new Transaction({
      userId: request.userId,
      collectorId: request.collectorId,
      requestId: request._id,
      type: 'pickup',
      amount: request.actualPrice,
      greenCoins: request.greenCoins,
      description: `Pickup completed: ${request.wasteType} (${request.quantity}kg)`,
      status: 'completed'
    });
    await transaction.save();

    // Update user's green coins and eco score
    await User.findByIdAndUpdate(request.userId, {
      $inc: { 
        greenCoins: request.greenCoins,
        ecoScore: Math.floor(request.quantity * 0.5)
      }
    });

    await request.populate('userId collectorId', 'name email phone');

    res.json({
      success: true,
      message: 'Request completed successfully',
      request,
      transaction
    });

  } catch (error) {
    console.error('Complete request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to complete request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update waste request status
router.put('/requests/:requestId/status', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, updates } = req.body;

    const request = await WasteRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found' 
      });
    }

    // Check permissions
    const canUpdate = request.userId.toString() === req.user.userId || 
                     request.collectorId?.toString() === req.user.userId ||
                     req.user.role === 'admin';

    if (!canUpdate) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to update this request' 
      });
    }

    // Update request
    request.status = status;
    if (updates) {
      Object.assign(request, updates);
    }
    await request.save();

    await request.populate('userId collectorId', 'name email phone');

    res.json({
      success: true,
      message: 'Request updated successfully',
      request
    });

  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete waste request
router.delete('/requests/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await WasteRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found' 
      });
    }

    // Check permissions - only owner or admin can delete
    if (request.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to delete this request' 
      });
    }

    // Only allow deletion of pending requests
    if (request.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only pending requests can be deleted' 
      });
    }

    await WasteRequest.findByIdAndDelete(requestId);

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });

  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Calculate estimated price based on waste type and quantity
function calculateEstimatedPrice(wasteType, quantity) {
  const rates = {
    paper: 8,      // ₹8/kg
    plastic: 12,   // ₹12/kg
    metal: 30,     // ₹30/kg
    'e-waste': 25, // ₹25/kg
    organic: 2,    // ₹2/kg
    mixed: 5,      // ₹5/kg
    cardboard: 10, // ₹10/kg
    glass: 6       // ₹6/kg
  };
  
  return (rates[wasteType] || 5) * quantity;
}

export default router;
