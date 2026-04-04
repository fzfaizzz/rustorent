import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      if (error) throw error;
      toast.success('Registration successful!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Logged in successfully!');
      return data;
    } catch (error) {
      toast.error('Invalid login credentials.');
      throw error;
    }
  };

  const loginWithOtp = async (phone) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
      });
      if (error) throw error;
      toast.success('OTP sent to your phone!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const verifyOtp = async (phone, token) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      if (error) throw error;
      toast.success('Logged in successfully!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      toast.success('Password updated successfully!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const addAddress = async (newAddress) => {
    try {
      const currentAddresses = user?.user_metadata?.addresses || [];
      // Keep only unique addresses (simple check by stringifying)
      const isDuplicate = currentAddresses.some(addr => 
        JSON.stringify(addr) === JSON.stringify(newAddress)
      );
      
      if (isDuplicate) {
        toast.error("This address is already saved.");
        return;
      }

      const updatedAddresses = [...currentAddresses, newAddress];
      const { data, error } = await supabase.auth.updateUser({
        data: { ...user.user_metadata, addresses: updatedAddresses }
      });
      if (error) throw error;
      toast.success('Address saved successfully!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateProfile = async (fullName) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { ...user.user_metadata, full_name: fullName }
      });
      if (error) throw error;
      toast.success('Profile updated successfully!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const deleteAddress = async (index) => {
    try {
      const currentAddresses = user?.user_metadata?.addresses || [];
      const updatedAddresses = currentAddresses.filter((_, i) => i !== index);
      const { data, error } = await supabase.auth.updateUser({
        data: { ...user.user_metadata, addresses: updatedAddresses }
      });
      if (error) throw error;
      toast.success('Address removed.');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully.');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signup,
      login,
      loginWithOtp,
      verifyOtp,
      logout,
      updatePassword,
      updateProfile,
      addAddress,
      deleteAddress,
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
