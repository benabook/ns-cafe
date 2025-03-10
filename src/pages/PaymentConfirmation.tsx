
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedPage from '@/components/ui/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, Clock, Copy, QrCode, RefreshCw, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LightningInvoice {
  invoice: string;
  paymentId: string;
  amount: number;
  orderId: string;
  expiresAt: string;
}

const PaymentConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total, customerName } = location.state || {};
  
  const [invoice, setInvoice] = useState<LightningInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Redirect if no order data
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  // Fetch Lightning invoice
  useEffect(() => {
    const createInvoice = async () => {
      try {
        setLoading(true);
        
        // Call our edge function to create a Lightning invoice
        const { data, error } = await supabase.functions.invoke('create-lightning-invoice', {
          body: { orderId, amount: total },
        });
        
        if (error) {
          console.error('Error creating Lightning invoice:', error);
          setError('Failed to create Lightning invoice');
          return;
        }
        
        setInvoice(data);
      } catch (err) {
        console.error('Error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (orderId && total) {
      createInvoice();
    }
  }, [orderId, total]);

  const copyToClipboard = () => {
    if (invoice?.invoice) {
      navigator.clipboard.writeText(invoice.invoice)
        .then(() => {
          setCopied(true);
          toast.success('Invoice copied to clipboard');
          setTimeout(() => setCopied(false), 3000);
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          toast.error('Failed to copy invoice');
        });
    }
  };

  const refreshInvoice = async () => {
    if (orderId && total) {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.functions.invoke('create-lightning-invoice', {
          body: { orderId, amount: total },
        });
        
        if (error) {
          console.error('Error refreshing invoice:', error);
          setError('Failed to refresh invoice');
          return;
        }
        
        setInvoice(data);
        toast.success('Invoice refreshed');
      } catch (err) {
        console.error('Error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!orderId) {
    return null;
  }

  // Format the invoice for display (show first and last few characters)
  const formatInvoice = (invoice: string) => {
    if (invoice.length <= 30) return invoice;
    return `${invoice.substring(0, 15)}...${invoice.substring(invoice.length - 15)}`;
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Lightning Payment</h1>
          
          <Card className="p-6 mb-6">
            {loading ? (
              <div className="flex flex-col items-center py-8">
                <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
                <p>Creating Lightning invoice...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={refreshInvoice}>Try Again</Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-lg font-medium">Pay with Bitcoin Lightning</p>
                  <p className="text-sm text-muted-foreground">
                    Amount: RM {total?.toFixed(2)}
                  </p>
                </div>
                
                <div className="flex justify-center mb-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <QrCode className="h-48 w-48 mx-auto" />
                    <p className="text-center text-sm mt-2 text-muted-foreground">
                      Scan with Lightning wallet
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Invoice:</p>
                  <div className="flex items-center">
                    <div className="bg-muted p-3 rounded-l-md border-r-0 flex-1 overflow-hidden text-sm font-mono">
                      {invoice?.invoice ? formatInvoice(invoice.invoice) : 'No invoice available'}
                    </div>
                    <Button 
                      variant="outline" 
                      className="rounded-l-none"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span>{orderId.slice(0, 8)}</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between text-sm mb-6">
                  <span className="text-muted-foreground">Expires in:</span>
                  <span>15 minutes</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={refreshInvoice}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Invoice
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => navigate('/order-confirmation', { 
                      state: { 
                        orderId, 
                        pickupTime: 15, // Default pickup time
                        total,
                        customerName
                      } 
                    })}
                  >
                    I've Completed Payment
                  </Button>
                </div>
              </>
            )}
          </Card>
          
          <div className="text-center">
            <Button 
              variant="link"
              onClick={() => navigate('/')}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Return to Menu
            </Button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default PaymentConfirmation;
