import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  Clock,
  CheckCircle,
  Package,
  MapPin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const CollectorEarnings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('this-month');

  if (!user || user.role !== 'collector') {
    return <div>Access denied</div>;
  }

  const earningsData = [
    { month: 'Jul', earnings: 1240, pickups: 28 },
    { month: 'Aug', earnings: 1580, pickups: 35 },
    { month: 'Sep', earnings: 1320, pickups: 31 },
    { month: 'Oct', earnings: 1750, pickups: 42 },
    { month: 'Nov', earnings: 1890, pickups: 45 },
    { month: 'Dec', earnings: 2100, pickups: 48 }
  ];

  const weeklyData = [
    { week: 'Week 1', earnings: 420, pickups: 12 },
    { week: 'Week 2', earnings: 380, pickups: 11 },
    { week: 'Week 3', earnings: 520, pickups: 15 },
    { week: 'Week 4', earnings: 480, pickups: 14 }
  ];

  const recentTransactions = [
    {
      id: 'TXN001',
      date: '2024-12-27',
      time: '2:30 PM',
      customer: 'Sarah Johnson',
      address: '123 Green Street',
      amount: 45,
      status: 'completed',
      wasteTypes: ['Plastic', 'Paper'],
      weight: '15 kg'
    },
    {
      id: 'TXN002',
      date: '2024-12-27',
      time: '11:15 AM',
      customer: 'Mike Chen',
      address: '456 Oak Avenue',
      amount: 32,
      status: 'completed',
      wasteTypes: ['Electronic', 'Metal'],
      weight: '8 kg'
    },
    {
      id: 'TXN003',
      date: '2024-12-26',
      time: '4:45 PM',
      customer: 'Lisa Park',
      address: '789 Pine Road',
      amount: 28,
      status: 'completed',
      wasteTypes: ['Organic', 'Glass'],
      weight: '12 kg'
    },
    {
      id: 'TXN004',
      date: '2024-12-26',
      time: '1:20 PM',
      customer: 'David Wilson',
      address: '321 Maple Drive',
      amount: 65,
      status: 'pending',
      wasteTypes: ['Plastic', 'Paper', 'Glass'],
      weight: '22 kg'
    },
    {
      id: 'TXN005',
      date: '2024-12-25',
      time: '3:10 PM',
      customer: 'Emma Rodriguez',
      address: '654 Cedar Lane',
      amount: 15,
      status: 'completed',
      wasteTypes: ['Paper', 'Cardboard'],
      weight: '10 kg'
    }
  ];

  const summaryStats = {
    totalEarnings: 2100,
    thisMonth: 2100,
    lastMonth: 1890,
    avgPerPickup: 43.75,
    totalPickups: 48,
    pendingPayments: 125,
    completedPickups: 46
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const monthlyGrowth = ((summaryStats.thisMonth - summaryStats.lastMonth) / summaryStats.lastMonth * 100).toFixed(1);

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
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Earnings & Payments
            </h1>
            <p className="text-muted-foreground">
              Track your income and payment history
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Charts and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earnings Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-2xl font-bold text-success">${summaryStats.totalEarnings}</p>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-primary">${summaryStats.avgPerPickup}</p>
                    <p className="text-sm text-muted-foreground">Avg per Pickup</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{summaryStats.totalPickups}</p>
                    <p className="text-sm text-muted-foreground">Total Pickups</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-2xl font-bold text-warning">${summaryStats.pendingPayments}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Earnings Trend</span>
                <Badge variant="outline" className="text-success border-success">
                  +{monthlyGrowth}% vs last month
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
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
                    <Line 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Breakdown - December</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="week" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.status === 'completed' ? 'bg-success/20' : 'bg-warning/20'
                      }`}>
                        {transaction.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <Clock className="h-4 w-4 text-warning" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{transaction.customer}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {transaction.address}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{transaction.date} at {transaction.time}</span>
                          <span>{transaction.wasteTypes.join(', ')}</span>
                          <span>{transaction.weight}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-success">${transaction.amount}</p>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary and Actions */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card className="bg-success/5 border-success/20">
            <CardHeader>
              <CardTitle className="text-success">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>This Month</span>
                  <span className="font-semibold">${summaryStats.thisMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Month</span>
                  <span className="font-semibold">${summaryStats.lastMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span>Growth</span>
                  <span className="font-semibold text-success">+{monthlyGrowth}%</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Pending Payments</span>
                    <span className="font-semibold text-warning">${summaryStats.pendingPayments}</span>
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
              <Button className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                View Payment Details
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download Tax Report
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Payment Schedule
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Update Bank Details
              </Button>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Completion Rate</span>
                  <span className="font-semibold">96%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Rating</span>
                  <span className="font-semibold">4.8/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">On-Time Pickups</span>
                  <span className="font-semibold">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Efficiency Score</span>
                  <span className="font-semibold text-success">Excellent</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-blue-700">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p>Payments are processed weekly on Fridays</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p>Direct deposit takes 1-2 business days</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p>Tax documents available in January</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollectorEarnings;
