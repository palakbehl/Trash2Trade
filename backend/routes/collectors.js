import express from 'express';
import User from '../models/User.js';
import Collector from '../models/Collector.js';
import WasteRequest from '../models/WasteRequest.js';
import { authenticateToken, requireCollector, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all collectors (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    
    let filter = {};
    if (status) filter.verificationStatus = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const collectors = await Collector.find(filter)
      .populate('userId', 'name email phone isVerified createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Collector.countDocuments(filter);

    res.json({
      success: true,
      collectors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get collectors error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch collectors',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get collector profile
router.get('/profile', authenticateToken, requireCollector, async (req, res) => {
  try {
    const collector = await Collector.findOne({ userId: req.user.userId })
      .populate('userId', 'name email phone isVerified createdAt');

    if (!collector) {
      return res.status(404).json({ 
        success: false, 
        message: 'Collector profile not found' 
      });
    }

    res.json({
      success: true,
      collector
    });

  } catch (error) {
    console.error('Get collector profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch collector profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get collector statistics
router.get('/stats', authenticateToken, requireCollector, async (req, res) => {
  try {
    const collector = await Collector.findOne({ userId: req.user.userId });
    if (!collector) {
      return res.status(404).json({ 
        success: false, 
        message: 'Collector profile not found' 
      });
    }

    // Get collector's requests
    const collectorRequests = await WasteRequest.find({ collectorId: req.user.userId });
    const completedPickups = collectorRequests.filter(req => req.status === 'completed');
    const pendingPickups = collectorRequests.filter(req => req.status === 'pending');
    const assignedPickups = collectorRequests.filter(req => req.status === 'assigned');

    const totalEarnings = completedPickups.reduce((sum, req) => sum + (req.estimatedValue || 0), 0);
    const wasteCollected = completedPickups.reduce((sum, req) => sum + req.quantity, 0);

    const stats = {
      overview: {
        totalPickups: completedPickups.length,
        pendingPickups: pendingPickups.length,
        assignedPickups: assignedPickups.length,
        totalEarnings,
        wasteCollected,
        rating: collector.rating,
        completionRate: collector.completionRate
      },
      performance: {
        efficiency: wasteCollected > 0 ? (wasteCollected / (completedPickups.length || 1)).toFixed(1) : 0,
        avgEarningsPerPickup: completedPickups.length > 0 ? (totalEarnings / completedPickups.length).toFixed(2) : 0,
        monthlyPickups: getMonthlyPickups(completedPickups),
        wasteTypeBreakdown: getWasteTypeBreakdown(completedPickups)
      },
      profile: {
        vehicleType: collector.vehicleType,
        serviceAreas: collector.serviceAreas,
        verificationStatus: collector.verificationStatus,
        isActive: collector.isActive,
        joinedAt: collector.createdAt
      }
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get collector stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch collector statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create collector profile
router.post('/profile', authenticateToken, async (req, res) => {
  try {
    // Check if user is already a collector
    const existingCollector = await Collector.findOne({ userId: req.user.userId });
    if (existingCollector) {
      return res.status(400).json({ 
        success: false, 
        message: 'Collector profile already exists' 
      });
    }

    const {
      vehicleType,
      vehicleNumber,
      licenseNumber,
      aadharNumber,
      bankDetails,
      serviceAreas,
      documents
    } = req.body;

    // Validate required fields
    if (!vehicleType || !vehicleNumber || !licenseNumber || !aadharNumber || !bankDetails || !serviceAreas || !documents) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }

    const collectorData = {
      userId: req.user.userId,
      vehicleType,
      vehicleNumber: vehicleNumber.toUpperCase(),
      licenseNumber: licenseNumber.toUpperCase(),
      aadharNumber,
      bankDetails,
      serviceAreas,
      documents,
      isActive: true,
      rating: 0,
      totalPickups: 0,
      totalEarnings: 0,
      completionRate: 0,
      verificationStatus: 'pending'
    };

    const newCollector = new Collector(collectorData);
    await newCollector.save();

    // Update user role to collector
    await User.findByIdAndUpdate(req.user.userId, { role: 'collector' });

    await newCollector.populate('userId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Collector profile created successfully',
      collector: newCollector
    });

  } catch (error) {
    console.error('Create collector profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create collector profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update collector profile
router.put('/profile', authenticateToken, requireCollector, async (req, res) => {
  try {
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.userId;
    delete updates.rating;
    delete updates.totalPickups;
    delete updates.totalEarnings;
    delete updates.completionRate;
    delete updates.createdAt;

    // Only admin can update verification status
    if (req.user.role !== 'admin') {
      delete updates.verificationStatus;
    }

    const updatedCollector = await Collector.findOneAndUpdate(
      { userId: req.user.userId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!updatedCollector) {
      return res.status(404).json({ 
        success: false, 
        message: 'Collector profile not found' 
      });
    }

    res.json({
      success: true,
      message: 'Collector profile updated successfully',
      collector: updatedCollector
    });

  } catch (error) {
    console.error('Update collector profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update collector profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update collector verification status (admin only)
router.put('/:collectorId/verify', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { collectorId } = req.params;
    const { status, notes } = req.body;

    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification status' 
      });
    }

    const collector = await Collector.findByIdAndUpdate(
      collectorId,
      { 
        verificationStatus: status,
        verificationNotes: notes,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!collector) {
      return res.status(404).json({ 
        success: false, 
        message: 'Collector not found' 
      });
    }

    res.json({
      success: true,
      message: `Collector ${status} successfully`,
      collector
    });

  } catch (error) {
    console.error('Update verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update verification status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get collector requests (assigned and completed)
router.get('/requests', authenticateToken, requireCollector, async (req, res) => {
  try {
    const { status } = req.query;
    
    let filter = { collectorId: req.user.userId };
    if (status) filter.status = status;

    const requests = await WasteRequest.find(filter)
      .populate('userId', 'name email phone address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('Get collector requests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch collector requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Toggle collector active status
router.put('/status', authenticateToken, requireCollector, async (req, res) => {
  try {
    const { isActive } = req.body;

    const collector = await Collector.findOneAndUpdate(
      { userId: req.user.userId },
      { isActive, updatedAt: new Date() },
      { new: true }
    );

    if (!collector) {
      return res.status(404).json({ 
        success: false, 
        message: 'Collector profile not found' 
      });
    }

    res.json({
      success: true,
      message: `Collector status updated to ${isActive ? 'active' : 'inactive'}`,
      isActive: collector.isActive
    });

  } catch (error) {
    console.error('Update collector status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update collector status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper functions
function getMonthlyPickups(completedPickups) {
  const months = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const monthlyCount = completedPickups.filter(pickup => {
      const pickupDate = new Date(pickup.completedAt || pickup.createdAt);
      return pickupDate >= monthStart && pickupDate <= monthEnd;
    }).length;
    
    months.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
      count: monthlyCount
    });
  }
  
  return months;
}

function getWasteTypeBreakdown(completedPickups) {
  const breakdown = {};
  
  completedPickups.forEach(pickup => {
    if (breakdown[pickup.wasteType]) {
      breakdown[pickup.wasteType] += pickup.quantity;
    } else {
      breakdown[pickup.wasteType] = pickup.quantity;
    }
  });

  return breakdown;
}

export default router;
