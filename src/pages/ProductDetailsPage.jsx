import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, ChefHat, Leaf, Plus, Minus, ShoppingBag, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { menu as fallbackMenu } from '../data/menuData';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

export default function ProductDetailsPage({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      // 1. Fetch current product
      const { data: mainProduct, error: pError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (pError || !mainProduct) {
        // Fallback search
        let found = null;
        let foundCatItems = [];

        // 1. Check localStorage first
        const localProducts = JSON.parse(localStorage.getItem('rustorent_products') || '[]');
        if (localProducts.length > 0) {
            found = localProducts.find(p => p.id === id);
            if (found) {
                foundCatItems = localProducts.filter(p => p.category === found.category);
            }
        }

        // 2. Check fallbackMenu if not found locally
        if (!found) {
            for (const cat of fallbackMenu) {
              found = cat.items.find((item) => item.id === id);
              if (found) { 
                foundCatItems = cat.items;
                break; 
              }
            }
        }

        if (found) {
          setProduct(found);
          setRecommendations(foundCatItems.filter(i => i.id !== id).slice(0, 4));
        }
      } else {
        setProduct(mainProduct);
        // 2. Fetch recommendations (same category)
        const { data: recs } = await supabase
          .from('products')
          .select('*')
          .eq('category', mainProduct.category)
          .neq('id', id)
          .limit(4);
        setRecommendations(recs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center bg-dark">
        <Loader2 className="text-primary animate-spin" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-dark text-center">
        <h1 className="text-3xl font-serif text-white mb-4">Product Not Found</h1>
        <button onClick={() => navigate('/menu')} className="btn-primary">Back to Menu</button>
      </div>
    );
  }

  const productCategoryName = product.category || 'Food Item';

  const handleAddToCart = () => {
    // Add multiple quantities by calling addToCart multiple times or adjusting the cart logic
    // For this demo, we'll just add the item N times
    for (let i = 0; i < quantity; i++) {
        addToCart(product);
    }
    setQuantity(1);
  };

  const handleBuyNow = () => {
    // Add the items to cart and immediately open checkout
    for (let i = 0; i < quantity; i++) {
        addToCart(product);
    }
    navigate('/checkout');
  };

  return (
    <>
      <SEO 
        title={product.name} 
        description={product.description || `Order ${product.name} from D VEG WOK. Premium vegetarian dining.`}
        image={product.image}
        url={`https://dvegwok.com/product/${product.id}`}
      />
      <div className="min-h-screen pt-24 pb-16 bg-dark">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Breadcrumb */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8">
          <ArrowLeft size={18} /> Back
        </button>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          
          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden bg-dark-card border border-white/5 aspect-square lg:aspect-auto shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent z-10" />
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {product.isVeg && (
              <div className="absolute top-4 right-4 z-20 bg-white p-1 rounded-sm border-2 border-green-600 shadow-lg">
                <div className="w-3 h-3 rounded-full bg-green-600" />
              </div>
            )}
          </motion.div>

          {/* Right: Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-2 text-primary font-medium tracking-widest text-sm uppercase">{productCategoryName}</div>
            <h1 className="text-4xl md:text-5xl font-serif mb-4 flex items-center gap-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-gray-500 text-sm ml-1">Rating</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>Prep: {product.prep_time || product.prepTime} mins</span>
              </div>
            </div>

            <div className="text-4xl font-bold text-white mb-8">
              ₹{product.price}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Guaranteed Badges */}
            <div className="grid grid-cols-2 gap-4 mb-10 pb-10 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <Leaf size={20} />
                    </div>
                    <span className="text-sm text-gray-300">100% Pure Veg</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <ChefHat size={20} />
                    </div>
                    <span className="text-sm text-gray-300">Chef Special</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <ShieldCheck size={20} />
                    </div>
                    <span className="text-sm text-gray-300">Fresh Ingredients</span>
                </div>
            </div>

            {/* Action Area */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!product.in_stock ? (
                <div className="flex-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl py-4 text-lg font-bold flex items-center justify-center">
                  CURRENTLY OUT OF STOCK
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border border-white/20 rounded-lg p-2 bg-dark-card w-full sm:w-40">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-xl font-medium w-10 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <div className="flex-1 flex gap-3">
                    <button 
                      onClick={handleAddToCart}
                      className="btn-outline flex-1 py-4 text-base font-bold flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={18} /> Add to Cart
                    </button>

                    <button 
                      onClick={handleBuyNow}
                      className="btn-primary flex-1 py-4 text-base font-bold flex items-center justify-center"
                    >
                      Buy Now
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Ingredients & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            <div className="lg:col-span-2 card p-8">
                <h2 className="text-2xl font-serif mb-6 flex items-center gap-3">
                    <ChefHat className="text-primary" /> Key Ingredients
                </h2>
                <div className="flex flex-wrap gap-3">
                    {(Array.isArray(product.ingredients) ? product.ingredients : []).map((ing, idx) => (
                        <div key={idx} className="bg-dark border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {ing}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="card p-8 bg-gradient-to-br from-dark-card to-dark border-primary/20">
                <h3 className="text-lg font-serif mb-4 text-primary">Delivery Info</h3>
                <ul className="space-y-4 text-sm text-gray-300">
                    <li className="flex gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                        Standard delivery time is 35-45 minutes depending on location.
                    </li>
                    <li className="flex gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                        Packaged in spill-proof, eco-friendly containers.
                    </li>
                    <li className="flex gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                        Served piping hot straight from our tandoors and woks.
                    </li>
                </ul>
            </div>
        </div>

        {/* Recommended Area */}
        {recommendations.length > 0 && (
            <div>
                <h2 className="text-3xl font-serif mb-8 text-center lg:text-left">Recommended <span className="text-primary italic">Sides</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendations.map((rec) => (
                        <Link to={`/product/${rec.id}`} key={rec.id} className="card p-4 group hover:-translate-y-1 transition-all">
                            <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                                <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h4 className="font-serif text-lg mb-1 group-hover:text-primary transition-colors truncate">{rec.name}</h4>
                            <div className="flex justify-between items-center">
                                <span className="font-bold">₹{rec.price}</span>
                                {!rec.in_stock ? (
                                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Out of Stock</span>
                                ) : (
                                  <div className="flex items-center gap-1 text-xs text-gray-400">
                                      <Star className="w-3 h-3 text-primary fill-primary" /> {rec.rating}
                                  </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
    </>
  );
}
