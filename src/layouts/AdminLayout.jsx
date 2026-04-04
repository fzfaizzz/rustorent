import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Home, Package, Users, Settings, LogOut, ChevronRight, UtensilsCrossed, ShieldCheck, X, Calendar, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Simple static admin check
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    if (!isAdmin) {
       toast.error("Unauthorized Admin Access.");
       navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    toast.success('Admin logged out successfully');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <Home size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <UtensilsCrossed size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <Package size={20} /> },
    { name: 'Reservations', path: '/admin/reservations', icon: <Calendar size={20} /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <ShieldCheck size={20} /> },
  ];

  const currentPageName = navItems.find(i => i.path === location.pathname)?.name || 'Admin';

  return (
    <div className="flex h-screen bg-black overflow-hidden selection:bg-primary/30">
      
      {/* ===== DESKTOP SIDEBAR (hidden on mobile) ===== */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="hidden md:flex w-64 bg-dark-card border-r border-white/5 flex-col z-20 shrink-0"
      >
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <h2 className="text-xl font-serif tracking-widest text-white">
              D <span className="text-primary">VEG</span> WOK
            </h2>
          </Link>
          <div className="mt-2 text-xs font-medium text-gray-500 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-green-500" /> Admin Portal
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-all font-medium text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 h-full w-72 bg-dark-card border-r border-white/5 flex flex-col z-50 md:hidden shadow-2xl"
            >
              <div className="p-5 border-b border-white/5 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileSidebarOpen(false)}>
                  <h2 className="text-lg font-serif tracking-widest text-white">
                    D <span className="text-primary">VEG</span> WOK
                  </h2>
                </Link>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="px-4 py-2">
                <div className="text-xs font-medium text-gray-500 flex items-center gap-1.5 px-1">
                  <ShieldCheck size={14} className="text-green-500" /> Admin Portal
                </div>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm ${
                        isActive 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-3 border-t border-white/5">
                <button 
                  onClick={() => { setMobileSidebarOpen(false); handleLogout(); }}
                  className="flex items-center gap-3 px-4 py-3.5 w-full text-left rounded-xl transition-all font-medium text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="flex-1 flex flex-col h-full bg-[#050505] min-w-0">
        {/* Topbar */}
        <header className="h-14 md:h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-dark-card/50 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors -ml-1"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-serif text-base md:text-lg text-white truncate">
              {currentPageName}
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30 text-sm">
              A
            </div>
            <span className="text-sm font-medium text-gray-300 hidden sm:inline">Admin User</span>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <Outlet />
        </div>

        {/* ===== MOBILE BOTTOM NAV ===== */}
        <div className="md:hidden border-t border-white/5 bg-dark-card/95 backdrop-blur-md flex items-center justify-around px-2 py-1 shrink-0 z-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-all text-[10px] font-medium ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-gray-500'
                }`}
              >
                <span className={`${isActive ? 'scale-110' : ''} transition-transform`}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-all text-[10px] font-medium text-gray-500 hover:text-red-400"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
