'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getShoeById } from '@/lib/supabase/client';
import { Shoe } from '@/types';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { Star, Minus, Plus, ShoppingBag, ChevronDown, ChevronUp, Leaf, Check, Heart } from 'lucide-react';

interface ShoeDetailClientProps {
  id: string;
}

export default function ShoeDetailClient({ id }: ShoeDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [loading, setLoading] = useState(true);

  // Detail Page interactive states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  useEffect(() => {
    async function loadShoe() {
      try {
        const data = await getShoeById(id);
        if (data) {
          setShoe(data);
          // Set defaults
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }
          // Set first available size by default
          if (data.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load product details:', error);
      } finally {
        setLoading(false);
      }
    }
    loadShoe();
  }, [id]);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(prev => (prev === section ? null : section));
  };

  const handleAddToCart = () => {
    if (!shoe) return;
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(shoe, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!shoe) return;
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    // Add to cart and navigate immediately to checkout
    addToCart(shoe, selectedSize, selectedColor, quantity);
    router.push('/checkout');
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!shoe) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center flex-grow flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold uppercase tracking-widest text-neutral-900 mb-4">Product Not Found</h2>
        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-6">
          The sneaker details you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => router.push('/shoes')}
          className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const allPossibleSizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Image Gallery (cols: 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Large Image Container */}
          <div className="relative aspect-square w-full bg-neutral-50 border border-neutral-100 overflow-hidden">
            {shoe.badge && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider bg-neutral-900 text-white">
                {shoe.badge}
              </span>
            )}
            <img
              src={shoe.images[activeImageIndex]}
              alt={`${shoe.name} - View ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>

          {/* Thumbnails list */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {shoe.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-20 bg-neutral-50 border flex-shrink-0 focus:outline-hidden transition-all ${
                  idx === activeImageIndex
                    ? 'border-neutral-950 opacity-100 ring-1 ring-neutral-950 shadow-xs'
                    : 'border-neutral-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product details & actions (cols: 5) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Brand/Product titles */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">VELOCITY CORE</span>
            <h1 className="text-3xl font-black uppercase tracking-widest text-neutral-900 mt-1">{shoe.name}</h1>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-neutral-900">
                <Star className="w-4 h-4 fill-neutral-900 stroke-none" />
                <span className="text-xs font-bold">{shoe.rating}</span>
              </div>
              <span className="text-xs text-neutral-400 uppercase tracking-widest">({shoe.reviewsCount} Customer Reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pb-6 border-b border-neutral-100">
            <span className="text-2xl font-extrabold text-neutral-900">Rs. {shoe.price.toLocaleString()}</span>
            {shoe.originalPrice && (
              <span className="text-base text-neutral-400 line-through font-semibold">Rs. {shoe.originalPrice.toLocaleString()}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-600 leading-relaxed uppercase tracking-wider">
            {shoe.description}
          </p>

          {/* Colorway Picker */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Selected Colorway: <span className="text-neutral-900">{selectedColor}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {shoe.colors.map(color => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-[10px] font-bold border uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'border-neutral-950 bg-neutral-950 text-white'
                        : 'border-neutral-200 hover:border-neutral-900 bg-white text-neutral-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              <span>Select Size (EU)</span>
              <button className="underline hover:text-neutral-900 transition-colors">Size Guide</button>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {allPossibleSizes.map(size => {
                const isAvailable = shoe.sizes.includes(size);
                const isSelected = selectedSize === size;

                return (
                  <button
                    key={size}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-xs font-semibold border transition-all relative ${
                      !isAvailable
                        ? 'bg-neutral-50 text-neutral-300 border-neutral-100 cursor-not-allowed line-through'
                        : isSelected
                        ? 'border-neutral-950 bg-neutral-950 text-white font-bold shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-900 bg-white text-neutral-700'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity and CTA Buttons */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Quantity</span>
              
              <div className="flex items-center border border-neutral-200 bg-white">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-2 hover:bg-neutral-50 text-neutral-500 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-sm font-bold text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="p-2 hover:bg-neutral-50 text-neutral-500"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 pt-2">
              {shoe.inStock ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="flex-grow py-4 bg-transparent border border-neutral-950 text-neutral-950 hover:bg-neutral-50 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Bag
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-grow py-4 bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Buy It Now
                  </button>
                </>
              ) : (
                <div className="flex-grow py-4 bg-neutral-100 text-neutral-400 text-xs font-bold uppercase tracking-widest border border-neutral-200 text-center select-none">
                  Out of Stock
                </div>
              )}
              
              <button
                type="button"
                onClick={() => toggleWishlist(shoe)}
                className="px-5 border border-neutral-200 hover:border-neutral-950 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 transition-all duration-300 ${isInWishlist(shoe.id) ? 'fill-red-500 stroke-red-500 scale-110' : 'stroke-neutral-600'}`} />
              </button>
            </div>
          </div>

          {/* Value proposition icon detail */}
          <div className="p-4 bg-neutral-50 border border-neutral-100 flex gap-3.5 items-start">
            <Leaf className="w-5 h-5 text-neutral-800 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-900">Carbon Neutral Material</h4>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-relaxed mt-0.5">
                Every detail of this footwear, from wood fiber uppers to organic sugarcane soles, offsets carbon emissions. Machine washable on cold delicate wash.
              </p>
            </div>
          </div>

          {/* Collapsible Accordions (Specs, Materials, Shipping) */}
          <div className="border-t border-neutral-100 pt-4 divide-y divide-neutral-100">
            
            {/* Specs Accordion */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('specs')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-widest text-neutral-900 py-1.5 focus:outline-hidden"
              >
                <span>Shoe Specifications</span>
                {openAccordion === 'specs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'specs' && (
                <div className="pt-3 pb-1 text-xs text-neutral-500 space-y-1.5 uppercase tracking-wider animate-fade-in pl-1">
                  {shoe.specs && shoe.specs.length > 0 ? (
                    shoe.specs.map((spec, i) => <p key={i}>• {spec}</p>)
                  ) : (
                    <>
                      <p>• Weight: 240g (Lightweight framework)</p>
                      <p>• Heel-to-toe drop: 8mm for natural stride</p>
                      <p>• Neutral stability and medium flexibility</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Materials Accordion */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('materials')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-widest text-neutral-900 py-1.5 focus:outline-hidden"
              >
                <span>Materials & Care</span>
                {openAccordion === 'materials' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'materials' && (
                <div className="pt-3 pb-1 text-xs text-neutral-500 space-y-1.5 uppercase tracking-wider animate-fade-in pl-1">
                  {shoe.materials && shoe.materials.length > 0 ? (
                    shoe.materials.map((mat, i) => <p key={i}>• {mat}</p>)
                  ) : (
                    <>
                      <p>• Upper: Eucalyptus wood fiber mesh</p>
                      <p>• Midsole: Sugarcane-based SweetFoam</p>
                      <p>• Insole: Merino wool comfort lining</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shipping Accordion */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-widest text-neutral-900 py-1.5 focus:outline-hidden"
              >
                <span>Shipping & Returns</span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="pt-3 pb-1 text-xs text-neutral-500 space-y-1.5 uppercase tracking-wider animate-fade-in pl-1">
                  <p>• <b>Free standard shipping</b> on all orders, worldwide.</p>
                  <p>• Deliveries typically arrive in 3-5 business days.</p>
                  <p>• <b>30-Day Wear Test:</b> Run in them, live in them. If you aren&apos;t fully satisfied, return them within 30 days for a full refund.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square bg-neutral-100 border border-neutral-200 w-full" />
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-neutral-100 border border-neutral-200" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="h-4 bg-neutral-100 w-1/4" />
          <div className="h-10 bg-neutral-100 w-3/4" />
          <div className="h-6 bg-neutral-100 w-1/3" />
          <div className="h-24 bg-neutral-100 w-full animate-pulse" />
          <div className="h-10 bg-neutral-100 w-full" />
          <div className="h-14 bg-neutral-100 w-full" />
        </div>
      </div>
    </div>
  );
}
