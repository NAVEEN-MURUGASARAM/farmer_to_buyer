// src/components/common/Footer.jsx
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <span className="text-xl font-bold text-white">FarmerToBuyer</span>
            </div>
            <p className="text-sm text-gray-400">
              Connecting farmers directly with buyers for fresh, organic, and sustainable agriculture.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-green-500 transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="hover:text-green-500 transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="hover:text-green-500 transition">
                <Instagram size={18} />
              </a>
              <a href="#" className="hover:text-green-500 transition">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-green-500 transition">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-green-500 transition">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-green-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-green-500 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500 transition">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500 transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex gap-3 text-gray-400">
                <Mail size={18} className="flex-shrink-0 text-green-500" />
                <span className="text-sm">support@farmertobuy.com</span>
              </li>
              <li className="flex gap-3 text-gray-400">
                <Phone size={18} className="flex-shrink-0 text-green-500" />
                <span className="text-sm">+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex gap-3 text-gray-400">
                <MapPin size={18} className="flex-shrink-0 text-green-500" />
                <span className="text-sm">Bengaluru, Karnataka, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div>
              <p>© 2024 FarmerToBuyer. All rights reserved.</p>
            </div>
            <div className="flex justify-center gap-6">
              <a href="#" className="hover:text-green-500 transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-green-500 transition">
                Terms of Service
              </a>
              <a href="#" className="hover:text-green-500 transition">
                Cookie Policy
              </a>
            </div>
            <div className="text-right">
              <p>Made with ❤️ for sustainable agriculture</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}