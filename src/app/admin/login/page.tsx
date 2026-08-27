'use client';

import React, { useActionState } from 'react';
import { adminLoginAction } from './actions';
import { Lock, User, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

const initialState = {
  error: null as string | null,
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await adminLoginAction(prevState, formData);
      return result || { error: null };
    },
    initialState
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 px-4 font-sans select-none relative overflow-hidden">
      
      {/* Decorative Subtle Glowing Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

      {/* Glassmorphic Container Card */}
      <div className="w-full max-w-md bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 p-8 shadow-2xl relative z-10">
        
        {/* Top Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-none mb-4">
            <ShieldCheck className="w-6 h-6 text-white stroke-[1.5]" />
          </div>
          <h1 className="text-xl font-black tracking-widest text-white uppercase">
            Velocity Admin
          </h1>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1.5 font-medium">
            Control Center Authorization
          </p>
        </div>

        {/* Action Form */}
        <form action={formAction} className="space-y-5">
          {/* Error Message Box */}
          {state?.error && (
            <div className="p-4 bg-red-950/40 border border-red-900/60 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] uppercase tracking-wider font-bold text-red-400 leading-normal">
                {state.error}
              </p>
            </div>
          )}

          {/* Username Input Field */}
          <div className="space-y-2">
            <label 
              htmlFor="username" 
              className="block text-[9px] font-black uppercase tracking-widest text-neutral-400"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-neutral-500" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                disabled={isPending}
                placeholder="ENTER USERNAME"
                className="block w-full pl-10 pr-4 py-3 bg-neutral-950/60 border border-neutral-800 text-xs tracking-wider uppercase text-white placeholder-neutral-600 focus:border-white focus:ring-1 focus:ring-white focus:outline-none disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="space-y-2">
            <label 
              htmlFor="password" 
              className="block text-[9px] font-black uppercase tracking-widest text-neutral-400"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isPending}
                placeholder="ENTER PASSWORD"
                className="block w-full pl-10 pr-4 py-3 bg-neutral-950/60 border border-neutral-800 text-xs tracking-wider text-white placeholder-neutral-600 focus:border-white focus:ring-1 focus:ring-white focus:outline-none disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-between px-6 py-3.5 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 text-[10px] font-black uppercase tracking-widest transition-all duration-200 group"
          >
            <span>{isPending ? 'Authenticating...' : 'Authorize Login'}</span>
            {!isPending && <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
          </button>
        </form>

        {/* Bottom Security notice info */}
        <div className="mt-8 text-center border-t border-neutral-800/60 pt-6">
          <p className="text-[9px] text-neutral-600 uppercase tracking-widest">
            Secured Session • IP logged for auditing
          </p>
        </div>
      </div>
    </div>
  );
}
