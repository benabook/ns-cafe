
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import AnimatedPage from '@/components/ui/AnimatedPage';
import { Separator } from '@/components/ui/separator';
import { Copy, AlertCircle, Check, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateLightningInvoice, checkLightningPayment } from '@/services/paymentService';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

type PaymentConfirmationProps = {};

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { orderId, total } = location.state || {};
  
  const [invoice, setInvoice] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
    
    // Generate invoice on page load
    generateInvoice();
  }, [orderId]);

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    
    // Set up payment checking interval if we have an active payment
    if (paymentId && !isPaid) {
      checkInterval = setInterval(checkPayment, 5000); // Check every 5 seconds
    }
    
    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [paymentId, isPaid]);

  const generateInvoice = async () => {
    if (!orderId || !total) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateLightningInvoice(orderId, total);
      
      if (result.success && result.data) {
        setInvoice(result.data.invoice);
        setPaymentId(result.data.payment_id);
        setIsLoading(false);
      } else {
        setError('Failed to generate payment invoice. Please try again.');
      }
    } catch (err) {
      console.error('Error generating invoice:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const checkPayment = async () => {
    if (!paymentId) return;
    
    try {
      const { paid, status } = await checkLightningPayment(paymentId);
      
      if (paid) {
        setIsPaid(true);
        // Redirect to order confirmation after payment is confirmed
        setTimeout(() => {
          navigate('/order-confirmation', { 
            state: location.state 
          });
        }, 2000);
      }
    } catch (err) {
      console.error('Error checking payment:', err);
    }
  };

  const copyInvoice = () => {
    if (!invoice) return;
    
    navigator.clipboard.writeText(invoice)
      .then(() => toast({ title: 'Invoice copied to clipboard' }))
      .catch(err => console.error('Error copying to clipboard:', err));
  };

  if (isLoading && !error) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <p>Generating payment invoice...</p>
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

          <h1 className="text-2xl font-bold mb-6">Pay with Lightning</h1>
          
          {error ? (
            <div className="bg-destructive/10 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={generateInvoice} 
                    disabled={isGenerating}
                    className="mt-3"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
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
                <div className="text-center mb-4">
                  <p className="text-muted-foreground mb-6">
                    Scan the QR code below with your Lightning wallet to pay
                  </p>
                  
                  {invoice && (
                    <div className="bg-white p-4 rounded-lg inline-block mb-6">
                      <QRCodeSVG 
                        value={invoice} 
                        size={220} 
                        bgColor={"#ffffff"} 
                        fgColor={"#000000"} 
                        level={"L"} 
                        includeMargin={false}
                      />
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <p className="font-medium mb-1">Amount due:</p>
                    <p className="text-2xl font-bold">RM {total?.toFixed(2)}</p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={copyInvoice} 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Invoice
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Payment expires in 15 minutes.</p>
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

export default PaymentConfirmation;
