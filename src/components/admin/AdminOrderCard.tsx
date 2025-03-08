
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartItem, Order } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Clock } from 'lucide-react';

type AdminOrderCardProps = {
  order: Order;
  isDragging?: boolean;
};

const AdminOrderCard: React.FC<AdminOrderCardProps> = ({ order, isDragging }) => {
  // Format the timestamp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get appropriate badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'preparing': return 'bg-blue-500 hover:bg-blue-600';
      case 'ready': return 'bg-green-500 hover:bg-green-600';
      case 'completed': return 'bg-gray-500 hover:bg-gray-600';
      case 'cancelled': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card 
      className={`mb-4 ${isDragging ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">Order #{order.id.substring(0, 8)}</h3>
            <p className="text-sm text-muted-foreground">
              {order.createdAt ? formatDate(order.createdAt) : ''}
            </p>
          </div>
          <Badge className={getStatusBadgeColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <div className="mt-2 mb-3">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Customer
          </div>
          <div>{order.customerInfo.name}</div>
          <div className="text-sm">{order.customerInfo.phone}</div>
          {order.customerInfo.discord && (
            <div className="text-sm">{order.customerInfo.discord}</div>
          )}
        </div>

        <div className="mb-3 flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Pickup in {order.pickupTime} minutes</span>
        </div>

        <Separator className="my-3" />
        
        <div>
          <div className="font-medium mb-2">Order Items</div>
          <div className="space-y-2">
            {order.items.map((item: CartItem, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.quantity}x</span> {item.name}
                  {item.specialInstructions && (
                    <div className="text-xs text-muted-foreground ml-5">
                      Note: {item.specialInstructions}
                    </div>
                  )}
                </div>
                <div>RM {(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-3" />
        
        <div className="flex justify-between font-medium">
          <div>Total</div>
          <div>RM {order.total.toFixed(2)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminOrderCard;
