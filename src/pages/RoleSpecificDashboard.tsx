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

interface DashboardData {
  stats: Array<{
    title: string;
    value: string | number;
    change: string;
    icon: any;
    color: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
  charts: {
    categories: Record<string, number>;
  };
}

const RoleSpecificDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Get dynamic data based on user subtype
    const getDynamicData = (): DashboardData => {
      if (!user?.id) {
        return {
          stats: {},
          recentActivity: [],
          charts: { monthly: [], categories: {} }
        };
      }

      const userStats = dataStore.getUserStats(user.id);
      const userTransactions = dataStore.getTransactionsByUser(user.id);
      const userPickups = dataStore.getPickupRequestsByUser(user.id);

      switch (user?.subtype) {
        case 'trash-generator':
          return {
            stats: userStats || {
              totalPickups: 0,
              wasteCollected: 0,
              greenCoins: user.greenCoins,
              ecoScore: user.ecoScore || 0,
              co2Saved: 0,
              nextPickup: null
            },
            recentActivity: userTransactions.slice(0, 5).map(tx => ({
              id: tx.id,
              type: tx.type,
              description: tx.description,
              timestamp: tx.createdAt.toLocaleString(),
              status: 'completed'
            })),
            charts: {
              monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              categories: userPickups.reduce((acc: Record<string, number>, pickup) => {
                acc[pickup.wasteType] = (acc[pickup.wasteType] || 0) + pickup.quantity;
                return acc;
              }, {})
            }
          };
        case 'ngo-business':
          return {
            stats: {
              activeProjects: 8,
              totalParticipants: 150,
              wasteReduced: 450,
              partnerships: 6,
              impactScore: 98,
              nextEvent: 'Jan 15, 2024'
            },
            recentActivity: userTransactions.slice(0, 5).map(tx => ({
              id: tx.id,
              type: tx.type as string,
              description: tx.description,
              timestamp: tx.createdAt.toLocaleString(),
              status: 'completed'
            })),
            charts: {
              monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              categories: {
                community: 40,
                schools: 25,
                corporate: 20,
                events: 15
              }
            }
          };
        case 'diy-marketplace':
          const diyStats = dataStore.getDIYStats(user.id);
          return {
            stats: {
              itemsListed: diyStats?.itemsListed || 12,
              itemsSold: diyStats?.itemsSold || 8,
              totalEarnings: diyStats?.totalEarnings || 2400,
              rating: diyStats?.rating || 4.6,
              activeListings: diyStats?.activeListings || 4,
              completedSales: diyStats?.completedSales || 8
            },
            recentActivity: [
              {
                id: '1',
                type: 'sale',
                description: 'Sold Upcycled Wooden Planter for ₹450',
                timestamp: '2 hours ago',
                status: 'completed'
              },
              {
                id: '2',
                type: 'listing',
                description: 'Listed new Recycled Bottle Lamp',
                timestamp: '1 day ago',
                status: 'active'
              },
              {
                id: '3',
                type: 'review',
                description: 'Received 5-star review for Cardboard Organizer',
                timestamp: '3 days ago',
                status: 'positive'
              }
            ],
            charts: {
              monthly: [150, 200, 180, 220, 280, 320],
              categories: { 'Home Decor': 45, 'Lighting': 30, 'Storage': 25 }
            }
          };
        default:
          return {
            stats: {},
            recentActivity: [],
            charts: { monthly: [], categories: {} }
          };
      }
    };

    setDashboardData(getDynamicData());
  }, [user?.subtype, user?.id]);

  const getSubTypeTitle = () => {
    switch (user?.subtype) {
      case 'trash-generator':
        return 'Waste Generator Dashboard';
      case 'ngo-business':
        return 'NGO/Business Dashboard';
      case 'diy-marketplace':
        return 'DIY Marketplace Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getSubTypeIcon = () => {
    switch (user?.subtype) {
      case 'trash-generator':
        return Recycle;
      case 'ngo-business':
        return Users;
      case 'diy-marketplace':
        return ShoppingCart;
      default:
        return Activity;
    }
  };

  const renderStatsCards = () => {
    if (!dashboardData) return null;

    const { stats } = dashboardData;
    
    switch (user?.subtype) {
      case 'trash-generator':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Pickups</p>
                    <p className="text-2xl font-bold text-primary">{stats.totalPickups}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Waste Collected</p>
                    <p className="text-2xl font-bold text-green-600">{stats.wasteCollected}kg</p>
                  </div>
                  <Recycle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Green Coins</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.greenCoins}</p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Eco Score</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.ecoScore}%</p>
                  </div>
                  <Leaf className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CO2 Saved</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.co2Saved}kg</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Pickup</p>
                    <p className="text-lg font-bold text-orange-600">{stats.nextPickup}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'ngo-business':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold text-primary">{stats.activeProjects}</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Participants</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalParticipants}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Waste Reduced</p>
                    <p className="text-2xl font-bold text-green-600">{stats.wasteReduced}kg</p>
                  </div>
                  <Recycle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Partnerships</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.partnerships}</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Impact Score</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.impactScore}%</p>
                  </div>
                  <Target className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Event</p>
                    <p className="text-lg font-bold text-orange-600">{stats.nextEvent}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'diy-marketplace':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Items Listed</p>
                    <p className="text-2xl font-bold text-primary">{stats.itemsListed}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
                    <p className="text-2xl font-bold text-green-600">{stats.itemsSold}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold text-blue-600">₹{(stats.totalEarnings as number / 1000).toFixed(1)}K</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.rating}⭐</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.activeListings}</p>
                  </div>
                  <Recycle className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed Sales</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.completedSales}</p>
                  </div>
                  <Truck className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!dashboardData) return null;

  const TitleIcon = getSubTypeIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/15 rounded-full blur-xl animate-float-delayed"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
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
          {dashboardData.stats.map((stat, index) => {
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

          {/* Category Distribution */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Category Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(dashboardData.charts.categories).map(([category, value]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{activity.description}</div>
                    <div className="text-sm text-muted-foreground">{activity.timestamp}</div>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
