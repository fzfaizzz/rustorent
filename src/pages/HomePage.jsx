import { motion } from 'framer-motion';
import { Check, Star, Plus, Smartphone, Wine, Users2, Clock, Quote, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { featuredDishes } from '../data/menuData';
import SEO from '../components/SEO';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function HomePage({ addToCart }) {
  const navigate = useNavigate();

  const handleBuyNow = (dish) => {
    addToCart(dish);
    navigate('/checkout');
  };
  return (
    <>
      <SEO 
        title="Premium Veg Dining" 
        description="D VEG WOK offers the best Vegetarian, Indian, Chinese, and Pav Bhaji in Nalasopara East. Authentic flavors, luxury ambiance."
      />
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8 text-center lg:text-left pt-8 lg:pt-0">
              <h1 className="text-5xl md:text-7xl font-serif leading-tight">
                Savor Pure Veg<br />Excellence at <span className="text-primary italic">D VEG WOK</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Premium Vegetarian Dining Experience. Authentic Chinese, Indian & Thai Specials.
              </p>
              <div className="flex items-center gap-3 justify-center lg:justify-start text-sm text-gray-300">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 5 ? 'text-primary fill-primary' : 'text-gray-600'}`} />
                  ))}
                </div>
                <span className="text-primary font-semibold">4.8</span>
                <span className="text-gray-500">• 74 Reviews</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/reservation" className="btn-primary text-center">Reserve Table</Link>
                <Link to="/menu" className="btn-outline text-center">View Menu</Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md mx-auto">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 rounded-full border border-white/10 border-dashed" />
                <img src="/images/hero.png" alt="Veg Platter" className="w-full h-auto object-cover rounded-full shadow-[0_0_50px_rgba(255,122,0,0.15)] animate-glow" />
              </div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="absolute -bottom-6 left-1/2 -translate-x-1/2 lg:-left-8 lg:translate-x-0 bg-dark-card/90 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-2xl w-56">
                <h3 className="font-serif text-sm mb-3 border-b border-white/10 pb-2">Experience</h3>
                <ul className="space-y-2.5">
                  {['Dine-In', 'No-Contact Delivery', 'Family Seating'].map(t => (
                    <li key={t} className="flex items-center text-xs text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-2 text-primary"><Check size={10} /></span>
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED DISHES ═══════════ */}
      <section className="py-24 bg-dark border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-16">
            <motion.h2 {...fadeUp} className="section-heading">
              Culinary <span className="text-primary italic">Masterpieces</span>
            </motion.h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish, i) => (
              <motion.div key={dish.name} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="card overflow-hidden group hover:-translate-y-2 duration-300 shadow-lg hover:shadow-primary/10">
                <Link to={`/product/${dish.id}`} className="relative h-60 overflow-hidden block">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop'; }} />
                  <div className="absolute top-3 right-3 z-20 bg-dark/80 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center border border-white/10">
                    <Star className="text-primary w-3.5 h-3.5 mr-1 fill-primary" /><span className="text-white text-xs font-medium">{dish.rating}</span>
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <Link to={`/product/${dish.id}`} className="text-lg font-serif group-hover:text-primary transition-colors">{dish.name}</Link>
                    <span className="text-lg font-bold tracking-wider">₹{dish.price}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => addToCart(dish)} className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm font-medium flex justify-center items-center gap-2 group-hover:border-primary/50 transition-all hover:bg-white/5">
                      <Plus size={16} /> Add to Cart
                    </button>
                    <button onClick={() => handleBuyNow(dish)} className="flex-1 py-2.5 rounded-lg bg-primary text-black text-sm font-medium flex justify-center items-center gap-2 hover:bg-white transition-all shadow-lg hover:shadow-primary/20">
                      <ShoppingBag size={16} /> Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SERVING YOU BETTER ═══════════ */}
      <section className="py-24 bg-[#080808] border-t border-white/5 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div {...fadeUp} className="flex-1 space-y-8">
              <div>
                <h2 className="section-heading leading-tight">
                  Serving You <span className="text-primary italic">Better</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg mt-4">
                  Beyond food, we offer an unforgettable atmosphere. Enjoy impeccable service, ambient music, and a space designed for joyful gatherings.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Smartphone size={20} />, text: "Online Orders" },
                  { icon: <Wine size={20} />, text: "Bar Available" },
                  { icon: <Users2 size={20} />, text: "Family Dining" },
                  { icon: <Clock size={20} />, text: "24/7 Reservation" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-dark-card p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">{f.icon}</div>
                    <span className="text-gray-200 text-sm font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/reservation" className="btn-primary inline-block">Book a Table</Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex-1 relative">
              <div className="absolute inset-0 bg-primary/15 rounded-2xl blur-3xl -z-10 translate-x-4 translate-y-4" />
              <img src="/images/waiter.png" alt="Fine Dining" className="w-full rounded-2xl object-cover shadow-2xl border border-white/10 max-h-[550px]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ LUXURY DINING ═══════════ */}
      <section className="relative py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/images/ambient.png')` }} />
        <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 text-center flex flex-col items-center">
          <motion.div {...fadeUp} className="bg-dark/50 border border-white/10 p-12 md:p-16 rounded-2xl shadow-2xl backdrop-blur-md max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-serif mb-6">
              Luxury Dining <span className="text-primary italic">Starts Here</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Immerse yourself in an unparalleled vegetarian dining experience, surrounded by elegance.
            </p>
            <Link to="/reservation" className="btn-primary text-lg px-8 py-4 inline-block">Reserve Now</Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CHEFS ═══════════ */}
      <section className="py-24 bg-dark border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-16">
            <motion.h2 {...fadeUp} className="section-heading">Meet Our <span className="text-primary italic">Culinary Artists</span></motion.h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Chef Suresh", role: "Head Chef", desc: "15 years of mastery in vegetarian fine dining.", image: "/images/chef-suresh.png" },
              { name: "Chef Meena", role: "Chinese Specialist", desc: "Expert in Indo-Chinese fusion flavors.", image: "/images/chef-meena.png" },
              { name: "Chef Arjun", role: "Tandoor Master", desc: "Creating perfectly charred paneer and breads.", image: "/images/chef-arjun.png" },
            ].map((chef, i) => (
              <motion.div key={chef.name} {...fadeUp} transition={{ delay: i * 0.1 }} className="relative card overflow-hidden group h-96">
                <img src={chef.image} alt={chef.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
                
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-serif group-hover:text-primary transition-colors">{chef.name}</h3>
                  <p className="text-primary text-sm font-medium tracking-wide mb-2">{chef.role}</p>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{chef.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 {...fadeUp} className="section-heading">Words from Our <span className="text-primary italic">Guests</span></motion.h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Best vegetarian food in Nalasopara. The Paneer Tikka is heavenly!", author: "Tasty & Yummy", rating: 5 },
              { text: "Best place for vegetarians who wish to have chinese thai and Indian food..", author: "Rahul D.", rating: 5 },
              { text: "Delicious food with economy rate, bonus good customer service.", author: "Priya K.", rating: 5 },
            ].map((r, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-dark border border-white/5 p-8 rounded-2xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
                <Quote className="text-primary/30 w-10 h-10 mb-5" />
                <div className="flex mb-3">
                  {[...Array(r.rating)].map((_, idx) => <Star key={idx} className="w-3.5 h-3.5 text-primary fill-primary" />)}
                </div>
                <p className="text-gray-300 leading-relaxed italic mb-6">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">{r.author.charAt(0)}</div>
                  <div>
                    <h4 className="text-sm font-medium">{r.author}</h4>
                    <p className="text-xs text-gray-500">Google Review</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
