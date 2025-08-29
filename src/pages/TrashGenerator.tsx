import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Recycle, 
  Package, 
  Wine, 
  Box, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard,
  CheckCircle,
  Plus,
  Minus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const schema = yup.object({
  wasteTypes: yup.array().min(1, 'Select at least one waste type').required(),
  plasticType: yup.string().when('wasteTypes', {
    is: (wasteTypes: string[]) => wasteTypes?.includes('plastic'),
    then: (schema) => schema.required('Select plastic type'),
    otherwise: (schema) => schema.notRequired(),
  }),
  quantity: yup.number().min(1, 'Minimum quantity is 1').required('Quantity is required'),
  pickupDate: yup.string().required('Pickup date is required'),
  pickupTime: yup.string().required('Pickup time is required'),
  address: yup.string().required('Address is required'),
  upiId: yup.string().required('UPI ID is required'),
  notes: yup.string(),
});

interface TrashFormData {
  wasteTypes: string[];
  plasticType: string;
  quantity: number;
  pickupDate: string;
  pickupTime: string;
  address: string;
  upiId: string;
  notes: string;
}

const TrashGenerator = () => {
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TrashFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      wasteTypes: [],
      quantity: 1,
      plasticType: '',
      pickupDate: '',
      pickupTime: '',
      address: '',
      upiId: '',
      notes: '',
    },
  });

  const wasteTypes = [
    {
      id: 'plastic-bottles',
      name: 'Plastic Bottles',
      icon: Wine,
      minQuantity: 10,
      unit: 'bottles',
      image: '/api/placeholder/150/150'
    },
    {
      id: 'cardboard',
      name: 'Cardboard Boxes',
      icon: Box,
      minQuantity: 5,
      unit: 'boxes',
      image: '📦',
    },
    {
      id: 'paper',
      name: 'Paper/Newspaper',
      icon: Package,
      minQuantity: 2,
      unit: 'kg',
      image: '📰',
    },
    {
      id: 'metal',
      name: 'Metal Cans',
      icon: Package,
      minQuantity: 15,
      unit: 'cans',
      image: '🥫',
    },
    {
      id: 'glass',
      name: 'Glass Bottles',
      icon: Wine,
      minQuantity: 8,
      unit: 'bottles',
      image: '🍾',
    },
    {
      id: 'electronics',
      name: 'E-Waste',
      icon: Package,
      minQuantity: 1,
      unit: 'items',
      image: '📱',
    },
  ];

  const plasticTypes = [
    { id: 'PET', name: 'PET (Polyethylene Terephthalate)', description: 'Water bottles, soft drink bottles' },
    { id: 'HDPE', name: 'HDPE (High-Density Polyethylene)', description: 'Milk jugs, detergent bottles' },
    { id: 'PP', name: 'PP (Polypropylene)', description: 'Yogurt containers, bottle caps' },
    { id: 'LDPE', name: 'LDPE (Low-Density Polyethylene)', description: 'Plastic bags, food wraps' },
  ];

  const handleWasteTypeChange = (wasteTypeId: string, checked: boolean) => {
    let newWasteTypes: string[];
    if (checked) {
      newWasteTypes = [...selectedWasteTypes, wasteTypeId];
    } else {
      newWasteTypes = selectedWasteTypes.filter(id => id !== wasteTypeId);
    }
    setSelectedWasteTypes(newWasteTypes);
    setValue('wasteTypes', newWasteTypes);
  };

  const getMinQuantity = () => {
    if (selectedWasteTypes.length === 0) return 1;
    return Math.max(...selectedWasteTypes.map(id => 
      wasteTypes.find(type => type.id === id)?.minQuantity || 1
    ));
  };

  const onSubmit = async (data: TrashFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccessDialog(true);
      
      toast({
        title: 'Request Submitted! 🌱',
        description: 'Your waste pickup request has been successfully submitted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const selectedWaste = watch('wasteTypes');
  const quantity = watch('quantity');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/15 rounded-full blur-xl animate-float-delayed"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-eco bg-clip-text text-transparent mb-4">
            Schedule Waste Pickup
          </h1>
          <p className="text-lg text-muted-foreground">
            Select your waste types, quantity, and schedule a convenient pickup time
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Waste Type Selection */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Recycle className="h-6 w-6 text-primary" />
                <span>Select Waste Types</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wasteTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedWasteTypes.includes(type.id);
                  
                  return (
                    <div
                      key={type.id}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-eco ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleWasteTypeChange(type.id, !isSelected)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{type.image}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{type.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Min: {type.minQuantity} {type.unit}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleWasteTypeChange(type.id, e.target.checked)}
                          className="w-5 h-5 text-primary"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.wasteTypes && (
                <p className="text-destructive text-sm mt-2">{errors.wasteTypes.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Plastic Type Selection (if plastic is selected) */}
          {selectedWasteTypes.includes('plastic') && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle>Select Plastic Type</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => setValue('plasticType', value)}
                  className="space-y-3"
                >
                  {plasticTypes.map((plastic) => (
                    <div key={plastic.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50">
                      <RadioGroupItem value={plastic.id} id={plastic.id} />
                      <Label htmlFor={plastic.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{plastic.name}</div>
                        <div className="text-sm text-muted-foreground">{plastic.description}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.plasticType && (
                  <p className="text-destructive text-sm mt-2">{errors.plasticType.message}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quantity Selection */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle>Quantity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const currentQuantity = quantity || 1;
                    const minQty = getMinQuantity();
                    if (currentQuantity > minQty) {
                      setValue('quantity', currentQuantity - 1);
                    }
                  }}
                  disabled={quantity <= getMinQuantity()}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <div className="flex-1">
                  <Input
                    type="number"
                    {...register('quantity')}
                    min={getMinQuantity()}
                    className="text-center"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Minimum quantity: {getMinQuantity()}
                  </p>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const currentQuantity = quantity || 1;
                    setValue('quantity', currentQuantity + 1);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.quantity && (
                <p className="text-destructive text-sm mt-2">{errors.quantity.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Pickup Date</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="date"
                  {...register('pickupDate')}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.pickupDate && (
                  <p className="text-destructive text-sm mt-2">{errors.pickupDate.message}</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Pickup Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="time"
                  {...register('pickupTime')}
                />
                {errors.pickupTime && (
                  <p className="text-destructive text-sm mt-2">{errors.pickupTime.message}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Location */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Pickup Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register('address')}
                placeholder="Enter your complete address with landmarks..."
                rows={3}
              />
              {errors.address && (
                <p className="text-destructive text-sm mt-2">{errors.address.message}</p>
              )}
            </CardContent>
          </Card>

          {/* UPI ID */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>UPI ID for Payment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                {...register('upiId')}
                placeholder="yourname@upi"
                type="text"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Payment will be processed within 24 hours after verification
              </p>
              {errors.upiId && (
                <p className="text-destructive text-sm mt-2">{errors.upiId.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle>Additional Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register('notes')}
                placeholder="Any special instructions or additional information..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-eco hover:shadow-glow px-8 py-3 text-lg"
            >
              Schedule Pickup
            </Button>
          </div>
        </form>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm text-center">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <span>Request Submitted Successfully!</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-lg font-semibold text-green-600">
                🎉 Your request is successfully sent!
              </p>
              <p className="text-muted-foreground">
                The verification and payment to your bank account will be completed within 24 hours.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                  You will receive SMS and email updates about your pickup status.
                </p>
              </div>
              <Button
                onClick={() => setShowSuccessDialog(false)}
                className="bg-gradient-eco hover:shadow-glow"
              >
                Got it!
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TrashGenerator;
