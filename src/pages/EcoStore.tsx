import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  Star, 
  Package, 
  Truck,
  Leaf,
  Recycle,
  Award,
  User,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  seller: string;
  sellerRating: number;
  image: string;
  tags: string[];
  wasteReduced: string;
  location: string;
  inStock: boolean;
  sustainabilityScore: number;
  reviews: number;
  rating: number;
}

const EcoStore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Restrict access to users only (not collectors)
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'collector') {
      toast({
        title: "Access Restricted",
        description: "Eco Store is only available for users, not collectors.",
        variant: "destructive",
      });
      navigate('/collector');
      return;
    }
  }, [user, navigate, toast]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Products', icon: Package },
    { id: 'furniture', name: 'Upcycled Furniture', icon: Package },
    { id: 'decor', name: 'Home Decor', icon: Award },
    { id: 'fashion', name: 'Eco Fashion', icon: Heart },
    { id: 'electronics', name: 'Refurbished Tech', icon: Package },
    { id: 'crafts', name: 'Handmade Crafts', icon: Star },
  ];

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Recycled Plastic Chair',
      description: 'Comfortable chair made from 100% recycled plastic bottles. Durable, weather-resistant, and eco-friendly.',
      price: 2499,
      originalPrice: 3999,
      category: 'furniture',
      seller: 'EcoFurniture Co.',
      sellerRating: 4.8,
      image: '🪑',
      tags: ['recycled', 'outdoor', 'durable'],
      wasteReduced: '50 plastic bottles',
      location: 'Mumbai, Maharashtra',
      inStock: true,
      sustainabilityScore: 95,
      reviews: 124,
      rating: 4.6
    },
    {
      id: '2',
      name: 'Upcycled Wooden Bookshelf',
      description: 'Beautiful bookshelf crafted from reclaimed wood. Each piece is unique with natural wood grain patterns.',
      price: 4999,
      originalPrice: 7500,
      category: 'furniture',
      seller: 'GreenCraft Studio',
      sellerRating: 4.9,
      image: '📚',
      tags: ['reclaimed wood', 'handmade', 'unique'],
      wasteReduced: '2kg wood waste',
      location: 'Bangalore, Karnataka',
      inStock: true,
      sustainabilityScore: 88,
      reviews: 89,
      rating: 4.7
    },
    {
      id: '3',
      name: 'Eco-Friendly Tote Bag',
      description: 'Stylish tote bag made from recycled fabric scraps. Perfect for shopping and daily use.',
      price: 599,
      originalPrice: 999,
      category: 'fashion',
      seller: 'Sustainable Style',
      sellerRating: 4.5,
      image: '👜',
      tags: ['recycled fabric', 'reusable', 'stylish'],
      wasteReduced: '0.5kg fabric waste',
      location: 'Delhi, NCR',
      inStock: true,
      sustainabilityScore: 92,
      reviews: 256,
      rating: 4.4
    },
    {
      id: '4',
      name: 'Solar-Powered LED Lamp',
      description: 'Refurbished solar LED lamp with new battery. Provides 8 hours of bright light on full charge.',
      price: 1299,
      originalPrice: 2199,
      category: 'electronics',
      seller: 'TechReborn',
      sellerRating: 4.7,
      image: '💡',
      tags: ['solar', 'refurbished', 'energy-efficient'],
      wasteReduced: '1 electronic device',
      location: 'Pune, Maharashtra',
      inStock: true,
      sustainabilityScore: 90,
      reviews: 167,
      rating: 4.5
    },
    {
      id: '5',
      name: 'Handwoven Wall Art',
      description: 'Beautiful wall art created from discarded textile materials. Adds color and texture to any room.',
      price: 899,
      originalPrice: 1499,
      category: 'decor',
      seller: 'ArtisanCraft',
      sellerRating: 4.6,
      image: '🎨',
      tags: ['handwoven', 'textile waste', 'artistic'],
      wasteReduced: '0.8kg textile waste',
      location: 'Jaipur, Rajasthan',
      inStock: true,
      sustainabilityScore: 85,
      reviews: 78,
      rating: 4.3
    },
    {
      id: '6',
      name: 'Recycled Paper Notebook Set',
      description: 'Set of 3 notebooks made from 100% recycled paper. Perfect for journaling and note-taking.',
      price: 349,
      originalPrice: 599,
      category: 'crafts',
      seller: 'PaperCycle',
      sellerRating: 4.4,
      image: '📔',
      tags: ['recycled paper', 'eco-friendly', 'set of 3'],
      wasteReduced: '2kg paper waste',
      location: 'Chennai, Tamil Nadu',
      inStock: true,
      sustainabilityScore: 93,
      reviews: 203,
      rating: 4.2
    }
  ];

  useEffect(() => {
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  const addToCart = (productId: string) => {
    setCart(prev => [...prev, productId]);
    toast({
      title: 'Added to Cart! 🛒',
      description: 'Product has been added to your cart.',
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    const isAdding = !wishlist.includes(productId);
    toast({
      title: isAdding ? 'Added to Wishlist! ❤️' : 'Removed from Wishlist',
      description: isAdding ? 'Product saved to your wishlist.' : 'Product removed from wishlist.',
    });
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/15 rounded-full blur-xl animate-float-delayed"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-eco bg-clip-text text-transparent mb-4">
            🌱 Eco Store - Best to Waste Products
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover amazing upcycled and sustainable products that give waste a second life
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-eco mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search eco-friendly products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹2.3L</div>
              <div className="text-sm text-muted-foreground">Money Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">15.6T</div>
              <div className="text-sm text-muted-foreground">Waste Reduced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4.8⭐</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-eco hover:shadow-glow transition-all duration-300 group cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="text-4xl mb-2">{product.image}</div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 ${wishlist.includes(product.id) ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                      <Heart className="h-4 w-4" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                    </Button>
                  </div>
                </div>
                
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getSustainabilityColor(product.sustainabilityScore)}>
                    <Leaf className="h-3 w-3 mr-1" />
                    {product.sustainabilityScore}% Eco
                  </Badge>
                  <Badge variant="secondary">
                    <Recycle className="h-3 w-3 mr-1" />
                    {product.wasteReduced}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{product.seller}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span>{product.sellerRating}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <Badge variant="destructive">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    className="flex-1 bg-gradient-eco hover:shadow-glow"
                    onClick={() => addToCart(product.id)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProduct(product)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Product Detail Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-sm">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-3">
                    <span className="text-3xl">{selectedProduct.image}</span>
                    <span>{selectedProduct.name}</span>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getSustainabilityColor(selectedProduct.sustainabilityScore)}>
                      <Leaf className="h-3 w-3 mr-1" />
                      {selectedProduct.sustainabilityScore}% Sustainable
                    </Badge>
                    <Badge variant="secondary">
                      <Recycle className="h-3 w-3 mr-1" />
                      Saves {selectedProduct.wasteReduced}
                    </Badge>
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      In Stock
                    </Badge>
                  </div>

                  <p className="text-muted-foreground">{selectedProduct.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Seller Information</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{selectedProduct.seller}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{selectedProduct.sellerRating}/5.0 Rating</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedProduct.location}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Environmental Impact</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <Recycle className="h-4 w-4 text-green-600" />
                          <span>Waste Reduced: {selectedProduct.wasteReduced}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span>Sustainability Score: {selectedProduct.sustainabilityScore}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-blue-600" />
                          <span>Eco-Certified Product</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl font-bold text-primary">₹{selectedProduct.price}</span>
                      {selectedProduct.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{selectedProduct.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => toggleWishlist(selectedProduct.id)}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${wishlist.includes(selectedProduct.id) ? 'text-red-500 fill-current' : ''}`} />
                        Wishlist
                      </Button>
                      <Button
                        className="bg-gradient-eco hover:shadow-glow"
                        onClick={() => {
                          addToCart(selectedProduct.id);
                          setSelectedProduct(null);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-eco">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span className="font-semibold">{cart.length} items in cart</span>
              <Button size="sm" className="bg-gradient-eco">
                View Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoStore;
