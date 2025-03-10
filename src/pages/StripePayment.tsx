
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedPage from '@/components/ui/AnimatedPage';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingBag, CreditCard, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

const PaymentForm = ({ clientSecret, orderId, total, onSuccess }: { 
  clientSecret: string; 
  orderId: string;
  total: number;
  onSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }
    
    setIsProcessing(true);
    setCardError(null);
    
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });
      
      if (error) {
        setCardError(error.message || 'An error occurred with your payment');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Update order payment status in Supabase
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'paid',
            status: 'preparing'
          })
          .eq('id', orderId);
          
        if (updateError) {
          console.error('Error updating order status:', updateError);
        } else {
          // Call success callback
          onSuccess();
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setCardError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border rounded-md">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {cardError && (
        <div className="text-sm text-red-500 mt-2">
          {cardError}
        </div>
      )}
      
      <div className="flex justify-between font-medium text-lg">
        <span>Total</span>
        <span>RM {total.toFixed(2)}</span>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay Now
          </>
        )}
      </Button>
    </form>
  );
};

const StripePayment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { orderId, total, customerName } = location.state || {};
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !total) {
      navigate('/');
      return;
    }
    
    // Create payment intent when component mounts
    createPaymentIntent();
  }, [orderId, total]);

  const createPaymentIntent = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call Supabase Edge Function to create a Stripe payment intent
      const { data, error } = await supabase.functions.invoke('create-stripe-payment', {
        body: { orderId, amountMYR: total }
      });
      
      if (error || !data.clientSecret) {
        setError('Failed to initialize payment. Please try again.');
        console.error('Error creating payment intent:', error || data.error);
      } else {
        setClientSecret(data.clientSecret);
      }
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaid(true);
    toast({ title: 'Payment successful!' });
    
    // Redirect to order confirmation after payment is confirmed
    setTimeout(() => {
      navigate('/order-confirmation', { 
        state: { 
          orderId,
          total,
          customerName,
          fromPayment: true
        } 
      });
    }, 2000);
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Initializing payment...</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>

          <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>
          
          {error ? (
            <div className="bg-destructive/10 rounded-lg p-4 mb-6">
              <p className="font-medium text-destructive">{error}</p>
              <Button 
                variant="outline" 
                onClick={createPaymentIntent} 
                className="mt-3"
              >
                Try Again
              </Button>
            </div>
          ) : isPaid ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-6 mb-6 text-center"
            >
              <Check className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h2 className="text-xl font-medium text-green-700 dark:text-green-400 mb-1">Payment Successful!</h2>
              <p className="text-green-600 dark:text-green-500 mb-3">
                Redirecting to order confirmation...
              </p>
            </motion.div>
          ) : (
            <>
              <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
                <h2 className="text-lg font-medium mb-4">Card Payment</h2>
                
                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm 
                      clientSecret={clientSecret} 
                      orderId={orderId}
                      total={total}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                )}
                
                <Separator className="my-4" />
                
                <div className="text-sm text-muted-foreground">
                  <p>Your order will be automatically confirmed once payment is received.</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default StripePayment;
