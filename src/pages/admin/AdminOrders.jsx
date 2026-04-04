import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, CheckCircle2, XCircle, Clock, ChevronDown, Truck, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrders({ orders, updateOrderAdminStatus, hideHeader = false }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Today'); // 'Today', 'Yesterday', 'This Week', 'This Month', 'All Time', 'Custom'
  const [customDate, setCustomDate] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesSearch = (o.short_id || o.id).includes(searchTerm);
    
    let matchesDate = true;
    if (dateFilter !== 'All Time') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const orderDate = new Date(o.created_at || o.date);
      orderDate.setHours(0, 0, 0, 0);
      
      if (dateFilter === 'Today') {
        matchesDate = orderDate.getTime() === today.getTime();
      } else if (dateFilter === 'Yesterday') {
        matchesDate = orderDate.getTime() === yesterday.getTime();
      } else if (dateFilter === 'This Week') {
        matchesDate = orderDate >= startOfWeek;
      } else if (dateFilter === 'This Month') {
        matchesDate = orderDate >= startOfMonth;
      } else if (dateFilter === 'Custom') {
        if (!customDate) matchesDate = true;
        else {
          const customD = new Date(customDate);
          customD.setHours(0,0,0,0);
          matchesDate = orderDate.getTime() === customD.getTime();
        }
      }
    }
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  const handleUpdateStatus = (id, newStatus) => {
    updateOrderAdminStatus(id, newStatus);
    toast.success(`Order #${id} marked as ${newStatus}`);
    setActiveMenuId(null);
  };

  const getStatusStyle = (status) => {
    if (status === 'Delivered') return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (status === 'Cancelled') return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (['Preparing', 'Out for Delivery'].includes(status)) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-primary/10 text-primary border-primary/20';
  };

  const getStatusIcon = (status) => {
    if (status === 'Delivered') return <CheckCircle2 size={12} />;
    if (status === 'Cancelled') return <XCircle size={12} />;
    if (['Preparing', 'Out for Delivery'].includes(status)) return <Clock size={12} />;
    return <Truck size={12} />;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      {!hideHeader && (
        <div className="mb-2 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-1">Order Management</h2>
          <p className="text-gray-400 text-sm">View and update the status of customer orders.</p>
        </div>
      )}

      <div className="bg-dark-card border border-white/5 rounded-2xl p-4 md:p-6">
        
        {/* Controls */}
        <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search by Order ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-2.5 pl-9 pr-4 focus:outline-none focus:border-primary text-sm"
              />
            </div>
            
            {/* Date Filter */}
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-black/50 border border-white/10 text-white rounded-lg py-2.5 px-4 focus:outline-none focus:border-primary text-sm font-medium h-full"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="All Time">All Time</option>
                <option value="Custom">Custom Date</option>
              </select>

              {dateFilter === 'Custom' && (
                <input 
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="bg-black/50 border border-white/10 text-white rounded-lg py-2.5 px-4 focus:outline-none focus:border-primary text-sm h-full [color-scheme:dark]"
                />
              )}
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {['All', 'Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 md:px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border shrink-0 ${
                  statusFilter === status 
                    ? 'bg-primary text-black border-primary' 
                    : 'bg-black/30 text-gray-400 border-white/10 hover:border-white/20'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* ===== DESKTOP TABLE (hidden on mobile) ===== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-gray-500">
                <th className="font-medium px-4 py-3">Order ID</th>
                <th className="font-medium px-4 py-3">Date</th>
                <th className="font-medium px-4 py-3">Time</th>
                <th className="font-medium px-4 py-3">Items</th>
                <th className="font-medium px-4 py-3">Price</th>
                <th className="font-medium px-4 py-3">Status</th>
                <th className="font-medium px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">No orders found matching criteria.</td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr 
                    key={order.id} 
                    onClick={() => navigate(`/admin/order/${order.short_id || order.id}`)}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-4 font-bold text-white">#{order.short_id || order.id}</td>
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {new Date(order.created_at || order.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(order.created_at || order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">
                      <span className="truncate block max-w-[150px]">
                        {order.items.map(i => i.name).join(', ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-white">₹{order.total}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                         {getStatusIcon(order.status)}
                         {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right relative">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setActiveMenuId(activeMenuId === order.id ? null : order.id);
                         }}
                         className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                       >
                         <MoreVertical size={18} />
                       </button>

                       <AnimatePresence>
                         {activeMenuId === order.id && (
                           <>
                             <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                             <motion.div 
                               initial={{ opacity: 0, scale: 0.95, y: -10 }}
                               animate={{ opacity: 1, scale: 1, y: 0 }}
                               exit={{ opacity: 0, scale: 0.95, y: -10 }}
                               className="absolute right-8 top-12 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-20 py-1"
                             >
                                <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-white/5 uppercase tracking-wider">Update Status</div>
                                {['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                                  <button
                                    key={status}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(order.id, status);
                                    }}
                                    disabled={order.status === status}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                      order.status === status 
                                      ? 'text-primary bg-primary/5 cursor-default' 
                                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                  >
                                    {status}
                                  </button>
                                ))}
                             </motion.div>
                           </>
                         )}
                       </AnimatePresence>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE CARDS (hidden on desktop) ===== */}
        <div className="md:hidden space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-3">
              <ShoppingBag size={36} className="opacity-20" />
              <p className="text-sm">No orders found</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/admin/order/${order.short_id || order.id}`)}
                className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3 cursor-pointer hover:border-primary/30 transition-all"
              >
                {/* Top row: ID + Status */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">#{order.short_id || order.id}</span>
                    <span className="text-[10px] text-gray-400 mt-1 leading-tight">
                      <span className="text-white/70 font-medium">{order.address?.fullName}</span> <br />
                      {order.address?.addressLine1}{order.address?.addressLine2 ? `, ${order.address.addressLine2}` : ''}, {order.address?.city} - {order.address?.pincode}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="text-xs text-gray-400">
                  <span className="text-gray-300 font-medium">{order.items.length} Items</span>
                  <span className="mx-1">—</span>
                  <span className="truncate">{order.items.map(i => i.name).join(', ')}</span>
                </div>

                {/* Bottom row: Amount + Date + Action */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div>
                    <p className="text-white font-bold text-sm">₹{order.total}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {new Date(order.created_at || order.date).toLocaleDateString()} • {new Date(order.created_at || order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === order.id ? null : order.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-400 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                    >
                      Update <ChevronDown size={14} />
                    </button>

                    <AnimatePresence>
                      {activeMenuId === order.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 bottom-10 w-44 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-20 py-1"
                          >
                            <div className="px-3 py-1.5 text-[10px] font-medium text-gray-500 border-b border-white/5 uppercase tracking-wider">Update Status</div>
                            {['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                              <button
                                key={status}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(order.id, status);
                                }}
                                disabled={order.status === status}
                                className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                                  order.status === status 
                                  ? 'text-primary bg-primary/5 cursor-default' 
                                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
