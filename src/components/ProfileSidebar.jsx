import { X, User, Package, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfileSidebar({ isOpen, onClose, onOpenCart }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenCart = () => {
    onClose();
    onOpenCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-80 bg-dark-card border-l border-white/10 z-[60] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-serif flex items-center gap-2 text-white">
                <User className="text-primary" size={22} />
                Profile
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-full border border-white/10 hover:border-primary/50 transition-all">
                <X size={18} />
              </button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-2xl border border-primary/30 flex-shrink-0">
                   {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-medium text-white truncate">{user?.user_metadata?.full_name || 'User'}</h3>
                  <p className="text-sm text-gray-400 truncate">{user?.email || user?.phone || 'Guest'}</p>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <Link 
                to="/orders" 
                onClick={onClose}
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <Package className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
                <span className="font-medium text-gray-200">My Orders</span>
              </Link>
              
              <button 
                onClick={handleOpenCart}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors group text-left"
              >
                <ShoppingBag className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
                <span className="font-medium text-gray-200">My Cart</span>
              </button>

              <Link 
                to="/account" 
                onClick={onClose}
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <Settings className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
                <span className="font-medium text-gray-200">Account Settings</span>
              </Link>
            </div>

            {/* Logout Footer */}
            <div className="p-4 border-t border-white/10">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-all active:scale-[0.98]"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
