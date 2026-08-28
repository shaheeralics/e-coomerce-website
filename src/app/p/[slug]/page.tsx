import React from 'react';
import CustomPageClient from './CustomPageClient';
import { getCustomPagesAction } from '@/lib/actions';

export async function generateStaticParams() {
  try {
    const pages = await getCustomPagesAction();
    if (pages && pages.length > 0) {
      return pages.map((page) => ({ slug: page.slug }));
    }
  } catch (err) {
    console.error('Failed to generate static params for custom pages:', err);
  }
  return [
    { slug: 'about-us' },
    { slug: 'about-velocity' },
    { slug: 'privacy-policy' },
    { slug: 'terms-of-service' }
  ];
}

export default function CustomStaticPage() {
  return <CustomPageClient />;
}
