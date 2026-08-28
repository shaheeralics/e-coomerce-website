'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCustomPageBySlugAction } from '@/lib/actions';
import { CustomPage } from '@/types';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CustomPageClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      if (!slug) return;
      try {
        const data = await getCustomPageBySlugAction(slug);
        if (data && data.isPublished) {
          setPage(data);
        } else {
          setPage(null);
        }
      } catch (err) {
        console.error('Failed to load custom page:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center flex-grow flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center flex-grow flex flex-col justify-center items-center font-sans">
        <h2 className="text-xl font-black uppercase tracking-widest text-neutral-900 mb-2">Page Not Found</h2>
        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-6">
          The page you are looking for does not exist or has been unpublished by the administrator.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 flex-grow w-full font-sans">
      {/* Back link */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Title */}
      <article className="space-y-6">
        <header className="border-b border-neutral-100 pb-6">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-neutral-900 leading-tight">
            {page.title}
          </h1>
          {page.createdAt && (
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mt-2">
              Published on {new Date(page.createdAt).toLocaleDateString()}
            </span>
          )}
        </header>

        {/* Content body */}
        <div className="text-neutral-700 leading-relaxed text-sm whitespace-pre-line uppercase tracking-wide">
          {page.content}
        </div>
      </article>
    </div>
  );
}
