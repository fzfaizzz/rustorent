import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trash2, Loader2, Phone, User, Clock, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all'); // all, today, tomorrow, yesterday

  useEffect(() => {
    fetchReservations();

    const subscription = supabase
      .channel('public:reservations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setReservations(prev => [payload.new, ...prev]);
          toast.success(`New table reserved by ${payload.new.name}`);
        } else if (payload.eventType === 'UPDATE') {
          setReservations(prev => prev.map(r => r.id === payload.new.id ? payload.new : r));
        } else if (payload.eventType === 'DELETE') {
          setReservations(prev => prev.filter(r => r.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
        supabase.removeChannel(subscription);
    }
  }, []);

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) setReservations(data);
      else throw new Error("No data");
    } catch (error) {
      console.warn("Supabase fetch failed, falling back to local storage");
      const localReservations = JSON.parse(localStorage.getItem('rustorent_reservations') || '[]');
      setReservations(localReservations);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) {
         console.warn("Supabase delete failed, using localStorage");
         const localReservations = JSON.parse(localStorage.getItem('rustorent_reservations') || '[]');
         const updatedReservations = localReservations.filter(r => r.id !== id);
         localStorage.setItem('rustorent_reservations', JSON.stringify(updatedReservations));
         setReservations(updatedReservations);
         toast.success('Reservation cancelled (Local)');
         return;
      }
      setReservations(reservations.filter(r => r.id !== id));
      toast.success('Reservation cancelled');
    } catch (error) {
      toast.error('Cancel failed');
    }
  };

  const getFilteredReservations = () => {
    if (dateFilter === 'all') return reservations;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return reservations.filter(res => {
      const resDate = new Date(res.date);
      resDate.setHours(0, 0, 0, 0);
      
      if (dateFilter === 'today') return resDate.getTime() === today.getTime();
      if (dateFilter === 'tomorrow') return resDate.getTime() === tomorrow.getTime();
      if (dateFilter === 'yesterday') return resDate.getTime() === yesterday.getTime();
      return true;
    });
  };

  const filteredData = getFilteredReservations();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="bg-dark-card border border-white/5 rounded-2xl p-6 flex items-center gap-4 min-w-[250px]">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Filtered Reservations</p>
            <h3 className="text-2xl font-serif text-white">{filteredData.length}</h3>
          </div>
        </div>

        {/* Date Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'today', 'tomorrow', 'yesterday'].map(filter => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                dateFilter === filter 
                  ? 'bg-primary text-black' 
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="text-primary animate-spin" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredData.map((res, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              key={res.id}
              className="bg-dark-card border border-white/5 rounded-2xl p-6 relative group"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(res.id)}
                  className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 text-lg shrink-0">
                  {res.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-medium flex items-center gap-2">
                    {res.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                    <Phone size={10} /> {res.phone}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2">Table #</span>
                    <span className="text-white font-medium bg-primary/20 text-primary px-2 py-0.5 border border-primary/30 rounded">
                      Table {res.table_number || 1}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Calendar size={14}/> Date</span>
                    <span className="text-white font-medium">{res.date}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Clock size={14}/> Time Slot</span>
                    <span className="text-white font-medium">{res.time_from || res.time} - {res.time_to || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Users size={14}/> Guests</span>
                    <span className="text-white font-medium">{res.guests}</span>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
          {filteredData.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
               <Calendar size={48} className="mx-auto mb-4 opacity-10" />
               <p className="font-serif italic">No reservations found for '{dateFilter}'.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
