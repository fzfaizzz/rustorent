import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage({ cartItems, onRemove, onIncrease, onDecrease }) {
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 pt-8">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-heading text-center mb-2"
        >
          Your <span className="text-primary italic">Cart</span>
        </motion.h1>
        <div className="section-divider mb-12" />

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 space-y-6"
          >
            <ShoppingBag size={64} className="text-gray-700 mx-auto" />
            <p className="text-gray-500 text-lg">Your cart is empty</p>
            <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
              Browse Menu <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <motion.div
                  layout
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-4 md:p-5 flex items-center gap-3 md:gap-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base md:text-lg">{item.name}</h3>
                    <p className="text-primary font-semibold mt-1 text-sm md:text-base">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <button onClick={() => onDecrease(item)} className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="w-6 md:w-8 text-center font-medium text-sm md:text-base">{item.quantity}</span>
                    <button onClick={() => onIncrease(item)} className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-white font-bold text-sm md:text-lg w-16 md:w-20 text-right">₹{item.price * item.quantity}</p>
                  <button onClick={() => onRemove(item)} className="text-gray-500 hover:text-red-500 transition-colors p-1.5 md:p-2">
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="card p-6 md:p-8 max-w-md ml-auto">
              <h3 className="font-serif text-xl mb-6 border-b border-white/10 pb-3">Order Summary</h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal ({cartItems.reduce((t, i) => t + i.quantity, 0)} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span>Included</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10 mb-6">
                <span className="font-medium text-lg">Total</span>
                <span className="text-primary font-bold text-2xl">₹{subtotal}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
