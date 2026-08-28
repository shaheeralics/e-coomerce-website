'use client';

import React, { useState, useEffect } from 'react';
import { getStoreLocationsAction } from '@/lib/actions';
import { StoreLocation } from '@/types';
import { MapPin, Clock, Navigation, Map } from 'lucide-react';

export default function StoreLocationsPage() {
  const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLocations() {
      try {
        const data = await getStoreLocationsAction();
        setLocations(data);
        if (data.length > 0) {
          setSelectedLocation(data[0]);
        }
      } catch (err) {
        console.error('Failed to load store locations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLocations();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full flex flex-col font-sans">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Retail Experience</span>
        <h1 className="text-3xl font-black uppercase tracking-widest text-neutral-900 mt-1 mb-3">Our Store Locations</h1>
        <p className="text-xs text-neutral-500 uppercase tracking-wider leading-relaxed">
          Step into a Velocity store near you to experience our premium minimalist activewear and get custom fitting assistance.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-neutral-400 uppercase tracking-widest animate-pulse">
          Locating stores...
        </div>
      ) : locations.length === 0 ? (
        <div className="py-20 text-center text-neutral-500 border border-dashed border-neutral-200">
          <Map className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest font-bold">No store locations available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-grow">
          {/* List of locations */}
          <div className="lg:col-span-5 space-y-4">
            {locations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`w-full text-left p-6 border transition-all duration-300 select-none flex flex-col justify-between items-start gap-4 hover:shadow-xs cursor-pointer ${
                    isSelected 
                      ? 'border-neutral-900 bg-neutral-900 text-white' 
                      : 'border-neutral-200 bg-white text-neutral-800'
                  }`}
                >
                  <div className="space-y-2 w-full">
                    <div className="flex justify-between items-center w-full">
                      <h3 className={`text-sm font-black uppercase tracking-wider ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                        {loc.name}
                      </h3>
                      <Navigation className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-neutral-400'}`} />
                    </div>
                    
                    <div className="flex items-start gap-2.5 text-xs">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-neutral-400 mt-0.5" />
                      <p className={`leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {loc.address}
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs border-t pt-3 mt-3 border-neutral-200/10">
                      <Clock className="w-4 h-4 flex-shrink-0 text-neutral-400 mt-0.5" />
                      <div className={`space-y-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        <span className="font-bold uppercase block text-[9px] text-neutral-400">Timings</span>
                        <p>{loc.timings}</p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-7 bg-neutral-55 border border-neutral-100 flex flex-col min-h-[400px]">
            {selectedLocation ? (
              <div className="flex-grow flex flex-col h-full">
                {/* Embed Map Frame */}
                <div className="flex-grow relative bg-neutral-100 border-b border-neutral-200/60 overflow-hidden min-h-[300px]">
                  <iframe
                    src={selectedLocation.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title={selectedLocation.name}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                {/* Details box below map */}
                <div className="p-5 bg-neutral-50">
                  <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-1">
                    {selectedLocation.name} Directions
                  </h4>
                  <p className="text-[11px] text-neutral-500 uppercase tracking-wider">
                    {selectedLocation.address}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center text-neutral-400 uppercase tracking-widest text-xs">
                Select a store to view directions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
