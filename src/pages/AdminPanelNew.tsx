import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dataStore } from '@/lib/dynamicDataStore';
import BackButton from '@/components/BackButton';
import { 
  Users, 
  Truck, 
  TrendingUp, 
  MapPin, 
  BarChart3, 
  Activity,
  DollarSign,
  Recycle,
  Award,
  CheckCircle,
  Search,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Package,
  Warehouse,
  ShoppingCart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'collector' | 'admin';
  subtype?: string;
  greenCoins: number;
  isVerified: boolean;
  createdAt: any;
}

interface InventoryItem {
  id: string;
  name: string;
  category: 'plastic' | 'paper' | 'metal' | 'e-waste' | 'glass' | 'organic';
  quantity: number;
  unit: 'kg' | 'tons' | 'pieces';
  pricePerUnit: number;
  location: string;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const AdminPanelNew = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [collectors, setCollectors] = useState<UserData[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load dynamic data
    const loadData = () => {
      const allUsers = dataStore.getAllUsers();
      const usersList = allUsers.filter(u => u.role === 'user');
      const collectorsList = allUsers.filter(u => u.role === 'collector');
      const stats = dataStore.getAdminStats();
      
      setUsers(usersList);
      setCollectors(collectorsList);
      setAdminStats(stats);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Mock inventory data
  const mockInventory: InventoryItem[] = [
    {
      id: '1',
      name: 'Recycled Plastic Bottles',
      category: 'plastic',
      quantity: 2500,
      unit: 'kg',
      pricePerUnit: 15,
      location: 'Warehouse A',
      lastUpdated: '2024-01-30',
      status: 'in-stock'
    },
    {
      id: '2',
      name: 'Sorted Paper Waste',
      category: 'paper',
      quantity: 1800,
      unit: 'kg',
      pricePerUnit: 8,
      location: 'Warehouse B',
      lastUpdated: '2024-01-29',
      status: 'in-stock'
    },
    {
      id: '3',
      name: 'Scrap Metal Collection',
      category: 'metal',
      quantity: 450,
      unit: 'kg',
      pricePerUnit: 45,
      location: 'Warehouse C',
      lastUpdated: '2024-01-28',
      status: 'low-stock'
    },
    {
      id: '4',
      name: 'Electronic Components',
      category: 'e-waste',
      quantity: 120,
      unit: 'pieces',
      pricePerUnit: 25,
      location: 'Warehouse D',
      lastUpdated: '2024-01-27',
      status: 'low-stock'
    },
    {
      id: '5',
      name: 'Glass Bottles & Jars',
      category: 'glass',
      quantity: 800,
      unit: 'kg',
      pricePerUnit: 12,
      location: 'Warehouse A',
      lastUpdated: '2024-01-26',
      status: 'in-stock'
    },
    {
      id: '6',
      name: 'Organic Compost Material',
      category: 'organic',
      quantity: 50,
      unit: 'kg',
      pricePerUnit: 5,
      location: 'Warehouse E',
      lastUpdated: '2024-01-25',
      status: 'out-of-stock'
    }
  ];

  // Monthly analytics data
  const monthlyData = [
    { month: 'Jan', users: 1250, collectors: 85, revenue: 45000, wasteProcessed: 12500 },
    { month: 'Feb', users: 1380, collectors: 92, revenue: 52000, wasteProcessed: 14200 },
    { month: 'Mar', users: 1520, collectors: 98, revenue: 58000, wasteProcessed: 15800 },
    { month: 'Apr', users: 1680, collectors: 105, revenue: 63000, wasteProcessed: 17200 },
    { month: 'May', users: 1850, collectors: 112, revenue: 68000, wasteProcessed: 18900 },
    { month: 'Jun', users: 2020, collectors: 118, revenue: 74000, wasteProcessed: 20500 },
    { month: 'Jul', users: 2200, collectors: 125, revenue: 80000, wasteProcessed: 22200 },
    { month: 'Aug', users: 2400, collectors: 132, revenue: 86000, wasteProcessed: 23900 },
    { month: 'Sep', users: 2600, collectors: 140, revenue: 92000, wasteProcessed: 25600 },
    { month: 'Oct', users: 2800, collectors: 148, revenue: 98000, wasteProcessed: 27300 },
    { month: 'Nov', users: 3000, collectors: 156, revenue: 104000, wasteProcessed: 29000 },
    { month: 'Dec', users: 3200, collectors: 164, revenue: 110000, wasteProcessed: 30700 }
  ];

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // Use mock data instead of Firebase for now
      const mockUsers: UserData[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@test.com',
          role: 'user',
          subtype: 'trash-generator',
          greenCoins: 150,
          isVerified: true,
          createdAt: { toDate: () => new Date('2024-12-15') }
        },
        {
          id: 'sample2',
          name: 'Priya Patel',
          email: 'priya@example.com',
          role: 'user',
          subtype: 'ngo-business',
          greenCoins: 320,
          isVerified: true,
          createdAt: { toDate: () => new Date('2024-12-20') }
        },
        {
          id: 'sample3',
          name: 'Sneha Reddy',
          email: 'sneha@example.com',
          role: 'user',
          subtype: 'diy-marketplace',
          greenCoins: 85,
          isVerified: false,
          createdAt: { toDate: () => new Date('2025-01-05') }
        }
      ];
        
      const sampleCollectors: UserData[] = [
        {
          id: 'collector1',
          name: 'Amit Kumar',
          email: 'amit@example.com',
          role: 'collector',
          greenCoins: 2450,
          isVerified: true,
          createdAt: { toDate: () => new Date('2024-12-10') }
        },
        {
          id: 'collector2',
          name: 'Rajesh Singh',
          email: 'rajesh@example.com',
          role: 'collector',
          greenCoins: 1890,
          isVerified: true,
          createdAt: { toDate: () => new Date('2024-12-25') }
        }
      ];
        
      setUsers(mockUsers);
      setCollectors(sampleCollectors);
      setInventory(mockInventory);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    fetchUsers();
    toast({
      title: 'Data Refreshed',
      description: 'All data has been refreshed successfully',
    });
  };

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Data export will be available shortly',
    });
  };

  const handleView = (id: string) => {
    toast({
      title: 'View Details',
      description: `Viewing details for user ${id}`,
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: 'Edit User',
      description: `Editing user ${id}`,
    });
  };

  // Filter functions
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCollectors = collectors.filter(collector => 
    collector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collector.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculations
  const totalUsers = users.length;
  const totalCollectors = collectors.length;
  const totalRevenue = users.reduce((sum, user) => sum + user.greenCoins, 0) + 
                      collectors.reduce((sum, collector) => sum + collector.greenCoins, 0);
  const totalWasteProcessed = inventory.reduce((sum, item) => sum + item.quantity, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      case 'low-stock':
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <BackButton />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-eco bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage users, collectors, and platform analytics
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-primary">{totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Collectors</p>
                  <p className="text-2xl font-bold text-success">{totalCollectors}</p>
                </div>
                <Truck className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-yellow-600">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Waste Processed</p>
                  <p className="text-2xl font-bold text-purple-600">{totalWasteProcessed} kg</p>
                </div>
                <Recycle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users and collectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="collectors">Collectors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="map">Live Map</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle>Platform Users</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Name</th>
                          <th className="text-left p-4">Email</th>
                          <th className="text-left p-4">Type</th>
                          <th className="text-left p-4">Green Coins</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="p-4 font-medium">{user.name}</td>
                            <td className="p-4 text-muted-foreground">{user.email}</td>
                            <td className="p-4">
                              <Badge variant="outline">{user.subtype || 'User'}</Badge>
                            </td>
                            <td className="p-4">{user.greenCoins}</td>
                            <td className="p-4">
                              {user.isVerified ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleView(user.id)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(user.id)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collectors Tab */}
          <TabsContent value="collectors">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle>Waste Collectors</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading collectors...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Name</th>
                          <th className="text-left p-4">Email</th>
                          <th className="text-left p-4">Green Coins</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCollectors.map((collector) => (
                          <tr key={collector.id} className="border-b hover:bg-muted/50">
                            <td className="p-4 font-medium">{collector.name}</td>
                            <td className="p-4 text-muted-foreground">{collector.email}</td>
                            <td className="p-4">{collector.greenCoins}</td>
                            <td className="p-4">
                              {collector.isVerified ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleView(collector.id)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(collector.id)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle>Monthly Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((month, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{month.month}</p>
                          <p className="text-sm text-muted-foreground">
                            {month.users} users, {month.collectors} collectors
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">₹{month.revenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{month.wasteProcessed} kg</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">User Growth Rate</span>
                      <span className="text-2xl font-bold text-green-600">+24%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Collector Retention</span>
                      <span className="text-2xl font-bold text-blue-600">89%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Revenue/User</span>
                      <span className="text-2xl font-bold text-purple-600">₹1,850</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Waste Processing Rate</span>
                      <span className="text-2xl font-bold text-orange-600">92%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Warehouse className="h-5 w-5" />
                  <span>Inventory Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-700">In Stock Items</p>
                          <p className="text-2xl font-bold text-green-800">
                            {inventory.filter(item => item.status === 'in-stock').length}
                          </p>
                        </div>
                        <Package className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-700">Low Stock Items</p>
                          <p className="text-2xl font-bold text-yellow-800">
                            {inventory.filter(item => item.status === 'low-stock').length}
                          </p>
                        </div>
                        <Activity className="h-8 w-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-700">Out of Stock</p>
                          <p className="text-2xl font-bold text-red-800">
                            {inventory.filter(item => item.status === 'out-of-stock').length}
                          </p>
                        </div>
                        <ShoppingCart className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Item Name</th>
                        <th className="text-left p-4">Category</th>
                        <th className="text-left p-4">Quantity</th>
                        <th className="text-left p-4">Price/Unit</th>
                        <th className="text-left p-4">Location</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Last Updated</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{item.name}</td>
                          <td className="p-4">
                            <Badge variant="outline" className="capitalize">
                              {item.category}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="p-4">₹{item.pricePerUnit}</td>
                          <td className="p-4">{item.location}</td>
                          <td className="p-4">{getStatusBadge(item.status)}</td>
                          <td className="p-4 text-muted-foreground">{item.lastUpdated}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleView(item.id)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(item.id)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
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

          {/* Live Map Tab */}
          <TabsContent value="map">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Live Collection Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Interactive Map Coming Soon
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Real-time tracking of collectors and pickup locations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanelNew;
