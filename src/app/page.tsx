import React from 'react';
import Link from 'next/link';
import { getShoes } from '@/lib/supabase/client';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, ShieldCheck, RefreshCw, Truck, Leaf } from 'lucide-react';

export const revalidate = 3600; // Revalidate page data every hour

export default async function Home() {
  const shoes = await getShoes();
  const trendingShoes = shoes.filter(s => s.inStock).slice(0, 4);

  const categories = [
    {
      title: "Men's Collection",
      subtitle: "Performance & Comfort",
      image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop",
      href: "/shoes?gender=men",
      gridArea: "md:col-span-2 md:row-span-1"
    },
    {
      title: "Women's Collection",
      subtitle: "Featherweight & Contoured",
      image: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=800&auto=format&fit=crop",
      href: "/shoes?gender=women",
      gridArea: "md:col-span-1 md:row-span-1"
    },
    {
      title: "Performance Running",
      subtitle: "Carbon-Plated Propulsion",
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop",
      href: "/shoes?category=running",
      gridArea: "md:col-span-1 md:row-span-1"
    },
    {
      title: "Limited Drops",
      subtitle: "Individually Numbered Releases",
      image: "https://images.unsplash.com/photo-1579338559194-a162d19de842?q=80&w=800&auto=format&fit=crop",
      href: "/shoes?category=limited",
      gridArea: "md:col-span-2 md:row-span-1"
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] bg-neutral-50 flex items-center justify-center overflow-hidden border-b border-neutral-100">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-r from-neutral-100/90 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1508184964240-ee96bb96778f?q=80&w=1600&auto=format&fit=crop"
            alt="Running background"
            className="w-full h-full object-cover opacity-35"
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
          <div className="space-y-6 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-neutral-900 text-white px-3 py-1">
              New Launch: Stratus V1
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-neutral-950 leading-[0.9] uppercase">
              The Standard <br />Of Speed.
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed uppercase tracking-wider">
              Engineered with dual-density foam and responsive HyperFoam technology. Velocity Stratus V1 offers cloud-cushioning and high energy return, fully crafted with carbon-neutral materials.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                href="/shoes"
                className="px-8 py-4 bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest text-center transition-colors duration-200"
              >
                Shop Collection
              </Link>
              <Link
                href="/shoes/velocity-stratus-v1"
                className="px-8 py-4 bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-50 text-xs font-bold uppercase tracking-widest text-center transition-colors duration-200"
              >
                Explore Stratus V1
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            {/* Soft decorative glow */}
            <div className="absolute w-72 h-72 rounded-full bg-neutral-200/50 blur-3xl -z-10 animate-pulse" />
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
              alt="Velocity Stratus Sneaker Showcase"
              className="w-full max-w-lg object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:rotate-[-5deg] transition-transform duration-500 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Value Propositions Bar */}
      <section className="bg-white border-b border-neutral-100 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neutral-50 border border-neutral-100">
                <Truck className="w-5 h-5 text-neutral-900" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900">Free Delivery</h3>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">On all orders, worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neutral-50 border border-neutral-100">
                <RefreshCw className="w-5 h-5 text-neutral-900" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900">30-Day Wear Test</h3>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Returns accepted, no questions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neutral-50 border border-neutral-100">
                <ShieldCheck className="w-5 h-5 text-neutral-900" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900">Authentic Quality</h3>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Individually tracked series</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neutral-50 border border-neutral-100">
                <Leaf className="w-5 h-5 text-neutral-900" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900">100% Carbon Neutral</h3>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Eucalyptus and sugar cane basis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Curated Selection</span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-neutral-900 mt-1">Trending Now</h2>
            </div>
            <Link
              href="/shoes"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-500 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {trendingShoes.map((shoe) => (
              <ProductCard key={shoe.id} shoe={shoe} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Tailored Fit</span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-neutral-900 mt-1">Explore Collections</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.title}
                className={`relative aspect-video md:aspect-auto md:h-[400px] overflow-hidden group border border-neutral-200 ${category.gridArea}`}
              >
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-neutral-950/45 group-hover:bg-neutral-950/55 transition-colors duration-300" />
                
                {/* Info Text */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white z-10">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-300 mb-1">{category.subtitle}</span>
                  <h3 className="text-lg sm:text-xl font-bold uppercase tracking-widest mb-4">{category.title}</h3>
                  <div>
                    <Link
                      href={category.href}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-neutral-900 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-100 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Ethos / Sustainability Block */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square md:aspect-video lg:aspect-auto lg:h-[450px] overflow-hidden border border-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop"
                alt="Eucalyptus tree fiber knitting details"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Carbon Neutral Design</span>
              <h2 className="text-3xl font-black uppercase tracking-wider text-neutral-900 leading-tight">
                Designed to tread lightly on the Earth.
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed uppercase tracking-wider">
                We believe that premium style shouldn&apos;t compromise our planet. Every pair of Velocity sneakers is engineered with carbon-neutral materials, including renewable eucalyptus wood fibers, sugarcane-based SweetFoam midsoles, and laces crafted from 100% recycled plastic bottles.
              </p>
              <div className="pt-2">
                <Link
                  href="/shoes?category=casual"
                  className="inline-flex items-center gap-2 border-b-2 border-neutral-950 pb-1 text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
                >
                  <span>Learn about our Eco-Breeze series</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
