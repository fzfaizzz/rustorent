import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Trash2, Calendar, User, Loader2, Quote } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) setReviews(data);
      else throw new Error("No data");
    } catch (error) {
      console.warn("Supabase fetch failed, falling back to local storage");
      const localReviews = JSON.parse(localStorage.getItem('rustorent_reviews') || '[]');
      if (localReviews.length > 0) {
        setReviews(localReviews);
      } else {
        const initialReviews = [
          { id: '1', name: "Tasty & Yummy", rating: 5, comment: "Tasty & Yummy 😋", created_at: new Date().toISOString() },
          { id: '2', name: "Rahul D.", rating: 5, comment: "Best place for vegetarians who wish to have chinese thai and Indian food..", created_at: new Date(Date.now() - 86400000).toISOString() },
          { id: '3', name: "Priya K.", rating: 5, comment: "Delicious food with economy rate, bonus good customer service.", created_at: new Date(Date.now() - 172800000).toISOString() }
        ];
        setReviews(initialReviews);
        localStorage.setItem('rustorent_reviews', JSON.stringify(initialReviews));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) {
         console.warn("Supabase delete failed, using localStorage");
         const localReviews = JSON.parse(localStorage.getItem('rustorent_reviews') || '[]');
         const updatedReviews = localReviews.filter(r => r.id !== id);
         localStorage.setItem('rustorent_reviews', JSON.stringify(updatedReviews));
         setReviews(updatedReviews);
         toast.success('Review deleted (Local)');
         return;
      }
      setReviews(reviews.filter(r => r.id !== id));
      toast.success('Review deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Average Rating</p>
            <h3 className="text-2xl font-serif text-white">{avgRating} / 5.0</h3>
          </div>
        </div>
        <div className="bg-dark-card border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Reviews</p>
            <h3 className="text-2xl font-serif text-white">{reviews.length}</h3>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="text-primary animate-spin" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={review.id}
              className="bg-dark-card border border-white/5 rounded-2xl p-6 relative group"
            >
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(review.id)}
                  className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 text-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-medium flex items-center gap-2">
                    {review.name}
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={12} className={s <= review.rating ? 'text-primary fill-primary' : 'text-gray-600'} />
                      ))}
                    </div>
                  </h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                    <Calendar size={10} /> {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="relative">
                <Quote className="absolute -left-2 -top-2 text-primary/10 -scale-x-100" size={40} />
                <p className="text-gray-300 text-sm leading-relaxed relative z-10 pl-4 border-l-2 border-primary/20 italic">
                  {review.comment}
                </p>
              </div>
            </motion.div>
          ))}
          {reviews.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
               <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
               <p className="font-serif italic">No reviews yet. Your guest feedback will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
