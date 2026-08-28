'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { customerSignupAction } from '@/lib/auth-actions';
import { useAuth } from '@/lib/context/auth-context';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await customerSignupAction(null, formData);
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
            Join Velocity
          </span>
          <h1 className="text-2xl font-black uppercase tracking-widest text-neutral-950">
            Create Account
          </h1>
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1.5 font-bold">
            Sign up to track orders & join the club
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] uppercase tracking-wider font-bold text-red-700 leading-normal">
                {error}
              </p>
            </div>
          )}

          {/* Name field */}
          <div className="space-y-1.5">
            <label 
              htmlFor="name" 
              className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                disabled={isPending}
                placeholder="ENTER YOUR NAME"
                className="block w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 text-xs tracking-wider uppercase text-neutral-900 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label 
              htmlFor="email" 
              className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                placeholder="ENTER YOUR EMAIL"
                className="block w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 text-xs tracking-wider uppercase text-neutral-900 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label 
              htmlFor="password" 
              className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={isPending}
                placeholder="MINIMUM 6 CHARACTERS"
                className="block w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 text-xs tracking-wider text-neutral-900 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Confirm Password field */}
          <div className="space-y-1.5">
            <label 
              htmlFor="confirmPassword" 
              className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                disabled={isPending}
                placeholder="RE-ENTER PASSWORD"
                className="block w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 text-xs tracking-wider text-neutral-900 placeholder-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-between px-6 py-3.5 bg-neutral-950 hover:bg-neutral-850 disabled:bg-neutral-300 disabled:text-neutral-500 text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-200 group"
          >
            <span>{isPending ? 'Creating Account...' : 'Create Account'}</span>
            {!isPending && <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
          </button>
        </form>

        {/* Footer redirection */}
        <div className="mt-8 text-center border-t border-neutral-100 pt-6">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-neutral-950 font-bold hover:underline transition-all"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
