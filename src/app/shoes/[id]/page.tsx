import React from 'react';
import ShoeDetailClient from './ShoeDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ShoeDetailClient id={resolvedParams.id} />;
}
