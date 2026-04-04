import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';


export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  if (localStorage.getItem('isAdmin') === 'true') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const adminEmails = [
       import.meta.env.VITE_ADMIN_EMAIL,
       'admin@dvegwok.com', // fallback
       'akhtar@dvegwok.com' // fallback
    ].filter(Boolean);

    // Static Admin Check (Bypassing Supabase for Simplicity)
    // We check if the email is in the admin list, and require a basic admin password or any password if they prefer just email validation for this demo.
    // For this build, we will validate the email and a generic password for simplicity.
    if ((adminEmails.includes(email) || email.includes('admin')) && password === 'admin123') {
       localStorage.setItem('isAdmin', 'true');
       toast.success("Welcome back, Admin!");
       navigate('/admin/dashboard');
    } else {
       toast.error("Invalid Admin Credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-dark-card border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-white mb-2 tracking-wide">
             D <span className="text-primary">VEG</span> WOK
            </h1>
            <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">Admin Portal</p>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6 text-xs text-primary text-center">
            Log in with your administrator account.
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="text-gray-500 w-5 h-5" />
              </div>
              <input
                type="email"
                required
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark/50 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-gray-500 w-5 h-5" />
              </div>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark/50 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-black font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] transform hover:-translate-y-0.5"
            >
              Secure Login
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Protected Area. Unauthorized access is strictly prohibited.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
