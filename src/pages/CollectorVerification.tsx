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
  Truck, 
  User, 
  Phone, 
  MapPin, 
  Upload,
  CheckCircle,
  Car,
  Bike,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  vehicleType: yup.string().oneOf(['bicycle', 'motorcycle', 'small-truck', 'large-truck']).required('Vehicle type is required'),
  licenseNumber: yup.string().required('License number is required'),
  experience: yup.string().required('Experience is required'),
  availability: yup.string().required('Availability is required'),
});

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  vehicleType: 'bicycle' | 'motorcycle' | 'small-truck' | 'large-truck';
  licenseNumber: string;
  experience: string;
  availability: string;
}

const CollectorVerification = () => {
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const vehicleTypes = [
    {
      id: 'bicycle',
      name: 'Bicycle',
      icon: Bike,
      capacity: '5-10 kg',
      suitableFor: ['Small plastic items', 'Paper', 'Light materials'],
      color: 'text-green-500',
    },
    {
      id: 'motorcycle',
      name: 'Motorcycle',
      icon: Bike,
      capacity: '10-25 kg',
      suitableFor: ['Bottles', 'Cans', 'Small electronics'],
      color: 'text-blue-500',
    },
    {
      id: 'small-truck',
      name: 'Small Truck/Van',
      icon: Car,
      capacity: '50-200 kg',
      suitableFor: ['Cardboard boxes', 'Furniture', 'Appliances'],
      color: 'text-orange-500',
    },
    {
      id: 'large-truck',
      name: 'Large Truck',
      icon: Truck,
      capacity: '200+ kg',
      suitableFor: ['Bulk waste', 'Industrial materials', 'Large items'],
      color: 'text-red-500',
    },
  ];

  const onSubmit = async (data: FormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccessDialog(true);
      
      toast({
        title: 'Application Submitted! 🚛',
        description: 'Your collector verification application has been submitted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const selectedVehicle = watch('vehicleType');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/15 rounded-full blur-xl animate-float-delayed"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-eco bg-clip-text text-transparent mb-4">
            Collector Verification
          </h1>
          <p className="text-lg text-muted-foreground">
            Join our network of verified waste collectors and start earning
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-6 w-6 text-primary" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+91 9876543210"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    {...register('licenseNumber')}
                    placeholder="Enter license/ID number"
                  />
                  {errors.licenseNumber && (
                    <p className="text-destructive text-sm mt-1">{errors.licenseNumber.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address">Complete Address</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  placeholder="Enter your complete address with city and state"
                  rows={3}
                />
                {errors.address && (
                  <p className="text-destructive text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Selection */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-6 w-6 text-primary" />
                <span>Vehicle Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                onValueChange={(value) => setValue('vehicleType', value as any)}
                className="space-y-4"
              >
                {vehicleTypes.map((vehicle) => {
                  const Icon = vehicle.icon;
                  return (
                    <div key={vehicle.id} className="relative">
                      <RadioGroupItem
                        value={vehicle.id}
                        id={vehicle.id}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={vehicle.id}
                        className={`flex items-start space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-eco ${
                          selectedVehicle === vehicle.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`h-8 w-8 ${vehicle.color} mt-1`} />
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{vehicle.name}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Capacity: {vehicle.capacity}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Suitable for:</span>
                            <ul className="list-disc list-inside mt-1">
                              {vehicle.suitableFor.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              {errors.vehicleType && (
                <p className="text-destructive text-sm mt-2">{errors.vehicleType.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Experience and Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  {...register('experience')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select experience level</option>
                  <option value="new">New to waste collection</option>
                  <option value="1-2-years">1-2 years</option>
                  <option value="3-5-years">3-5 years</option>
                  <option value="5-plus-years">5+ years</option>
                </select>
                {errors.experience && (
                  <p className="text-destructive text-sm mt-2">{errors.experience.message}</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  {...register('availability')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select availability</option>
                  <option value="part-time">Part-time (2-4 hours/day)</option>
                  <option value="full-time">Full-time (6-8 hours/day)</option>
                  <option value="weekends">Weekends only</option>
                  <option value="flexible">Flexible schedule</option>
                </select>
                {errors.availability && (
                  <p className="text-destructive text-sm mt-2">{errors.availability.message}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Document Upload */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground mb-2">
                    Upload ID Proof (Aadhaar, PAN, Driving License)
                  </p>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.pdf,.jpg,.jpeg,.png';
                      input.multiple = true;
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files) {
                          toast({
                            title: 'Files Selected',
                            description: `${files.length} file(s) selected for ID proof`,
                          });
                        }
                      };
                      input.click();
                    }}
                  >
                    Choose Files
                  </Button>
                </div>
                
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground mb-2">
                    Upload Vehicle Registration (if applicable)
                  </p>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.pdf,.jpg,.jpeg,.png';
                      input.multiple = true;
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files) {
                          toast({
                            title: 'Files Selected',
                            description: `${files.length} file(s) selected for vehicle registration`,
                          });
                        }
                      };
                      input.click();
                    }}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-eco hover:shadow-glow px-8 py-3 text-lg"
            >
              Submit Application
            </Button>
          </div>
        </form>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm text-center">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <span>Application Submitted!</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-lg font-semibold text-green-600">
                🚛 Welcome to our collector network!
              </p>
              <p className="text-muted-foreground">
                Your application is under review. We'll contact you within 2-3 business days with verification details.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                  You will receive an email with your application reference number and next steps.
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

export default CollectorVerification;
