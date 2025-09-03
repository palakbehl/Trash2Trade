import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore } from '@/lib/dynamicDataStore';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Award,
  Recycle,
  ShoppingCart,
  TrendingUp,
  Package,
  Star,
  Heart,
  Settings,
  Bell,
  Shield,
  CreditCard,
  History,
  Leaf
} from 'lucide-react';

interface ProfileStats {
  wasteCollected?: number;
  greenCoins?: number;
  pickupsCompleted?: number;
  sustainabilityScore?: number;
  productsListed?: number;
  productsSold?: number;
  partnershipProjects?: number;
  impactMetrics?: {
    co2Saved: number;
    treesEquivalent: number;
    wasteReduced: number;
  };
}

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });
  const { toast } = useToast();

  const handleNotificationToggle = (type: 'email' | 'sms' | 'push') => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    toast({
      title: "Settings Updated",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${notifications[type] ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleSettingsAction = (action: string) => {
    toast({
      title: "Feature Coming Soon",
      description: `${action} functionality will be available in the next update.`,
    });
  };

  // Get real profile data based on user subtype and dataStore
  const getProfileStats = (): ProfileStats => {
    if (!user?.id || !user?.subtype) return {};
    
    switch (user.subtype) {
      case 'trash-generator':
        const userStats = dataStore.getUserStats(user.id);
        const userPickups = dataStore.getPickupRequestsByUser(user.id);
        const completedPickups = userPickups.filter(p => p.status === 'completed');
        const totalWaste = completedPickups.reduce((sum, p) => sum + p.quantity, 0);
        
        return {
          wasteCollected: totalWaste || 245,
          greenCoins: user.greenCoins || 1250,
          pickupsCompleted: completedPickups.length || 23,
          sustainabilityScore: user.ecoScore || 87,
          impactMetrics: {
            co2Saved: totalWaste * 0.186 || 45.6, // CO2 factor per kg
            treesEquivalent: Math.floor(totalWaste / 20) || 12,
            wasteReduced: totalWaste || 245
          }
        };
      case 'ngo-business':
        const ngoStats = dataStore.getNGOStats(user.id);
        return {
          partnershipProjects: ngoStats?.activePrograms || 8,
          wasteCollected: ngoStats?.wasteRecycled || 2340,
          greenCoins: user.greenCoins || 5600,
          sustainabilityScore: 94,
          impactMetrics: {
            co2Saved: ngoStats?.co2Saved || 234.5,
            treesEquivalent: Math.floor((ngoStats?.wasteRecycled || 2340) / 35) || 67,
            wasteReduced: ngoStats?.wasteRecycled || 2340
          }
        };
      case 'diy-marketplace':
        const diyStats = dataStore.getDIYStats(user.id);
        return {
          productsListed: diyStats?.itemsListed || 12,
          productsSold: diyStats?.itemsSold || 8,
          greenCoins: user.greenCoins || 3400,
          sustainabilityScore: 91,
          impactMetrics: {
            co2Saved: (diyStats?.itemsSold || 8) * 15.4 || 123.4, // CO2 saved per upcycled item
            treesEquivalent: Math.floor((diyStats?.itemsSold || 8) * 4.2) || 34,
            wasteReduced: (diyStats?.itemsSold || 8) * 111 || 890 // avg waste per DIY product
          }
        };
      default:
        return {};
    }
  };

  const stats = getProfileStats();

  const renderSubTypeSpecificContent = () => {
    switch (user?.subtype) {
      case 'trash-generator':
        return (
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Recycle className="h-5 w-5 text-green-600" />
                  <span>Waste Collection History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataStore.getPickupRequestsByUser(user?.id || '').slice(0, 3).map((pickup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{pickup.wasteType}</div>
                        <div className="text-sm text-muted-foreground">{pickup.scheduledDate} • {pickup.quantity}kg</div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800">{pickup.status}</Badge>
                        <div className="text-sm text-primary font-medium">+{pickup.greenCoins} coins</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle>Eco Store Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Recycled Plastic Chair', price: '₹2,499', date: '2024-08-22', status: 'Delivered' },
                    { name: 'Eco-Friendly Tote Bag', price: '₹599', date: '2024-08-18', status: 'In Transit' },
                  ].map((purchase, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{purchase.name}</div>
                        <div className="text-sm text-muted-foreground">{purchase.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{purchase.price}</div>
                        <Badge variant="outline">{purchase.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'ngo-business':
        return (
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span>Partnership Projects</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Zero Waste Campaign 2024', status: 'Active', participants: 1200, impact: '2.3T waste reduced' },
                    { name: 'Corporate CSR Initiative', status: 'Completed', participants: 450, impact: '1.8T waste reduced' },
                    { name: 'Community Awareness Program', status: 'Planning', participants: 800, impact: 'Projected 1.5T' },
                  ].map((project, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{project.name}</div>
                        <Badge className={project.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                       project.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                                       'bg-yellow-100 text-yellow-800'}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {project.participants} participants • {project.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'diy-marketplace':
        return (
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-purple-600" />
                  <span>Seller Dashboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.productsListed}</div>
                    <div className="text-sm text-muted-foreground">Products Listed</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.productsSold}</div>
                    <div className="text-sm text-muted-foreground">Products Sold</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">₹{((dataStore.getDIYStats(user?.id || '').totalEarnings || 2400) / 1000).toFixed(1)}K</div>
                    <div className="text-sm text-muted-foreground">Total Earnings</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{dataStore.getDIYStats(user?.id || '').rating || 4.6}⭐</div>
                    <div className="text-sm text-muted-foreground">Seller Rating</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Recent Sales</h4>
                  {dataStore.getDIYProducts().filter(p => p.sellerId === user?.id && p.status === 'sold').slice(0, 3).map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-sm text-muted-foreground">Sold • {product.updatedAt.toLocaleDateString()}</div>
                      </div>
                      <div className="font-medium text-green-600">₹{product.price}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/15 rounded-full blur-xl animate-float-delayed"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-eco bg-clip-text text-transparent mb-4">
            My Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your account and track your eco-impact
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Info */}
              <Card className="md:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Profile Information</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Save' : 'Edit'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{user?.name || 'User Name'}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{user?.role}</Badge>
                        {user?.subtype && (
                          <Badge className="bg-primary/10 text-primary">
                            {user.subtype.replace('-', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          value={user?.email || ''} 
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          value="+91 9876543210" 
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="address" 
                          value="Mumbai, Maharashtra, India" 
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="joinDate">Member Since</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="joinDate" 
                          value="January 2024" 
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.greenCoins && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Green Coins</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{stats.greenCoins}</Badge>
                    </div>
                  )}
                  {stats.sustainabilityScore && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Eco Score</span>
                      <Badge className="bg-green-100 text-green-800">{stats.sustainabilityScore}%</Badge>
                    </div>
                  )}
                  {stats.wasteCollected && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Waste Collected</span>
                      <Badge className="bg-blue-100 text-blue-800">{stats.wasteCollected}kg</Badge>
                    </div>
                  )}
                  {stats.pickupsCompleted && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pickups</span>
                      <Badge variant="outline">{stats.pickupsCompleted}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.impactMetrics && (
                <>
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                    <CardContent className="p-6 text-center">
                      <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{stats.impactMetrics.co2Saved}kg</div>
                      <div className="text-sm text-muted-foreground">CO2 Saved</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                    <CardContent className="p-6 text-center">
                      <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{stats.impactMetrics.treesEquivalent}</div>
                      <div className="text-sm text-muted-foreground">Trees Equivalent</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                    <CardContent className="p-6 text-center">
                      <Recycle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">{stats.impactMetrics.wasteReduced}kg</div>
                      <div className="text-sm text-muted-foreground">Waste Reduced</div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle>Monthly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { month: 'Jan', greenCoins: 850, wasteCollected: 45 },
                        { month: 'Feb', greenCoins: 920, wasteCollected: 52 },
                        { month: 'Mar', greenCoins: 1100, wasteCollected: 68 },
                        { month: 'Apr', greenCoins: 1250, wasteCollected: 75 },
                        { month: 'May', greenCoins: 1180, wasteCollected: 71 },
                        { month: 'Jun', greenCoins: 1350, wasteCollected: 82 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="greenCoins" stroke="#10b981" strokeWidth={2} name="Green Coins" />
                        <Line type="monotone" dataKey="wasteCollected" stroke="#3b82f6" strokeWidth={2} name="Waste (kg)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle>Waste Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Plastic', value: 35, color: '#3b82f6' },
                            { name: 'Paper', value: 28, color: '#10b981' },
                            { name: 'Metal', value: 22, color: '#f59e0b' },
                            { name: 'E-Waste', value: 15, color: '#8b5cf6' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: 'Plastic', value: 35, color: '#3b82f6' },
                            { name: 'Paper', value: 28, color: '#10b981' },
                            { name: 'Metal', value: 22, color: '#f59e0b' },
                            { name: 'E-Waste', value: 15, color: '#8b5cf6' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            {renderSubTypeSpecificContent()}
          </TabsContent>


          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Notifications</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleNotificationToggle('email')}
                    >
                      {notifications.email ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Alerts</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleNotificationToggle('sms')}
                    >
                      {notifications.sms ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push Notifications</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleNotificationToggle('push')}
                    >
                      {notifications.push ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacy & Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleSettingsAction('Change Password')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleSettingsAction('Privacy Settings')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleSettingsAction('Payment Methods')}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
