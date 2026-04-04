import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, MapPin, Phone, Mail, ShoppingBag, Clock, CheckCircle2, XCircle, Truck, CreditCard, Calendar, Package } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import toast from 'react-hot-toast';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();
  
  const order = orders.find(o => o.id === id || o.short_id === id);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <Package size={48} className="opacity-20 mb-4" />
        <h2 className="text-xl font-serif">Order not found</h2>
        <button onClick={() => navigate('/admin/users')} className="mt-4 text-primary hover:underline">Back to Dashboard</button>
      </div>
    );
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatus(order.id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'Delivered') return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (status === 'Cancelled') return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (['Preparing', 'Out for Delivery'].includes(status)) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-primary/10 text-primary border-primary/20';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-primary/50 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-serif text-white">Order #{order.short_id || order.id.slice(0, 8)}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
           {['Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
             <button
               key={status}
               onClick={() => handleStatusUpdate(status)}
               disabled={order.status === status}
               className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                 order.status === status 
                 ? 'bg-gray-800 text-gray-500 border-white/5 cursor-default' 
                 : status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' :
                   status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' :
                   'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
               }`}
             >
               Mark as {status}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order Items & Payment */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary" />
              <h3 className="font-medium text-white">Order Items</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary font-bold">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">₹{item.price} per item</p>
                      </div>
                    </div>
                    <p className="text-white font-bold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                 <div className="flex justify-between text-gray-400 text-sm">
                   <span>Subtotal</span>
                   <span>₹{order.total}</span>
                 </div>
                 <div className="flex justify-between text-gray-400 text-sm">
                   <span>Delivery Fee</span>
                   <span className="text-green-500 uppercase font-bold text-xs">Free</span>
                 </div>
                 <div className="flex justify-between text-white font-bold text-lg pt-2">
                   <span>Total Amount</span>
                   <span className="text-primary">₹{order.total}</span>
                 </div>
              </div>
            </div>
          </section>

          <section className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden">
             <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
              <CreditCard size={18} className="text-primary" />
              <h3 className="font-medium text-white">Payment Information</h3>
            </div>
            <div className="p-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</p>
                    <p className="text-xs text-gray-500">Full payment is {order.status === 'Delivered' ? 'received' : 'pending'}</p>
                  </div>
               </div>
            </div>
          </section>
        </div>

        {/* Right Column: Customer & Delivery Info */}
        <div className="space-y-6">
          <section className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
              <User size={18} className="text-primary" />
              <h3 className="font-medium text-white">Customer Profile</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 text-lg">
                  {order.address?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold">{order.address?.fullName}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter">ID: {order.user_id || 'GUEST-ORDER'}</p>
                </div>
              </div>
              <div className="space-y-3 pt-2 text-sm">
                 <div className="flex items-center gap-3 text-gray-300">
                    <Mail size={14} className="text-gray-500 shrink-0" />
                    <span className="truncate">{order.customer_email || 'Not provided'}</span>
                 </div>
                 <div className="flex items-center gap-3 text-gray-300">
                    <Phone size={14} className="text-gray-500 shrink-0" />
                    <span>{order.address?.phone}</span>
                 </div>
              </div>
            </div>
          </section>

          <section className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              <h3 className="font-medium text-white">Delivery Address</h3>
            </div>
            <div className="p-6">
              <div className="flex gap-3">
                <MapPin size={18} className="text-gray-500 shrink-0 mt-1" />
                <div className="text-sm text-gray-300 leading-relaxed">
                  <p className="font-bold text-white mb-1">{order.address?.fullName}</p>
                  <p>{order.address?.addressLine1}</p>
                  {order.address?.addressLine2 && <p>{order.address.addressLine2}</p>}
                  <p>{order.address?.city} - {order.address?.pincode}</p>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                      <Truck size={14} /> Standard Delivery
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              <h3 className="font-medium text-white">Timeline</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                <div className="flex items-start gap-4 relative z-10">
                   <div className="w-5 h-5 rounded-full bg-primary border-4 border-dark flex-shrink-0 mt-0.5" />
                   <div>
                     <p className="text-xs font-bold text-white uppercase tracking-wider">Order Placed</p>
                     <p className="text-[10px] text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                   </div>
                </div>
                <div className={`flex items-start gap-4 relative z-10 ${['Preparing', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'opacity-100' : 'opacity-30'}`}>
                   <div className={`w-5 h-5 rounded-full border-4 border-dark flex-shrink-0 mt-0.5 ${['Preparing', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'bg-primary' : 'bg-white/10'}`} />
                   <div>
                     <p className="text-xs font-bold text-white uppercase tracking-wider">Preparation</p>
                     <p className="text-[10px] text-gray-500">{order.status === 'Preparing' ? 'In progress' : ['Out for Delivery', 'Delivered'].includes(order.status) ? 'Completed' : 'Pending'}</p>
                   </div>
                </div>
                <div className={`flex items-start gap-4 relative z-10 ${order.status === 'Delivered' ? 'opacity-100' : 'opacity-30'}`}>
                   <div className={`w-5 h-5 rounded-full border-4 border-dark flex-shrink-0 mt-0.5 ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-white/10'}`} />
                   <div>
                     <p className="text-xs font-bold text-white uppercase tracking-wider">Delivered</p>
                     <p className="text-[10px] text-gray-500">{order.status === 'Delivered' ? 'Package received' : 'Awaiting delivery'}</p>
                   </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
