import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { dataStore } from '@/lib/dynamicDataStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  Star, 
  Upload,
  Package,
  Tag,
  MapPin,
  User,
  CheckCircle,
  Eye,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const productSchema = yup.object({
  title: yup.string().required('Product title is required'),
  description: yup.string().required('Product description is required'),
  price: yup.number().min(1, 'Price must be greater than 0').required('Price is required'),
  category: yup.string().required('Category is required'),
  condition: yup.string().required('Condition is required'),
  materials: yup.string().required('Materials used is required'),
  location: yup.string().required('Location is required'),
  contactInfo: yup.string().required('Contact information is required'),
  images: yup.array().min(1, 'At least one image is required'),
});

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  materials: string;
  location: string;
  contactInfo: string;
  images: string[];
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  materials: string;
  location: string;
  seller: string;
  rating: number;
  reviews: number;
  images: string[];
  featured: boolean;
  createdAt: string;
}

const DIYMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'browse' | 'sell'>('browse');
  const [userStats, setUserStats] = useState<any>(null);

  // Check if user has access (DIY marketplace users)
  if (!user || (user.role !== 'user' && user.subtype !== 'diy-marketplace')) {
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
    // Load dynamic products and transform to match UI expectations
    const allProducts = dataStore.getDIYProducts().map(product => ({
      ...product,
      seller: dataStore.getUser(product.sellerId)?.name || 'Unknown',
      rating: 4.5, // Default rating
      reviews: Math.floor(Math.random() * 50) + 1,
      featured: Math.random() > 0.7,
      createdAt: product.createdAt.toISOString()
    }));
    setProducts(allProducts);
    
    // Load user stats
    if (user?.id) {
      const stats = dataStore.getDIYStats(user.id);
      setUserStats(stats);
    }
  }, [user?.id]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
  });

  const categories = [
    { id: 'all', name: 'All Categories', count: 156 },
    { id: 'furniture', name: 'Furniture', count: 45 },
    { id: 'decor', name: 'Home Decor', count: 32 },
    { id: 'bags', name: 'Bags & Accessories', count: 28 },
    { id: 'toys', name: 'Toys & Games', count: 21 },
    { id: 'art', name: 'Art & Crafts', count: 18 },
    { id: 'electronics', name: 'Upcycled Electronics', count: 12 },
  ];

  const conditions = [
    { value: 'new', label: 'Brand New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
  ];

  // Initialize with some sample products if none exist
  useEffect(() => {
    const existingProducts = dataStore.getDIYProducts();
    if (existingProducts.length === 0 && user?.id) {
      // Add some sample products for demonstration
      const sampleProducts = [
        {
          sellerId: user.id,
          title: 'Upcycled Plastic Bottle Planters',
          description: 'Beautiful planters made from recycled plastic bottles with drainage system. Perfect for herbs and small plants.',
          price: 299,
          category: 'decor',
          condition: 'new',
          materials: 'Recycled plastic bottles, rope, paint',
          location: 'Mumbai, Maharashtra',
          images: ['🪴'],
          status: 'active' as const
        },
        {
          sellerId: user.id,
          title: 'Cardboard Storage Organizer',
          description: 'Multi-compartment storage solution made from cardboard boxes. Lightweight and customizable.',
          price: 450,
          category: 'furniture',
          condition: 'excellent',
          materials: 'Cardboard, fabric, glue',
          location: 'Delhi, Delhi',
          images: ['📦'],
          status: 'active' as const
        }
      ];
      
      sampleProducts.forEach(product => {
        dataStore.addDIYProduct(product);
      });
    }
  }, [user?.id]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProducts = products.filter(product => product.featured);

  const onSubmitProduct = async (data: ProductFormData) => {
    try {
      if (!user?.id) {
        toast({
          title: 'Error',
          description: 'You must be logged in to list products.',
          variant: 'destructive',
        });
        return;
      }

      // Add product to dynamic data store
      const newProduct = dataStore.addDIYProduct({
        sellerId: user.id,
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        condition: data.condition,
        materials: data.materials,
        location: data.location,
        images: data.images || ['📦'], // Default image if none provided
        status: 'active'
      });

      // Calculate platform fee (5% of selling price)
      const platformFee = data.price * 0.05;
      const sellerEarnings = data.price - platformFee;
      
      toast({
        title: "Product Listed Successfully!",
        description: `Your product has been added to the marketplace. You'll receive ₹${sellerEarnings.toFixed(2)} after our 5% platform fee.`,
      });
      
      setShowAddProductDialog(false);
      reset();
      
      // Refresh products list
      const allProducts = dataStore.getDIYProducts().map(product => ({
        ...product,
        seller: dataStore.getUser(product.sellerId)?.name || 'Unknown',
        rating: 4.5,
        reviews: Math.floor(Math.random() * 50) + 1,
        featured: Math.random() > 0.7,
        createdAt: product.createdAt.toISOString()
      }));
      setProducts(allProducts);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to list product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/15 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-success/10 rounded-full blur-lg animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-eco bg-clip-text text-transparent">
                  DIY Marketplace
                </h1>
                <p className="text-muted-foreground mt-1">
                  Discover and sell amazing upcycled products
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'browse' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('browse')}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Browse
                  </Button>
                  <Button
                    variant={viewMode === 'sell' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('sell')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Sell
                  </Button>
                </div>
                
                {viewMode === 'sell' && (
                  <Button
                    onClick={() => setShowAddProductDialog(true)}
                    className="bg-gradient-eco hover:shadow-glow"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {viewMode === 'browse' ? (
            <>
              {/* Search and Filters */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center space-x-2"
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="ml-1">
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Featured Products */}
              {selectedCategory === 'all' && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Star className="h-6 w-6 text-yellow-500 mr-2" />
                    Featured Products
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProducts.map((product) => (
                      <Card key={product.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-eco hover:shadow-glow transition-all group">
                        <CardContent className="p-0">
                          <div className="relative">
                            <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center text-6xl">
                              {product.images[0]}
                            </div>
                            <Badge className="absolute top-2 left-2 bg-yellow-500">
                              Featured
                            </Badge>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {product.title}
                              </h3>
                              <div className="text-right">
                                <div className="text-xl font-bold text-primary">₹{product.price}</div>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{product.rating}</span>
                                <span>({product.reviews})</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{product.location.split(',')[0]}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>{product.seller}</span>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" className="bg-gradient-eco">
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  Contact
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* All Products */}
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {selectedCategory === 'all' ? 'All Products' : `${categories.find(c => c.id === selectedCategory)?.name} Products`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-eco hover:shadow-glow transition-all group">
                      <CardContent className="p-0">
                        <div className="relative">
                          <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center text-5xl">
                            {product.images[0]}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="p-3">
                          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                            {product.title}
                          </h3>
                          
                          <div className="text-lg font-bold text-primary mb-2">₹{product.price}</div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{product.rating}</span>
                            </div>
                            <span>{product.location.split(',')[0]}</span>
                          </div>
                          
                          <Button size="sm" className="w-full bg-gradient-eco">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Seller Dashboard */
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Start Selling Your Upcycled Products</h2>
                <p className="text-muted-foreground mb-6">
                  Turn your creative waste-to-product ideas into income
                </p>
                <Button
                  onClick={() => setShowAddProductDialog(true)}
                  size="lg"
                  className="bg-gradient-eco hover:shadow-glow"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  List Your First Product
                </Button>
              </div>

              {/* Seller Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                  <CardContent className="p-6 text-center">
                    <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{userStats?.itemsListed || 0}</div>
                    <div className="text-sm text-muted-foreground">Products Listed</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                  <CardContent className="p-6 text-center">
                    <ShoppingCart className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{userStats?.itemsSold || 0}</div>
                    <div className="text-sm text-muted-foreground">Items Sold</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                  <CardContent className="p-6 text-center">
                    <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{userStats?.rating || '-'}</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                  <CardContent className="p-6 text-center">
                    <Tag className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">₹{userStats?.totalEarnings || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Earnings</div>
                  </CardContent>
                </Card>
              </div>

              {/* Getting Started Guide */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
                <CardHeader>
                  <CardTitle>Getting Started as a Seller</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">1. Upload Products</h3>
                      <p className="text-sm text-muted-foreground">
                        Add photos and details of your upcycled creations
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <h3 className="font-semibold mb-2">2. Connect with Buyers</h3>
                      <p className="text-sm text-muted-foreground">
                        Respond to inquiries and build relationships
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Package className="h-6 w-6 text-yellow-500" />
                      </div>
                      <h3 className="font-semibold mb-2">3. Ship & Earn</h3>
                      <p className="text-sm text-muted-foreground">
                        Package your items and earn from your creativity
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Add Product Dialog */}
        <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
          <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Add New Product</span>
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmitProduct)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Enter product title"
                  />
                  {errors.title && (
                    <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    {...register('price')}
                    placeholder="Enter price"
                    min="1"
                  />
                  {errors.price && (
                    <p className="text-destructive text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe your product, materials used, and unique features..."
                  rows={4}
                />
                {errors.description && (
                  <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    {...register('category')}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select category</option>
                    {categories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-destructive text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <select
                    {...register('condition')}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select condition</option>
                    {conditions.map((condition) => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>
                  {errors.condition && (
                    <p className="text-destructive text-sm mt-1">{errors.condition.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="materials">Materials Used</Label>
                <Input
                  id="materials"
                  {...register('materials')}
                  placeholder="e.g., Recycled plastic bottles, cardboard, fabric"
                />
                {errors.materials && (
                  <p className="text-destructive text-sm mt-1">{errors.materials.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="City, State"
                  />
                  {errors.location && (
                    <p className="text-destructive text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactInfo">Contact Information</Label>
                  <Input
                    id="contactInfo"
                    {...register('contactInfo')}
                    placeholder="Phone or email"
                  />
                  {errors.contactInfo && (
                    <p className="text-destructive text-sm mt-1">{errors.contactInfo.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Product Images</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground mb-2">
                    Click to upload or drag and drop images
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG up to 10MB (Max 5 images)
                  </p>
                  <Button type="button" variant="outline" className="mt-4">
                    Choose Files
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddProductDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-eco hover:shadow-glow">
                  List Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DIYMarketplace;
