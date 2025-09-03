import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Leaf, User, Truck, Recycle, Building, ShoppingCart, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['user', 'collector'] as const).required('Please select a role'),
});

interface FormData {
  email: string;
  password: string;
  role: 'user' | 'collector';
}

type UserSubType = 'trash-generator' | 'ngo-business' | 'diy-marketplace';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserSubType | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'user' as 'user' | 'collector',
    },
  });

  const watchedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    if (data.role === 'user') {
      setShowUserDialog(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password, data.role);
      
      if (success) {
        toast({
          title: 'Login successful!',
          description: 'Welcome back to Trash2Trade!',
        });
        
        // Navigate based on role
        if (data.role === 'collector') {
          navigate('/collector/dashboard');
        } else {
          navigate('/');
        }
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid credentials. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserLogin = async () => {
    if (!selectedUserType) return;
    
    const formData = watch();
    setIsLoading(true);
    
    try {
      // Try to login with demo credentials based on subtype
      let email = formData.email;
      
      // If using demo pattern, map to correct demo email
      if (email === 'user@trash2trade.com' || email.includes('@trash2trade.com')) {
        switch (selectedUserType) {
          case 'ngo-business':
            email = 'ngo@trash2trade.com';
            break;
          case 'diy-marketplace':
            email = 'diy@trash2trade.com';
            break;
          case 'trash-generator':
            email = 'user@trash2trade.com';
            break;
        }
      }
      
      const success = await login(email, formData.password, 'user');
      if (success) {
        toast({
          title: 'Welcome back! 🌱',
          description: `Signed in as ${selectedUserType.replace('-', ' ')}.`,
        });
        
        // Navigate based on user subtype
        switch (selectedUserType) {
          case 'trash-generator':
            navigate('/dashboard');
            break;
          case 'ngo-business':
            navigate('/ngo/dashboard');
            break;
          case 'diy-marketplace':
            navigate('/diy/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid credentials. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setShowUserDialog(false);
    }
  };

  const roleOptions = [
    {
      value: 'user',
      label: 'User',
      description: 'Individual users with different needs',
      icon: User,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      value: 'collector',
      label: 'Collector',
      description: 'Collect waste and earn money',
      icon: Truck,
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
    },
  ];

  const userSubTypes = [
    {
      value: 'trash-generator',
      label: 'Trash Generator',
      description: 'Generate waste and book pickups',
      icon: Recycle,
    },
    {
      value: 'ngo-business',
      label: 'NGO/Business',
      description: 'Sponsor eco-initiatives and CSR activities',
      icon: Building,
    },
    {
      value: 'diy-marketplace',
      label: 'DIY Marketplace Seller',
      description: 'Sell best-to-waste products online',
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/15 rounded-full blur-lg animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-success/10 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-accent/20 rounded-full blur-lg animate-float"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-1/3 left-5 w-16 h-16 border-2 border-primary/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 right-8 w-12 h-12 border-2 border-secondary/30 rounded-full animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4 hover:scale-105 transition-transform">
            <Leaf className="h-10 w-10 text-primary animate-pulse" />
            <span className="font-bold text-2xl bg-gradient-eco bg-clip-text text-transparent">
              Trash2Trade
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue your eco journey</p>
        </div>

        <Card className="shadow-eco backdrop-blur-sm bg-white/95">
          <CardHeader>
            <CardTitle className="text-center text-xl">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">I am a...</Label>
                <RadioGroup
                  value={watchedRole}
                  onValueChange={(value) => setValue('role', value as 'user' | 'collector')}
                  className="grid grid-cols-1 gap-3"
                >
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div key={option.value} className="relative">
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={option.value}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md ${
                            watchedRole === option.value
                              ? `border-primary ${option.bgColor} shadow-glow`
                              : 'border-border hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          <Icon className={`h-6 w-6 ${option.color}`} />
                          <div>
                            <div className="font-semibold text-lg">{option.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {option.description}
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="h-12 text-lg"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-12 text-lg"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-eco hover:shadow-glow transform hover:scale-105 transition-all duration-300 text-lg py-3" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary font-medium hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-sunshine/20 rounded-xl border border-secondary/30">
              <p className="text-sm font-semibold text-foreground mb-2">Demo credentials:</p>
              <div className="text-sm space-y-1">
                <p><strong>Users:</strong> user@trash2trade.com (then select subtype)</p>
                <p><strong>Collector:</strong> collector@test.com</p>
                <p><strong>Password:</strong> password123</p>
                <p className="text-xs text-muted-foreground mt-2">For users, you'll select your specific role after login</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Citizen Sub-type Selection Dialog */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Select Your Role</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose the option that best describes you:
              </p>
              
              <RadioGroup
                value={selectedUserType || ''}
                onValueChange={(value) => setSelectedUserType(value as UserSubType)}
                className="space-y-2"
              >
                {userSubTypes.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.value} className="relative">
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={option.value}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-eco ${
                          selectedUserType === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUserDialog(false);
                    setSelectedUserType(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUserLogin}
                  disabled={!selectedUserType || isLoading}
                  className="bg-gradient-eco hover:shadow-glow"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Login;
