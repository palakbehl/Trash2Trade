// Payment related types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'processing';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export interface PaymentDetails {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface Transaction extends Omit<PaymentDetails, 'method' | 'metadata'> {
  type: 'payment' | 'refund' | 'payout' | 'fee' | 'reward';
  metadata: {
    relatedId?: string;
    platformFee?: number;
    collectorAmount?: number;
    userAmount?: number;
    paymentMethod?: PaymentMethod;
    [key: string]: any;
  };
}

// Component props
export interface PaymentProcessingProps {
  userId: string;
  amount: number;
  description: string;
  onSuccess?: (transaction: Transaction) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export interface TransactionStatusProps {
  status: PaymentStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface TransactionHistoryProps {
  userId: string;
  userRole: 'user' | 'collector' | 'admin';
  limit?: number;
  className?: string;
}

// Error boundary
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// API response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  success: boolean;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'collector' | 'admin';
  balance: number;
  greenCoins: number;
  createdAt: Date;
  updatedAt: Date;
  // Add other user fields as needed
}
