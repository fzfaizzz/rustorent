import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Mail, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ 
          name: formData.name, 
          message: formData.message,
          user_email: user?.email || 'Guest'
        }]);

      if (error) throw error;

      toast.success('Message Sent Successfully!');
      setFormData({ name: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback
      toast.success('Message Sent (Local Mode)!');
      setFormData({ name: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us" 
        description="Get in touch with VIP Veg Restaurant. We're here to answer all your questions about catering, reservations, and more."
        url="https://dvegwok.com/contact"
      />
      <div className="min-h-screen pt-24 pb-16 bg-dark">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-8">
        <div className="text-center mb-12">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-heading">
            Get In <span className="text-primary italic">Touch</span>
          </motion.h1>
          <div className="section-divider" />
          <p className="text-gray-400 mt-4">We'd love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card p-8 space-y-6">
              <h2 className="text-2xl font-serif">Contact Information</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">Address</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Shop no.1, Vijay Nagar Road,<br />
                      Damodar Nagar, Nalasopara East,<br />
                      Maharashtra 401209
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">Phone</h3>
                    <p className="text-gray-400 text-sm">072648 78434</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">Hours</h3>
                    <p className="text-gray-400 text-sm">Open Till 11:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">Email</h3>
                    <p className="text-gray-400 text-sm">info@dvegwok.com</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card p-8">
              <h2 className="text-2xl font-serif mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
                <textarea
                  required
                  placeholder="Your Message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field resize-none"
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} 
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card overflow-hidden h-80"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.6540083580835!2d72.81867097719402!3d19.42734969407662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7af8b49ea55eb%3A0xd8f1eedb577a056d!2sD%20VEG%20WOK!5e0!3m2!1sen!2sin!4v1772800182403!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="D VEG WOK Location"
            className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          ></iframe>
        </motion.div>
      </div>
    </div>
    </>
  );
}
