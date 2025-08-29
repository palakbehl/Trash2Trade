import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Leaf, User, Truck, Recycle, Building, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup.string().oneOf(['citizen', 'collector', 'ngo'] as const).required('Please select a role'),
});

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

type CitizenSubType = 'trash-generator' | 'ngo-business' | 'diy-marketplace';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showCitizenDialog, setShowCitizenDialog] = useState(false);
  const [selectedCitizenType, setSelectedCitizenType] = useState<CitizenSubType | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'citizen' as UserRole,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    if (data.role === 'citizen') {
      setShowCitizenDialog(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await signup(data.name, data.email, data.password, data.role);
      if (success) {
        toast({
          title: 'Welcome to Trash2Trade! 🌱',
          description: 'Your account has been created successfully.',
        });
        
        // Navigate based on role
        switch (data.role) {
          case 'collector':
            navigate('/collector');
            break;
          default:
            navigate('/');
        }
      } else {
        toast({
          title: 'Signup failed',
          description: 'Something went wrong. Please try again.',
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

  const handleCitizenSignup = async () => {
    if (!selectedCitizenType) return;
    
    const formData = watch();
    setIsLoading(true);
    
    try {
      const success = await signup(formData.name, formData.email, formData.password, 'citizen');
      if (success) {
        toast({
          title: 'Welcome to Trash2Trade! 🌱',
          description: `Account created as ${selectedCitizenType.replace('-', ' ')}.`,
        });
        navigate('/citizen');
      } else {
        toast({
          title: 'Signup failed',
          description: 'Something went wrong. Please try again.',
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
      setShowCitizenDialog(false);
    }
  };

  const roleOptions = [
    {
      value: 'citizen',
      label: 'Citizen',
      description: 'Book waste pickups and earn rewards',
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
    {
      value: 'ngo',
      label: 'NGO/Business',
      description: 'Sponsor drives and track impact',
      icon: Building,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  const citizenSubTypes = [
    {
      value: 'trash-generator',
      label: 'Trash Generator',
      description: 'Generate waste and book pickups',
      icon: Recycle,
    },
    {
      value: 'ngo-business',
      label: 'NGO/Business',
      description: 'Sponsor drives and track impact',
      icon: Building,
    },
    {
      value: 'diy-marketplace',
      label: 'DIY Marketplace Seller',
      description: 'Sell DIY products from recycled materials',
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Join the Revolution</h1>
          <p className="text-muted-foreground">Create your account and start making an impact</p>
        </div>

        <Card className="shadow-eco">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label>I am a...</Label>
                <RadioGroup
                  value={selectedRole}
                  onValueChange={(value) => setValue('role', value as UserRole)}
                  className="grid grid-cols-1 gap-2"
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
                            selectedRole === option.value
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

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-eco hover:shadow-glow transition-all duration-300 hover:scale-105" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Citizen Sub-type Selection Dialog */}
        <Dialog open={showCitizenDialog} onOpenChange={setShowCitizenDialog}>
          <DialogContent className="sm:max-w-md">
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
                value={selectedCitizenType || ''}
                onValueChange={(value) => setSelectedCitizenType(value as CitizenSubType)}
                className="space-y-2"
              >
                {citizenSubTypes.map((option) => {
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
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedCitizenType === option.value
                            ? 'border-primary bg-primary/5'
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
                    setShowCitizenDialog(false);
                    setSelectedCitizenType(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCitizenSignup}
                  disabled={!selectedCitizenType || isLoading}
                  className="bg-gradient-eco hover:shadow-glow transition-all duration-300"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Signup;