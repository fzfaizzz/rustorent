import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Phone, Mail, ChevronRight, History, X, ShoppingBag, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminUsers({ orders = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Extract unique users from orders
  const users = useMemo(() => {
    const userMap = new Map();
    orders.forEach(order => {
      const email = order.customer_email || order.address?.email;
      if (!email) return;
      
      if (!userMap.has(email)) {
        userMap.set(email, {
          id: order.user_id || 'guest',
          name: order.address?.fullName || 'Guest',
          email,
          phone: order.address?.phone || 'N/A',
          orderCount: 0,
          totalSpent: 0,
          lastOrder: order.created_at,
          orders: []
        });
      }
      
      const userData = userMap.get(email);
      userData.orderCount += 1;
      userData.totalSpent += order.total;
      userData.orders.push(order);
      if (new Date(order.created_at) > new Date(userData.lastOrder)) {
        userData.lastOrder = order.created_at;
      }
    });
    return Array.from(userMap.values());
  }, [orders]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-serif text-white mb-1">Customer Directory</h2>
           <p className="text-gray-500 text-sm">Manage and view order history for all your customers.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-card border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={user.email}
            className="bg-dark-card border border-white/5 rounded-2xl p-5 hover:border-primary/30 transition-all group cursor-pointer"
            onClick={() => setSelectedUser(user)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 text-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-medium group-hover:text-primary transition-colors">{user.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5"><Mail size={12} /> {user.email}</p>
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-white transition-colors">
                <History size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-4">
               <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Orders</p>
                  <p className="text-white font-bold">{user.orderCount}</p>
               </div>
               <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Spent</p>
                  <p className="text-primary font-bold">₹{user.totalSpent.toLocaleString()}</p>
               </div>
            </div>

            <div className="flex items-center justify-between text-xs">
               <span className="text-gray-500 flex items-center gap-1.5"><Phone size={12} /> {user.phone}</span>
               <span className="text-primary flex items-center gap-1 font-medium">View History <ArrowRight size={12} /></span>
            </div>
          </motion.div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500 bg-dark-card border border-dashed border-white/10 rounded-3xl">
             <User size={48} className="mx-auto mb-4 opacity-10" />
             <p className="font-serif italic text-lg">No customers found matching your search.</p>
          </div>
        )}
      </div>

      {/* Slide-over User History */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-dark-card border-l border-white/10 z-[60] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                      {selectedUser.name.charAt(0)}
                   </div>
                   <div>
                      <h3 className="text-white font-medium">{selectedUser.name}</h3>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{selectedUser.email}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 <div>
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Order History</h4>
                    <div className="space-y-4">
                       {selectedUser.orders.map(order => (
                          <div 
                            key={order.id}
                            onClick={() => { setSelectedUser(null); navigate(`/admin/order/${order.short_id || order.id}`); }}
                            className="bg-black/40 border border-white/5 rounded-2xl p-4 hover:border-primary/30 transition-all cursor-pointer group"
                          >
                             <div className="flex items-center justify-between mb-3">
                                <span className="text-white font-bold text-sm">#{order.short_id || order.id.slice(0, 6)}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                                  order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                  'bg-primary/10 text-primary border-primary/20'
                                }`}>
                                  {order.status}
                                </span>
                             </div>
                             <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                                <span className="text-sm text-white font-bold flex items-center gap-1 group-hover:text-primary transition-colors">
                                   ₹{order.total} <ChevronRight size={14} />
                                </span>
                             </div>
                             <div className="mt-2 text-[10px] text-gray-600 truncate">
                                {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="p-6 bg-white/5 border-t border-white/5">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 font-medium">Lifetime Value</span>
                    <span className="text-lg text-primary font-bold">₹{selectedUser.totalSpent.toLocaleString()}</span>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
