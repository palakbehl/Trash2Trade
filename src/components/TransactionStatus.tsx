import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PaymentStatus } from '@/types';

interface TransactionStatusProps {
  status: PaymentStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status,
  showLabel = true,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const statusConfig = {
    pending: {
      icon: <Clock className={`${sizeClasses[size]} text-amber-500`} aria-hidden="true" />,
      label: 'Pending',
      color: 'bg-amber-100 text-amber-800',
      ariaLabel: 'Payment pending',
    },
    completed: {
      icon: <CheckCircle className={`${sizeClasses[size]} text-green-500`} aria-hidden="true" />,
      label: 'Completed',
      color: 'bg-green-100 text-green-800',
      ariaLabel: 'Payment completed',
    },
    failed: {
      icon: <XCircle className={`${sizeClasses[size]} text-red-500`} aria-hidden="true" />,
      label: 'Failed',
      color: 'bg-red-100 text-red-800',
      ariaLabel: 'Payment failed',
    },
    processing: {
      icon: <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} aria-hidden="true" />,
      label: 'Processing',
      color: 'bg-blue-100 text-blue-800',
      ariaLabel: 'Payment processing',
    },
    refunded: {
      icon: <AlertTriangle className={`${sizeClasses[size]} text-purple-500`} aria-hidden="true" />,
      label: 'Refunded',
      color: 'bg-purple-100 text-purple-800',
      ariaLabel: 'Payment refunded',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const statusAriaLabel = ariaLabel || config.ariaLabel;

  return (
    <div 
      className={`inline-flex items-center space-x-1.5 ${className}`}
      role="status"
      aria-label={statusAriaLabel}
    >
      <span aria-hidden="true">{config.icon}</span>
      {showLabel && (
        <Badge 
          className={config.color} 
          variant="outline"
          aria-hidden={!showLabel}
        >
          {config.label}
        </Badge>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const MemoizedTransactionStatus = React.memo(TransactionStatus);
