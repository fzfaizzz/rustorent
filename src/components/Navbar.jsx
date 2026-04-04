import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ cartCount, onOpenCart, onOpenProfile }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Reservation', href: '/reservation' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="fixed w-full z-50 bg-dark/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex justify-between items-center h-20">

          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-serif tracking-widest text-white">
              D <span className="text-primary">VEG</span> WOK
            </h1>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm uppercase tracking-widest font-medium transition-colors ${
                  isActive(link.href) ? 'text-primary' : 'text-gray-300 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <button
                onClick={onOpenProfile}
                className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold font-serif hover:bg-primary/30 transition-colors border border-primary/30 ml-2"
              >
                {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || (user.phone ? '#' : 'U')}
              </button>
            ) : (
              <Link to="/login" className="px-5 py-2 text-sm uppercase tracking-widest font-bold text-dark bg-primary hover:bg-white transition-all transform hover:scale-105 rounded-full border border-primary shadow-[0_0_15px_rgba(255,122,0,0.3)]">
                Login
              </Link>
            )}

            {/* <button
              onClick={onOpenCart}
              className="relative p-2 text-white hover:text-primary transition-colors ml-2"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button> */}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            {user && (
              <button
                onClick={onOpenProfile}
                className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold border border-primary/30"
              >
                 {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || (user.phone ? '#' : 'U')}
              </button>
            )}
            {/* <button
              onClick={onOpenCart}
              className="relative p-2 text-white hover:text-primary transition-colors"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button> */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`block text-base uppercase tracking-widest font-medium transition-colors py-2 ${
                    isActive(link.href) ? 'text-primary' : 'text-gray-300 hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {!user && (
                <div className="pt-4 mt-2 border-t border-light/10 flex gap-3 text-white">
                   <Link 
                     to="/login"
                     onClick={() => setIsMobileMenuOpen(false)}
                     className="flex-1 text-center px-4 py-3 text-sm font-semibold bg-light/10 rounded-xl transition-colors hover:bg-light/20 border border-light/5"
                   >
                     Sign In
                   </Link>
                   <Link 
                     to="/signup"
                     onClick={() => setIsMobileMenuOpen(false)}
                     className="flex-1 text-center px-4 py-3 text-sm font-semibold text-dark bg-primary rounded-xl transition-colors hover:bg-primary/90 shadow-[0_4px_15px_rgba(255,122,0,0.3)]"
                   >
                     Sign Up
                   </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
