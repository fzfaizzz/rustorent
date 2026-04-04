import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

export default function ReservationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : '', 
    phone: '', 
    date: '', 
    timeFrom: '', 
    timeTo: '',
    tableNumber: '1',
    guests: '2'
  });

  // Date Constraints (Today up to 5 days ahead)
  const getLocalDateString = (dateObj) => {
    const offset = dateObj.getTimezoneOffset() * 60000;
    return new Date(dateObj.getTime() - offset).toISOString().split('T')[0];
  };

  const today = new Date();
  const maxBookingDate = new Date();
  maxBookingDate.setDate(today.getDate() + 5);

  const minDateStr = getLocalDateString(today);
  const maxDateStr = getLocalDateString(maxBookingDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a table.');
      navigate('/login?redirect=/reservation');
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch ALL reservations for this date
      const { data: dailyReservations, error: fetchError } = await supabase
        .from('reservations')
        .select('*')
        .eq('date', formData.date);
        
      if (fetchError) throw fetchError;

      const reqStart = formData.timeFrom;
      const reqEnd = formData.timeTo;

      // Find all tables that have an overlapping reservation
      const busyTables = new Set();
      
      dailyReservations?.forEach(res => {
        const resStart = res.time_from;
        const resEnd = res.time_to;
        // Overlap condition
        if (reqStart < resEnd && reqEnd > resStart) {
          busyTables.add(res.table_number);
        }
      });

      const targetTable = parseInt(formData.tableNumber);

      // If the chosen table is busy
      if (busyTables.has(targetTable)) {
        // Find available tables
        const allTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const availableTables = allTables.filter(t => !busyTables.has(t));
        
        let message = `Table ${targetTable} is already booked for this time.`;
        if (availableTables.length > 0) {
           message += `\nAvailable tables: ${availableTables.join(', ')}`;
        } else {
           message += `\nSorry, all tables are booked for this time slot.`;
        }
        
        toast.error(message, { duration: 6000 });
        setLoading(false);
        return;
      }

      // 2. Create the reservation
      const newReservation = {
        id: crypto.randomUUID(),
        user_id: user.id,
        name: formData.name,
        phone: formData.phone,
        date: formData.date,
        time_from: formData.timeFrom,
        time_to: formData.timeTo,
        table_number: parseInt(formData.tableNumber),
        guests: parseInt(formData.guests) || 2,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from('reservations').insert([newReservation]);

      if (error) {
         console.warn("Supabase reservation failed, falling back to local.");
         const localRes = JSON.parse(localStorage.getItem('rustorent_reservations') || '[]');
         localRes.unshift(newReservation);
         localStorage.setItem('rustorent_reservations', JSON.stringify(localRes));
         toast.success('Table Reserved Successfully (Local)!');
      } else {
         toast.success('Table Reserved Successfully!');
      }
      
      setFormData({ name: '', phone: '', date: '', timeFrom: '', timeTo: '', tableNumber: '1', guests: '2' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to reserve table.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <SEO 
        title="Reserve a Table" 
        description="Book your table at D VEG WOK. Enjoy a premium, 100% vegetarian fine dining experience with your family and friends."
        url="https://dvegwok.com/reservation"
      />
      <div className="min-h-screen pt-24 pb-16 bg-dark">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 pt-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-heading"
          >
            Reserve Your <span className="text-primary italic">Table</span>
          </motion.h1>
          <div className="section-divider" />
          <p className="text-gray-400 mt-4">Book your spot for an unforgettable dining experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="card p-8 space-y-6">
              <h2 className="text-2xl font-serif">Why Dine With Us?</h2>
              <div className="space-y-4">
                {[
                  { icon: '🍽️', title: 'Premium Ambience', desc: 'Elegant dark-themed dining space' },
                  { icon: '🥬', title: '100% Vegetarian', desc: 'Pure veg kitchen with no cross-contamination' },
                  { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Dishes crafted by award-winning chefs' },
                  { icon: '💰', title: 'Best Value', desc: 'Premium quality at ₹200–400 per person' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-8">
              <h3 className="font-serif text-lg mb-3">Opening Hours</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between"><span>Monday – Friday</span><span className="text-white">11:00 AM – 11:30 PM</span></div>
                <div className="flex justify-between"><span>Saturday – Sunday</span><span className="text-white">10:00 AM – 11:30 PM</span></div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card p-8">
              <h2 className="text-2xl font-serif mb-6">Book a Table</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="text-gray-500 w-4 h-4" /></div>
                  <input type="text" required placeholder="Your Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="input-field pl-10" />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="text-gray-500 w-4 h-4" /></div>
                  <input type="tel" required placeholder="Phone Number" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} className="input-field pl-10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Date (Up to 5 days advance)</label>
                    <div className="absolute inset-y-0 bottom-0 left-0 pl-3 pb-3 flex items-end pointer-events-none"><Calendar className="text-gray-500 w-4 h-4 mb-0.5" /></div>
                    <input 
                      type="date" 
                      required 
                      min={minDateStr}
                      max={maxDateStr}
                      value={formData.date} 
                      onChange={(e) => handleChange('date', e.target.value)} 
                      className="input-field pl-10 [color-scheme:dark]" 
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Table Number</label>
                    <div className="absolute inset-y-0 bottom-0 left-0 pl-3 pb-3 flex items-end pointer-events-none"><span className="text-gray-500 font-bold mb-0.5 ml-1">#</span></div>
                    <select required value={formData.tableNumber} onChange={(e) => handleChange('tableNumber', e.target.value)} className="input-field pl-10 appearance-none">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>Table {n}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-xs font-medium text-gray-400 mb-1 block">From Time</label>
                    <div className="absolute inset-y-0 bottom-0 left-0 pl-3 pb-3 flex items-end pointer-events-none"><Clock className="text-gray-500 w-4 h-4 mb-0.5" /></div>
                    <input type="time" required value={formData.timeFrom} onChange={(e) => handleChange('timeFrom', e.target.value)} className="input-field pl-10 [color-scheme:dark]" />
                  </div>
                  <div className="relative">
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Till Time</label>
                    <div className="absolute inset-y-0 bottom-0 left-0 pl-3 pb-3 flex items-end pointer-events-none"><Clock className="text-gray-500 w-4 h-4 mb-0.5" /></div>
                    <input type="time" required value={formData.timeTo} onChange={(e) => handleChange('timeTo', e.target.value)} className="input-field pl-10 [color-scheme:dark]" />
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Users className="text-gray-500 w-4 h-4" /></div>
                  <select value={formData.guests} onChange={(e) => handleChange('guests', e.target.value)} className="input-field pl-10 appearance-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full mt-4 py-4 disabled:opacity-50">
                   {loading ? 'Confirming...' : (user ? 'Confirm Reservation' : 'Login to Book Table')}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}
