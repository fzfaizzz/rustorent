import { useState, useEffect } from 'react';
import { Plus, Star, Search, Utensils, Loader2 } from 'lucide-react';
import { menu as fallbackMenu } from '../data/menuData';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export default function MenuPage({ addToCart }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Group products by category to match the existing UI structure
          const categories = [...new Set(data.map(p => p.category))];
          const groupedData = categories.map(cat => ({
            category: cat,
            items: data.filter(p => p.category === cat)
          }));
          setProducts(groupedData);
        } else {
          setProducts(fallbackMenu);
        }
      } catch (err) {
        console.error('Supabase fetch failed, using fallback:', err);
        setProducts(fallbackMenu);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['All', ...products.map(c => c.category)];

  const filteredMenu = products
    .filter(c => activeCategory === 'All' || c.category === activeCategory)
    .map(c => ({
      ...c,
      items: c.items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(c => c.items.length > 0);

  return (
    <>
      <SEO 
        title="Our Menu" 
        description="Explore our wide range of premium vegetarian dishes including Chinese starters, Indian main courses, and delectable desserts."
        url="https://dvegwok.com/menu"
      />
      <div className="min-h-screen pt-24 pb-16 bg-dark">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <motion.h1 {...fadeUp} className="section-heading">
            Our <span className="text-primary italic">Full Menu</span>
          </motion.h1>
          <div className="section-divider" />
          <p className="text-gray-400 mt-4">Premium vegetarian dishes crafted to perfection</p>
        </div>

        {/* Search + Filter */}
        <div className="mb-10 space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-11"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all border ${
                  activeCategory === cat
                    ? 'bg-primary text-black border-primary'
                    : 'bg-dark-card text-gray-400 border-white/10 hover:border-primary/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Categories */}
        <div className="space-y-14">
          {filteredMenu.map((category, idx) => (
            <motion.div key={category.category} {...fadeUp} transition={{ delay: idx * 0.05 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Utensils size={18} />
                </div>
                <h2 className="text-2xl font-serif">{category.category}</h2>
                <div className="flex-1 h-px bg-white/10 ml-3 hidden md:block" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {category.items.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="card p-4 flex items-center gap-4 group hover:-translate-y-1 duration-300 relative cursor-pointer"
                  >
                    <div className="w-20 h-20 overflow-hidden rounded-lg shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'; }}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors truncate">{item.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <span className="text-xs text-gray-400">{item.rating}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 relative z-20">
                        <span className="text-primary font-bold">₹{item.price}</span>
                        {!item.in_stock ? (
                          <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Out of Stock</span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item);
                            }}
                            className="bg-dark border border-white/10 p-1.5 rounded-full text-white hover:bg-primary hover:text-black hover:border-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No dishes found matching your search.</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
