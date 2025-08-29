import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Truck, 
  Package, 
  TrendingUp, 
  MapPin, 
  BarChart3, 
  PieChart, 
  Activity,
  DollarSign,
  Recycle,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'collector';
  subType?: string;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  totalRequests: number;
  wasteCollected?: number;
  earnings?: number;
}

interface CollectorLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'available' | 'busy' | 'offline';
  vehicleType: string;
  currentLoad: number;
  maxLoad: number;
}

interface AnalyticsData {
  totalUsers: number;
  totalCollectors: number;
  wasteCollected: number;
  revenue: number;
  activeRequests: number;
  completedRequests: number;
  sustainabilityScore: number;
  monthlyGrowth: number;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [collectors, setCollectors] = useState<CollectorLocation[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalCollectors: 0,
    wasteCollected: 0,
    revenue: 0,
    activeRequests: 0,
    completedRequests: 0,
    sustainabilityScore: 0,
    monthlyGrowth: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  const mockUsers: UserData[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      role: 'user',
      subType: 'trash-generator',
      location: 'Mumbai, Maharashtra',
      status: 'active',
      joinDate: '2024-01-15',
      totalRequests: 23
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya@example.com',
      role: 'user',
      subType: 'ngo-business',
      location: 'Ahmedabad, Gujarat',
      status: 'active',
      joinDate: '2024-02-20',
      totalRequests: 45
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      role: 'collector',
      location: 'Delhi, NCR',
      status: 'active',
      joinDate: '2024-01-10',
      totalRequests: 156,
      wasteCollected: 2340,
      earnings: 45600
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      email: 'sneha@example.com',
      role: 'user',
      subType: 'diy-marketplace',
      location: 'Bangalore, Karnataka',
      status: 'active',
      joinDate: '2024-03-05',
      totalRequests: 12
    }
  ];

  const mockCollectors: CollectorLocation[] = [
    {
      id: '1',
      name: 'Amit Kumar',
      lat: 28.6139,
      lng: 77.2090,
      status: 'available',
      vehicleType: 'small-truck',
      currentLoad: 45,
      maxLoad: 200
    },
    {
      id: '2',
      name: 'Rajesh Singh',
      lat: 19.0760,
      lng: 72.8777,
      status: 'busy',
      vehicleType: 'large-truck',
      currentLoad: 180,
      maxLoad: 500
    },
    {
      id: '3',
      name: 'Vikram Joshi',
      lat: 12.9716,
      lng: 77.5946,
      status: 'available',
      vehicleType: 'motorcycle',
      currentLoad: 8,
      maxLoad: 25
    }
  ];

  const mockAnalytics: AnalyticsData = {
    totalUsers: 1247,
    totalCollectors: 89,
    wasteCollected: 15600,
    revenue: 234500,
    activeRequests: 45,
    completedRequests: 2156,
    sustainabilityScore: 87,
    monthlyGrowth: 23.5
  };

  useEffect(() => {
    setUsers(mockUsers);
    setCollectors(mockCollectors);
    setAnalytics(mockAnalytics);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'text-primary' }: any) => (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {trend && (
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{trend}% this month
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/15 rounded-full blur-xl animate-float-delayed"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-eco bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Monitor and manage your eco-connect platform
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="collectors">Collectors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="map">Live Map</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={analytics.totalUsers.toLocaleString()}
                icon={Users}
                trend={analytics.monthlyGrowth}
                color="text-blue-600"
              />
              <StatCard
                title="Active Collectors"
                value={analytics.totalCollectors}
                icon={Truck}
                trend={15.2}
                color="text-green-600"
              />
              <StatCard
                title="Waste Collected"
                value={`${analytics.wasteCollected}kg`}
                icon={Recycle}
                trend={28.7}
                color="text-purple-600"
              />
              <StatCard
                title="Revenue"
                value={`₹${(analytics.revenue / 1000).toFixed(1)}K`}
                icon={DollarSign}
                trend={18.3}
                color="text-orange-600"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Requests</span>
                    <Badge className="bg-green-100 text-green-800">{analytics.activeRequests}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed Today</span>
                    <Badge className="bg-blue-100 text-blue-800">23</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Verification</span>
                    <Badge className="bg-yellow-100 text-yellow-800">7</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span>Sustainability Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Score</span>
                    <Badge className="bg-green-100 text-green-800">{analytics.sustainabilityScore}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CO2 Saved</span>
                    <Badge className="bg-blue-100 text-blue-800">2.3T</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trees Equivalent</span>
                    <Badge className="bg-green-100 text-green-800">156</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <span>System Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">3 collectors offline</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">High demand area: Mumbai</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">All systems operational</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-semibold">User</th>
                        <th className="p-4 font-semibold">Role</th>
                        <th className="p-4 font-semibold">Location</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Requests</th>
                        <th className="p-4 font-semibold">Join Date</th>
                        <th className="p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <Badge variant="outline" className="w-fit">
                                {user.role}
                              </Badge>
                              {user.subType && (
                                <span className="text-xs text-muted-foreground mt-1">
                                  {user.subType.replace('-', ' ')}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-sm">{user.location}</td>
                          <td className="p-4">
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm">{user.totalRequests}</td>
                          <td className="p-4 text-sm">{new Date(user.joinDate).toLocaleDateString()}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">View</Button>
                              <Button size="sm" variant="outline">Edit</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collectors Tab */}
          <TabsContent value="collectors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Collector Management</h2>
              <Button>Add New Collector</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collectors.map((collector) => (
                <Card key={collector.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{collector.name}</span>
                      <Badge className={getStatusColor(collector.status)}>
                        {collector.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm capitalize">{collector.vehicleType.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{collector.lat.toFixed(4)}, {collector.lng.toFixed(4)}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Load Capacity</span>
                        <span>{collector.currentLoad}/{collector.maxLoad}kg</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(collector.currentLoad / collector.maxLoad) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Monthly Collection Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    📊 Chart visualization would be implemented here with a charting library like Recharts
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Waste Type Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    🥧 Pie chart showing waste type breakdown would be here
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">98.5%</div>
                    <div className="text-sm text-muted-foreground">Collection Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">4.8⭐</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">23min</div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">87%</div>
                    <div className="text-sm text-muted-foreground">User Retention</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <h2 className="text-2xl font-bold">Live Collector Map</h2>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardContent className="p-6">
                <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg font-semibold">Interactive Map View</p>
                    <p className="text-sm">Real-time collector locations and routes would be displayed here</p>
                    <p className="text-xs mt-2">Integration with Google Maps or Mapbox would show:</p>
                    <ul className="text-xs mt-2 space-y-1">
                      <li>• Live collector positions</li>
                      <li>• Active pickup routes</li>
                      <li>• User request locations</li>
                      <li>• Traffic and optimal routing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-muted-foreground">Active Collectors</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">34</div>
                  <div className="text-sm text-muted-foreground">Pending Pickups</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">8.5km</div>
                  <div className="text-sm text-muted-foreground">Avg Distance</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
