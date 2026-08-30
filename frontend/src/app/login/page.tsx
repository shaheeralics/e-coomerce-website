'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { customerLoginAction } from '@/lib/auth-actions';
import { useAuth } from '@/lib/context/auth-context';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await customerLoginAction(null, formData);
    setIsPending(false);
    if (result && result.error) {
      setError(result.error);
    } else {
      await refreshUser();
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-white py-16 px-4 font-sans select-none">
      <div className="w-full max-w-md bg-white border border-neutral-100 p-8 md:p-10 shadow-lg">
        
        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-[9px] font-black uppercase tracking-widest bg-neutral-900 text-white px-3 py-1 mb-3 inline-block">
            Member Access
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest text-neutral-950">
            Sign In
          </h1>
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1.5 font-bold">
            Access your orders & exclusive releases
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] uppercase tracking-wider font-bold text-red-700 leading-normal">
                {error}
              </p>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500"
            >
              Email Address or Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                disabled={isPending}
                placeholder="ENTER YOUR EMAIL OR USERNAME"
                className="block w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 text-xs tracking-wider uppercase text-neutral-900 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label 
                htmlFor="password" 
                className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isPending}
                placeholder="ENTER YOUR PASSWORD"
                className="block w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 text-xs tracking-wider text-neutral-900 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-between px-6 py-3.5 bg-neutral-950 hover:bg-neutral-850 disabled:bg-neutral-300 disabled:text-neutral-500 text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-200 group"
          >
            <span>{isPending ? 'Signing In...' : 'Sign In'}</span>
            {!isPending && <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
          </button>
        </form>

        {/* Footer redirection */}
        <div className="mt-8 text-center border-t border-neutral-100 pt-6">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
            Don't have an account?{' '}
            <Link 
              href="/signup" 
              className="text-neutral-950 font-bold hover:underline transition-all"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
