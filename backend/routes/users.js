import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import WasteRequest from '../models/WasteRequest.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role, status, limit = 50, page = 1 } = req.query;
    
    let filter = {};
    if (role) filter.role = role;
    if (status) filter.isVerified = status === 'verified';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user by ID
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can only view their own profile unless they're admin
    if (userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to view this profile' 
      });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user statistics
router.get('/:userId/stats', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can only view their own stats unless they're admin
    if (userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to view these statistics' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get user's waste requests
    const userRequests = await WasteRequest.find({ userId });
    const userTransactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    
    const completedPickups = userRequests.filter(req => req.status === 'completed');
    const pendingPickups = userRequests.filter(req => req.status === 'pending');
    const totalWasteCollected = completedPickups.reduce((sum, req) => sum + req.quantity, 0);
    const totalEarnings = userTransactions
      .filter(tx => tx.type === 'pickup')
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Find next pickup
    const nextPickup = userRequests
      .filter(req => req.status === 'assigned')
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())[0];

    const stats = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subtype: user.subtype,
        greenCoins: user.greenCoins,
        ecoScore: user.ecoScore || 0,
        isVerified: user.isVerified,
        joinedAt: user.createdAt
      },
      pickups: {
        total: completedPickups.length,
        pending: pendingPickups.length,
        completed: completedPickups.length,
        nextPickup: nextPickup?.scheduledDate || null
      },
      waste: {
        totalCollected: totalWasteCollected,
        co2Saved: totalWasteCollected * 0.5 // Estimate: 0.5kg CO2 per kg waste
      },
      finances: {
        totalEarnings,
        greenCoins: user.greenCoins,
        recentTransactions: userTransactions.slice(0, 5)
      },
      environmental: {
        ecoScore: user.ecoScore || 0,
        wasteTypes: getWasteTypeBreakdown(completedPickups)
      }
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update user profile
router.put('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Users can only update their own profile unless they're admin
    if (userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to update this profile' 
      });
    }

    // Remove sensitive fields that shouldn't be updated directly
    delete updates.password;
    delete updates.role;
    delete updates.greenCoins;
    delete updates.ecoScore;
    delete updates.createdAt;

    // Only admin can update role and verification status
    if (req.user.role === 'admin') {
      // Admin can update role and verification
      if (req.body.role) updates.role = req.body.role;
      if (req.body.isVerified !== undefined) updates.isVerified = req.body.isVerified;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update user green coins (admin only)
router.post('/:userId/green-coins', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, type, description } = req.body;

    if (!amount || !type || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount, type, and description are required' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update user's green coins
    const newAmount = type === 'add' ? user.greenCoins + amount : user.greenCoins - amount;
    user.greenCoins = Math.max(0, newAmount); // Ensure it doesn't go negative
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: type === 'add' ? 'reward' : 'penalty',
      amount: 0,
      greenCoins: type === 'add' ? amount : -amount,
      description,
      status: 'completed'
    });
    await transaction.save();

    res.json({
      success: true,
      message: `Green coins ${type === 'add' ? 'added' : 'deducted'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        greenCoins: user.greenCoins
      },
      transaction
    });

  } catch (error) {
    console.error('Update green coins error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update green coins',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete user (admin only)
router.delete('/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Prevent admin from deleting themselves
    if (userId === req.user.userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot delete your own account' 
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to get waste type breakdown
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
