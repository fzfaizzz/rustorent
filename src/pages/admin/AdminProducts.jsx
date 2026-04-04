import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, Check, X, Camera, Utensils, IndianRupee, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { menu as fallbackMenu } from '../../data/menuData';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    is_veg: true,
    in_stock: true,
    prep_time: 15
  });

  const categories = ['All', ...new Set(products.map(p => p.category))];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) setProducts(data);
      else throw new Error("No data");
    } catch (error) {
      console.warn('Supabase fetch failed, falling back to localStorage');
      const localProducts = JSON.parse(localStorage.getItem('rustorent_products') || '[]');
      if (localProducts.length > 0) {
        setProducts(localProducts);
      } else {
        const initialProducts = fallbackMenu.flatMap(c => c.items.map(i => ({...i, category: c.category})));
        setProducts(initialProducts);
        localStorage.setItem('rustorent_products', JSON.stringify(initialProducts));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ in_stock: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      setProducts(products.map(p => p.id === id ? { ...p, in_stock: !currentStatus } : p));
      toast.success('Stock status updated');
    } catch (error) {
      console.warn('Supabase update failed, using localStorage');
      const updatedProducts = products.map(p => p.id === id ? { ...p, in_stock: !currentStatus } : p);
      setProducts(updatedProducts);
      localStorage.setItem('rustorent_products', JSON.stringify(updatedProducts));
      toast.success('Stock status updated (Local)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        id: editingProduct ? editingProduct.id : formData.name.toLowerCase().replace(/\s+/g, '-'),
      };

      let error;
      if (editingProduct) {
        ({ error } = await supabase.from('products').update(productData).eq('id', editingProduct.id));
      } else {
        ({ error } = await supabase.from('products').insert([productData]));
      }

      if (error) throw error;
      
      toast.success(`Product ${editingProduct ? 'updated' : 'added'} successfully`);
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.warn('Supabase save failed, using localStorage');
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        id: editingProduct ? editingProduct.id : formData.name.toLowerCase().replace(/\s+/g, '-'),
      };
      let updatedProducts = [...products];
      if (editingProduct) {
        updatedProducts = updatedProducts.map(p => p.id === editingProduct.id ? productData : p);
      } else {
        updatedProducts.push(productData);
      }
      setProducts(updatedProducts);
      localStorage.setItem('rustorent_products', JSON.stringify(updatedProducts));
      toast.success(`Product ${editingProduct ? 'updated' : 'added'} (Local)`);
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || '',
        image: product.image || '',
        is_veg: product.is_veg,
        in_stock: product.in_stock,
        prep_time: product.prep_time || 15
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        is_veg: true,
        in_stock: true,
        prep_time: 15
      });
    }
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === 'All' || p.category === categoryFilter)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-card border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary/50 transition-all outline-none"
            />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-dark-card border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <button 
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} /> Add New Food
        </button>
      </div>

      {/* Products Grid */}
      {loading && products.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="text-primary animate-spin" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <motion.div 
              layout
              key={product.id}
              className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all"
            >
              <div className="aspect-video relative overflow-hidden bg-white/5">
                <img 
                  src={product.image || '/images/veg-manchurian.png'} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${product.in_stock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    onClick={() => openModal(product)}
                    className="p-2 bg-white/10 hover:bg-primary/20 rounded-full text-white transition-all backdrop-blur-md border border-white/10"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleToggleStock(product.id, product.in_stock)}
                    className={`p-2 rounded-full text-white transition-all backdrop-blur-md border border-white/10 ${product.in_stock ? 'bg-red-500/20 hover:bg-red-500/40' : 'bg-green-500/20 hover:bg-green-500/40'}`}
                  >
                    {product.in_stock ? <X size={18} /> : <Check size={18} />}
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.category}</span>
                  <div className={`w-3 h-3 rounded-full border ${product.is_veg ? 'border-green-500 p-0.5' : 'border-red-500 p-0.5'}`}>
                    <div className={`w-full h-full rounded-full ${product.is_veg ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                </div>
                <h3 className="text-white font-medium truncate">{product.name}</h3>
                <div className="flex items-center justify-between pt-2">
                  <div className="text-white font-bold flex items-center">
                    <IndianRupee size={14} className="text-primary" /> {product.price}
                  </div>
                  <span className="text-[10px] text-gray-500">{product.prep_time} mins prep</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-dark-card border border-white/10 rounded-3xl p-6 md:p-8 overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-serif text-white mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Food Item'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">Food Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="input-field" 
                      placeholder="e.g. Paneer Tikka"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1.5 block">Price (₹)</label>
                      <input 
                        required
                        type="number" 
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="input-field" 
                        placeholder="220"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1.5 block">Category</label>
                      <input 
                        required
                        type="text" 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="input-field" 
                        placeholder="Veg Starters"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">Ingredients (Comma separated)</label>
                    <textarea 
                      value={Array.isArray(formData.ingredients) ? formData.ingredients.join(', ') : ''}
                      onChange={e => setFormData({...formData, ingredients: e.target.value.split(',').map(i => i.trim())})}
                      className="input-field h-24 resize-none" 
                      placeholder="Paneer, Yogurt, Capsicum..."
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">Image URL</label>
                    <div className="flex gap-2">
                       <input 
                        type="text" 
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        className="input-field flex-1" 
                        placeholder="https://..."
                      />
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                         {formData.image ? <img src={formData.image} className="w-full h-full object-cover rounded-lg" alt="" /> : <Camera size={20} className="text-gray-500" />}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="input-field h-24 resize-none" 
                      placeholder="Describe the dish..."
                    />
                  </div>
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.is_veg}
                        onChange={e => setFormData({...formData, is_veg: e.target.checked})}
                        className="w-4 h-4 rounded border-white/20 bg-dark text-primary focus:ring-primary/50"
                      />
                      <span className="text-sm text-gray-300">Vegetarian</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.in_stock}
                        onChange={e => setFormData({...formData, in_stock: e.target.checked})}
                        className="w-4 h-4 rounded border-white/20 bg-dark text-primary focus:ring-primary/50"
                      />
                      <span className="text-sm text-gray-300">In Stock</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-white/5">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary px-8"
                  >
                    {editingProduct ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
