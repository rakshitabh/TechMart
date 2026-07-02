import React from 'react';
import { ShoppingBag, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-brand-600 p-2 rounded-lg text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight font-display bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
                TechMart
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Premium next-generation tech e-commerce built for developers, creators, and enthusiasts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wider uppercase">
              Shop Categories
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/products?category=Smartphones" className="text-sm text-gray-500 dark:text-slate-400 hover:text-brand-500 transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Laptops" className="text-sm text-gray-500 dark:text-slate-400 hover:text-brand-500 transition-colors">
                  Laptops
                </Link>
              </li>
              <li>
                <Link to="/products?category=Peripherals" className="text-sm text-gray-500 dark:text-slate-400 hover:text-brand-500 transition-colors">
                  Peripherals
                </Link>
              </li>
              <li>
                <Link to="/products?category=Audio" className="text-sm text-gray-500 dark:text-slate-400 hover:text-brand-500 transition-colors">
                  Audio & Sound
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-500 dark:text-slate-400 hover:text-brand-500 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 dark:text-slate-400 hover:text-brand-500 transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 dark:text-slate-400 hover:text-brand-500 transition-colors">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 dark:text-slate-400 hover:text-brand-500 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wider uppercase">
              TechMart HQ
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-slate-400">
              <li>101 Silicon Valley Blvd</li>
              <li>San Jose, CA 95110</li>
              <li>Email: contact@techmart.dev</li>
              <li>Phone: +1 (555) 019-2834</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 dark:border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 dark:text-slate-500">
            &copy; 2026 TechMart Inc. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <a href="#" className="text-xs text-gray-400 hover:text-brand-500">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-400 hover:text-brand-500">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
