import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  TrendingUp,
  Leaf,
  Users,
  Target,
  Calendar,
  Download,
  Share,
  MapPin,
  Award,
  Recycle,
  TreePine,
  Droplets
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const NGOImpact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('this-year');

  if (!user || user.role !== 'ngo') {
    return <div>Access denied</div>;
  }

  const impactData = [
    { month: 'Jan', wasteCollected: 2.1, co2Saved: 5.8, pickups: 45, investment: 1200 },
    { month: 'Feb', wasteCollected: 2.8, co2Saved: 7.2, pickups: 62, investment: 1800 },
    { month: 'Mar', wasteCollected: 3.2, co2Saved: 8.1, pickups: 78, investment: 2100 },
    { month: 'Apr', wasteCollected: 2.9, co2Saved: 7.5, pickups: 68, investment: 1950 },
    { month: 'May', wasteCollected: 3.8, co2Saved: 9.2, pickups: 89, investment: 2400 },
    { month: 'Jun', wasteCollected: 4.2, co2Saved: 10.1, pickups: 95, investment: 2650 },
    { month: 'Jul', wasteCollected: 3.9, co2Saved: 9.8, pickups: 88, investment: 2300 },
    { month: 'Aug', wasteCollected: 4.5, co2Saved: 11.2, pickups: 102, investment: 2800 },
    { month: 'Sep', wasteCollected: 4.1, co2Saved: 10.5, pickups: 94, investment: 2550 },
    { month: 'Oct', wasteCollected: 4.8, co2Saved: 12.1, pickups: 108, investment: 3000 },
    { month: 'Nov', wasteCollected: 5.2, co2Saved: 13.5, pickups: 118, investment: 3200 },
    { month: 'Dec', wasteCollected: 4.9, co2Saved: 12.8, pickups: 112, investment: 2950 }
  ];

  const wasteTypeData = [
    { name: 'Plastic', value: 35, color: '#3B82F6' },
    { name: 'Paper', value: 28, color: '#10B981' },
    { name: 'Organic', value: 20, color: '#F59E0B' },
    { name: 'Glass', value: 12, color: '#8B5CF6' },
    { name: 'Metal', value: 5, color: '#EF4444' }
  ];

  const regionData = [
    { region: 'Downtown', pickups: 145, waste: 8.2, co2: 18.5 },
    { region: 'Suburbs', pickups: 98, waste: 5.8, co2: 12.3 },
    { region: 'Industrial', pickups: 67, waste: 12.1, co2: 28.7 },
    { region: 'Coastal', pickups: 89, waste: 6.9, co2: 15.2 },
    { region: 'Rural', pickups: 34, waste: 2.8, co2: 6.8 }
  ];

  const milestones = [
    {
      id: 1,
      title: '1000 Pickups Sponsored',
      description: 'Reached our first major milestone of sponsoring 1000 waste pickups',
      date: '2024-08-15',
      impact: '28.5 tons of waste collected',
      achieved: true
    },
    {
      id: 2,
      title: '50 Tons CO₂ Saved',
      description: 'Environmental impact equivalent to planting 2,300 trees',
      date: '2024-10-22',
      impact: '50.2 tons CO₂ equivalent',
      achieved: true
    },
    {
      id: 3,
      title: '100 Community Partners',
      description: 'Built partnerships with 100 local organizations',
      date: '2024-11-30',
      impact: '100 active partnerships',
      achieved: true
    },
    {
      id: 4,
      title: '2000 Pickups Goal',
      description: 'Target to sponsor 2000 waste pickups by year end',
      date: '2024-12-31',
      impact: 'Projected 55 tons waste',
      achieved: false
    }
  ];

  const totalStats = {
    totalWaste: impactData.reduce((sum, data) => sum + data.wasteCollected, 0).toFixed(1),
    totalCO2: impactData.reduce((sum, data) => sum + data.co2Saved, 0).toFixed(1),
    totalPickups: impactData.reduce((sum, data) => sum + data.pickups, 0),
    totalInvestment: impactData.reduce((sum, data) => sum + data.investment, 0)
  };

  const currentMonth = impactData[impactData.length - 1];
  const previousMonth = impactData[impactData.length - 2];
  const wasteGrowth = ((currentMonth.wasteCollected - previousMonth.wasteCollected) / previousMonth.wasteCollected * 100).toFixed(1);
  const pickupGrowth = ((currentMonth.pickups - previousMonth.pickups) / previousMonth.pickups * 100).toFixed(1);

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
              Impact Tracker
            </h1>
            <p className="text-muted-foreground">
              Monitor and analyze your environmental impact metrics
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            
            <Button variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share Impact
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Charts and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Recycle className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-2xl font-bold text-success">{totalStats.totalWaste} tons</p>
                    <p className="text-sm text-muted-foreground">Waste Collected</p>
                    <Badge variant="outline" className="text-success border-success mt-1">
                      +{wasteGrowth}% vs last month
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TreePine className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{totalStats.totalCO2} tons</p>
                    <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                    <p className="text-xs text-green-600 mt-1">≈ {Math.round(parseFloat(totalStats.totalCO2) * 46)} trees planted</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-primary">{totalStats.totalPickups}</p>
                    <p className="text-sm text-muted-foreground">Pickups Sponsored</p>
                    <Badge variant="outline" className="text-primary border-primary mt-1">
                      +{pickupGrowth}% vs last month
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">${totalStats.totalInvestment.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Investment</p>
                    <p className="text-xs text-blue-600 mt-1">${(totalStats.totalInvestment / totalStats.totalPickups).toFixed(0)} per pickup</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="wasteCollected" 
                      stackId="1"
                      stroke="hsl(var(--success))" 
                      fill="hsl(var(--success))"
                      fillOpacity={0.6}
                      name="Waste Collected (tons)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="co2Saved" 
                      stackId="2"
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                      name="CO₂ Saved (tons)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Waste Type Distribution */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Waste Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {wasteTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {wasteTypeData.map((type, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: type.color }}
                      ></div>
                      <span className="text-sm">{type.name} ({type.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" className="text-muted-foreground" />
                      <YAxis dataKey="region" type="category" className="text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="pickups" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Region</th>
                      <th className="text-left p-3">Pickups</th>
                      <th className="text-left p-3">Waste Collected</th>
                      <th className="text-left p-3">CO₂ Saved</th>
                      <th className="text-left p-3">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionData.map((region, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{region.region}</td>
                        <td className="p-3">{region.pickups}</td>
                        <td className="p-3">{region.waste} tons</td>
                        <td className="p-3">{region.co2} tons</td>
                        <td className="p-3">
                          <Badge variant="outline" className={
                            region.waste / region.pickups > 0.08 ? 'text-success border-success' :
                            region.waste / region.pickups > 0.06 ? 'text-warning border-warning' :
                            'text-muted-foreground'
                          }>
                            {(region.waste / region.pickups * 1000).toFixed(0)} kg/pickup
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Milestones and Insights */}
        <div className="space-y-6">
          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div 
                    key={milestone.id} 
                    className={`p-4 rounded-lg border ${
                      milestone.achieved 
                        ? 'border-success bg-success/5' 
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${
                        milestone.achieved ? 'bg-success/20' : 'bg-muted'
                      }`}>
                        <Award className={`h-4 w-4 ${
                          milestone.achieved ? 'text-success' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{milestone.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {milestone.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium">{milestone.impact}</span>
                          <Badge variant="outline" className={
                            milestone.achieved ? 'text-success border-success' : 'text-muted-foreground'
                          }>
                            {milestone.achieved ? 'Achieved' : 'In Progress'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Impact Insights */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Impact Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-blue-700">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p>Waste collection increased by {wasteGrowth}% this month</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Leaf className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p>Your efforts saved {totalStats.totalCO2} tons of CO₂ this year</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p>Industrial region shows highest waste per pickup ratio</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p>On track to reach 2000 pickups goal by year end</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Equivalents */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <TreePine className="h-5 w-5 mr-2" />
                Environmental Equivalents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Trees Planted</span>
                  <span className="font-semibold text-green-700">
                    {Math.round(parseFloat(totalStats.totalCO2) * 46)} trees
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cars Off Road</span>
                  <span className="font-semibold text-green-700">
                    {Math.round(parseFloat(totalStats.totalCO2) * 0.22)} cars/year
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Energy Saved</span>
                  <span className="font-semibold text-green-700">
                    {Math.round(parseFloat(totalStats.totalWaste) * 2.1)} MWh
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Water Saved</span>
                  <span className="font-semibold text-green-700">
                    {Math.round(parseFloat(totalStats.totalWaste) * 850)} liters
                  </span>
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
                <Download className="h-4 w-4 mr-2" />
                Generate Impact Report
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Share className="h-4 w-4 mr-2" />
                Share on Social Media
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                View Impact Map
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NGOImpact;
