import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Star, 
  Package,
  Tag,
  MapPin,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  Heart
} from 'lucide-react';
import { dataStore } from '@/lib/dynamicDataStore';
import UserChart from '@/components/charts/UserChart';

const DIYMarketplaceFixed = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userStats, setUserStats] = useState<any>(null);

  // Allow all users to view the marketplace
  // But only show certain actions to DIY marketplace users
  const isDiyUser = user && user.role === 'user' && user.subtype === 'diy-marketplace';
  const isTrashGenerator = user && user.role === 'user' && user.subtype === 'trash-generator';
  const isNgoBusiness = user && user.role === 'user' && user.subtype === 'ngo-business';

  useEffect(() => {
    // Load sample products
    const sampleProducts = [
      {
        id: '1',
        title: 'Upcycled Wooden Planter',
        description: 'Beautiful planter made from reclaimed wood',
        price: 450,
        category: 'home-decor',
        condition: 'new',
        materials: 'Reclaimed wood, eco-friendly varnish',
        location: 'Mumbai, Maharashtra',
        seller: 'EcoCreator',
        rating: 4.8,
        reviews: 23,
        images: ['🪴'],
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Recycled Plastic Bottle Lamp',
        description: 'Artistic lamp made from recycled plastic bottles',
        price: 320,
        category: 'lighting',
        condition: 'new',
        materials: 'Recycled plastic bottles, LED lights',
        location: 'Delhi, NCR',
        seller: 'GreenMaker',
        rating: 4.6,
        reviews: 18,
        images: ['💡'],
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Cardboard Storage Organizer',
        description: 'Sturdy organizer made from cardboard waste',
        price: 180,
        category: 'storage',
        condition: 'new',
        materials: 'Cardboard, non-toxic glue',
        location: 'Bangalore, Karnataka',
        seller: 'CraftGuru',
        rating: 4.4,
        reviews: 12,
        images: ['📦'],
        featured: false,
        createdAt: new Date().toISOString()
      }
    ];
    setProducts(sampleProducts);
    
    // Load user stats
    if (user?.id) {
      const stats = dataStore.getDIYStats(user.id);
      setUserStats(stats);
    }
  }, [user?.id]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'home-decor', name: 'Home Decor' },
    { id: 'lighting', name: 'Lighting' },
    { id: 'storage', name: 'Storage' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = [
    {
      title: 'Items Listed',
      value: userStats?.itemsListed || 12,
      change: '+3 this month',
      icon: Package,
      color: 'text-primary',
    },
    {
      title: 'Items Sold',
      value: userStats?.itemsSold || 8,
      change: '+2 this month',
      icon: ShoppingCart,
      color: 'text-success',
    },
    {
      title: 'Total Earnings',
      value: `₹${userStats?.totalEarnings || 2400}`,
      change: '+₹800 this month',
      icon: DollarSign,
      color: 'text-warning',
    },
    {
      title: 'Rating',
      value: `${userStats?.rating || 4.6}/5`,
      change: 'Based on reviews',
      icon: Star,
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DIY Marketplace</h1>
            <p className="text-gray-600">Find unique upcycled and eco-friendly products</p>
          </div>
          {isDiyUser && (
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link to="/diy/my-products/add">
                <Plus className="w-4 h-4 mr-2" />
                Sell Your Product
              </Link>
            </Button>
          )}
          {!user && (
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/login">Log In to Buy</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up to Sell</Link>
              </Button>
            </div>
          )}
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.change}
                      </p>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <span>Sales Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <UserChart type="greenCoins" />
                </div>
              </CardContent>
            </Card>

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Browse Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted flex items-center justify-center text-6xl">
                      {product.images[0]}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{product.title}</h3>
                        {product.featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">
                            ₹{product.price}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-warning fill-current" />
                            <span className="text-sm">{product.rating}</span>
                            <span className="text-xs text-muted-foreground">
                              ({product.reviews})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {product.location}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-muted-foreground">
                            by {product.seller}
                          </span>
                          {!user ? (
                            <Button asChild size="sm" variant="outline">
                              <Link to="/login">Login to View</Link>
                            </Button>
                          ) : isDiyUser && product.seller === user?.name ? (
                            <div className="text-xs text-muted-foreground">Your Product</div>
                          ) : (
                            <Button size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="p-2 bg-success/10 rounded-full">
                      <ShoppingCart className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Product Sold</p>
                      <p className="text-xs text-muted-foreground">
                        Wooden Planter - ₹450
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">New Listing</p>
                      <p className="text-xs text-muted-foreground">
                        Bottle Lamp - ₹320
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="p-2 bg-warning/10 rounded-full">
                      <Star className="h-4 w-4 text-warning" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">New Review</p>
                      <p className="text-xs text-muted-foreground">
                        5 stars - Great quality!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Monthly Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <UserChart type="monthlyActivity" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DIYMarketplaceFixed;
