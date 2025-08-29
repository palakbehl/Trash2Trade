import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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

  // Mock profile data based on user subtype
  const getProfileStats = (): ProfileStats => {
    if (!user?.subType) return {};
    
    switch (user.subType) {
      case 'trash-generator':
        return {
          wasteCollected: 245,
          greenCoins: 1250,
          pickupsCompleted: 23,
          sustainabilityScore: 87,
          impactMetrics: {
            co2Saved: 45.6,
            treesEquivalent: 12,
            wasteReduced: 245
          }
        };
      case 'ngo-business':
        return {
          partnershipProjects: 8,
          wasteCollected: 2340,
          greenCoins: 5600,
          sustainabilityScore: 94,
          impactMetrics: {
            co2Saved: 234.5,
            treesEquivalent: 67,
            wasteReduced: 2340
          }
        };
      case 'diy-marketplace':
        return {
          productsListed: 34,
          productsSold: 156,
          greenCoins: 3400,
          sustainabilityScore: 91,
          impactMetrics: {
            co2Saved: 123.4,
            treesEquivalent: 34,
            wasteReduced: 890
          }
        };
      default:
        return {};
    }
  };

  const stats = getProfileStats();

  const renderSubTypeSpecificContent = () => {
    switch (user?.subType) {
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
                  {[
                    { date: '2024-08-25', type: 'Plastic Bottles', amount: '15kg', status: 'Completed', coins: 75 },
                    { date: '2024-08-20', type: 'Cardboard', amount: '8kg', status: 'Completed', coins: 40 },
                    { date: '2024-08-15', type: 'E-Waste', amount: '3 items', status: 'Completed', coins: 150 },
                  ].map((pickup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{pickup.type}</div>
                        <div className="text-sm text-muted-foreground">{pickup.date} • {pickup.amount}</div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800">{pickup.status}</Badge>
                        <div className="text-sm text-primary font-medium">+{pickup.coins} coins</div>
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
                    <div className="text-2xl font-bold text-blue-600">₹45.6K</div>
                    <div className="text-sm text-muted-foreground">Total Earnings</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">4.7⭐</div>
                    <div className="text-sm text-muted-foreground">Seller Rating</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Recent Sales</h4>
                  {[
                    { product: 'Upcycled Wooden Bookshelf', buyer: 'Rahul S.', price: '₹4,999', date: '2024-08-24' },
                    { product: 'Handwoven Wall Art', buyer: 'Priya P.', price: '₹899', date: '2024-08-22' },
                    { product: 'Solar-Powered LED Lamp', buyer: 'Amit K.', price: '₹1,299', date: '2024-08-20' },
                  ].map((sale, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{sale.product}</div>
                        <div className="text-sm text-muted-foreground">Sold to {sale.buyer} • {sale.date}</div>
                      </div>
                      <div className="font-medium text-green-600">{sale.price}</div>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="ecostore">Eco Store</TabsTrigger>
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
                        {user?.subType && (
                          <Badge className="bg-primary/10 text-primary">
                            {user.subType.replace('-', ' ')}
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

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  📊 Monthly progress charts would be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            {renderSubTypeSpecificContent()}
          </TabsContent>

          {/* Eco Store Tab */}
          <TabsContent value="ecostore" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <span>Shopping Cart</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your cart is empty</p>
                    <Button className="mt-4 bg-gradient-eco">Browse Eco Store</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Wishlist</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Recycled Plastic Chair', price: '₹2,499', image: '🪑' },
                      { name: 'Solar-Powered LED Lamp', price: '₹1,299', image: '💡' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.image}</span>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-primary font-medium">{item.price}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Alerts</span>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push Notifications</span>
                    <Button variant="outline" size="sm">Disable</Button>
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
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
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
