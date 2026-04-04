import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, CheckCircle, ArrowLeft, ArrowRight, Banknote, Smartphone, Package, Home, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, label: 'Address', icon: <MapPin size={16} /> },
  { id: 2, label: 'Payment', icon: <CreditCard size={16} /> },
  { id: 3, label: 'Confirmed', icon: <CheckCircle size={16} /> },
];

export default function CheckoutPage({ cartItems, onCheckout }) {
  const navigate = useNavigate();
  const { user, addAddress } = useAuth();
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState('');
  const [showSavedAddresses, setShowSavedAddresses] = useState(true);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressMode, setAddressMode] = useState(user?.user_metadata?.addresses?.length > 0 ? 'saved' : 'new');

  useEffect(() => {
    if (!user) {
      toast.error('Please login to proceed to checkout.');
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  const savedAddresses = user?.user_metadata?.addresses || [];

  // Address state
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    pincode: '',
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  // Redirect if cart is empty and not on confirmation step
  if (cartItems.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  const [addressErrors, setAddressErrors] = useState({});

  // Allowed pincodes (approx 5km radius around Nalasopara East)
  const VALID_PINCODES = ['401209', '401208', '401203', '401202', '401303', '401305'];

  const validateAddress = () => {
    const errs = {};
    if (!address.fullName.trim()) errs.fullName = 'Full name is required';
    if (!address.phone.trim() || address.phone.trim().length < 10) errs.phone = 'Valid phone number required';
    if (!address.addressLine1.trim()) errs.addressLine1 = 'Address is required';
    if (!address.city.trim()) errs.city = 'City is required';
    
    const pin = address.pincode.trim();
    if (!pin || pin.length < 5) {
      errs.pincode = 'Valid pincode required';
    } else if (!VALID_PINCODES.includes(pin)) {
      errs.pincode = 'Distance too long. We only deliver within 5km.';
      toast.error('Delivery distance too long! We only serve within a 5km radius.');
    }
    
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [selectedSavedIndex, setSelectedSavedIndex] = useState(-1);

  const validateSavedAddress = () => {
    if (selectedSavedIndex === -1 && savedAddresses.length > 0) {
      toast.error("Please select a delivery address.");
      return false;
    }
    
    const selectedPin = savedAddresses[selectedSavedIndex]?.pincode?.trim();
    if (!VALID_PINCODES.includes(selectedPin)) {
       toast.error('Distance too long! This saved address is outside our 5km delivery zone.');
       return false;
    }
    
    return true;
  };

  const handleContinueToPayment = async () => {
    if (addressMode === 'saved') {
      if (validateSavedAddress()) {
        setStep(2);
        window.scrollTo(0, 0);
      }
    } else {
      if (validateAddress()) {
        if (isSavingAddress && user) {
          try {
            await addAddress(address);
          } catch (error) {
            console.error("Failed to save address:", error);
          }
        }
        setStep(2);
        window.scrollTo(0, 0);
      }
    }
  };

  const selectSavedAddress = (savedAddr, index) => {
    setAddress(savedAddr);
    setSelectedSavedIndex(index);
    toast.success("Address selected");
  };

  const handlePlaceOrder = () => {
    const newId = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderId(newId);
    onCheckout(address, paymentMethod);
    setStep(3);
    window.scrollTo(0, 0);
  };

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
  };
  const [direction, setDirection] = useState(1);

  const goToStep = (s) => {
    setDirection(s > step ? 1 : -1);
    setStep(s);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-8">

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8 md:mb-12">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all border ${
                step >= s.id
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-dark-card text-gray-500 border-white/5'
              }`}>
                <span className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold ${
                  step > s.id ? 'bg-primary text-black' :
                  step === s.id ? 'bg-primary/20 text-primary border border-primary/40' :
                  'bg-white/5 text-gray-500'
                }`}>
                  {step > s.id ? <CheckCircle size={12} /> : s.id}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-1 md:mx-2 rounded ${step > s.id ? 'bg-primary' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {/* ===== STEP 1: ADDRESS ===== */}
          {step === 1 && (
            <motion.div
              key="address"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="card p-5 md:p-8">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif text-white">Delivery Address</h2>
                    <p className="text-gray-500 text-xs md:text-sm">Where should we deliver your order?</p>
                  </div>
                </div>

                {/* Address Selection Mode */}
                {user && savedAddresses.length > 0 && (
                  <div className="flex bg-dark/40 p-1 rounded-xl mb-8 border border-white/5">
                    <button
                      onClick={() => setAddressMode('saved')}
                      className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                        addressMode === 'saved' 
                          ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Saved Addresses
                    </button>
                    <button
                      onClick={() => {
                        setAddressMode('new');
                        setAddress({
                          fullName: '',
                          phone: '',
                          addressLine1: '',
                          addressLine2: '',
                          city: '',
                          pincode: '',
                        });
                        setSelectedSavedIndex(-1);
                      }}
                      className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                        addressMode === 'new' 
                          ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      New Address
                    </button>
                  </div>
                )}

                {/* Saved Addresses List */}
                {addressMode === 'saved' && user && savedAddresses.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 mb-8">
                    {savedAddresses.map((addr, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectSavedAddress(addr, idx)}
                        className={`text-left p-5 rounded-xl border transition-all group relative ${
                          selectedSavedIndex === idx 
                            ? 'bg-primary/10 border-primary/50 ring-1 ring-primary/30' 
                            : 'bg-white/5 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedSavedIndex === idx ? 'border-primary bg-primary' : 'border-gray-600'
                          }`}>
                            {selectedSavedIndex === idx && <div className="w-2 h-2 rounded-full bg-black" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white mb-1">{addr.fullName}</p>
                            <p className="text-xs text-gray-400">
                              {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city} - {addr.pincode}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* New Address Form */}
                {(addressMode === 'new' || !user || savedAddresses.length === 0) && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                      <div className="sm:col-span-1">
                        <label className="text-xs font-medium text-gray-400 mb-1.5 block">Full Name *</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={address.fullName}
                          onChange={e => setAddress({...address, fullName: e.target.value})}
                          className={`input-field ${addressErrors.fullName ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        />
                        {addressErrors.fullName && <p className="text-red-400 text-[10px] mt-1">{addressErrors.fullName}</p>}
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-xs font-medium text-gray-400 mb-1.5 block">Phone Number *</label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={address.phone}
                          onChange={e => setAddress({...address, phone: e.target.value})}
                          className={`input-field ${addressErrors.phone ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        />
                        {addressErrors.phone && <p className="text-red-400 text-[10px] mt-1">{addressErrors.phone}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-gray-400 mb-1.5 block">Address Line 1 *</label>
                        <input
                          type="text"
                          placeholder="House/Flat No., Building Name, Street"
                          value={address.addressLine1}
                          onChange={e => setAddress({...address, addressLine1: e.target.value})}
                          className={`input-field ${addressErrors.addressLine1 ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        />
                        {addressErrors.addressLine1 && <p className="text-red-400 text-[10px] mt-1">{addressErrors.addressLine1}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-gray-400 mb-1.5 block">Address Line 2</label>
                        <input
                          type="text"
                          placeholder="Landmark, Area (Optional)"
                          value={address.addressLine2}
                          onChange={e => setAddress({...address, addressLine2: e.target.value})}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-400 mb-1.5 block">City *</label>
                        <input
                          type="text"
                          placeholder="Mumbai"
                          value={address.city}
                          onChange={e => setAddress({...address, city: e.target.value})}
                          className={`input-field ${addressErrors.city ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        />
                        {addressErrors.city && <p className="text-red-400 text-[10px] mt-1">{addressErrors.city}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-400 mb-1.5 block">Pincode *</label>
                        <input
                          type="text"
                          placeholder="400001"
                          value={address.pincode}
                          onChange={e => setAddress({...address, pincode: e.target.value})}
                          className={`input-field ${addressErrors.pincode ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        />
                        {addressErrors.pincode && <p className="text-red-400 text-[10px] mt-1">{addressErrors.pincode}</p>}
                      </div>
                    </div>

                    {user && (
                      <div className="mt-6 flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5 group transition-all hover:bg-white/10">
                        <input 
                          type="checkbox" 
                          id="save-address"
                          checked={isSavingAddress}
                          onChange={(e) => setIsSavingAddress(e.target.checked)}
                          className="w-5 h-5 rounded border-white/20 bg-dark text-primary focus:ring-primary/50 transition-all cursor-pointer"
                        />
                        <label htmlFor="save-address" className="text-sm font-medium text-gray-300 cursor-pointer select-none">
                          Save this address for future orders
                        </label>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    <ArrowLeft size={16} /> Back to Cart
                  </button>
                  <button
                    onClick={handleContinueToPayment}
                    className="btn-primary flex items-center gap-2"
                  >
                    Continue to Payment <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 2: PAYMENT ===== */}
          {step === 2 && (
            <motion.div
              key="payment"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="card p-5 md:p-8">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif text-white">Payment Method</h2>
                    <p className="text-gray-500 text-xs md:text-sm">Choose how you'd like to pay</p>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-3 mb-6">
                  {[
                    { id: 'cod', label: 'Cash on Delivery', sublabel: 'Pay when your food arrives', icon: <Banknote size={22} className="text-emerald-500" /> },
                    // { id: 'upi', label: 'UPI Payment', sublabel: 'Google Pay, PhonePe, Paytm', icon: <Smartphone size={22} className="text-blue-500" /> },
                    // { id: 'card', label: 'Credit / Debit Card', sublabel: 'Visa, Mastercard, Rupay', icon: <CreditCard size={22} className="text-purple-500" /> },
                  ].map(opt => (
                    <div key={opt.id}>
                      <button
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                          paymentMethod === opt.id
                            ? 'bg-primary/5 border-primary/30 shadow-[0_0_15px_rgba(255,122,0,0.1)]'
                            : 'bg-dark border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                          paymentMethod === opt.id ? 'bg-white/5 border-primary/20' : 'bg-white/5 border-white/10'
                        }`}>
                          {opt.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{opt.label}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{opt.sublabel}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          paymentMethod === opt.id
                            ? 'border-primary bg-primary'
                            : 'border-gray-600'
                        }`}>
                          {paymentMethod === opt.id && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </button>

                      {/* UPI field */}
                      {/* <AnimatePresence>
                        {paymentMethod === 'upi' && opt.id === 'upi' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 pl-14">
                              <label className="text-xs font-medium text-gray-400 mb-1.5 block">UPI ID</label>
                              <input
                                type="text"
                                placeholder="yourname@upi"
                                value={upiId}
                                onChange={e => setUpiId(e.target.value)}
                                className="input-field max-w-xs"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence> */}

                      {/* Card fields */}
                      {/* <AnimatePresence>
                        {paymentMethod === 'card' && opt.id === 'card' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 pl-4 md:pl-14 space-y-3">
                              <div>
                                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Card Number</label>
                                <input
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  maxLength={19}
                                  value={cardDetails.number}
                                  onChange={e => setCardDetails({...cardDetails, number: e.target.value})}
                                  className="input-field"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">Expiry</label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    value={cardDetails.expiry}
                                    onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                                    className="input-field"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">CVV</label>
                                  <input
                                    type="password"
                                    placeholder="•••"
                                    maxLength={4}
                                    value={cardDetails.cvv}
                                    onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})}
                                    className="input-field"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence> */}
                    </div>
                  ))}
                </div>

                {/* Order Summary Mini */}
                <div className="bg-dark rounded-xl border border-white/5 p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-gray-300">
                        <span className="truncate pr-4">{item.name} × {item.quantity}</span>
                        <span className="text-white font-medium shrink-0">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/5 pt-2 mt-2 flex justify-between font-bold text-white">
                      <span>Total</span>
                      <span className="text-primary">₹{total}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => { setDirection(-1); setStep(1); }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    <ArrowLeft size={16} /> Change Address
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="btn-primary flex items-center gap-2 group"
                  >
                    Confirm & Place Order <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 3: ORDER CONFIRMED ===== */}
          {step === 3 && (
            <motion.div
              key="confirmed"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="card p-6 md:p-10 text-center">
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle size={40} className="text-green-500" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">Order Confirmed!</h2>
                  <p className="text-gray-400 text-sm md:text-base mb-1">Thank you for your order</p>
                  <p className="text-primary font-bold text-lg mb-6">Order #{orderId}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.6 }}
                  className="bg-dark rounded-xl border border-white/5 p-4 md:p-6 mb-6 text-left max-w-md mx-auto"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Truck size={20} className="text-primary" />
                    <div>
                      <p className="text-white text-sm font-medium">Estimated Delivery</p>
                      <p className="text-primary font-bold">30 - 45 minutes</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/5 pt-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-gray-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-400">
                        {address.fullName}, {address.addressLine1}
                        {address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city} - {address.pincode}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CreditCard size={14} className="text-gray-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-400">
                        {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI Payment' : 'Card Payment'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                  <button
                    onClick={() => navigate('/orders')}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    <Package size={18} /> Track My Order
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="btn-outline flex items-center justify-center gap-2"
                  >
                    <Home size={18} /> Back to Home
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
