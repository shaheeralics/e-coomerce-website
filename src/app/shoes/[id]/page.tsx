import React from 'react';
import ShoeDetailClient from './ShoeDetailClient';
import { getShoesAction } from '@/lib/actions';
import { MOCK_SHOES } from '@/lib/mock-shoes';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const shoes = await getShoesAction();
    if (shoes && shoes.length > 0) {
      return shoes.map((shoe) => ({ id: shoe.id }));
    }
  } catch (err) {
    console.error('Failed to generate static params for shoes:', err);
  }
  return MOCK_SHOES.map((shoe) => ({ id: shoe.id }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ShoeDetailClient id={resolvedParams.id} />;
}
