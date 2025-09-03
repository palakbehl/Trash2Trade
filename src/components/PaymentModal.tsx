import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Wallet, 
  Smartphone,
  Shield,
  CheckCircle,
  X,
  Lock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [upiId, setUpiId] = useState('');

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentSuccess(true);
    
    // Clear cart after successful payment
    setTimeout(() => {
      clearCart();
      setPaymentSuccess(false);
      onClose();
      toast({
        title: "Payment Successful! 🎉",
        description: "Your order has been placed successfully. You'll receive a confirmation email shortly.",
      });
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (paymentSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Your order has been placed successfully. You'll receive a confirmation email shortly.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-green-600" />
            <span>Secure Checkout</span>
          </DialogTitle>
          <DialogDescription>
            Complete your purchase securely. Your payment information is encrypted and protected.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold">Order Summary</h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.image || '📦'}</span>
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span className="text-lg text-primary">₹{getTotalPrice().toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Method</h3>
            
            {/* Payment Method Selection */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaymentMethod('card')}
                className="flex flex-col items-center p-3 h-auto"
              >
                <CreditCard className="h-4 w-4 mb-1" />
                <span className="text-xs">Card</span>
              </Button>
              <Button
                variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaymentMethod('upi')}
                className="flex flex-col items-center p-3 h-auto"
              >
                <Smartphone className="h-4 w-4 mb-1" />
                <span className="text-xs">UPI</span>
              </Button>
              <Button
                variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaymentMethod('wallet')}
                className="flex flex-col items-center p-3 h-auto"
              >
                <Wallet className="h-4 w-4 mb-1" />
                <span className="text-xs">Wallet</span>
              </Button>
            </div>

            {/* Payment Form */}
            <Card>
              <CardContent className="p-4 space-y-4">
                {paymentMethod === 'card' && (
                  <>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({
                          ...cardDetails,
                          number: formatCardNumber(e.target.value)
                        })}
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({
                            ...cardDetails,
                            expiry: formatExpiry(e.target.value)
                          })}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({
                            ...cardDetails,
                            cvv: e.target.value.replace(/\D/g, '').substring(0, 3)
                          })}
                          maxLength={3}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({
                          ...cardDetails,
                          name: e.target.value
                        })}
                      />
                    </div>
                  </>
                )}

                {paymentMethod === 'upi' && (
                  <div>
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="text-center py-4">
                    <Wallet className="h-12 w-12 text-primary mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
                    <p className="text-2xl font-bold text-primary">₹5,240</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">Sufficient Balance</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-eco hover:shadow-glow"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Pay ₹{getTotalPrice().toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
