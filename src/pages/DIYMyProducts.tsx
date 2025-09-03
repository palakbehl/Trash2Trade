import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Package, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Star,
  Heart,
  MessageCircle
} from 'lucide-react';
import { dataStore } from '@/lib/dynamicDataStore';
import { useToast } from '@/hooks/use-toast';
import UserChart from '@/components/charts/UserChart';

const DIYMyProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);

  // Check if user has access
  if (!user || (user.role !== 'user' || user.subtype !== 'diy-marketplace')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You must be logged in as a DIY marketplace user to access this page.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (user?.id) {
      // Load user's products
      const userProducts = dataStore.getDIYProducts().filter(p => p.sellerId === user.id);
      setMyProducts(userProducts);
      
      // Load user stats
      const stats = dataStore.getDIYStats(user.id);
      setUserStats(stats);
    }
  }, [user?.id]);

  const filteredProducts = myProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteProduct = (productId: string) => {
    // In a real app, this would call an API
    setMyProducts(prev => prev.filter(p => p.id !== productId));
    toast({
      title: "Product Deleted",
      description: "Your product has been removed from the marketplace.",
    });
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setShowEditDialog(true);
  };

  const stats = [
    {
      title: 'Total Products',
      value: myProducts.length,
      change: '+2 this month',
      icon: Package,
      color: 'text-primary',
    },
    {
      title: 'Active Listings',
      value: myProducts.filter(p => p.status === 'active').length,
      change: 'Currently live',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Products Sold',
      value: myProducts.filter(p => p.status === 'sold').length,
      change: '+1 this week',
      icon: DollarSign,
      color: 'text-blue-600',
    },
    {
      title: 'Average Rating',
      value: userStats?.rating || 4.6,
      change: 'Based on reviews',
      icon: Star,
      color: 'text-yellow-600',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Products</h1>
          <p className="text-muted-foreground">
            Manage your DIY marketplace listings
          </p>
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
          {/* Left Column - Products List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search your products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', name: 'All Products' },
                      { id: 'active', name: 'Active' },
                      { id: 'sold', name: 'Sold' },
                      { id: 'inactive', name: 'Inactive' }
                    ].map((status) => (
                      <Button
                        key={status.id}
                        variant={statusFilter === status.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter(status.id)}
                      >
                        {status.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="space-y-4">
              {filteredProducts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'Start by adding your first product to the marketplace'
                      }
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Product Image */}
                        <div className="w-32 h-32 bg-muted flex items-center justify-center text-4xl">
                          {product.images[0]}
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{product.title}</h3>
                              <p className="text-muted-foreground text-sm line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={product.status === 'active' ? 'default' : 
                                        product.status === 'sold' ? 'secondary' : 'outline'}
                              >
                                {product.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-primary">
                                ₹{product.price}
                              </span>
                              <div className="text-sm text-muted-foreground">
                                Listed on {product.createdAt.toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Analytics & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages
                </Button>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Sales Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <UserChart type="greenCoins" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myProducts.slice(0, 3).map((product, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="text-2xl">{product.images[0]}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.status === 'sold' ? 'Sold' : 'Listed'} • ₹{product.price}
                        </p>
                      </div>
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Product Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-muted-foreground">
                Product editing functionality will be implemented here.
              </p>
              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DIYMyProducts;
