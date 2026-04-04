import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const OrderContext = createContext({});

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Fetch initial orders
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.warn('Supabase fetch orders failed, falling back to localStorage:', error.message);
      const localOrders = JSON.parse(localStorage.getItem('rustorent_orders') || '[]');
      setOrders(localOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const playNotificationSound = () => {
      try {
        const audio = new Audio();
        audio.src = '/images/faaah.mp3';
        audio.volume = 1.0; // Full volume as requested
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Audio playback prevented by browser policy. Interaction is required first.', error);
          });
        }
      } catch (error) {
        console.warn('Audio playback failed', error);
      }
    };

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        const isAdmin = localStorage.getItem('isAdmin') === 'true' && window.location.pathname.startsWith('/admin');
        const currentUser = userRef.current;
        const isMyOrder = currentUser && (payload.new?.user_id === currentUser.id || payload.new?.customer_email === currentUser.email);

        if (payload.eventType === 'INSERT') {
          if (isAdmin) {
            playNotificationSound();
            toast.success(`New order received: #${payload.new.short_id}`, { icon: '🔔' });
          }
          // Only add to local state if we are admin OR the order belongs to us
          if (isAdmin || isMyOrder) {
            // Check if it's already in our state to avoid duplicates from immediate insert response
            setOrders((prev) => {
              const exists = prev.find(o => o.id === payload.new.id);
              if (exists) return prev;
              return [payload.new, ...prev];
            });
          }
        } else if (payload.eventType === 'UPDATE') {
          setOrders((prev) =>
            prev.map((o) => (o.id === payload.new.id ? payload.new : o))
          );
          
          if (isAdmin) {
            toast.success(`Order #${payload.new.short_id} has been updated to: ${payload.new.status}`);
          } else if (isMyOrder) {
            toast.success(`Your order #${payload.new.short_id} is now: ${payload.new.status}`, { icon: '📦' });
          }
        } else if (payload.eventType === 'DELETE') {
          setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const createOrder = async (orderData) => {
    try {
      // Create a 6 digit short ID for UI
      const short_id = Math.floor(100000 + Math.random() * 900000).toString();
      const newOrder = {
          id: crypto.randomUUID(),
          short_id,
          items: orderData.items,
          total: orderData.total,
          address: orderData.address || {},
          payment_method: orderData.paymentMethod || 'cod',
          status: 'Placed',
          user_id: orderData.userId || null,
          customer_email: orderData.customerEmail || null,
          created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .select()
        .single();
        
      if (error) {
        console.warn('Supabase insert failed, using localStorage');
        // Fallback
        const localOrders = JSON.parse(localStorage.getItem('rustorent_orders') || '[]');
        localOrders.unshift(newOrder);
        localStorage.setItem('rustorent_orders', JSON.stringify(localOrders));
        setOrders(prev => [newOrder, ...prev]);
        toast.success('Order Placed (Local Mode)! Check My Orders to track it.', { duration: 4000 });
        return newOrder;
      }
      
      toast.success('Order Placed! Check My Orders to track it.', { duration: 4000 });
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
      throw error;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.warn('Supabase update failed, using localStorage');
        // Fallback
        const localOrders = JSON.parse(localStorage.getItem('rustorent_orders') || '[]');
        const updatedOrders = localOrders.map(o => o.id === id ? { ...o, status } : o);
        localStorage.setItem('rustorent_orders', JSON.stringify(updatedOrders));
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        return;
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };
  
  const cancelOrder = async (id) => {
    await updateOrderStatus(id, 'Cancelled');
  };

  return (
    <OrderContext.Provider value={{ orders, loading, createOrder, updateOrderStatus, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  return useContext(OrderContext);
};
