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
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Building, 
  Users, 
  Recycle, 
  Heart, 
  Calendar, 
  MapPin, 
  CheckCircle,
  Plus,
  Minus,
  Target,
  Award,
  Leaf
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const schema = yup.object({
  organizationName: yup.string().required('Organization name is required'),
  organizationType: yup.string().oneOf(['ngo', 'business', 'school', 'government']).required('Organization type is required'),
  contactPerson: yup.string().required('Contact person is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  serviceType: yup.string().oneOf(['waste-submission', 'csr-activity', 'zero-waste-campaign']).required('Service type is required'),
  wasteAmount: yup.number().when('serviceType', {
    is: 'waste-submission',
    then: (schema) => schema.min(1, 'Amount must be greater than 0').required('Waste amount is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  wasteType: yup.string().when('serviceType', {
    is: 'waste-submission',
    then: (schema) => schema.required('Waste type is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  teamMembers: yup.number().when('serviceType', {
    is: 'csr-activity',
    then: (schema) => schema.min(1, 'At least 1 team member required').required('Number of team members is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  activityType: yup.string().when('serviceType', {
    is: 'csr-activity',
    then: (schema) => schema.required('Activity type is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  campaignType: yup.string().when('serviceType', {
    is: 'zero-waste-campaign',
    then: (schema) => schema.required('Campaign type is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  campaignDate: yup.string().when('serviceType', {
    is: 'zero-waste-campaign',
    then: (schema) => schema.required('Campaign date is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  expectedParticipants: yup.number().when('serviceType', {
    is: 'zero-waste-campaign',
    then: (schema) => schema.min(10, 'Minimum 10 participants expected').required('Expected participants is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  budget: yup.number().min(0, 'Budget cannot be negative'),
  additionalServices: yup.array().of(yup.string()),
  description: yup.string(),
});

interface NGOFormData {
  organizationName: string;
  organizationType: 'ngo' | 'business' | 'school' | 'government';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  serviceType: 'waste-submission' | 'csr-activity' | 'zero-waste-campaign';
  wasteAmount?: number;
  wasteType?: string;
  teamMembers?: number;
  activityType?: string;
  campaignType?: string;
  campaignDate?: string;
  expectedParticipants?: number;
  budget?: number;
  additionalServices?: string[];
  description?: string;
}

const NGOBusiness = () => {
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NGOFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      teamMembers: 1,
      expectedParticipants: 10,
      budget: 0,
      additionalServices: [],
    },
  });

  const organizationTypes = [
    { value: 'ngo', label: 'NGO/Non-Profit', icon: Heart, color: 'text-red-500' },
    { value: 'business', label: 'Business/Corporate', icon: Building, color: 'text-blue-500' },
    { value: 'school', label: 'Educational Institution', icon: Award, color: 'text-purple-500' },
    { value: 'government', label: 'Government Agency', icon: Target, color: 'text-green-500' },
  ];

  const serviceTypes = [
    {
      value: 'waste-submission',
      label: 'Waste Submission',
      description: 'Submit waste materials from your organization',
      icon: Recycle,
    },
    {
      value: 'csr-activity',
      label: 'CSR Activity',
      description: 'Organize Corporate Social Responsibility activities',
      icon: Users,
    },
    {
      value: 'zero-waste-campaign',
      label: 'Zero Waste Campaign',
      description: 'Organize waste collection and cleaning campaigns',
      icon: Leaf,
    },
  ];

  const wasteTypes = [
    'Paper & Cardboard',
    'Plastic Materials',
    'Metal & Aluminum',
    'Glass & Bottles',
    'Electronic Waste',
    'Organic Waste',
    'Mixed Recyclables',
  ];

  const activityTypes = [
    'Beach Cleanup',
    'Tree Plantation',
    'Awareness Workshop',
    'Recycling Drive',
    'Community Cleanup',
    'Environmental Education',
  ];

  const campaignTypes = [
    'City-wide Cleanup',
    'Beach/River Cleanup',
    'Neighborhood Campaign',
    'School/College Drive',
    'Corporate Campus Cleanup',
    'Public Space Maintenance',
  ];

  const additionalServiceOptions = [
    'Transportation Support',
    'Equipment Rental',
    'Volunteer Coordination',
    'Media Coverage',
    'Certificate of Participation',
    'Impact Report',
  ];

  const serviceType = watch('serviceType');
  const teamMembers = watch('teamMembers');
  const expectedParticipants = watch('expectedParticipants');

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    let newServices: string[];
    if (checked) {
      newServices = [...selectedServices, serviceId];
    } else {
      newServices = selectedServices.filter(id => id !== serviceId);
    }
    setSelectedServices(newServices);
    setValue('additionalServices', newServices);
  };

  const onSubmit = async (data: NGOFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccessDialog(true);
      
      toast({
        title: 'Application Submitted! 🌱',
        description: 'Your organization application has been successfully submitted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/20 p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/15 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-success/10 rounded-full blur-lg animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-eco bg-clip-text text-transparent mb-4">
            Organization Partnership
          </h1>
          <p className="text-lg text-muted-foreground">
            Join us in creating a sustainable future through corporate partnerships and community initiatives
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Organization Details */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-primary" />
                <span>Organization Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    {...register('organizationName')}
                    placeholder="Enter organization name"
                  />
                  {errors.organizationName && (
                    <p className="text-destructive text-sm mt-1">{errors.organizationName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    {...register('contactPerson')}
                    placeholder="Enter contact person name"
                  />
                  {errors.contactPerson && (
                    <p className="text-destructive text-sm mt-1">{errors.contactPerson.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="organization@example.com"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

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
              </div>

              <div>
                <Label htmlFor="address">Organization Address</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  placeholder="Enter complete address with city and state"
                  rows={3}
                />
                {errors.address && (
                  <p className="text-destructive text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Organization Type */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle>Organization Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                onValueChange={(value) => setValue('organizationType', value as any)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {organizationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.value} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50">
                      <RadioGroupItem value={type.value} id={type.value} />
                      <Label htmlFor={type.value} className="flex items-center space-x-3 cursor-pointer flex-1">
                        <Icon className={`h-5 w-5 ${type.color}`} />
                        <span className="font-medium">{type.label}</span>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              {errors.organizationType && (
                <p className="text-destructive text-sm mt-2">{errors.organizationType.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Service Type Selection */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle>Select Service Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                onValueChange={(value) => setValue('serviceType', value as any)}
                className="space-y-4"
              >
                {serviceTypes.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div key={service.value} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50">
                      <RadioGroupItem value={service.value} id={service.value} />
                      <Label htmlFor={service.value} className="flex items-center space-x-3 cursor-pointer flex-1">
                        <Icon className="h-6 w-6 text-primary" />
                        <div>
                          <div className="font-medium">{service.label}</div>
                          <div className="text-sm text-muted-foreground">{service.description}</div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              {errors.serviceType && (
                <p className="text-destructive text-sm mt-2">{errors.serviceType.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Waste Submission Details */}
          {serviceType === 'waste-submission' && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Recycle className="h-5 w-5 text-primary" />
                  <span>Waste Submission Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wasteType">Waste Type</Label>
                    <select
                      {...register('wasteType')}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select waste type</option>
                      {wasteTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.wasteType && (
                      <p className="text-destructive text-sm mt-1">{errors.wasteType.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="wasteAmount">Amount (in kg)</Label>
                    <Input
                      id="wasteAmount"
                      type="number"
                      {...register('wasteAmount')}
                      placeholder="Enter amount in kg"
                      min="1"
                    />
                    {errors.wasteAmount && (
                      <p className="text-destructive text-sm mt-1">{errors.wasteAmount.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* CSR Activity Details */}
          {serviceType === 'csr-activity' && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>CSR Activity Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="activityType">Activity Type</Label>
                    <select
                      {...register('activityType')}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select activity type</option>
                      {activityTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.activityType && (
                      <p className="text-destructive text-sm mt-1">{errors.activityType.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="teamMembers">Team Members Participating</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const current = teamMembers || 1;
                          if (current > 1) setValue('teamMembers', current - 1);
                        }}
                        disabled={teamMembers <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        {...register('teamMembers')}
                        type="number"
                        min="1"
                        className="text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const current = teamMembers || 1;
                          setValue('teamMembers', current + 1);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {errors.teamMembers && (
                      <p className="text-destructive text-sm mt-1">{errors.teamMembers.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Zero Waste Campaign Details */}
          {serviceType === 'zero-waste-campaign' && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  <span>Zero Waste Campaign Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="campaignType">Campaign Type</Label>
                    <select
                      {...register('campaignType')}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select campaign type</option>
                      {campaignTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.campaignType && (
                      <p className="text-destructive text-sm mt-1">{errors.campaignType.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="campaignDate">Preferred Campaign Date</Label>
                    <Input
                      id="campaignDate"
                      type="date"
                      {...register('campaignDate')}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.campaignDate && (
                      <p className="text-destructive text-sm mt-1">{errors.campaignDate.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="expectedParticipants">Expected Participants</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const current = expectedParticipants || 10;
                        if (current > 10) setValue('expectedParticipants', current - 10);
                      }}
                      disabled={expectedParticipants <= 10}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      {...register('expectedParticipants')}
                      type="number"
                      min="10"
                      step="10"
                      className="text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const current = expectedParticipants || 10;
                        setValue('expectedParticipants', current + 10);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.expectedParticipants && (
                    <p className="text-destructive text-sm mt-1">{errors.expectedParticipants.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Services */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
            <CardHeader>
              <CardTitle>Additional Services (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {additionalServiceOptions.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={selectedServices.includes(service)}
                      onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                    />
                    <Label htmlFor={service} className="text-sm cursor-pointer">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle>Budget (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  {...register('budget')}
                  placeholder="Enter budget in INR"
                  min="0"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Leave blank if budget is flexible
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-eco">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...register('description')}
                  placeholder="Any additional details or special requirements..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

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
                <span>Application Submitted Successfully!</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-lg font-semibold text-green-600">
                🎉 Thank you for partnering with us!
              </p>
              <p className="text-muted-foreground">
                Our team will review your application and contact you within 2-3 business days to discuss the next steps.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                  You will receive a confirmation email with your application details and reference number.
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

export default NGOBusiness;
