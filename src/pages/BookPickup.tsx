import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  Clock,
  MapPin,
  Package,
  CheckCircle,
  ArrowLeft,
  Info,
  Truck,
  Gift
} from 'lucide-react';
import { wasteTypes } from '@/data/mockData';

interface BookingForm {
  wasteType: string;
  quantity: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  urgency: 'normal' | 'urgent';
}

const BookPickup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  const [formData, setFormData] = useState<BookingForm>({
    wasteType: '',
    quantity: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    urgency: 'normal'
  });

  const [errors, setErrors] = useState<Partial<BookingForm>>({});

  if (!user || (user.role !== 'user' || user.subtype !== 'trash-generator')) {
    return <div>Access denied</div>;
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<BookingForm> = {};

    if (step === 1) {
      if (!formData.wasteType) newErrors.wasteType = 'Please select a waste type';
      if (!formData.quantity) newErrors.quantity = 'Please enter quantity';
      else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
        newErrors.quantity = 'Please enter a valid quantity';
      }
    }

    if (step === 2) {
      if (!formData.address) newErrors.address = 'Please enter your address';
      if (!formData.preferredDate) newErrors.preferredDate = 'Please select a date';
      if (!formData.preferredTime) newErrors.preferredTime = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful booking
    setBookingConfirmed(true);
    setIsSubmitting(false);
  };

  const selectedWasteType = wasteTypes.find(type => type.value === formData.wasteType);
  const estimatedGreenCoins = formData.quantity ? Math.ceil(Number(formData.quantity) * 2.5) : 0;

  // Success state
  if (bookingConfirmed) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Pickup Booked Successfully! 🎉
                </h1>
                <p className="text-muted-foreground">
                  Your waste collection has been scheduled. A collector will be assigned soon.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Waste Type</p>
                    <p className="font-medium capitalize">{formData.wasteType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{formData.quantity} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(formData.preferredDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p className="font-medium">{formData.preferredTime}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 mb-6">
                <Gift className="h-5 w-5 text-success" />
                <span className="text-success font-medium">
                  You'll earn ~{estimatedGreenCoins} GreenCoins!
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/citizen')} className="flex-1 sm:flex-none">
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setBookingConfirmed(false);
                    setCurrentStep(1);
                    setFormData({
                      wasteType: '',
                      quantity: '',
                      address: '',
                      preferredDate: '',
                      preferredTime: '',
                      notes: '',
                      urgency: 'normal'
                    });
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Book Another Pickup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/citizen')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Book Waste Pickup
          </h1>
          <p className="text-muted-foreground">
            Schedule a convenient time for waste collection and earn GreenCoins!
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              1
            </div>
            <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
            <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              3
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {currentStep === 1 && <Package className="h-5 w-5" />}
              {currentStep === 2 && <MapPin className="h-5 w-5" />}
              {currentStep === 3 && <CheckCircle className="h-5 w-5" />}
              <span>
                {currentStep === 1 && 'Waste Details'}
                {currentStep === 2 && 'Pickup Details'}
                {currentStep === 3 && 'Confirmation'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Waste Details */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="wasteType">Waste Type *</Label>
                  <Select 
                    value={formData.wasteType} 
                    onValueChange={(value) => setFormData({...formData, wasteType: value})}
                  >
                    <SelectTrigger className={errors.wasteType ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      {wasteTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.wasteType && (
                    <p className="text-sm text-destructive">{errors.wasteType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Estimated Quantity (kg) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className={errors.quantity ? 'border-destructive' : ''}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-destructive">{errors.quantity}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Don't worry if it's not exact - our collectors will weigh it accurately
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select 
                    value={formData.urgency} 
                    onValueChange={(value: 'normal' | 'urgent') => setFormData({...formData, urgency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal (within 3-5 days)</SelectItem>
                      <SelectItem value="urgent">Urgent (within 24 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedWasteType && formData.quantity && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gift className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-success">Estimated Reward</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You'll earn approximately <strong>{estimatedGreenCoins} GreenCoins</strong> for this pickup
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Step 2: Pickup Details */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="address">Pickup Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete address including landmarks"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className={errors.address ? 'border-destructive' : ''}
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date *</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                      className={errors.preferredDate ? 'border-destructive' : ''}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.preferredDate && (
                      <p className="text-sm text-destructive">{errors.preferredDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Time *</Label>
                    <Select 
                      value={formData.preferredTime} 
                      onValueChange={(value) => setFormData({...formData, preferredTime: value})}
                    >
                      <SelectTrigger className={errors.preferredTime ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00-12:00">Morning (9:00 AM - 12:00 PM)</SelectItem>
                        <SelectItem value="12:00-15:00">Afternoon (12:00 PM - 3:00 PM)</SelectItem>
                        <SelectItem value="15:00-18:00">Evening (3:00 PM - 6:00 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.preferredTime && (
                      <p className="text-sm text-destructive">{errors.preferredTime}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions for the collector..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Pickup Guidelines:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Please ensure waste is properly sorted and clean</li>
                        <li>• Someone should be available at the pickup time</li>
                        <li>• Collector will verify and weigh the waste</li>
                        <li>• GreenCoins will be credited after completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <>
                <div className="space-y-4">
                  <h3 className="font-semibold">Review Your Booking</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wasteTypes.map((type) => (
                      <div
                        key={type.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          formData.wasteType === type.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setFormData({ ...formData, wasteType: type.value })}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{type.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-medium">{type.label}</h3>
                            <p className="text-sm text-muted-foreground">
                              ₹{type.pricePerKg}/kg
                            </p>
                            <p className="text-xs text-success">
                              Min: {type.minQuantity} kg
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Waste Type</p>
                      <div className="flex items-center space-x-2">
                        <span>{selectedWasteType?.icon}</span>
                        <span className="font-medium capitalize">{formData.wasteType}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="font-medium">{formData.quantity} kg</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Urgency</p>
                      <Badge variant={formData.urgency === 'urgent' ? 'destructive' : 'secondary'}>
                        {formData.urgency}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">
                          {new Date(formData.preferredDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{formData.preferredTime}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Reward</p>
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-success" />
                        <span className="font-medium text-success">{estimatedGreenCoins} GreenCoins</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Pickup Address</p>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <p className="font-medium">{formData.address}</p>
                    </div>
                  </div>
                  
                  {formData.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Additional Notes</p>
                        <p className="text-sm bg-muted/30 p-3 rounded-lg">{formData.notes}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">What happens next?</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We'll assign a nearby collector to your request. You'll receive notifications about 
                    the pickup status and collector details.
                  </p>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookPickup;
