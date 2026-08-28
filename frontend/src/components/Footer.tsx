'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Send, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setEmail('');
  };

  const footerLinks = {
    shop: [
      { label: 'Shop All', href: '/shoes' },
      { label: 'Men\'s Collection', href: '/shoes?gender=men' },
      { label: 'Women\'s Collection', href: '/shoes?gender=women' },
      { label: 'Performance Running', href: '/shoes?category=running' },
      { label: 'Casual Essentials', href: '/shoes?category=casual' },
      { label: 'Limited Releases', href: '/shoes?category=limited' },
    ],
    company: [
      { label: 'Our Story', href: '#' },
      { label: 'Sustainability', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Journal', href: '#' },
      { label: 'Press & Media', href: '#' },
    ],
    support: [
      { label: 'Contact Us', href: '#' },
      { label: 'Shipping & Delivery', href: '#' },
      { label: 'Returns & Exchanges', href: '#' },
      { label: 'Size Guide', href: '#' },
      { label: 'Order Status', href: '#' },
      { label: 'FAQ', href: '#' },
    ]
  };

  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-8 border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="pb-12 mb-12 border-b border-neutral-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Join the Velocity Club</h3>
            <p className="text-xs text-neutral-400 leading-relaxed uppercase tracking-wider">
              Subscribe to receive early access to limited edition drops, exclusive events, and technical updates.
            </p>
          </div>
          
          <div className="w-full max-w-md">
            {isSubscribed ? (
              <div className="p-4 bg-neutral-900 border border-neutral-800 text-center animate-fade-in">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                  Welcome to Velocity. Check your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border border-neutral-800 focus-within:border-white transition-colors duration-200">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  required
                  className="w-full px-4 py-3 bg-transparent text-xs tracking-wider border-none outline-hidden text-white placeholder-neutral-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-6 bg-white hover:bg-neutral-200 text-neutral-950 flex items-center justify-center transition-colors duration-200"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-800">
          
          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Brand */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Velocity Core</h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4 uppercase tracking-wider">
              Velocity builds high-performance, carbon-neutral activewear and running shoes designed for ultimate speed, durability, and minimal environmental impact.
            </p>
            <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              <a href="#" className="hover:text-white transition-colors duration-200">IG</a>
              <a href="#" className="hover:text-white transition-colors duration-200">TW</a>
              <a href="#" className="hover:text-white transition-colors duration-200">YT</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-neutral-500 font-medium uppercase tracking-widest">
          <div className="text-center md:text-left">
            &copy; {new Date().getFullYear()} VELOCITY Inc. All rights reserved.
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">CA Supply Chains</a>
          </div>

          <div className="flex gap-2.5 text-[9px] border border-neutral-800 px-3 py-1 text-neutral-400 rounded-none uppercase">
            <span>VISA</span>
            <span>MC</span>
            <span>AMEX</span>
            <span>APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
