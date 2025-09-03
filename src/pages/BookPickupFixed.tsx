import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore } from '@/lib/dynamicDataStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  Clock,
  MapPin,
  Package,
  CheckCircle,
  ArrowLeft,
  Info,
  Truck,
  Gift,
  Recycle
} from 'lucide-react';

interface BookingForm {
  wasteType: string;
  quantity: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  urgency: 'normal' | 'urgent';
}

const wasteTypesFixed = [
  { 
    value: 'plastic', 
    label: 'Plastic Bottles', 
    color: 'bg-blue-100 text-blue-800', 
    icon: '🍶', 
    pricePerKg: 15, 
    minQuantity: 2,
    description: 'Bottles',
    minText: 'Min: 10 bottles'
  },
  { 
    value: 'cardboard', 
    label: 'Cardboard Boxes', 
    color: 'bg-orange-100 text-orange-800', 
    icon: '📦', 
    pricePerKg: 12, 
    minQuantity: 5,
    description: 'Boxes',
    minText: 'Min: 5 boxes'
  },
  { 
    value: 'paper', 
    label: 'Paper/Newspaper', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: '📰', 
    pricePerKg: 8, 
    minQuantity: 2,
    description: 'Paper/Newspaper',
    minText: 'Min: 2 kg'
  },
  { 
    value: 'metal', 
    label: 'Metal Cans', 
    color: 'bg-gray-100 text-gray-800', 
    icon: '🥫', 
    pricePerKg: 25, 
    minQuantity: 15,
    description: 'Metal Cans',
    minText: 'Min: 15 cans'
  },
  { 
    value: 'glass', 
    label: 'Glass Bottles', 
    color: 'bg-green-100 text-green-800', 
    icon: '🍾', 
    pricePerKg: 10, 
    minQuantity: 8,
    description: 'Glass Bottles',
    minText: 'Min: 8 bottles'
  },
  { 
    value: 'e-waste', 
    label: 'E-Waste', 
    color: 'bg-purple-100 text-purple-800', 
    icon: '📱', 
    pricePerKg: 50, 
    minQuantity: 1,
    description: 'E-Waste',
    minText: 'Min: 1 item'
  }
];

const BookPickupFixed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>([]);
  
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
      if (selectedWasteTypes.length === 0) newErrors.wasteType = 'Please select at least one waste type';
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

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleWasteTypeToggle = (wasteType: string) => {
    setSelectedWasteTypes(prev => {
      if (prev.includes(wasteType)) {
        return prev.filter(type => type !== wasteType);
      } else {
        return [...prev, wasteType];
      }
    });
  };

  const calculateEstimatedValue = () => {
    if (!formData.quantity || selectedWasteTypes.length === 0) return 0;
    
    const quantity = Number(formData.quantity);
    const avgPrice = selectedWasteTypes.reduce((sum, type) => {
      const wasteType = wasteTypesFixed.find(w => w.value === type);
      return sum + (wasteType?.pricePerKg || 0);
    }, 0) / selectedWasteTypes.length;
    
    return Math.round(quantity * avgPrice);
  };

  const calculateGreenCoins = () => {
    const baseCoins = calculateEstimatedValue() * 0.5;
    return Math.round(baseCoins);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    
    setIsSubmitting(true);
    try {
      if (user?.id) {
        // Create pickup request using dynamic data store
        const pickupRequest = dataStore.addPickupRequest({
          userId: user.id,
          address: formData.address,
          wasteType: selectedWasteTypes[0], // Use first selected type for now
          quantity: Number(formData.quantity),
          scheduledDate: formData.preferredDate,
          status: 'pending',
          estimatedValue: calculateEstimatedValue(),
          greenCoins: calculateGreenCoins()
        });

        toast({
          title: 'Pickup Scheduled Successfully! 🌱',
          description: `Your pickup request has been submitted. You'll earn ₹${calculateEstimatedValue()} and ${calculateGreenCoins()} Green Coins when completed.`,
        });

        setBookingConfirmed(true);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule pickup. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success confirmation screen
  if (bookingConfirmed) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Pickup Scheduled Successfully!
                </h2>
                <p className="text-muted-foreground">
                  Your waste pickup has been scheduled. A collector will contact you soon.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Estimated Earnings:</span>
                    <div className="text-success font-bold">₹{calculateEstimatedValue()}</div>
                  </div>
                  <div>
                    <span className="font-medium">Green Coins:</span>
                    <div className="text-primary font-bold">{calculateGreenCoins()}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/trash-generator')} className="flex-1 sm:flex-none">
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setBookingConfirmed(false);
                    setCurrentStep(1);
                    setSelectedWasteTypes([]);
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/trash-generator')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Schedule Waste Pickup
          </h1>
          <p className="text-muted-foreground text-center">
            Select your waste types, quantity, and schedule a convenient pickup time
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
              {currentStep === 1 && <Recycle className="h-5 w-5 text-green-600" />}
              {currentStep === 2 && <MapPin className="h-5 w-5 text-blue-600" />}
              {currentStep === 3 && <CheckCircle className="h-5 w-5 text-green-600" />}
              <span>
                {currentStep === 1 && 'Select Waste Types'}
                {currentStep === 2 && 'Pickup Details'}
                {currentStep === 3 && 'Confirmation'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Waste Type Selection */}
            {currentStep === 1 && (
              <>
                <div className="space-y-4">
                  <Label className="text-base font-medium">Select Waste Types</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wasteTypesFixed.map((type) => (
                      <Card 
                        key={type.value}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedWasteTypes.includes(type.value) 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleWasteTypeToggle(type.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{type.icon}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                              <div className="text-xs text-muted-foreground mt-1">{type.minText}</div>
                            </div>
                            <div className="text-right">
                              <input
                                type="checkbox"
                                checked={selectedWasteTypes.includes(type.value)}
                                onChange={() => handleWasteTypeToggle(type.value)}
                                className="w-4 h-4"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {errors.wasteType && (
                    <p className="text-sm text-destructive">{errors.wasteType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Estimated Total Quantity (kg) *</Label>
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

                {/* Earnings Preview */}
                {selectedWasteTypes.length > 0 && formData.quantity && (
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 flex items-center space-x-2">
                        <Gift className="h-4 w-4" />
                        <span>Estimated Earnings</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">₹{calculateEstimatedValue()}</div>
                          <div className="text-sm text-muted-foreground">Cash Value</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{calculateGreenCoins()}</div>
                          <div className="text-sm text-muted-foreground">Green Coins</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                      className={errors.preferredDate ? 'border-destructive' : ''}
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
                        <SelectItem value="flexible">Flexible</SelectItem>
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
              </>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Pickup Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Waste Types:</span>
                      <span className="font-medium">
                        {selectedWasteTypes.map(type => 
                          wasteTypesFixed.find(w => w.value === type)?.label
                        ).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-medium">{formData.quantity} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span className="font-medium">
                        {new Date(formData.preferredDate).toLocaleDateString()} - {formData.preferredTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Address:</span>
                      <span className="font-medium text-right max-w-xs">{formData.address}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Estimated Earnings:</span>
                      <span className="text-green-600">₹{calculateEstimatedValue()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Green Coins:</span>
                      <span className="text-blue-600">{calculateGreenCoins()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">What happens next?</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>A nearby collector will be notified of your request</li>
                        <li>You'll receive a confirmation call within 24 hours</li>
                        <li>The collector will arrive at your scheduled time</li>
                        <li>Your earnings will be credited after pickup completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {isSubmitting ? 'Scheduling...' : 'Confirm Pickup'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookPickupFixed;
