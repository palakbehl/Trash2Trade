import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Loader2, CreditCard, ArrowUpDown } from 'lucide-react';
import { dataStore } from '@/lib/dynamicDataStore';
import { Transaction, PaymentMethod } from '@/types';
import { ErrorBoundary } from './ErrorBoundary';
import { TransactionStatus } from './TransactionStatus';

interface PaymentProcessingProps {
  userId: string;
  amount: number;
  description: string;
  onSuccess?: (transaction: Transaction) => void;
  onError?: (error: Error) => void;
  className?: string;
}

const paymentMethods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { 
    value: 'upi', 
    label: 'UPI',
    icon: <CreditCard className="h-4 w-4 mr-2" />
  },
  { 
    value: 'card', 
    label: 'Credit/Debit Card',
    icon: <CreditCard className="h-4 w-4 mr-2" />
  },
  { 
    value: 'netbanking', 
    label: 'Net Banking',
    icon: <ArrowUpDown className="h-4 w-4 mr-2" />
  },
  { 
    value: 'wallet', 
    label: 'Wallet (Paytm, PhonePe, etc.)',
    icon: <CreditCard className="h-4 w-4 mr-2" />
  },
];

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({
  userId,
  amount,
  description,
  onSuccess,
  onError,
  className = '',
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('' as PaymentMethod);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  // Reset form when props change
  useEffect(() => {
    resetForm();
  }, [userId, amount, description]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setError('');

    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Process payment through data store
      const paymentResult = dataStore.processPayment({
        userId,
        amount,
        description,
        paymentMethod,
        metadata: {}
      });

      if (paymentResult.success) {
        setTransaction(paymentResult.transaction);
        setPaymentStatus('success');
        if (onSuccess) onSuccess(paymentResult.transaction);
      } else {
        throw new Error(paymentResult.error || 'Payment processing failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment';
      setPaymentStatus('error');
      setError(errorMessage);
      if (onError) onError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setPaymentMethod('' as PaymentMethod);
    setPaymentStatus('idle');
    setError('');
    setTransaction(null);
  };

  // Success state
  if (paymentStatus === 'success' && transaction) {
    return (
      <div 
        className={`text-center p-6 bg-white rounded-lg border border-green-200 ${className}`}
        role="alert"
        aria-live="polite"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">Payment Successful</h3>
        <p className="mt-2 text-sm text-gray-500">
          Your payment of ₹{amount.toLocaleString()} has been processed successfully.
        </p>
        <div className="mt-6">
          <Button onClick={resetForm}>
            Make Another Payment
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  if (paymentStatus === 'error') {
    return (
      <div 
        className={`text-center p-6 bg-white rounded-lg border border-red-200 ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">Payment Failed</h3>
        <p className="mt-2 text-sm text-gray-500">
          {error || 'There was an error processing your payment.'}
        </p>
        <div className="mt-6 space-x-3">
          <Button variant="outline" onClick={resetForm}>
            Try Again
          </Button>
          <Button asChild>
            <a href="/support">Contact Support</a>
          </Button>
        </div>
      </div>
    );
  }

  // Processing state
  if (paymentStatus === 'processing') {
    return (
      <div 
        className={`text-center p-8 ${className}`}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Processing Payment</h3>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we process your payment. Do not refresh or close this page.
        </p>
      </div>
    );
  }

  // Payment form
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          An error occurred while loading the payment form. Please try again.
        </div>
      }
    >
      <Card className={className}>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Complete your payment securely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <Input
                  id="amount"
                  type="text"
                  value={amount.toLocaleString()}
                  readOnly
                  className="pl-7 font-medium text-lg"
                  aria-label={`Amount: ₹${amount.toLocaleString()}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                readOnly
                aria-label={`Payment for: ${description}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select 
                value={paymentMethod}
                onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
                disabled={isProcessing}
              >
                <SelectTrigger id="payment-method" aria-label="Select payment method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem 
                      key={method.value} 
                      value={method.value}
                      className="flex items-center"
                    >
                      <span className="flex items-center">
                        {method.icon}
                        {method.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div 
                className="p-3 text-sm text-red-700 bg-red-50 rounded-md"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button 
                type="submit"
                className="w-full"
                disabled={isProcessing || !paymentMethod}
                aria-busy={isProcessing}
                aria-disabled={isProcessing || !paymentMethod}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${amount.toLocaleString()}`
                )}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              <p>Your payment is secure and encrypted</p>
              <p className="mt-1">By continuing, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a></p>
            </div>
          </form>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default PaymentProcessing;
