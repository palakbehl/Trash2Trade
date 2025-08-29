import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Plus,
  Target,
  DollarSign,
  Calendar,
  Users,
  Leaf,
  Award,
  TrendingUp,
  MapPin,
  Edit,
  Pause,
  Play,
  BarChart3
} from 'lucide-react';

const NGOSponsor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    duration: '',
    category: '',
    location: ''
  });

  if (!user || user.role !== 'ngo') {
    return <div>Access denied</div>;
  }

  const activeCampaigns = [
    {
      id: 'CAMP001',
      title: 'Clean Ocean Initiative',
      description: 'Sponsor plastic waste collection from coastal areas to protect marine life.',
      targetAmount: 10000,
      raisedAmount: 7500,
      duration: '30 days',
      daysLeft: 12,
      category: 'Marine Conservation',
      location: 'Coastal Areas',
      sponsors: 45,
      pickupsSponsored: 120,
      wasteCollected: '2.8 tons',
      status: 'active',
      createdDate: '2024-11-27'
    },
    {
      id: 'CAMP002',
      title: 'Urban Green Spaces',
      description: 'Support waste cleanup in city parks and recreational areas.',
      targetAmount: 5000,
      raisedAmount: 3200,
      duration: '45 days',
      daysLeft: 28,
      category: 'Urban Environment',
      location: 'City Parks',
      sponsors: 28,
      pickupsSponsored: 85,
      wasteCollected: '1.5 tons',
      status: 'active',
      createdDate: '2024-12-01'
    },
    {
      id: 'CAMP003',
      title: 'School Recycling Program',
      description: 'Fund recycling education and waste collection in local schools.',
      targetAmount: 8000,
      raisedAmount: 8000,
      duration: '60 days',
      daysLeft: 0,
      category: 'Education',
      location: 'Local Schools',
      sponsors: 67,
      pickupsSponsored: 200,
      wasteCollected: '4.2 tons',
      status: 'completed',
      createdDate: '2024-10-15'
    }
  ];

  const handleCreateCampaign = () => {
    // In a real app, this would call an API to create the campaign
    console.log('Creating campaign:', formData);
    setShowCreateForm(false);
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      duration: '',
      category: '',
      location: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalStats = {
    totalRaised: activeCampaigns.reduce((sum, camp) => sum + camp.raisedAmount, 0),
    totalSponsors: activeCampaigns.reduce((sum, camp) => sum + camp.sponsors, 0),
    totalPickups: activeCampaigns.reduce((sum, camp) => sum + camp.pickupsSponsored, 0),
    totalWaste: activeCampaigns.reduce((sum, camp) => sum + parseFloat(camp.wasteCollected), 0).toFixed(1)
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/ngo')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Sponsorship Campaigns
            </h1>
            <p className="text-muted-foreground">
              Create and manage campaigns to fund environmental initiatives
            </p>
          </div>
          
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">${totalStats.totalRaised.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Raised</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{totalStats.totalSponsors}</p>
                <p className="text-sm text-muted-foreground">Total Sponsors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalStats.totalPickups}</p>
                <p className="text-sm text-muted-foreground">Pickups Sponsored</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{totalStats.totalWaste} tons</p>
                <p className="text-sm text-muted-foreground">Waste Collected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Campaign Form */}
          {showCreateForm && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-primary">Create New Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter campaign title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marine">Marine Conservation</SelectItem>
                        <SelectItem value="urban">Urban Environment</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="wildlife">Wildlife Protection</SelectItem>
                        <SelectItem value="community">Community Cleanup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your campaign goals and impact"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Amount ($)</Label>
                    <Input
                      id="target"
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                      placeholder="10000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Target area"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleCreateCampaign}>
                    Create Campaign
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Campaigns */}
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => {
              const progressPercentage = (campaign.raisedAmount / campaign.targetAmount) * 100;
              
              return (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              {campaign.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {campaign.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                              <Badge variant="outline">{campaign.category}</Badge>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                {campaign.location}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                {campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : 'Completed'}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>${campaign.raisedAmount.toLocaleString()} / ${campaign.targetAmount.toLocaleString()}</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>

                          <div className="grid md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <p className="text-lg font-bold text-primary">{campaign.sponsors}</p>
                              <p className="text-xs text-muted-foreground">Sponsors</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-success">{campaign.pickupsSponsored}</p>
                              <p className="text-xs text-muted-foreground">Pickups</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-green-600">{campaign.wasteCollected}</p>
                              <p className="text-xs text-muted-foreground">Waste Collected</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-blue-600">{Math.round(progressPercentage)}%</p>
                              <p className="text-xs text-muted-foreground">Funded</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 lg:w-40">
                        <Button size="sm" className="w-full">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Analytics
                        </Button>
                        
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>

                        {campaign.status === 'active' ? (
                          <Button variant="outline" size="sm" className="w-full">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        ) : campaign.status === 'paused' ? (
                          <Button variant="outline" size="sm" className="w-full">
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Column - Campaign Tips and Performance */}
        <div className="space-y-6">
          {/* Campaign Performance */}
          <Card className="bg-success/5 border-success/20">
            <CardHeader>
              <CardTitle className="text-success flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Active Campaigns</span>
                  <span className="font-semibold">{activeCampaigns.filter(c => c.status === 'active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Funding Rate</span>
                  <span className="font-semibold">68%</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate</span>
                  <span className="font-semibold text-success">85%</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Sponsors</span>
                  <span className="font-semibold">47</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Award className="h-4 w-4 text-primary mt-0.5" />
                  <p>Set realistic funding goals based on your organization's reach</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Target className="h-4 w-4 text-primary mt-0.5" />
                  <p>Include specific impact metrics and clear objectives</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Users className="h-4 w-4 text-primary mt-0.5" />
                  <p>Engage with sponsors through regular updates</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Calendar className="h-4 w-4 text-primary mt-0.5" />
                  <p>Optimal campaign duration is 30-45 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New sponsor joined Clean Ocean</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Urban Green reached 60% funding</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">School Program completed successfully</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View All Analytics
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Sponsors
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Award className="h-4 w-4 mr-2" />
                Campaign Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NGOSponsor;
