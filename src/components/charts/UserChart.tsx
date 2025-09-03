import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface UserChartProps {
  type: 'ecoScore' | 'greenCoins' | 'wasteGenerated' | 'impact' | 'monthlyActivity' | 'diyEarnings' | 'ngoImpact' | 'collectorPerformance';
  data?: any[];
  userStats?: any;
}

const UserChart: React.FC<UserChartProps> = ({ type, data, userStats }) => {
  // Sample data for different chart types
  const ecoScoreData = data || [
    { month: 'Jan', score: 65, target: 70 },
    { month: 'Feb', score: 72, target: 75 },
    { month: 'Mar', score: 78, target: 80 },
    { month: 'Apr', score: 85, target: 85 },
    { month: 'May', score: 88, target: 90 },
    { month: 'Jun', score: 92, target: 95 }
  ];

  const greenCoinsData = [
    { month: 'Jan', earned: 120, spent: 80 },
    { month: 'Feb', earned: 150, spent: 100 },
    { month: 'Mar', earned: 180, spent: 120 },
    { month: 'Apr', earned: 220, spent: 150 },
    { month: 'May', earned: 280, spent: 200 },
    { month: 'Jun', earned: 320, spent: 250 }
  ];

  const wasteData = [
    { type: 'Plastic', amount: 45, color: '#3B82F6' },
    { type: 'Paper', amount: 30, color: '#EAB308' },
    { type: 'Metal', amount: 15, color: '#6B7280' },
    { type: 'E-Waste', amount: 8, color: '#8B5CF6' },
    { type: 'Glass', amount: 2, color: '#10B981' }
  ];

  const impactData = [
    { month: 'Jan', co2Saved: 12, treesEquivalent: 2.5 },
    { month: 'Feb', co2Saved: 18, treesEquivalent: 3.8 },
    { month: 'Mar', co2Saved: 25, treesEquivalent: 5.2 },
    { month: 'Apr', co2Saved: 32, treesEquivalent: 6.7 },
    { month: 'May', co2Saved: 38, treesEquivalent: 8.0 },
    { month: 'Jun', co2Saved: 45, treesEquivalent: 9.5 }
  ];

  const activityData = [
    { week: 'Week 1', pickups: 2, recycled: 15 },
    { week: 'Week 2', pickups: 3, recycled: 22 },
    { week: 'Week 3', pickups: 1, recycled: 8 },
    { week: 'Week 4', pickups: 4, recycled: 28 }
  ];

  const diyEarningsData = [
    { month: 'Jan', sales: 1200, products: 3, avgPrice: 400 },
    { month: 'Feb', sales: 1800, products: 5, avgPrice: 360 },
    { month: 'Mar', sales: 2400, products: 6, avgPrice: 400 },
    { month: 'Apr', sales: 3200, products: 8, avgPrice: 400 },
    { month: 'May', sales: 2800, products: 7, avgPrice: 400 },
    { month: 'Jun', sales: 3600, products: 9, avgPrice: 400 }
  ];

  const ngoImpactData = [
    { month: 'Jan', programs: 2, participants: 45, wasteReduced: 120 },
    { month: 'Feb', programs: 3, participants: 68, wasteReduced: 180 },
    { month: 'Mar', programs: 4, participants: 92, wasteReduced: 240 },
    { month: 'Apr', programs: 5, participants: 115, wasteReduced: 300 },
    { month: 'May', programs: 6, participants: 138, wasteReduced: 360 },
    { month: 'Jun', programs: 7, participants: 162, wasteReduced: 420 }
  ];

  const collectorPerformanceData = [
    { month: 'Jan', pickups: 15, earnings: 2400, efficiency: 85 },
    { month: 'Feb', pickups: 18, earnings: 2880, efficiency: 88 },
    { month: 'Mar', pickups: 22, earnings: 3520, efficiency: 92 },
    { month: 'Apr', pickups: 25, earnings: 4000, efficiency: 90 },
    { month: 'May', pickups: 28, earnings: 4480, efficiency: 94 },
    { month: 'Jun', pickups: 32, earnings: 5120, efficiency: 96 }
  ];

  switch (type) {
    case 'ecoScore':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={ecoScoreData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value, name) => [value, name === 'score' ? 'Eco Score' : 'Target']} />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#10B981" 
              fill="#10B981" 
              fillOpacity={0.3}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'greenCoins':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={greenCoinsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="earned" fill="#10B981" name="Earned" radius={[4, 4, 0, 0]} />
            <Bar dataKey="spent" fill="#EF4444" name="Spent" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'wasteGenerated':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={wasteData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="amount"
              label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
            >
              {wasteData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} kg`, 'Amount']} />
          </PieChart>
        </ResponsiveContainer>
      );

    case 'impact':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={impactData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'co2Saved' ? `${value} kg CO₂` : `${value} trees`,
                name === 'co2Saved' ? 'CO₂ Saved' : 'Trees Equivalent'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="co2Saved" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="treesEquivalent" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'monthlyActivity':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="pickups" fill="#3B82F6" name="Pickups" radius={[4, 4, 0, 0]} />
            <Bar dataKey="recycled" fill="#10B981" name="Recycled (kg)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'diyEarnings':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={diyEarningsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value, name) => [
              name === 'sales' ? `₹${value}` : value,
              name === 'sales' ? 'Sales' : name === 'products' ? 'Products Sold' : 'Avg Price'
            ]} />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#10B981" 
              fill="#10B981" 
              fillOpacity={0.3}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'ngoImpact':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ngoImpactData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value, name) => [
              value,
              name === 'programs' ? 'Active Programs' : 
              name === 'participants' ? 'Participants' : 'Waste Reduced (kg)'
            ]} />
            <Line 
              type="monotone" 
              dataKey="programs" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="participants" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="wasteReduced" 
              stroke="#EAB308" 
              strokeWidth={3}
              dot={{ fill: '#EAB308', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'collectorPerformance':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={collectorPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value, name) => [
              name === 'earnings' ? `₹${value}` : name === 'efficiency' ? `${value}%` : value,
              name === 'pickups' ? 'Pickups' : name === 'earnings' ? 'Earnings' : 'Efficiency'
            ]} />
            <Bar dataKey="pickups" fill="#3B82F6" name="Pickups" radius={[4, 4, 0, 0]} />
            <Bar dataKey="efficiency" fill="#10B981" name="Efficiency %" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    default:
      return <div>Chart type not supported</div>;
  }
};

export default UserChart;
