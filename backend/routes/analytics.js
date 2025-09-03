import express from 'express';
import User from '../models/User.js';
import WasteRequest from '../models/WasteRequest.js';
import DIYProduct from '../models/DIYProduct.js';
import Transaction from '../models/Transaction.js';
import Collector from '../models/Collector.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get overall platform analytics (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get basic counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCollectors = await User.countDocuments({ role: 'collector' });
    const totalRequests = await WasteRequest.countDocuments();
    const completedRequests = await WasteRequest.countDocuments({ status: 'completed' });
    const pendingRequests = await WasteRequest.countDocuments({ status: 'pending' });
    const totalProducts = await DIYProduct.countDocuments({ status: 'active' });

    // Get waste data
    const wasteData = await WasteRequest.aggregate([
      { $match: { status: 'completed' } },
      { 
        $group: {
          _id: null,
          totalWaste: { $sum: '$quantity' },
          totalValue: { $sum: '$estimatedValue' }
        }
      }
    ]);

    const totalWasteCollected = wasteData[0]?.totalWaste || 0;
    const totalRevenue = wasteData[0]?.totalValue || 0;
    const co2Saved = totalWasteCollected * 0.5; // Estimate: 0.5kg CO2 per kg waste

    // Get growth data
    const userGrowth = await getUserGrowthData(startDate);
    const wasteGrowth = await getWasteGrowthData(startDate);
    const revenueGrowth = await getRevenueGrowthData(startDate);

    // Get waste type breakdown
    const wasteTypeBreakdown = await WasteRequest.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$wasteType',
          quantity: { $sum: '$quantity' },
          count: { $sum: 1 }
        }
      },
      { $sort: { quantity: -1 } }
    ]);

    // Get top collectors
    const topCollectors = await getTopCollectors();

    // Get recent activities
    const recentActivities = await getRecentActivities();

    const analytics = {
      overview: {
        totalUsers,
        totalCollectors,
        totalRequests,
        completedRequests,
        pendingRequests,
        totalProducts,
        totalWasteCollected,
        totalRevenue,
        co2Saved,
        completionRate: totalRequests > 0 ? ((completedRequests / totalRequests) * 100).toFixed(1) : 0
      },
      growth: {
        users: userGrowth,
        waste: wasteGrowth,
        revenue: revenueGrowth
      },
      breakdown: {
        wasteTypes: wasteTypeBreakdown,
        topCollectors,
        recentActivities
      },
      timeframe
    };

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user-specific analytics
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can only view their own analytics unless they're admin
    if (userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to view these analytics' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get user's requests and transactions
    const userRequests = await WasteRequest.find({ userId });
    const userTransactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    
    const completedPickups = userRequests.filter(req => req.status === 'completed');
    const totalWasteCollected = completedPickups.reduce((sum, req) => sum + req.quantity, 0);
    const totalEarnings = userTransactions
      .filter(tx => tx.type === 'pickup')
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Get monthly data for charts
    const monthlyData = getMonthlyUserData(userRequests, userTransactions);

    // Get waste type breakdown
    const wasteTypeData = getWasteTypeBreakdown(completedPickups);

    const analytics = {
      user: {
        id: user._id,
        name: user.name,
        greenCoins: user.greenCoins,
        ecoScore: user.ecoScore || 0,
        joinedAt: user.createdAt
      },
      overview: {
        totalPickups: completedPickups.length,
        pendingPickups: userRequests.filter(req => req.status === 'pending').length,
        wasteCollected: totalWasteCollected,
        totalEarnings,
        co2Saved: totalWasteCollected * 0.5,
        avgPickupValue: completedPickups.length > 0 ? (totalEarnings / completedPickups.length).toFixed(2) : 0
      },
      trends: {
        monthly: monthlyData,
        wasteTypes: wasteTypeData
      },
      recentTransactions: userTransactions.slice(0, 10)
    };

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get collector-specific analytics
router.get('/collector/:collectorId', authenticateToken, async (req, res) => {
  try {
    const { collectorId } = req.params;

    // Collectors can only view their own analytics unless they're admin
    if (collectorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to view these analytics' 
      });
    }

    const collector = await Collector.findOne({ userId: collectorId }).populate('userId');
    if (!collector) {
      return res.status(404).json({ 
        success: false, 
        message: 'Collector not found' 
      });
    }

    // Get collector's requests
    const collectorRequests = await WasteRequest.find({ collectorId });
    const completedPickups = collectorRequests.filter(req => req.status === 'completed');
    const totalEarnings = completedPickups.reduce((sum, req) => sum + (req.estimatedValue || 0), 0);
    const wasteCollected = completedPickups.reduce((sum, req) => sum + req.quantity, 0);

    // Get monthly performance data
    const monthlyPerformance = getMonthlyCollectorData(collectorRequests);

    // Get service area performance
    const serviceAreaData = getServiceAreaData(collectorRequests);

    const analytics = {
      collector: {
        id: collector._id,
        name: collector.userId.name,
        rating: collector.rating,
        verificationStatus: collector.verificationStatus,
        joinedAt: collector.createdAt
      },
      performance: {
        totalPickups: completedPickups.length,
        pendingPickups: collectorRequests.filter(req => req.status === 'pending').length,
        totalEarnings,
        wasteCollected,
        completionRate: collector.completionRate,
        avgEarningsPerPickup: completedPickups.length > 0 ? (totalEarnings / completedPickups.length).toFixed(2) : 0,
        efficiency: wasteCollected > 0 ? (wasteCollected / (completedPickups.length || 1)).toFixed(1) : 0
      },
      trends: {
        monthly: monthlyPerformance,
        serviceAreas: serviceAreaData,
        wasteTypes: getWasteTypeBreakdown(completedPickups)
      }
    };

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Get collector analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch collector analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper functions
async function getUserGrowthData(startDate) {
  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: startDate }, role: 'user' } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  return userGrowth;
}

async function getWasteGrowthData(startDate) {
  const wasteGrowth = await WasteRequest.aggregate([
    { $match: { createdAt: { $gte: startDate }, status: 'completed' } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        quantity: { $sum: '$quantity' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  return wasteGrowth;
}

async function getRevenueGrowthData(startDate) {
  const revenueGrowth = await WasteRequest.aggregate([
    { $match: { createdAt: { $gte: startDate }, status: 'completed' } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        revenue: { $sum: '$estimatedValue' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  return revenueGrowth;
}

async function getTopCollectors() {
  const topCollectors = await WasteRequest.aggregate([
    { $match: { status: 'completed', collectorId: { $exists: true } } },
    {
      $group: {
        _id: '$collectorId',
        totalPickups: { $sum: 1 },
        totalWaste: { $sum: '$quantity' },
        totalEarnings: { $sum: '$estimatedValue' }
      }
    },
    { $sort: { totalPickups: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' }
  ]);

  return topCollectors;
}

async function getRecentActivities() {
  const recentRequests = await WasteRequest.find()
    .populate('userId', 'name')
    .populate('collectorId', 'name')
    .sort({ createdAt: -1 })
    .limit(20);

  return recentRequests.map(req => ({
    type: 'waste_request',
    status: req.status,
    user: req.userId.name,
    collector: req.collectorId?.name,
    wasteType: req.wasteType,
    quantity: req.quantity,
    createdAt: req.createdAt
  }));
}

function getMonthlyUserData(userRequests, userTransactions) {
  const months = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const monthlyPickups = userRequests.filter(req => {
      const reqDate = new Date(req.createdAt);
      return reqDate >= monthStart && reqDate <= monthEnd && req.status === 'completed';
    });

    const monthlyEarnings = userTransactions.filter(tx => {
      const txDate = new Date(tx.createdAt);
      return txDate >= monthStart && txDate <= monthEnd && tx.type === 'pickup';
    }).reduce((sum, tx) => sum + tx.amount, 0);

    months.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
      pickups: monthlyPickups.length,
      earnings: monthlyEarnings,
      waste: monthlyPickups.reduce((sum, req) => sum + req.quantity, 0)
    });
  }
  
  return months;
}

function getMonthlyCollectorData(collectorRequests) {
  const months = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const monthlyCompleted = collectorRequests.filter(req => {
      const reqDate = new Date(req.completedAt || req.createdAt);
      return reqDate >= monthStart && reqDate <= monthEnd && req.status === 'completed';
    });

    months.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
      pickups: monthlyCompleted.length,
      earnings: monthlyCompleted.reduce((sum, req) => sum + (req.estimatedValue || 0), 0),
      waste: monthlyCompleted.reduce((sum, req) => sum + req.quantity, 0)
    });
  }
  
  return months;
}

function getServiceAreaData(collectorRequests) {
  // This would require geocoding or area mapping
  // For now, return a simple breakdown
  return [];
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

  return Object.entries(breakdown).map(([type, quantity]) => ({
    type,
    quantity,
    percentage: completedPickups.length > 0 ? ((quantity / completedPickups.reduce((sum, p) => sum + p.quantity, 0)) * 100).toFixed(1) : 0
  }));
}

export default router;
