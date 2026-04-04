import { MapPin, Phone, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-3xl font-serif tracking-widest mb-4">
              D <span className="text-primary">VEG</span> WOK
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium Vegetarian Dining Experience. Indian, Chinese, Thai and much more crafted to perfection.
            </p>
            <div className="flex space-x-3 pt-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif text-white mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', to: '/' },
                { name: 'Full Menu', to: '/menu' },
                { name: 'Reserve Table', to: '/reservation' },
                { name: 'Reviews', to: '/reviews' },
                { name: 'Contact', to: '/contact' },
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.to} className="text-gray-400 hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif text-white mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="text-primary mt-1 mr-3 shrink-0" size={18} />
                <span className="text-gray-400 text-sm leading-relaxed">
                  Shop no.1, Vijay Nagar Road,<br/>
                  Damodar Nagar, Nalasopara East,<br/>
                  Maharashtra 401209
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="text-primary mr-3 shrink-0" size={18} />
                <span className="text-gray-400 text-sm">072648 78434</span>
              </li>
              <li className="flex items-center">
                <Clock className="text-primary mr-3 shrink-0" size={18} />
                <span className="text-gray-400 text-sm">Open Till: 11:30 PM</span>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div className="h-48 rounded-lg overflow-hidden border border-white/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.6540083580835!2d72.81867097719402!3d19.42734969407662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7af8b49ea55eb%3A0xd8f1eedb577a056d!2sD%20VEG%20WOK!5e0!3m2!1sen!2sin!4v1772800182403!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant Location"
              className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            />
          </div>
        </div>

        <div className="border-t border-white/10 flex flex-col md:flex-row justify-between items-center py-6 mt-4">
          <p className="text-gray-500 text-sm mb-3 md:mb-0">
            &copy; {new Date().getFullYear()} D VEG WOK. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
