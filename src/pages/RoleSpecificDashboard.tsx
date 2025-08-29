import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Package, 
  Users, 
  Award, 
  Recycle, 
  ShoppingCart,
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Leaf,
  Star
} from 'lucide-react';

interface DashboardData {
  stats: Record<string, number | string>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
  charts: {
    monthly: number[];
    categories: Record<string, number>;
  };
}

const RoleSpecificDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Mock data based on user subtype
    const getMockData = (): DashboardData => {
      switch (user?.subType) {
        case 'trash-generator':
          return {
            stats: {
              totalPickups: 23,
              wasteCollected: 245,
              greenCoins: 1250,
              ecoScore: 87,
              co2Saved: 45.6,
              nextPickup: 'Aug 30, 2024'
            },
            recentActivity: [
              {
                id: '1',
                type: 'pickup',
                description: 'Plastic bottles pickup completed',
                timestamp: '2024-08-25 10:30 AM',
                status: 'completed'
              },
              {
                id: '2',
                type: 'reward',
                description: 'Earned 75 Green Coins',
                timestamp: '2024-08-25 10:35 AM',
                status: 'success'
              },
              {
                id: '3',
                type: 'pickup',
                description: 'Cardboard pickup scheduled',
                timestamp: '2024-08-30 2:00 PM',
                status: 'scheduled'
              }
            ],
            charts: {
              monthly: [12, 18, 23, 15, 28, 22],
              categories: { plastic: 45, cardboard: 30, metal: 15, glass: 10 }
            }
          };

        case 'ngo-business':
          return {
            stats: {
              activeProjects: 8,
              totalParticipants: 2450,
              wasteReduced: 2340,
              partnerships: 15,
              impactScore: 94,
              nextEvent: 'Sep 5, 2024'
            },
            recentActivity: [
              {
                id: '1',
                type: 'project',
                description: 'Zero Waste Campaign launched',
                timestamp: '2024-08-20 9:00 AM',
                status: 'active'
              },
              {
                id: '2',
                type: 'partnership',
                description: 'New corporate partner onboarded',
                timestamp: '2024-08-18 3:30 PM',
                status: 'completed'
              },
              {
                id: '3',
                type: 'event',
                description: 'Community awareness event scheduled',
                timestamp: '2024-09-05 10:00 AM',
                status: 'scheduled'
              }
            ],
            charts: {
              monthly: [1200, 1800, 2100, 1900, 2450, 2340],
              categories: { campaigns: 40, csr: 35, awareness: 25 }
            }
          };

        case 'diy-marketplace':
          return {
            stats: {
              productsListed: 34,
              productsSold: 156,
              totalEarnings: 45600,
              avgRating: 4.7,
              wasteUpcycled: 890,
              nextOrder: 'Processing'
            },
            recentActivity: [
              {
                id: '1',
                type: 'sale',
                description: 'Upcycled bookshelf sold',
                timestamp: '2024-08-24 2:15 PM',
                status: 'completed'
              },
              {
                id: '2',
                type: 'listing',
                description: 'New product listed: Solar lamp',
                timestamp: '2024-08-23 11:00 AM',
                status: 'active'
              },
              {
                id: '3',
                type: 'review',
                description: 'Received 5-star review',
                timestamp: '2024-08-22 4:45 PM',
                status: 'positive'
              }
            ],
            charts: {
              monthly: [25, 32, 28, 35, 42, 34],
              categories: { furniture: 50, decor: 25, electronics: 15, crafts: 10 }
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

    setDashboardData(getMockData());
  }, [user?.subType]);

  const getSubTypeTitle = () => {
    switch (user?.subType) {
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
    switch (user?.subType) {
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
    
    switch (user?.subType) {
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
                    <p className="text-sm font-medium text-muted-foreground">Products Listed</p>
                    <p className="text-2xl font-bold text-primary">{stats.productsListed}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Products Sold</p>
                    <p className="text-2xl font-bold text-green-600">{stats.productsSold}</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}⭐</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Waste Upcycled</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.wasteUpcycled}kg</p>
                  </div>
                  <Recycle className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Order</p>
                    <p className="text-lg font-bold text-orange-600">{stats.nextOrder}</p>
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
        {renderStatsCards()}

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Monthly Trends Chart */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Monthly Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                📊 Monthly trend chart would be displayed here
                <div className="ml-4 text-sm">
                  Data: [{dashboardData.charts.monthly.join(', ')}]
                </div>
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
