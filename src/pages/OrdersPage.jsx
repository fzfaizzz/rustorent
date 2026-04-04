import { motion } from 'framer-motion';
import { Package, CheckCircle2, Truck, Clock, AlertCircle, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Utility to format data
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function OrdersPage({ orders, cancelOrder }) {
  const { user } = useAuth();
  
  // Filter orders manually to only show this user's orders
  const myOrders = orders?.filter(order => 
    (user?.email && order.customer_email === user.email) || 
    (user?.id && order.user_id === user.id)
  ) || [];

  if (!myOrders || myOrders.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-dark">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-gray-500" />
          </div>
          <h1 className="text-3xl font-serif text-white">No Orders Yet</h1>
          <p className="text-gray-400 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Explore our premium vegetarian menu and treat yourself!</p>
          <Link to="/menu" className="btn-primary inline-block mt-4">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-dark">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl font-serif mb-2"
          >
            My <span className="text-primary italic">Orders</span>
          </motion.h1>
          <div className="w-20 h-1 bg-primary mb-4" />
          <p className="text-gray-400">Track, manage, and view your recent orders.</p>
        </div>

        <div className="space-y-8">
          {myOrders.map((order, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={order.id} 
              className="card overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-white/5 p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-lg">Order #{order.short_id || order.id}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                      order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">Placed on {formatDate(order.created_at || order.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-primary">₹{order.total}</p>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Items List */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-serif text-lg mb-4">Items ({order.items.length})</h3>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-dark">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'; }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{item.name}</h4>
                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right font-bold">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking & Actions */}
                <div className="bg-dark-card border border-white/5 p-6 rounded-xl flex flex-col">
                  <h3 className="font-serif text-lg mb-6">Delivery Status</h3>
                  
                  {order.status === 'Cancelled' ? (
                    <div className="flex items-center gap-3 text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <AlertCircle size={24} />
                      <div>
                        <p className="font-bold">Order Cancelled</p>
                        <p className="text-sm text-red-400/80">Refund initiated to original source.</p>
                      </div>
                    </div>
                  ) : order.status === 'Delivered' ? (
                    <div className="flex items-center gap-3 text-green-500 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <CheckCircle2 size={24} />
                      <div>
                        <p className="font-bold">Successfully Delivered</p>
                        <p className="text-sm text-green-500/80">Enjoy your premium meal!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-white/10">
                      
                      {/* Step 1: Placed */}
                      <div className="relative">
                        <div className="absolute -left-[30px] w-6 h-6 bg-primary rounded-full flex items-center justify-center border-4 border-dark-card shadow-[0_0_10px_rgba(255,122,0,0.5)]">
                          <CheckCircle2 size={12} className="text-black" />
                        </div>
                        <p className="font-medium text-white">Order Accepted</p>
                        <p className="text-xs text-gray-500">{formatDate(order.created_at || order.date)}</p>
                      </div>

                      {/* Step 2: Preparing */}
                      <div className="relative">
                        <div className={`absolute -left-[30px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-dark-card ${
                          ['Preparing', 'Out for Delivery'].includes(order.status) ? 'bg-primary shadow-[0_0_10px_rgba(255,122,0,0.5)]' : 'bg-gray-700'
                        }`}>
                          <ChefHat size={12} className={['Preparing', 'Out for Delivery'].includes(order.status) ? 'text-black' : 'text-gray-400'} />
                        </div>
                        <p className={`font-medium ${['Preparing', 'Out for Delivery'].includes(order.status) ? 'text-white' : 'text-gray-500'}`}>Food is Preparing</p>
                        {order.status === 'Preparing' && <p className="text-xs text-primary mt-1 animate-pulse">Chefs are working their magic...</p>}
                      </div>

                      {/* Step 3: Out for Delivery */}
                      <div className="relative">
                        <div className={`absolute -left-[30px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-dark-card ${
                          order.status === 'Out for Delivery' ? 'bg-primary shadow-[0_0_10px_rgba(255,122,0,0.5)]' : 'bg-gray-700'
                        }`}>
                          <Truck size={12} className={order.status === 'Out for Delivery' ? 'text-black' : 'text-gray-400'} />
                        </div>
                        <p className={`font-medium ${order.status === 'Out for Delivery' ? 'text-white' : 'text-gray-500'}`}>Out for Delivery</p>
                        {order.status === 'Out for Delivery' && <p className="text-xs text-primary mt-1 animate-pulse">Arriving in ~15 mins</p>}
                      </div>
                      
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/10 mt-auto">
                    {['Placed', 'Preparing'].includes(order.status) && (
                      <button 
                        onClick={() => cancelOrder(order.id)}
                        className="w-full py-3 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium text-sm"
                      >
                        Cancel Order
                      </button>
                    )}
                    {/* {order.status === 'Delivered' && (
                      <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium text-sm">
                        Download Invoice
                      </button>
                    )} */}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
