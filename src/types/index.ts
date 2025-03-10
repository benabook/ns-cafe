
export interface Option {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'salads-bowls' | 'mains-sandwiches' | 'add-ons' | 'espresso-drinks' | 'non-coffee' | 'smoothies' | 'cold-pressed';
  ingredients: string[];
  image: string;
  options?: Option[];
  usdPrice?: number; // Added for USD price display
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedOption?: Option;
  specialInstructions?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'delivered';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface CustomerInfo {
  name: string;
  discord: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  date: Date;
  tableNumber?: string;
  customerInfo: CustomerInfo;
  paymentMethod: 'crypto';
  paymentStatus: PaymentStatus;
  pickupTime: number;
  createdAt?: string; // Added for Supabase timestamp
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}
