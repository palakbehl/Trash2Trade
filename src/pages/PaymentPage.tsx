import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import PaymentProcessing from '@/components/PaymentProcessing';
import TransactionHistory from '@/components/TransactionHistory';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface PaymentPageLocationState {
  amount?: number;
  description?: string;
  redirectTo?: string;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pay');
  
  // Get payment details from location state or use defaults
  const { 
    amount = 0, 
    description = 'Payment',
    redirectTo = '/dashboard'
  } = (location.state as PaymentPageLocationState) || {};

  const handlePaymentSuccess = (transaction: any) => {
    console.log('Payment successful:', transaction);
    // Navigate to success page or back to where they came from
    navigate(redirectTo, { 
      state: { 
        paymentSuccess: true,
        transactionId: transaction.id
      } 
    });
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    // Could show a toast notification here
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p>Please log in to make a payment.</p>
        <Button onClick={() => navigate('/login')} className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-2">Payments</h1>
        <p className="text-muted-foreground mb-8">
          {activeTab === 'pay' ? 'Complete your payment' : 'View your transaction history'}
        </p>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
          defaultValue="pay"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
            <TabsTrigger value="pay">Make Payment</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pay" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Payment</CardTitle>
                <CardDescription>
                  Securely complete your payment using any of the available methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentProcessing
                  userId={user.id}
                  amount={amount}
                  description={description}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <TransactionHistory 
              userId={user.id}
              userRole={user.role}
              className="w-full"
            />
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default PaymentPage;
