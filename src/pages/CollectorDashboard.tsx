import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  TrendingUp, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Truck,
  Users,
  Calendar,
  Target,
  Star,
  Route,
  Award
} from 'lucide-react';
import UserChart from '@/components/charts/UserChart';
import { dataStore } from '@/lib/dynamicDataStore';
import CollectorChart from '@/components/charts/CollectorChart';

const CollectorDashboard = () => {
  const { user } = useAuth();
  const [collectorStats, setCollectorStats] = useState<any>(null);
  const [availablePickups, setAvailablePickups] = useState<any[]>([]);
  const [completedPickups, setCompletedPickups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user?.id) {
      try {
        const stats = dataStore.getCollectorStats(user.id);
        setCollectorStats(stats);
        
        const pendingPickups = dataStore.getPendingPickupRequests();
        setAvailablePickups(pendingPickups);
        
        const myCompletedPickups = dataStore.getPickupRequestsByCollector(user.id).filter(pickup => 
          pickup.status === 'completed'
        );
        setCompletedPickups(myCompletedPickups);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading collector data:', error);
        setLoading(false);
      }
    }
  }, [user?.id]);

  if (!user || user.role !== 'collector') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You must be logged in as a collector to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading collector dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Earnings',
      value: `₹${collectorStats?.totalEarnings || 0}`,
      change: `${collectorStats?.totalPickups || 0} pickups completed`,
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: '+15%',
    },
    {
      title: 'Active Pickups',
      value: `${availablePickups.length}`,
      change: `${collectorStats?.activePickups || 0} in progress`,
      icon: Truck,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+2',
    },
    {
      title: 'Waste Collected',
      value: `${collectorStats?.wasteCollected || 0}kg`,
      change: 'Total collected',
      icon: Star,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      trend: '+0.2',
    },
    {
      title: 'Efficiency',
      value: `${collectorStats?.efficiency || 0}kg/pickup`,
      change: 'Average per pickup',
      icon: Award,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      trend: '+5%',
    },
  ];

  const quickActions = [
    {
      title: 'View Requests',
      description: 'Browse available pickups',
      icon: AlertCircle,
      to: '/collector/requests',
      color: 'bg-primary text-primary-foreground',
    },
    {
      title: 'Active Route',
      description: 'Navigate to pickups',
      icon: Route,
      to: '/collector/active',
      color: 'bg-success text-success-foreground',
    },
    {
      title: 'Inventory',
      description: 'Manage your waste stock',
      icon: Package,
      to: '/collector/inventory',
      color: 'bg-purple-600 text-white',
    },
    {
      title: 'View Earnings',
      description: 'Track your income',
      icon: TrendingUp,
      to: '/collector/earnings',
      color: 'bg-warning text-white',
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome, {user.name}! 🚛
        </h1>
        <p className="text-muted-foreground">
          Ready to collect some waste and earn rewards? Let's make an impact today!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold bg-gradient-eco bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      asChild
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center text-center space-y-2"
                    >
                      <Link to={action.to}>
                        <div className={`p-2 rounded-full ${action.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{action.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Available Pickup Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Available Pickup Requests
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/collector/requests">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availablePickups.slice(0, 3).map((pickup) => (
                  <div key={pickup.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium capitalize">{pickup.wasteType}</p>
                        <Badge variant="secondary" className="text-xs">
                          {pickup.quantity}kg
                        </Badge>
                        <Badge 
                          variant={pickup.status === 'pending' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {pickup.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {pickup.address.split(',')[0]}
                        <Clock className="h-3 w-3 ml-3 mr-1" />
                        {new Date(pickup.scheduledDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-success">
                        Est. ₹{pickup.estimatedValue || pickup.quantity * 2}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        +{pickup.greenCoins || pickup.quantity * 5} GC
                      </p>
                    </div>
                  </div>
                ))}
                
                {availablePickups.length === 0 && (
                  <div className="text-center py-8">
                    <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No available pickups right now</p>
                    <p className="text-sm text-muted-foreground">
                      Check back later for new opportunities
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span>Monthly Earnings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <UserChart type="collectorPerformance" userStats={collectorStats} />
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Performance Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Pickups</span>
                  <span className="font-medium">{collectorStats.totalPickups}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Earnings</span>
                  <span className="font-medium text-success">
                    ₹{collectorStats?.totalEarnings || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Inventory Value</span>
                  <span className="font-medium text-primary">
                    ₹{collectorStats?.inventoryValue || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Efficiency</span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="font-medium">{collectorStats?.efficiency || 0} kg/pickup</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Optimization Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Route className="h-5 w-5 text-primary" />
                <span>Route Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.508606919916!2d72.91715567475678!3d22.560073233430376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4e1285d628d5%3A0xe6cee346bfaa35d0!2sG%20H%20Patel%20College%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1756497169186!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{border: 0}} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Route Optimization Map"
                />
              </div>
              <div className="p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Optimized route for your active pickups. Tap locations for navigation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Active Pickups */}
          <Card>
            <CardHeader>
              <CardTitle>My Active Pickups</CardTitle>
            </CardHeader>
            <CardContent>
              {availablePickups.length > 0 ? (
                <div className="space-y-3">
                  {availablePickups.slice(0, 3).map((pickup) => (
                    <div key={pickup.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{pickup.wasteType}</span>
                        <Badge variant="default">In Progress</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {pickup.address.split(',')[0]}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Scheduled: {new Date(pickup.scheduledDate || pickup.scheduledDate).toLocaleString()}
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3" asChild>
                        <Link to="/collector/active">Navigate</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No active pickups</p>
                  <Button size="sm" className="mt-2" asChild>
                    <Link to="/collector/requests">Find Pickups</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollectorDashboard;