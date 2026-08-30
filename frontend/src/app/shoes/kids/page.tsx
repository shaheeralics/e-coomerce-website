'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getShoes } from '@/lib/supabase/client';
import { Shoe } from '@/types';
import ProductCard from '@/components/ProductCard';
import { SlidersHorizontal, ChevronDown, X, Star } from 'lucide-react';

export default function KidsShoesPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <KidsShoesCatalogContent />
    </Suspense>
  );
}

function KidsShoesCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allShoes, setAllShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter states (gender preselected to 'kids')
  const [selectedGenders, setSelectedGenders] = useState<string[]>(['kids']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Load shoes from data layer
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getShoes();
        setAllShoes(data);
      } catch (error) {
        console.error('Failed to load shoes:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync URL search parameters on mount or change (but keep kids)
  useEffect(() => {
    if (loading) return;
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories([categoryParam.toLowerCase()]);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams, loading]);

  const availableSizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
  const availableColors = ['White', 'Black', 'Blue', 'Grey', 'Green', 'Pink', 'Sand', 'Red', 'Orange'];

  const toggleGender = (gender: string) => {
    // If they toggle, they can go to men/women or clear
    setSelectedGenders(prev =>
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleSize = (size: number) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const resetFilters = () => {
    setSelectedGenders(['kids']);
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(300);
    setSortBy('featured');
  };

  // Filter and Sort shoes
  const processedShoes = useMemo(() => {
    let result = [...allShoes];

    // 1. Gender Filter
    if (selectedGenders.length > 0) {
      result = result.filter(shoe => {
        const isMen = selectedGenders.includes('men') && (shoe.category === 'men' || shoe.category === 'running' || shoe.category === 'casual' || shoe.name.toLowerCase().includes('men') || !shoe.name.toLowerCase().includes('luna knit'));
        const isWomen = selectedGenders.includes('women') && (shoe.category === 'women' || shoe.category === 'casual' || shoe.category === 'running' || shoe.name.toLowerCase().includes('luna knit') || shoe.name.toLowerCase().includes('women'));
        const isKids = selectedGenders.includes('kids') && (shoe.category === 'kids' || shoe.name.toLowerCase().includes('kids') || (shoe as any).gender === 'kids');
        return isMen || isWomen || isKids;
      });
    }

    // 2. Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter(shoe => selectedCategories.includes(shoe.category));
    }

    // 3. Size Filter
    if (selectedSizes.length > 0) {
      result = result.filter(shoe => shoe.sizes.some(size => selectedSizes.includes(size)));
    }

    // 4. Color Filter
    if (selectedColors.length > 0) {
      result = result.filter(shoe =>
        shoe.colors.some(colorName =>
          selectedColors.some(selColor =>
            colorName.toLowerCase().includes(selColor.toLowerCase())
          )
        )
      );
    }

    // 5. Price Filter
    result = result.filter(shoe => shoe.price <= maxPrice);

    // 6. Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (a.badge === 'New' ? -1 : 1));
    }

    return result;
  }, [allShoes, selectedGenders, selectedCategories, selectedSizes, selectedColors, maxPrice, sortBy]);

  const activeFiltersCount = (selectedGenders.includes('kids') && selectedGenders.length > 1 ? selectedGenders.length - 1 : selectedGenders.length === 0 ? 0 : 0) + selectedCategories.length + selectedSizes.length + selectedColors.length + (maxPrice < 300 ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full flex flex-col">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Kids Collection</span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-neutral-900 mt-1">
            Kids Shoes ({processedShoes.length})
          </h1>
        </div>

        {/* Sort & Mobile filter button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-900 bg-white hover:bg-neutral-50 md:hidden transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Sort By</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-900 py-2.5 pl-4 pr-10 rounded-none focus:outline-hidden focus:border-neutral-900 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 items-start flex-grow">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-28 h-[calc(100vh-10rem)] overflow-y-auto pr-4 border-r border-neutral-100 space-y-8 select-none">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900">Filters</h2>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[10px] text-neutral-400 hover:text-neutral-900 font-semibold uppercase tracking-wider transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Gender</h3>
            <div className="space-y-2">
              {['Men', 'Women', 'Kids'].map(gender => (
                <label key={gender} className="flex items-center gap-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGenders.includes(gender.toLowerCase())}
                    onChange={() => toggleGender(gender.toLowerCase())}
                    className="w-4 h-4 rounded-none accent-neutral-950 border-neutral-300 text-neutral-950"
                  />
                  <span className="uppercase tracking-wider">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Category</h3>
            <div className="space-y-2">
              {[
                { label: 'Running', value: 'running' },
                { label: 'Casual', value: 'casual' },
                { label: 'Limited Drops', value: 'limited' }
              ].map(cat => (
                <label key={cat.value} className="flex items-center gap-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.value)}
                    onChange={() => toggleCategory(cat.value)}
                    className="w-4 h-4 rounded-none accent-neutral-950 border-neutral-300 text-neutral-950"
                  />
                  <span className="uppercase tracking-wider">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Size (EU)</h3>
            <div className="grid grid-cols-4 gap-2">
              {availableSizes.map(size => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`py-2 text-[10px] font-semibold border text-center transition-all ${
                      isSelected
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-900 bg-white'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Color</h3>
            <div className="flex flex-wrap gap-2">
              {availableColors.map(color => {
                const isSelected = selectedColors.includes(color);
                return (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-3 py-1.5 text-[9px] font-semibold border uppercase tracking-wider transition-all ${
                      isSelected
                        ? 'border-neutral-950 bg-neutral-950 text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-900 bg-white'
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Max Price</h3>
              <span className="text-xs font-bold text-neutral-900">Rs. {maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="300"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-neutral-950 bg-neutral-200 h-1 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              <span>Rs. 100</span>
              <span>Rs. 300</span>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 w-full flex flex-col h-full min-h-[40vh]">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 flex-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col">
                  <div className="aspect-square bg-neutral-100 border border-neutral-200 w-full mb-4" />
                  <div className="h-4 bg-neutral-100 w-2/3 mb-2" />
                  <div className="h-3 bg-neutral-100 w-1/3 mb-4" />
                  <div className="h-4 bg-neutral-100 w-1/4 mt-auto" />
                </div>
              ))}
            </div>
          ) : processedShoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center flex-grow border border-dashed border-neutral-200 p-8">
              <h3 className="text-base font-semibold text-neutral-900 uppercase tracking-widest mb-2">No shoes found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mb-6 uppercase tracking-wider">
                No products match this filter criteria for kids.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {processedShoes.map((shoe) => (
                <ProductCard key={shoe.id} shoe={shoe} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-neutral-900/60 backdrop-blur-xs">
          <div className="relative flex w-full max-w-xs flex-col bg-white pb-12 shadow-xl animate-slide-right-in overflow-y-auto">
            {/* Header */}
            <div className="flex px-4 pt-5 pb-3 justify-between items-center border-b border-neutral-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Filters ({activeFiltersCount})</h2>
              <button
                type="button"
                className="p-2 -mr-2 text-neutral-400 hover:text-neutral-950 rounded-full hover:bg-neutral-50"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter controls */}
            <div className="p-4 space-y-8">
              
              {/* Gender */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Gender</h3>
                <div className="space-y-2">
                  {['Men', 'Women', 'Kids'].map(gender => (
                    <label key={gender} className="flex items-center gap-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes(gender.toLowerCase())}
                        onChange={() => toggleGender(gender.toLowerCase())}
                        className="w-4 h-4 rounded-none accent-neutral-950 border-neutral-300 text-neutral-950"
                      />
                      <span className="uppercase tracking-wider">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Category</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Running', value: 'running' },
                    { label: 'Casual', value: 'casual' },
                    { label: 'Limited Drops', value: 'limited' }
                  ].map(cat => (
                    <label key={cat.value} className="flex items-center gap-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.value)}
                        onChange={() => toggleCategory(cat.value)}
                        className="w-4 h-4 rounded-none accent-neutral-950 border-neutral-300 text-neutral-950"
                      />
                      <span className="uppercase tracking-wider">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Size (EU)</h3>
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map(size => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`py-2 text-[10px] font-semibold border text-center transition-all ${
                          isSelected
                            ? 'border-neutral-950 bg-neutral-950 text-white'
                            : 'border-neutral-200 text-neutral-600 bg-white'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map(color => {
                    const isSelected = selectedColors.includes(color);
                    return (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-1.5 text-[9px] font-semibold border uppercase tracking-wider transition-all ${
                          isSelected
                            ? 'border-neutral-950 bg-neutral-950 text-white'
                            : 'border-neutral-200 text-neutral-600 bg-white'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Max Price</h3>
                  <span className="text-xs font-bold text-neutral-900">Rs. {maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="300"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-neutral-950 bg-neutral-200 h-1 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  <span>Rs. 100</span>
                  <span>Rs. 300</span>
                </div>
              </div>

            </div>

            {/* Sticky Actions in Drawer */}
            <div className="mt-auto px-4 pt-6 border-t border-neutral-100 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 text-center border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 text-center bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full flex flex-col">
      <div className="h-10 bg-neutral-100 w-1/3 mb-10 animate-pulse" />
      <div className="flex gap-8 items-start flex-grow">
        <aside className="hidden md:block w-64 h-[calc(100vh-10rem)] bg-neutral-50 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-neutral-100 border border-neutral-200 w-full mb-4 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
