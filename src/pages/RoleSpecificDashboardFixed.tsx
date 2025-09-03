import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Recycle, 
  Leaf, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Activity,
  PieChart,
  DollarSign,
  Users,
  Target,
  Award,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  Truck
} from 'lucide-react';
import { dataStore } from '@/lib/dynamicDataStore';
import UserChart from '@/components/charts/UserChart';

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  icon: any;
  color: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: string;
}

const RoleSpecificDashboard = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      try {
        let stats;
        switch (user.subtype) {
          case 'trash-generator':
            stats = dataStore.getUserStats(user.id);
            break;
          case 'ngo-business':
            stats = dataStore.getNGOStats(user.id);
            break;
          case 'diy-marketplace':
            stats = dataStore.getDIYStats(user.id);
            break;
          default:
            stats = {};
        }
        setUserStats(stats);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    }
  }, [user?.id]);

  const getSubTypeTitle = () => {
    switch (user?.subtype) {
      case 'trash-generator':
        return 'Citizen Dashboard';
      case 'ngo-business':
        return 'NGO/Business Dashboard';
      case 'diy-marketplace':
        return 'DIY Marketplace Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getTitleIcon = () => {
    switch (user?.subtype) {
      case 'trash-generator':
        return Recycle;
      case 'ngo-business':
        return Users;
      case 'diy-marketplace':
        return Package;
      default:
        return Leaf;
    }
  };

  const getChartType = () => {
    switch (user?.subtype) {
      case 'trash-generator':
        return 'ecoScore';
      case 'ngo-business':
        return 'ngoImpact';
      case 'diy-marketplace':
        return 'diyEarnings';
      default:
        return 'monthlyActivity';
    }
  };

  const getChartTitle = () => {
    switch (user?.subtype) {
      case 'trash-generator':
        return 'Eco Score Trend';
      case 'ngo-business':
        return 'Impact Overview';
      case 'diy-marketplace':
        return 'Sales Performance';
      default:
        return 'Activity Overview';
    }
  };

  const getStatsCards = (): StatCard[] => {
    if (!userStats) return [];

    switch (user?.subtype) {
      case 'trash-generator':
        const userPickups = dataStore.getPickupRequestsByUser(user.id);
        const completedPickups = userPickups.filter(p => p.status === 'completed');
        const totalWaste = completedPickups.reduce((sum, p) => sum + p.quantity, 0);
        
        return [
          {
            title: 'Total Pickups',
            value: completedPickups.length,
            change: '+2 this month',
            icon: Package,
            color: 'text-primary',
          },
          {
            title: 'Waste Collected',
            value: `${totalWaste}kg`,
            change: '+15kg this month',
            icon: Recycle,
            color: 'text-green-600',
          },
          {
            title: 'Green Coins',
            value: user.greenCoins || 0,
            change: '+50 this month',
            icon: DollarSign,
            color: 'text-blue-600',
          },
          {
            title: 'Eco Score',
            value: user.ecoScore || 0,
            change: '+5 this month',
            icon: Award,
            color: 'text-yellow-600',
          },
        ];

      case 'ngo-business':
        return [
          {
            title: 'Active Programs',
            value: userStats.activePrograms || 0,
            change: '+1 this month',
            icon: Target,
            color: 'text-primary',
          },
          {
            title: 'Participants',
            value: userStats.totalParticipants || 0,
            change: '+25 this month',
            icon: Users,
            color: 'text-green-600',
          },
          {
            title: 'Waste Reduced',
            value: `${userStats.wasteRecycled || 0}kg`,
            change: '+120kg this month',
            icon: Recycle,
            color: 'text-blue-600',
          },
          {
            title: 'Impact Score',
            value: userStats.impactScore || 0,
            change: '+8 this month',
            icon: Award,
            color: 'text-yellow-600',
          },
        ];

      case 'diy-marketplace':
        return [
          {
            title: 'Items Listed',
            value: userStats.itemsListed || 0,
            change: '+3 this month',
            icon: Package,
            color: 'text-primary',
          },
          {
            title: 'Items Sold',
            value: userStats.itemsSold || 0,
            change: '+2 this month',
            icon: ShoppingCart,
            color: 'text-green-600',
          },
          {
            title: 'Total Earnings',
            value: `₹${userStats.totalEarnings || 0}`,
            change: '+₹800 this month',
            icon: DollarSign,
            color: 'text-blue-600',
          },
          {
            title: 'Rating',
            value: `${userStats.rating || 4.6}/5`,
            change: 'Based on reviews',
            icon: Star,
            color: 'text-yellow-600',
          },
        ];

      default:
        return [];
    }
  };

  const getRecentActivity = (): ActivityItem[] => {
    switch (user?.subtype) {
      case 'trash-generator':
        const userPickups = dataStore.getPickupRequestsByUser(user?.id || '');
        return userPickups.slice(0, 3).map((pickup, index) => ({
          id: pickup.id,
          type: 'pickup',
          description: `${pickup.wasteType} pickup - ${pickup.quantity}kg`,
          timestamp: pickup.scheduledDate,
          status: pickup.status
        }));

      case 'ngo-business':
        return [
          {
            id: '1',
            type: 'program',
            description: 'New recycling program launched',
            timestamp: '2 hours ago',
            status: 'active'
          },
          {
            id: '2',
            type: 'partnership',
            description: 'Partnership with local school established',
            timestamp: '1 day ago',
            status: 'completed'
          },
          {
            id: '3',
            type: 'event',
            description: 'Community cleanup event organized',
            timestamp: '3 days ago',
            status: 'completed'
          }
        ];

      case 'diy-marketplace':
        const userProducts = dataStore.getDIYProducts().filter(p => p.sellerId === user?.id);
        return userProducts.slice(0, 3).map((product, index) => ({
          id: product.id,
          type: 'product',
          description: `${product.title} - ₹${product.price}`,
          timestamp: product.createdAt.toLocaleDateString(),
          status: product.status
        }));

      default:
        return [];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
      case 'sold':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const TitleIcon = getTitleIcon();
  const statsCards = getStatsCards();
  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/15 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-success/10 rounded-full blur-lg animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <TitleIcon className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-eco bg-clip-text text-transparent">
              {getSubTypeTitle()}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Track your progress and manage your eco-impact
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Main Chart */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span>{getChartTitle()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <UserChart type={getChartType()} userStats={userStats} />
              </div>
            </CardContent>
          </Card>

          {/* Secondary Chart */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Monthly Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <UserChart type="monthlyActivity" userStats={userStats} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{activity.description}</div>
                      <div className="text-sm text-muted-foreground">{activity.timestamp}</div>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Schedule Pickup</h3>
              <p className="text-sm text-muted-foreground mb-4">Book your next waste collection</p>
              <Button className="bg-gradient-eco">Schedule Now</Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Browse Eco Store</h3>
              <p className="text-sm text-muted-foreground mb-4">Shop sustainable products</p>
              <Button variant="outline">Visit Store</Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">View Analytics</h3>
              <p className="text-sm text-muted-foreground mb-4">Track your eco-impact</p>
              <Button variant="outline">View Details</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSpecificDashboard;
