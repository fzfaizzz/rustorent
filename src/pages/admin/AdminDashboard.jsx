import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, ShoppingBag, Clock, TrendingUp, ChevronRight, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard({ orders = [] }) {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('Today'); // 'Today', 'Yesterday', 'This Week', 'This Month', 'All Time', 'Custom'
  const [customDate, setCustomDate] = useState('');

  const filteredOrders = useMemo(() => {
    if (dateFilter === 'All Time') return orders;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return orders.filter(o => {
      const orderDate = new Date(o.created_at || o.date);
      orderDate.setHours(0, 0, 0, 0);
      
      if (dateFilter === 'Today') return orderDate.getTime() === today.getTime();
      if (dateFilter === 'Yesterday') return orderDate.getTime() === yesterday.getTime();
      if (dateFilter === 'This Week') return orderDate >= startOfWeek;
      if (dateFilter === 'This Month') return orderDate >= startOfMonth;
      if (dateFilter === 'Custom' && customDate) {
         const customD = new Date(customDate);
         customD.setHours(0,0,0,0);
         return orderDate.getTime() === customD.getTime();
      }
      return true;
    });
  }, [orders, dateFilter, customDate]);

  const stats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((acc, o) => acc + o.total, 0);
    const totalOrders = filteredOrders.length;
    const activeOrders = filteredOrders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0;

    return [
      { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <IndianRupee size={20} />, trend: '+12.5%', color: 'emerald' },
      { label: 'Total Orders', value: totalOrders, icon: <ShoppingBag size={20} />, trend: '+8.2%', color: 'blue' },
      { label: 'Active Orders', value: activeOrders, icon: <Activity size={20} />, trend: 'Live', color: 'orange' },
      { label: 'Avg. Order', value: `₹${avgOrderValue}`, icon: <TrendingUp size={20} />, trend: '+4.1%', color: 'purple' },
    ];
  }, [orders]);

  const topProducts = useMemo(() => {
    const counts = {};
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      });
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [filteredOrders]);

  const revenueByDay = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Mocking for visual placeholder
    return days.map(day => ({
      day,
      revenue: Math.floor(Math.random() * 5000) + 2000
    }));
  }, []);

  return (
    <div className="space-y-6 md:space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-1">Dashboard</h2>
          <p className="text-gray-400 text-sm md:text-base">Real-time performance overview of D VEG WOK.</p>
        </div>
        
        {/* Date Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-black/50 border border-white/10 text-white rounded-lg py-2 px-4 focus:outline-none focus:border-primary text-sm font-medium"
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
              className="bg-black/50 border border-white/10 text-white rounded-lg py-2 pl-3 pr-4 focus:outline-none focus:border-primary text-sm [color-scheme:dark]"
            />
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-dark-card border border-white/5 p-5 md:p-6 rounded-3xl relative overflow-hidden group"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-all`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500 border border-${stat.color}-500/20`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-gray-500 bg-black/50 px-2 py-1 rounded-full border border-white/5 uppercase tracking-widest">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Revenue Trend Chart (Simple Bar Visualization) */}
        <div className="lg:col-span-2 bg-dark-card border border-white/5 rounded-3xl p-6 md:p-8">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-serif text-white">Revenue Trends</h3>
             <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" /> Last 7 Days
             </span>
           </div>
           <div className="h-64 flex items-end justify-between gap-3 md:gap-4 px-2">
             {revenueByDay.map((data, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-3 group px-1">
                 <div className="w-full relative">
                   <motion.div 
                     initial={{ height: 0 }}
                     animate={{ height: `${(data.revenue / 7000) * 100}%` }}
                     className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-xl transition-all relative cursor-pointer"
                   >
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl z-10">
                       ₹{data.revenue}
                     </div>
                   </motion.div>
                 </div>
                 <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">{data.day}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Top Selling Products List */}
        <div className="bg-dark-card border border-white/5 rounded-3xl p-6 md:p-8">
          <h3 className="text-lg font-serif text-white mb-8">Best Sellers</h3>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all hover:bg-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/20">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-200 font-medium truncate max-w-[140px]">{p.name}</span>
                </div>
                <div className="text-right">
                   <div className="text-sm text-white font-bold">{p.count}</div>
                   <div className="text-[9px] text-gray-500 uppercase tracking-tighter">Orders</div>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <div className="py-20 text-center text-gray-500 italic text-sm">
                No orders processed yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Order Feed */}
      <div className="bg-dark-card border border-white/5 rounded-3xl overflow-hidden">
        <div className="px-6 py-5 md:px-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-ping absolute inset-0" />
              <div className="w-3 h-3 rounded-full bg-green-500 relative" />
            </div>
            <h3 className="text-lg font-serif text-white">Live Orders</h3>
          </div>
          <Link to="/admin/orders" className="text-xs text-primary hover:underline font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all">
            See All Orders <ChevronRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {filteredOrders.slice(0, 5).map((order) => (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={order.id} 
              className="p-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors cursor-pointer group"
              onClick={() => navigate(`/admin/order/${order.short_id || order.id}`)}
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary font-bold text-lg group-hover:border-primary/30 transition-all">
                  #{order.short_id || order.id.slice(0, 6)}
                </div>
                <div>
                  <h4 className="text-white font-medium group-hover:text-primary transition-colors">{order.address?.fullName || 'Guest Customer'}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-3 mt-1 uppercase tracking-tighter">
                    <span className="text-gray-300 font-bold">₹{order.total}</span>
                    <span>{order.items?.length || 0} Items</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-xl ${
                  order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                  order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                  'bg-primary/10 text-primary border-primary/20'
                }`}>
                  {order.status}
                </span>
                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-gray-600 group-hover:text-white group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </motion.div>
          ))}
          {filteredOrders.length === 0 && (
             <div className="p-20 text-center text-gray-600">
                <p className="font-serif italic text-lg opacity-40">No activity detected for {dateFilter}.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
