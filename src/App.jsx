import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import ReservationPage from './pages/ReservationPage';
import ReviewsPage from './pages/ReviewsPage';
import ContactPage from './pages/ContactPage';
import toast from 'react-hot-toast';
import { useOrders } from './context/OrderContext';
import { useAuth } from './context/AuthContext';

import ProductDetailsPage from './pages/ProductDetailsPage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';

// Components
import ProfileSidebar from './components/ProfileSidebar';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminProducts from './pages/admin/AdminProducts';
import AdminReviews from './pages/admin/AdminReviews';
import AdminReservations from './pages/admin/AdminReservations';
import AdminMessages from './pages/admin/AdminMessages';

function App() {
  const { user } = useAuth();
  const { orders, createOrder, cancelOrder, updateOrderStatus } = useOrders();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (dish) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.name === dish.name);
      if (existing) {
        return prev.map(item =>
          item.name === dish.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
    toast.success(`${dish.name} added to cart!`);
  };

  const removeFromCart = (dish) => {
    setCartItems(prev => prev.filter(item => item.name !== dish.name));
    toast.success('Item removed from cart');
  };

  const increaseQty = (dish) => {
    setCartItems(prev =>
      prev.map(item =>
        item.name === dish.name ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (dish) => {
    setCartItems(prev =>
      prev.map(item =>
        item.name === dish.name && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleCheckout = async (address, paymentMethod) => {
    if (cartItems.length === 0) return;
    
    try {
      await createOrder({
        items: cartItems,
        total: cartItems.reduce((t, i) => t + i.price * i.quantity, 0),
        address,
        paymentMethod,
        userId: user?.id,
        customerEmail: user?.email
      });
      setCartItems([]);
      setIsCartOpen(false);
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white font-sans selection:bg-primary/30">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          className: 'premium-toast',
          style: {
            background: 'rgba(20, 20, 20, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255, 122, 0, 0.2)',
            borderRadius: '16px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            maxWidth: '450px',
          },
          success: {
            iconTheme: { primary: '#ff7a00', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
            style: {
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }
          },
        }}
      />

      {!isAdminRoute && (
        <Navbar
          cartCount={cartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      )}

      {!isAdminRoute && (
        <ProfileSidebar 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {!isAdminRoute && (
        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onRemove={removeFromCart}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
        />
      )}

      <Routes>
        <Route path="/" element={<HomePage addToCart={addToCart} />} />
        <Route path="/menu" element={<MenuPage addToCart={addToCart} />} />
        <Route path="/cart" element={
          <CartPage
            cartItems={cartItems}
            onRemove={removeFromCart}
            onIncrease={increaseQty}
            onDecrease={decreaseQty}
          />
        } />
        <Route path="/checkout" element={
          <CheckoutPage
            cartItems={cartItems}
            onCheckout={handleCheckout}
          />
        } />
        <Route path="/product/:id" element={<ProductDetailsPage addToCart={addToCart} />} />
        <Route path="/orders" element={<OrdersPage orders={orders} cancelOrder={cancelOrder} />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/account" element={<AccountPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard orders={orders} updateOrderAdminStatus={updateOrderStatus} />} />
          <Route path="users" element={<AdminUsers orders={orders} />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="order/:id" element={<AdminOrderDetail />} />
          <Route path="orders" element={<AdminOrders orders={orders} updateOrderAdminStatus={updateOrderStatus} />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
