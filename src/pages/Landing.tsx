import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import RateCard from '@/components/RateCard';
import ChatBot from '@/components/ChatBot';
import InquiryButton from '@/components/InquiryButton';
import { 
  ArrowRight, 
  Play, 
  Recycle, 
  Award, 
  Users, 
  User, 
  Truck, 
  Building, 
  CheckCircle, 
  Leaf, 
  Star, 
  ShoppingCart,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import heroImage from '@/assets/hero-recycling.jpg';

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);

  const features = [
    {
      icon: Recycle,
      title: 'Smart Waste Collection',
      description: 'Book pickups for different waste types with our intelligent scheduling system.',
      details: 'Our AI-powered system optimizes collection routes, schedules pickups based on waste type and quantity, and sends real-time notifications. Citizens can book pickups for plastic, paper, metal, e-waste, and organic waste with just a few taps.',
      benefits: ['AI-optimized routes', 'Real-time tracking', 'Multiple waste types', 'Flexible scheduling']
    },
    {
      icon: Award,
      title: 'Earn GreenCoins',
      description: 'Get rewarded for every kilogram of waste you help recycle. Redeem for real benefits.',
      details: 'Every kilogram of waste you recycle earns you GreenCoins. These can be redeemed for cash, shopping vouchers, eco-friendly products, or donated to environmental causes. The more you recycle, the more you earn!',
      benefits: ['₹2-5 per kg rewards', 'Instant coin crediting', 'Multiple redemption options', 'Bonus for consistent recycling']
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'Join thousands of eco-warriors making a difference in their neighborhoods.',
      details: 'Connect with like-minded individuals in your area, participate in community cleanup drives, and track collective environmental impact. Build a sustainable future together through collaborative action.',
      benefits: ['Local community groups', 'Cleanup drive participation', 'Impact leaderboards', 'Environmental education']
    },
    {
      icon: ShoppingCart,
      title: 'DIY Marketplace',
      description: 'Discover and sell amazing upcycled products made from waste materials.',
      details: 'Browse and purchase unique products made from recycled materials. From furniture to fashion, discover creative upcycled items while supporting local artisans and reducing waste.',
      benefits: ['Unique upcycled products', 'Support local artisans', 'Eco-friendly shopping', 'Creative waste solutions']
    },
  ];

  const roles = [
    {
      icon: User,
      title: 'Citizens',
      description: 'Book pickups, earn rewards, and track your environmental impact.',
      benefits: ['Easy pickup booking', 'GreenCoins rewards', 'Eco score tracking', 'Impact badges'],
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      route: '/trash-generator',
    },
    {
      icon: Truck,
      title: 'Collectors',
      description: 'Make money while helping the environment by collecting waste.',
      benefits: ['Flexible earning', 'Route optimization', 'Performance tracking', 'Community rating'],
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
      route: '/collector',
    },
    {
      icon: Heart,
      title: 'NGOs & Businesses',
      description: 'Sponsor collection drives and measure your environmental impact.',
      benefits: ['Impact measurement', 'Community engagement', 'CSR reporting', 'Brand visibility'],
      color: 'text-success',
      bgColor: 'bg-success/10',
      route: '/ngo-business',
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
    setShowSubscriptionSuccess(true);
    setTimeout(() => setShowSubscriptionSuccess(false), 3000);
  };

  const handleRoleClick = (route: string) => {
    navigate(route);
  };

  const handleFeatureClick = (index: number) => {
    if (index === 3) { // DIY Marketplace
      navigate('/diy-marketplace');
    } else {
      setSelectedFeature(index);
    }
  };

  const nextFeature = () => {
    setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeatureIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const heroImages = [
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop&crop=center'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // Auto-scroll images every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '50,000kg', label: 'Waste Recycled' },
    { value: '25+', label: 'Cities Covered' },
    { value: '4.8★', label: 'User Rating' },
  ];

  return (
    <div className="flex flex-col">
      {/* Collection Center Info Bar */}
      <div className="bg-gradient-eco text-white py-3 px-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>8758443219</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>G H Patel College of Engineering and Technology, Anand, Gujarat, 388120</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Follow us:</span>
            <div className="flex space-x-2">
              <Facebook className="h-4 w-4 cursor-pointer hover:text-secondary transition-colors" />
              <Twitter className="h-4 w-4 cursor-pointer hover:text-secondary transition-colors" />
              <Instagram className="h-4 w-4 cursor-pointer hover:text-secondary transition-colors" />
              <Linkedin className="h-4 w-4 cursor-pointer hover:text-secondary transition-colors" />
            </div>
          </div>
        </div>
      </div>
      {/* Video-like Hero Section */}
      <section className="relative bg-gradient-nature min-h-screen flex items-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" />
          <div className="absolute top-32 right-20 w-16 h-16 bg-secondary/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-success/25 rounded-full animate-pulse" />
          <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-warning/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Video-like overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 transition-opacity duration-1000"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/80 to-secondary/20" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-left">
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-gradient-eco rounded-full animate-glow mr-4">
                    <Leaf className="h-16 w-16 text-white" />
                  </div>
                  <div>
                    <h1 className="text-6xl md:text-7xl font-bold text-foreground leading-tight">
                      Transform
                    </h1>
                    <h1 className="text-6xl md:text-7xl font-bold bg-gradient-eco bg-clip-text text-transparent leading-tight">
                      Waste
                    </h1>
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  into <span className="bg-gradient-sunshine bg-clip-text text-transparent">Rewards</span>
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                  Join the tech-powered recycling revolution. Connect with collectors, 
                  earn rewards, and make a real impact on our planet's future.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 bg-gradient-eco hover:shadow-glow transform hover:scale-105 transition-all duration-300" 
                    asChild
                  >
                    <Link to="/signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-4 border-2 border-primary hover:bg-primary hover:text-white transform hover:scale-105 transition-all duration-300" 
                    asChild
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 max-w-md">
                  {stats.slice(0, 2).map((stat, index) => (
                    <div key={index} className="text-left">
                      <div className="text-3xl font-bold text-primary">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Content - Image Carousel */}
              <div className="relative">
                <div className="relative bg-gradient-forest rounded-3xl p-8 shadow-eco">
                  <div className="aspect-video bg-black/20 rounded-2xl overflow-hidden relative mb-6">
                    <div className="relative w-full h-full">
                      {heroImages.map((image, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${image})` }}
                          />
                        </div>
                      ))}
                      
                      {/* Navigation Arrows */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      {/* Dots Indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {heroImages.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Transform Waste Into Value</h3>
                    <p className="text-white/90">Discover how our platform creates impact through technology</p>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-secondary p-3 rounded-full shadow-yellow animate-bounce">
                  <Award className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-success p-3 rounded-full shadow-eco animate-pulse">
                  <Recycle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            {/* Bottom Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-eco">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose <span className="bg-gradient-eco bg-clip-text text-transparent">Trash2Trade</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform makes recycling rewarding, efficient, and impactful for everyone in the community.
            </p>
          </div>

          {/* Horizontal Scrollable Features */}
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={prevFeature}
                className="bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextFeature}
                className="bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentFeatureIndex * 100}%)` }}
              >
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <Card 
                        className="text-center hover:shadow-glow hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white/90 to-primary/10 backdrop-blur-sm group cursor-pointer"
                        onClick={() => handleFeatureClick(index)}
                      >
                        <CardContent className="p-8">
                          <div className="bg-gradient-eco w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Icon className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground text-lg leading-relaxed">
                            {feature.description}
                          </p>
                          <Button 
                            variant="outline" 
                            className="mt-4 bg-gradient-to-r from-primary to-secondary text-white border-0 hover:shadow-lg transition-all duration-300"
                          >
                            Learn More
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Dots indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentFeatureIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  onClick={() => setCurrentFeatureIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rate Card Section */}
      <RateCard />

      {/* Roles Section */}
      <section className="py-20 bg-gradient-sunshine">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built for <span className="bg-gradient-forest bg-clip-text text-transparent">Everyone</span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Whether you're an individual, collector, or organization, we have tools designed specifically for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-glow hover:-translate-y-4 transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm group cursor-pointer transform hover:scale-105"
                  onClick={() => {
                    if (role.title === 'Citizens') {
                      navigate('/trash-generator');
                    } else if (role.title === 'Collectors') {
                      navigate('/signup');
                    } else if (role.title === 'NGOs & Businesses') {
                      navigate('/ngo-business');
                    } else if (role.title === 'DIY Marketplace') {
                      navigate('/diy-marketplace');
                    }
                  }}
                >
                  <CardContent className="p-8">
                    <div className={`${role.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-10 w-10 ${role.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 text-center group-hover:text-primary transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 text-center text-lg">
                      {role.description}
                    </p>
                    <ul className="space-y-3">
                      {role.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                          <span className="font-medium">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 text-center">
                      <Button 
                        variant="outline" 
                        className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-nature">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-glow">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-eco rounded-full">
                  <Mail className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Stay <span className="bg-gradient-eco bg-clip-text text-transparent">Connected</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get the latest updates on recycling initiatives, environmental tips, and exclusive rewards directly in your inbox.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 text-lg"
                  required
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-gradient-eco hover:shadow-glow transform hover:scale-105 transition-all duration-300 h-12 px-8"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Subscribe
                </Button>
                
                {/* Success Message */}
                {showSubscriptionSuccess && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-success text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Successfully subscribed to our newsletter!</span>
                    </div>
                  </div>
                )}
              </form>
              
              <p className="text-sm text-muted-foreground mt-4">
                Join 10,000+ eco-warriors already subscribed. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-forest relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-secondary/20 rounded-full animate-float" />
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-warning/20 rounded-full animate-bounce" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-success/30 rounded-full animate-pulse" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Make an <span className="text-secondary">Impact</span>?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Join thousands of eco-warriors who are already making a difference. 
              Start your recycling journey today and earn rewards while saving the planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-12 py-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:shadow-yellow transform hover:scale-105 transition-all duration-300" 
                asChild
              >
                <Link to="/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-12 py-4 border-2 border-white text-foreground bg-white hover:bg-white/90 hover:text-primary transform hover:scale-105 transition-all duration-300" 
                asChild
              >
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-8 w-8 text-primary" />
                <span className="font-bold text-2xl">Trash2Trade</span>
              </div>
              <p className="text-background/80 mb-6">
                Transforming waste into rewards through technology and community collaboration.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <Facebook className="h-5 w-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <Twitter className="h-5 w-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <Linkedin className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-background/80 hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/signup" className="text-background/80 hover:text-primary transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="text-background/80 hover:text-primary transition-colors">Login</Link></li>
                <li><Link to="/trash-generator" className="text-background/80 hover:text-primary transition-colors">For Citizens</Link></li>
                <li><Link to="/collector" className="text-background/80 hover:text-primary transition-colors">For Collectors</Link></li>
                <li><Link to="/ngo-business" className="text-background/80 hover:text-primary transition-colors">For NGOs/Business</Link></li>
                <li><Link to="/eco-store" className="text-background/80 hover:text-primary transition-colors">Eco Store</Link></li>
                <li><Link to="/about" className="text-background/80 hover:text-primary transition-colors">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2">
                <li><Link to="/trash-generator" className="text-background/80 hover:text-primary transition-colors">Waste Collection</Link></li>
                <li><Link to="/eco-store" className="text-background/80 hover:text-primary transition-colors">Eco Store</Link></li>
                <li><Link to="/dashboard" className="text-background/80 hover:text-primary transition-colors">Reward System</Link></li>
                <li><Link to="/profile" className="text-background/80 hover:text-primary transition-colors">Impact Tracking</Link></li>
                <li><Link to="/ngo-business" className="text-background/80 hover:text-primary transition-colors">Community Drives</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-background/80">support@trash2trade.com</li>
                <li className="text-background/80">8758443219</li>
                <li className="text-background/80">G H Patel College of Engineering and Technology, Anand, Gujarat, 388120</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-12 pt-8 text-center">
            <p className="text-background/60">
              © 2024 Trash2Trade. All rights reserved. Making the world cleaner, one pickup at a time.
            </p>
          </div>
        </div>
      </footer>

      {/* Feature Details Dialog */}
      <Dialog open={selectedFeature !== null} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="max-w-2xl">
          {selectedFeature !== null && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center text-2xl">
                  <div className="bg-gradient-eco w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    {React.createElement(features[selectedFeature].icon, { className: "h-6 w-6 text-white" })}
                  </div>
                  {features[selectedFeature].title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {features[selectedFeature].details}
                </p>
                <div>
                  <h4 className="font-semibold text-lg mb-3">Key Benefits:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {features[selectedFeature].benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-success mr-2 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setSelectedFeature(null)}>
                    Close
                  </Button>
                  <Button asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ChatBot and Inquiry Components */}
      <ChatBot />
      <InquiryButton />
      
    </div>
  );
};

export default Landing;