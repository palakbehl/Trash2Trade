import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, RefreshCw, Search } from 'lucide-react';
import { Transaction, PaymentStatus } from '@/types';
import { ErrorBoundary } from './ErrorBoundary';
import { TransactionStatus } from './TransactionStatus';
import { format } from 'date-fns';

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
type SortField = 'date' | 'amount' | 'type' | 'status';
type SortOrder = 'asc' | 'desc';

interface TransactionItem {
  id: string;
  userId: string;
  type: 'payment' | 'refund' | 'payout' | 'fee' | 'reward' | 'pickup' | 'purchase' | 'penalty';
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  date: Date;
  metadata: {
    relatedId?: string;
    collectorId?: string;
    [key: string]: any;
  };
}

interface TransactionHistoryProps {
  userId: string;
  userRole: 'user' | 'collector' | 'admin';
  limit?: number;
  className?: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  userId,
  userRole,
  limit,
  className = '',
}) => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [sortBy, setSortBy] = useState<{ field: SortField; order: SortOrder }>({
    field: 'date',
    order: 'desc',
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions when component mounts or filters change
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Mock implementation - in a real app, this would come from an API or data store
        const mockTransactions: TransactionItem[] = [
          {
            id: 'tx_123',
            userId: userId,
            type: 'payment',
            amount: 1000,
            currency: 'INR',
            status: 'completed',
            description: 'Pickup payment',
            date: new Date(),
            metadata: {
              relatedId: 'pickup_123',
              collectorId: 'collector_123'
            }
          },
          {
            id: 'tx_124',
            userId: userId,
            type: 'reward',
            amount: 100,
            currency: 'INR',
            status: 'completed',
            description: 'Green coins reward',
            date: new Date(Date.now() - 86400000), // Yesterday
            metadata: {}
          }
        ];

        // Filter transactions based on user role
        let filteredTransactions = mockTransactions.filter(tx => {
          if (userRole === 'admin') return true;
          if (tx.userId === userId) return true;
          if (userRole === 'collector' && tx.metadata?.collectorId === userId) return true;
          return false;
        });

        // Apply time filter
        const now = new Date();
        const timeFilter: Record<TimeRange, Date> = {
          '7d': new Date(now.setDate(now.getDate() - 7)),
          '30d': new Date(now.setDate(now.getDate() - 30)),
          '90d': new Date(now.setDate(now.getDate() - 90)),
          '1y': new Date(now.setFullYear(now.getFullYear() - 1)),
          'all': new Date(0),
        };

        const timeFiltered = timeRange === 'all' 
          ? filteredTransactions 
          : filteredTransactions.filter(tx => new Date(tx.date) >= timeFilter[timeRange]);

        // Apply search
        const searched = searchQuery
          ? timeFiltered.filter(tx => 
              tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tx.status.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : timeFiltered;

        // Sort results
        const sorted = [...searched].sort((a, b) => {
          let comparison = 0;
          
          switch (sortBy.field) {
            case 'date':
              comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
              break;
            case 'amount':
              comparison = Math.abs(a.amount) - Math.abs(b.amount);
              break;
            case 'type':
              comparison = a.type.localeCompare(b.type);
              break;
            case 'status':
              comparison = a.status.localeCompare(b.status);
              break;
          }
          
          return sortBy.order === 'asc' ? comparison : -comparison;
        });

        // Apply limit if specified
        const limited = limit ? sorted.slice(0, limit) : sorted;

        setTransactions(limited);
      } catch (err) {
        console.error('Error loading transactions:', err);
        setError('Failed to load transactions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, userRole, timeRange, searchQuery, sortBy, limit]);

  const handleSort = (field: SortField) => {
    setSortBy(prev => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc',
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };

  const getTransactionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'payment': 'Payment',
      'refund': 'Refund',
      'payout': 'Payout',
      'fee': 'Fee',
      'reward': 'Reward',
      'pickup': 'Pickup',
      'purchase': 'Purchase',
      'penalty': 'Penalty',
    };
    
    return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleExport = () => {
    // In a real app, this would generate a CSV or PDF
    console.log('Exporting transactions:', transactions);
    alert('Export functionality will be implemented here');
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setTimeRange('30d');
    setSortBy({ field: 'date', order: 'desc' });
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading transactions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
        <p>{error}</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Card className={className}>
        <CardHeader>
          <div className="flex flex-col space-y-1.5">
            <CardTitle>Transaction History</CardTitle>
            <p className="text-sm text-muted-foreground">
              {limit ? 'Recent transactions' : 'All transactions'}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                className="pl-9 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search transactions"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <Select 
              value={timeRange}
              onValueChange={(value: TimeRange) => setTimeRange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleExport}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Export</span>
              </Button>
              
              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{tx.description}</div>
                        <div className="text-xs text-gray-500">ID: {tx.id}</div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {tx.amount >= 0 ? '' : '-'}{formatCurrency(Math.abs(tx.amount))}
                      </TableCell>
                      <TableCell>
                        {getTransactionTypeLabel(tx.type)}
                      </TableCell>
                      <TableCell>
                        <TransactionStatus status={tx.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {!limit && transactions.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              Showing {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default React.memo(TransactionHistory);
