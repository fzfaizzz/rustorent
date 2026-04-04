import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar({ isOpen, onClose, cartItems, onRemove, onIncrease, onDecrease }) {
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);

  const handleProceedToCheckout = () => {
    onClose();
    navigate('/checkout');
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
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-dark-card border-l border-white/10 z-[60] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-serif flex items-center gap-2">
                <ShoppingBag className="text-primary" size={22} />
                Your Cart
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-full border border-white/10 hover:border-primary/50 transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    layout
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 bg-dark p-3 rounded-xl border border-white/5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.name}</h4>
                      <p className="text-primary text-sm font-semibold mt-0.5">₹{item.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => onDecrease(item)} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => onIncrease(item)} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button onClick={() => onRemove(item)} className="text-gray-500 hover:text-red-500 transition-colors p-1.5">
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-dark/50">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center mb-5 pt-3 border-t border-white/5">
                  <span className="font-medium text-lg">Total</span>
                  <span className="text-primary font-bold text-2xl">₹{subtotal}</span>
                </div>
                <button onClick={handleProceedToCheckout} className="btn-primary w-full py-4 text-lg font-bold">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
