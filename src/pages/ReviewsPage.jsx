import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

const initialReviews = [
  { name: "Tasty & Yummy", rating: 5, comment: "Tasty & Yummy 😋", date: "a year ago" },
  { name: "Rahul D.", rating: 5, comment: "Best place for vegetarians who wish to have chinese thai and Indian food..", date: "2 weeks ago" },
  { name: "Priya K.", rating: 5, comment: "Delicious food with economy rate, bonus good customer service.", date: "1 month ago" },
];

export default function ReviewsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', rating: 5, comment: '' });
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setReviews(data);
        } else {
          throw new Error("Empty reviews");
        }
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local storage");
        const localReviews = JSON.parse(localStorage.getItem('rustorent_reviews') || '[]');
        if (localReviews.length > 0) {
          setReviews(localReviews);
        } else {
          setReviews(initialReviews);
          localStorage.setItem('rustorent_reviews', JSON.stringify(initialReviews));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "4.8";
    
  const totalReviewsCount = reviews.length || 74;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review.');
      navigate('/login?redirect=/reviews');
      return;
    }
    const { name, rating, comment } = formData;
    
    try {
      const newReview = { id: crypto.randomUUID(), name, rating, comment, created_at: new Date().toISOString() };
      const { data, error } = await supabase
        .from('reviews')
        .insert([newReview])
        .select();

      if (error) {
        console.warn('Supabase insert failed, using localStorage');
        const localReviews = JSON.parse(localStorage.getItem('rustorent_reviews') || '[]');
        localReviews.unshift({ ...newReview, date: 'Just now' });
        localStorage.setItem('rustorent_reviews', JSON.stringify(localReviews));
        setReviews(prev => [{ ...newReview, date: 'Just now' }, ...prev]);
        toast.success('Review Submitted (Local Mode)!');
        setFormData({ name: '', rating: 5, comment: '' });
        return;
      }
      
      setReviews([data[0], ...reviews]);
      toast.success('Review Submitted Successfully!');
      setFormData({ name: '', rating: 5, comment: '' });
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <>
      <SEO 
        title="Guest Reviews" 
        description="See what our wonderful customers have to say about the pure veg dining experience at D VEG WOK."
        url="https://dvegwok.com/reviews"
      />
      <div className="min-h-screen pt-24 pb-16 bg-dark">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-8">
        <div className="text-center mb-12">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-heading">
            Guest <span className="text-primary italic">Reviews</span>
          </motion.h1>
          <div className="section-divider" />
        </div>

        {/* Rating Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 text-center mb-12"
        >
          <div className="text-6xl font-bold text-primary font-serif mb-2">{avgRating}</div>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={`w-6 h-6 ${i <= Math.round(Number(avgRating)) ? 'text-primary fill-primary' : 'text-gray-600'}`} />
            ))}
          </div>
          <p className="text-gray-400">{totalReviewsCount} Reviews</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review List */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.map((review, i) => (
              <motion.div
                key={`${review.name}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                    {review.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{review.name}</h4>
                    <p className="text-xs text-gray-500">
                      {review.date || (review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Just now')}
                    </p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className={`w-3.5 h-3.5 ${idx < review.rating ? 'text-primary fill-primary' : 'text-gray-600'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">"{review.comment}"</p>
              </motion.div>
            ))}
          </div>

          {/* Add Review Form */}
          <div>
            <div className="card p-6 sticky top-28">
              <h3 className="font-serif text-xl mb-5">Write a Review</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />

                {/* Star Rating Selector */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Your Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="p-0.5"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            star <= (hoveredStar || formData.rating) ? 'text-primary fill-primary' : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  required
                  placeholder="Write your experience..."
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="input-field resize-none"
                />
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Send size={16} /> {user ? 'Submit Review' : 'Login to Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
