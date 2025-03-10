import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Index from './pages/Index';
import ItemDetail from './pages/ItemDetail';
import Cart from './pages/Cart';
import OrderConfirmation from './pages/OrderConfirmation';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { Toaster } from '@/components/ui/sonner';
import PaymentConfirmation from './pages/PaymentConfirmation';

function App() {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryClientProvider client={queryClient}>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/item/:id" element={<ItemDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/login" element={<Login />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </Router>
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
