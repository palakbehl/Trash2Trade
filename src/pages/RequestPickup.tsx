import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore } from '@/lib/dynamicDataStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Package, 
  Recycle,
  Clock,
  DollarSign,
  Coins
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/BackButton';

const pickupSchema = yup.object({
  address: yup.string().required('Address is required'),
  wasteType: yup.string().required('Waste type is required'),
  quantity: yup.number().min(1, 'Quantity must be at least 1kg').required('Quantity is required'),
  scheduledDate: yup.string().required('Pickup date is required'),
  notes: yup.string().optional()
});

interface PickupFormData {
  address: string;
  wasteType: string;
  quantity: number;
  scheduledDate: string;
  notes?: string;
}

const RequestPickup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(pickupSchema),
  });

  const selectedWasteType = watch('wasteType');
  const selectedQuantity = watch('quantity');

  const wasteTypes = [
    { 
      value: 'plastic', 
      label: 'Plastic Waste', 
      icon: '♻️', 
      pricePerKg: 2, 
      greenCoinsPerKg: 5,
      description: 'Bottles, containers, packaging'
    },
    { 
      value: 'paper', 
      label: 'Paper Waste', 
      icon: '📄', 
      pricePerKg: 1.5, 
      greenCoinsPerKg: 3,
      description: 'Newspapers, cardboard, documents'
    },
    { 
      value: 'metal', 
      label: 'Metal Waste', 
      icon: '🔩', 
      pricePerKg: 5, 
      greenCoinsPerKg: 8,
      description: 'Cans, wires, small appliances'
    },
    { 
      value: 'glass', 
      label: 'Glass Waste', 
      icon: '🍶', 
      pricePerKg: 1, 
      greenCoinsPerKg: 2,
      description: 'Bottles, jars, broken glass'
    },
    { 
      value: 'e-waste', 
      label: 'Electronic Waste', 
      icon: '📱', 
      pricePerKg: 10, 
      greenCoinsPerKg: 15,
      description: 'Phones, computers, batteries'
    },
    { 
      value: 'organic', 
      label: 'Organic Waste', 
      icon: '🍃', 
      pricePerKg: 0.5, 
      greenCoinsPerKg: 1,
      description: 'Food scraps, garden waste'
    }
  ];

  const calculateEarnings = () => {
    if (!selectedWasteType || !selectedQuantity) return { value: 0, greenCoins: 0 };
    
    const wasteInfo = wasteTypes.find(w => w.value === selectedWasteType);
    if (!wasteInfo) return { value: 0, greenCoins: 0 };
    
    return {
      value: wasteInfo.pricePerKg * selectedQuantity,
      greenCoins: wasteInfo.greenCoinsPerKg * selectedQuantity
    };
  };

  const onSubmit = async (data: PickupFormData) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to request pickup.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const earnings = calculateEarnings();
      
      const pickupRequest = dataStore.addPickupRequest({
        userId: user.id,
        address: data.address,
        wasteType: data.wasteType,
        quantity: data.quantity,
        scheduledDate: data.scheduledDate,
        status: 'pending',
        estimatedValue: earnings.value,
        greenCoins: earnings.greenCoins
      });

      toast({
        title: 'Pickup Requested Successfully! 🌱',
        description: `Your pickup request has been submitted. You'll earn ₹${earnings.value} and ${earnings.greenCoins} Green Coins when completed.`,
      });

      navigate('/trash-generator');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit pickup request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const earnings = calculateEarnings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-eco bg-clip-text text-transparent mb-2">
              Request Waste Pickup
            </h1>
            <p className="text-muted-foreground">
              Schedule a pickup and earn money while helping the environment
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Recycle className="h-5 w-5 text-primary" />
                <span>Pickup Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Pickup Address</span>
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete address with landmarks"
                    {...register('address')}
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-destructive text-sm">{errors.address.message}</p>
                  )}
                </div>

                {/* Waste Type */}
                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Waste Type</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {wasteTypes.map((waste) => (
                      <div key={waste.value} className="relative">
                        <input
                          type="radio"
                          id={waste.value}
                          value={waste.value}
                          {...register('wasteType')}
                          className="sr-only"
                        />
                        <label
                          htmlFor={waste.value}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                            selectedWasteType === waste.value
                              ? 'border-primary bg-primary/10 shadow-glow'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <span className="text-2xl">{waste.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold">{waste.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {waste.description}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                ₹{waste.pricePerKg}/kg
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {waste.greenCoinsPerKg} GC/kg
                              </Badge>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.wasteType && (
                    <p className="text-destructive text-sm">{errors.wasteType.message}</p>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Estimated Quantity (kg)</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    step="0.1"
                    placeholder="Enter quantity in kg"
                    {...register('quantity')}
                  />
                  {errors.quantity && (
                    <p className="text-destructive text-sm">{errors.quantity.message}</p>
                  )}
                </div>

                {/* Scheduled Date */}
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Preferred Pickup Date</span>
                  </Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('scheduledDate')}
                  />
                  {errors.scheduledDate && (
                    <p className="text-destructive text-sm">{errors.scheduledDate.message}</p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or additional information"
                    {...register('notes')}
                    rows={2}
                  />
                </div>

                {/* Earnings Preview */}
                {selectedWasteType && selectedQuantity && (
                  <Card className="bg-gradient-sunshine/20 border-secondary/30">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Estimated Earnings</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success">₹{earnings.value}</div>
                          <div className="text-sm text-muted-foreground">Cash Value</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{earnings.greenCoins}</div>
                          <div className="text-sm text-muted-foreground">Green Coins</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-eco hover:shadow-glow transition-all duration-300" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting Request...' : 'Request Pickup'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestPickup;
