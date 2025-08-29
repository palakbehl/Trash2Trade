import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  Navigation,
  Phone,
  Package,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Flag
} from 'lucide-react';

const CollectorRoute = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [routeStatus, setRouteStatus] = useState<'not-started' | 'active' | 'paused' | 'completed'>('active');

  if (!user || user.role !== 'collector') {
    return <div>Access denied</div>;
  }

  const mockRoute = {
    id: 'ROUTE001',
    date: 'Today, Dec 27',
    totalStops: 5,
    completedStops: 2,
    estimatedDuration: '3h 45m',
    totalDistance: '12.8 km',
    estimatedEarnings: 185,
    currentStop: 3,
    stops: [
      {
        id: 'STOP001',
        customerName: 'Sarah Johnson',
        address: '123 Green Street, EcoCity',
        phone: '+1 (555) 123-4567',
        timeSlot: '9:00 AM - 10:00 AM',
        wasteTypes: ['Plastic', 'Paper'],
        estimatedWeight: '15 kg',
        payment: 45,
        status: 'completed',
        completedAt: '9:25 AM',
        notes: 'Gate code: 1234'
      },
      {
        id: 'STOP002',
        customerName: 'Mike Chen',
        address: '456 Oak Avenue, GreenTown',
        phone: '+1 (555) 987-6543',
        timeSlot: '10:30 AM - 11:30 AM',
        wasteTypes: ['Electronic', 'Metal'],
        estimatedWeight: '8 kg',
        payment: 32,
        status: 'completed',
        completedAt: '10:45 AM',
        notes: 'Heavy items - need assistance'
      },
      {
        id: 'STOP003',
        customerName: 'Lisa Park',
        address: '789 Pine Road, EcoVille',
        phone: '+1 (555) 456-7890',
        timeSlot: '12:00 PM - 1:00 PM',
        wasteTypes: ['Organic', 'Glass'],
        estimatedWeight: '12 kg',
        payment: 28,
        status: 'current',
        notes: 'Apartment building - Unit 3B'
      },
      {
        id: 'STOP004',
        customerName: 'David Wilson',
        address: '321 Maple Drive, CleanCity',
        phone: '+1 (555) 234-5678',
        timeSlot: '2:00 PM - 3:00 PM',
        wasteTypes: ['Plastic', 'Paper', 'Glass'],
        estimatedWeight: '22 kg',
        payment: 65,
        status: 'pending',
        notes: 'Large pickup - multiple bags'
      },
      {
        id: 'STOP005',
        customerName: 'Emma Rodriguez',
        address: '654 Cedar Lane, GreenVille',
        phone: '+1 (555) 345-6789',
        timeSlot: '3:30 PM - 4:30 PM',
        wasteTypes: ['Paper', 'Cardboard'],
        estimatedWeight: '10 kg',
        payment: 15,
        status: 'pending',
        notes: 'Office building - Reception desk'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'current': return 'bg-primary text-primary-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'current': return Navigation;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const handleCompleteStop = (stopId: string) => {
    console.log('Completing stop:', stopId);
  };

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  const progressPercentage = (mockRoute.completedStops / mockRoute.totalStops) * 100;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/collector')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Active Route
        </h1>
        <p className="text-muted-foreground">
          {mockRoute.date} • {mockRoute.totalStops} stops planned
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Route Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Route Progress</span>
                <Badge className={getStatusColor(routeStatus === 'active' ? 'current' : routeStatus)}>
                  {routeStatus === 'active' ? 'In Progress' : routeStatus}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{mockRoute.completedStops} of {mockRoute.totalStops} stops completed</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{mockRoute.completedStops}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">${mockRoute.estimatedEarnings}</p>
                    <p className="text-sm text-muted-foreground">Est. Earnings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{mockRoute.totalDistance}</p>
                    <p className="text-sm text-muted-foreground">Total Distance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{mockRoute.estimatedDuration}</p>
                    <p className="text-sm text-muted-foreground">Est. Duration</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Stops */}
          <Card>
            <CardHeader>
              <CardTitle>Route Stops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRoute.stops.map((stop, index) => {
                  const StatusIcon = getStatusIcon(stop.status);
                  const isCurrentStop = stop.status === 'current';
                  
                  return (
                    <div 
                      key={stop.id} 
                      className={`p-4 rounded-lg border-2 ${
                        isCurrentStop 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${
                            stop.status === 'completed' ? 'bg-success/20' :
                            stop.status === 'current' ? 'bg-primary/20' :
                            'bg-muted'
                          }`}>
                            <StatusIcon className={`h-4 w-4 ${
                              stop.status === 'completed' ? 'text-success' :
                              stop.status === 'current' ? 'text-primary' :
                              'text-muted-foreground'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">Stop {index + 1}: {stop.customerName}</h3>
                              {stop.completedAt && (
                                <Badge variant="outline" className="text-success border-success">
                                  Completed at {stop.completedAt}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {stop.address}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {stop.timeSlot}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(stop.status)}>
                          ${stop.payment}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4 ml-11">
                        <div>
                          <p className="text-sm font-medium">Waste Types</p>
                          <p className="text-sm text-muted-foreground">{stop.wasteTypes.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Estimated Weight</p>
                          <p className="text-sm text-muted-foreground">{stop.estimatedWeight}</p>
                        </div>
                      </div>

                      {stop.notes && (
                        <div className="ml-11 p-3 bg-muted rounded-lg mb-4">
                          <p className="text-sm">
                            <strong>Notes:</strong> {stop.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 ml-11">
                        {isCurrentStop && (
                          <Button 
                            size="sm"
                            onClick={() => handleCompleteStop(stop.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete Stop
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCallCustomer(stop.phone)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGetDirections(stop.address)}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Route Controls */}
        <div className="space-y-6">
          {/* Route Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Route Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {routeStatus === 'active' ? (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setRouteStatus('paused')}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Route
                </Button>
              ) : routeStatus === 'paused' ? (
                <Button 
                  className="w-full"
                  onClick={() => setRouteStatus('active')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume Route
                </Button>
              ) : null}
              
              <Button variant="outline" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Optimize Route
              </Button>
              
              <Button variant="outline" className="w-full">
                <Flag className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </CardContent>
          </Card>

          {/* Current Stop Details */}
          {mockRoute.stops.find(stop => stop.status === 'current') && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-primary">Current Stop</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const currentStop = mockRoute.stops.find(stop => stop.status === 'current')!;
                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">{currentStop.customerName}</h3>
                        <p className="text-sm text-muted-foreground">{currentStop.address}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Time Slot</span>
                          <span className="text-sm font-medium">{currentStop.timeSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Payment</span>
                          <span className="text-sm font-medium text-success">${currentStop.payment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Weight</span>
                          <span className="text-sm font-medium">{currentStop.estimatedWeight}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button 
                          size="sm"
                          onClick={() => handleCallCustomer(currentStop.phone)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Customer
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGetDirections(currentStop.address)}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Emergency Contacts */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Emergency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-orange-300 text-orange-800"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Support: (555) 911-HELP
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-orange-300 text-orange-800"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Report Emergency
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollectorRoute;
