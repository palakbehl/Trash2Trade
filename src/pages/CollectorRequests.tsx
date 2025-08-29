import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  MapPin,
  Clock,
  Package,
  DollarSign,
  Search,
  Filter,
  Navigation,
  Phone,
  Star,
  Calendar,
  Truck
} from 'lucide-react';

const CollectorRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [filterBy, setFilterBy] = useState('all');

  if (!user || user.role !== 'collector') {
    return <div>Access denied</div>;
  }

  const mockRequests = [
    {
      id: 'REQ001',
      customerName: 'Sarah Johnson',
      address: '123 Green Street, EcoCity',
      distance: '0.8 km',
      wasteTypes: ['Plastic', 'Paper'],
      estimatedWeight: '15 kg',
      urgency: 'high',
      payment: 45,
      timeSlot: '2:00 PM - 4:00 PM',
      date: 'Today',
      rating: 4.8,
      phone: '+1 (555) 123-4567',
      notes: 'Please call before arriving. Gate code: 1234',
      status: 'available'
    },
    {
      id: 'REQ002',
      customerName: 'Mike Chen',
      address: '456 Oak Avenue, GreenTown',
      distance: '1.2 km',
      wasteTypes: ['Electronic', 'Metal'],
      estimatedWeight: '8 kg',
      urgency: 'medium',
      payment: 32,
      timeSlot: '10:00 AM - 12:00 PM',
      date: 'Tomorrow',
      rating: 4.9,
      phone: '+1 (555) 987-6543',
      notes: 'Heavy items - need assistance',
      status: 'available'
    },
    {
      id: 'REQ003',
      customerName: 'Lisa Park',
      address: '789 Pine Road, EcoVille',
      distance: '2.1 km',
      wasteTypes: ['Organic', 'Glass'],
      estimatedWeight: '12 kg',
      urgency: 'low',
      payment: 28,
      timeSlot: '4:00 PM - 6:00 PM',
      date: 'Dec 28',
      rating: 4.6,
      phone: '+1 (555) 456-7890',
      notes: 'Apartment building - Unit 3B',
      status: 'available'
    },
    {
      id: 'REQ004',
      customerName: 'David Wilson',
      address: '321 Maple Drive, CleanCity',
      distance: '3.5 km',
      wasteTypes: ['Plastic', 'Paper', 'Glass'],
      estimatedWeight: '22 kg',
      urgency: 'high',
      payment: 65,
      timeSlot: '9:00 AM - 11:00 AM',
      date: 'Dec 29',
      rating: 4.7,
      phone: '+1 (555) 234-5678',
      notes: 'Large pickup - multiple bags',
      status: 'available'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    // In a real app, this would call an API to accept the request
    console.log('Accepting request:', requestId);
  };

  const handleViewDetails = (requestId: string) => {
    // Navigate to detailed view or open modal
    console.log('Viewing details for:', requestId);
  };

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === 'all' || request.urgency === filterBy;
    return matchesSearch && matchesFilter;
  });

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
          Available Requests
        </h1>
        <p className="text-muted-foreground">
          Browse and accept pickup requests in your area
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="urgency">Urgency</SelectItem>
                <SelectItem value="rating">Customer Rating</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Grid */}
      <div className="grid gap-6">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Section - Request Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {request.customerName}
                      </h3>
                      <div className="flex items-center text-muted-foreground text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.address}
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Navigation className="h-4 w-4 mr-1 text-primary" />
                          <span>{request.distance}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>{request.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{request.phone}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {request.urgency} priority
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Waste Types</p>
                        <p className="text-xs text-muted-foreground">
                          {request.wasteTypes.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Est. Weight</p>
                        <p className="text-xs text-muted-foreground">
                          {request.estimatedWeight}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Schedule</p>
                        <p className="text-xs text-muted-foreground">
                          {request.date}, {request.timeSlot}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-success" />
                      <div>
                        <p className="text-sm font-medium text-success">Payment</p>
                        <p className="text-xs text-success">
                          ${request.payment}
                        </p>
                      </div>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="p-3 bg-muted rounded-lg mb-4">
                      <p className="text-sm">
                        <strong>Notes:</strong> {request.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Section - Actions */}
                <div className="flex flex-col space-y-3 lg:w-48">
                  <Button 
                    onClick={() => handleAcceptRequest(request.id)}
                    className="w-full"
                  >
                    Accept Request
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleViewDetails(request.id)}
                    className="w-full"
                  >
                    View Details
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No requests found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterBy !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Check back later for new pickup requests in your area'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <Card className="mt-8 bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{filteredRequests.length}</p>
              <p className="text-sm text-muted-foreground">Available Requests</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">
                ${filteredRequests.reduce((sum, req) => sum + req.payment, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Potential Earnings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">
                {filteredRequests.filter(req => req.urgency === 'high').length}
              </p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {(filteredRequests.reduce((sum, req) => sum + parseFloat(req.distance), 0) / filteredRequests.length || 0).toFixed(1)} km
              </p>
              <p className="text-sm text-muted-foreground">Avg Distance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectorRequests;
