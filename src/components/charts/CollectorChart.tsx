import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface CollectorChartProps {
  type: 'earnings' | 'pickups' | 'efficiency' | 'wasteTypes';
  data?: any[];
  collectorStats?: any;
}

const CollectorChart: React.FC<CollectorChartProps> = ({ type, data, collectorStats }) => {
  // Sample data for different chart types
  const earningsData = data || [
    { month: 'Jan', earnings: 850, pickups: 12 },
    { month: 'Feb', earnings: 1200, pickups: 18 },
    { month: 'Mar', earnings: 980, pickups: 15 },
    { month: 'Apr', earnings: 1450, pickups: 22 },
    { month: 'May', earnings: 1680, pickups: 28 },
    { month: 'Jun', earnings: 1920, pickups: 32 }
  ];

  const wasteTypesData = [
    { name: 'Plastic', value: 35, color: '#3B82F6' },
    { name: 'Paper', value: 25, color: '#EAB308' },
    { name: 'Metal', value: 20, color: '#6B7280' },
    { name: 'E-Waste', value: 15, color: '#8B5CF6' },
    { name: 'Glass', value: 5, color: '#10B981' }
  ];

  const efficiencyData = [
    { week: 'Week 1', efficiency: 8.2, target: 10 },
    { week: 'Week 2', efficiency: 9.1, target: 10 },
    { week: 'Week 3', efficiency: 10.5, target: 10 },
    { week: 'Week 4', efficiency: 11.2, target: 10 }
  ];

  switch (type) {
    case 'earnings':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'earnings' ? `₹${value}` : value,
                name === 'earnings' ? 'Earnings' : 'Pickups'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'pickups':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="pickups" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'efficiency':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={efficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} kg/pickup`, 'Efficiency']} />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#F59E0B" 
              strokeWidth={3}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#EF4444" 
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'wasteTypes':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={wasteTypesData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {wasteTypesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return <div>Chart type not supported</div>;
  }
};

export default CollectorChart;
