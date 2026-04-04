import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, ArrowLeft, KeyRound, MapPin, Trash2, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword, updateProfile, user, deleteAddress } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const savedAddresses = user?.user_metadata?.addresses || [];
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4 bg-dark text-center">
        <h2 className="text-2xl font-serif text-white mb-4">You need to be logged in</h2>
        <Link to="/login" className="bg-primary px-8 py-3 rounded-full text-dark font-bold">Login</Link>
      </div>
    );
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }
    setIsUpdatingProfile(true);
    try {
      await updateProfile(fullName);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 bg-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/" 
            className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-primary/50 transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-serif text-white uppercase tracking-wider">Account Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-light/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-3xl border border-primary/30 mx-auto mb-4">
                 {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || (user?.phone ? '#' : 'U')}
              </div>
              <h2 className="text-lg font-medium text-white truncate">{user?.user_metadata?.full_name || 'User'}</h2>
              <p className="text-sm text-gray-400 truncate mb-4">{user?.email || user?.phone || 'Guest'}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] uppercase font-bold border border-green-500/20 tracking-wider">
                <ShieldCheck size={12} /> Verified
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-light/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <User size={20} />
                </div>
                <h3 className="text-xl font-medium text-white">Profile Information</h3>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1 italic opacity-60">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-dark/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full bg-primary hover:bg-primary/90 text-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                >
                  {isUpdatingProfile ? 'Updating...' : 'Save Changes'}
                </button>
              </form>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-light/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <KeyRound size={20} />
                </div>
                <h3 className="text-xl font-medium text-white">Security</h3>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1 italic opacity-60">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-dark/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1 italic opacity-60">Confirm New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-dark/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                >
                  {isLoading ? 'Updating...' : 'Save New Password'}
                </button>
              </form>
            </motion.div>

            {/* Addresses Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-light/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <MapPin size={20} />
                </div>
                <h3 className="text-xl font-medium text-white">Saved Addresses</h3>
              </div>
              
              <div className="space-y-4">
                {savedAddresses.length === 0 ? (
                  <div className="text-center py-8 bg-dark/30 rounded-xl border border-dashed border-white/10">
                    <p className="text-gray-500 text-sm italic">No addresses saved yet.</p>
                    <p className="text-[10px] text-gray-600 mt-1">You can save addresses during checkout</p>
                  </div>
                ) : (
                  savedAddresses.map((addr, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-dark/50 border border-white/5 group hover:border-primary/30 transition-all">
                      <div>
                        <p className="text-white font-bold text-sm">{addr.fullName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{addr.addressLine1}, {addr.city} - {addr.pincode}</p>
                      </div>
                      <button 
                        onClick={() => deleteAddress(idx)}
                        className="p-2 text-gray-500 hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition-all bg-white/5 rounded-lg hover:bg-red-500/10"
                        title="Delete Address"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
