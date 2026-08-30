'use client';

import React, { useState, useEffect } from 'react';
import { 
  getStoreLocationsAction, 
  saveStoreLocationAction, 
  deleteStoreLocationAction 
} from '@/lib/actions';
import { StoreLocation } from '@/types';
import { MapPin, Plus, Trash2, Edit2, X, Save, Loader2, Clock, Globe } from 'lucide-react';

export default function AdminStoreLocationsPage() {
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formMapUrl, setFormMapUrl] = useState('');
  const [formTimings, setFormTimings] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getStoreLocationsAction();
      setStores(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormName('');
    setFormAddress('');
    setFormMapUrl('');
    setFormTimings('Mon - Sat: 11:00 AM - 10:00 PM, Sun: 2:00 PM - 8:00 PM');
    setIsModalOpen(true);
  };

  const openEditModal = (store: StoreLocation) => {
    setModalMode('edit');
    setEditingId(store.id);
    setFormName(store.name);
    setFormAddress(store.address);
    setFormMapUrl(store.mapUrl);
    setFormTimings(store.timings);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store location?')) return;
    try {
      const success = await deleteStoreLocationAction(id);
      if (success) {
        setStores(prev => prev.filter(s => s.id !== id));
      } else {
        alert('Failed to delete store location.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting store location.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAddress || !formMapUrl) {
      alert('Please fill out Name, Address, and Map URL.');
      return;
    }

    setIsSubmitting(true);
    const storeId = editingId || `store_${Math.random().toString(36).substring(2, 11)}`;

    const storeData: StoreLocation = {
      id: storeId,
      name: formName,
      address: formAddress,
      mapUrl: formMapUrl,
      timings: formTimings
    };

    try {
      const success = await saveStoreLocationAction(storeData);
      if (success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert('Failed to save store location.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving store location.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl relative font-sans text-neutral-100">
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Retail Outlets</span>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white mt-1">Store Locations</h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location</span>
        </button>
      </div>

      {/* Main Table view */}
      <div className="bg-neutral-950 border border-neutral-800 p-6">
        {loading ? (
          <div className="py-20 text-center text-neutral-500 uppercase tracking-widest animate-pulse">
            Loading physical outlets...
          </div>
        ) : stores.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 border border-dashed border-neutral-850">
            <MapPin className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
            <p className="text-xs uppercase tracking-widest">No physical outlets stored</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                  <th className="pb-3">Outlet Name</th>
                  <th className="pb-3">Address</th>
                  <th className="pb-3">Timings</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850/30 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                {stores.map(store => (
                  <tr key={store.id} className="hover:bg-neutral-900/10">
                    {/* Name */}
                    <td className="py-4 font-bold text-white">
                      <div>
                        <div>{store.name}</div>
                        <div className="text-[10px] text-neutral-500 font-mono tracking-normal lowercase mt-0.5">{store.id}</div>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-4 text-neutral-400 max-w-xs truncate" title={store.address}>
                      {store.address}
                    </td>

                    {/* Timings */}
                    <td className="py-4 text-neutral-450">{store.timings}</td>

                    {/* Actions */}
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(store)}
                          className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-xs transition-colors cursor-pointer"
                          aria-label="Edit store"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(store.id)}
                          className="p-2 bg-neutral-900 hover:bg-red-950/20 border border-neutral-800 hover:border-red-900/30 text-neutral-400 hover:text-red-400 rounded-xs transition-colors cursor-pointer"
                          aria-label="Delete store"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Slide-Over Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex bg-neutral-950/65 backdrop-blur-xs justify-end animate-fade-in">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => !isSubmitting && setIsModalOpen(false)} />

          <div className="relative w-full max-w-xl bg-neutral-950 border-l border-neutral-800 flex flex-col h-full shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Outlets Control</span>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  {modalMode === 'create' ? 'Add New Outlet' : `Edit Outlet: ${editingId}`}
                </h2>
              </div>
              <button
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-neutral-900 hover:bg-neutral-855 border border-neutral-800 transition-all disabled:opacity-40 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Store Name */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Store Outlet Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Velocity Islamabad Flagship"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white uppercase focus:outline-hidden focus:border-neutral-700"
                  />
                </div>

                {/* Operating Timings */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Operating Timings
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mon - Sat: 11:00 AM - 10:00 PM"
                    value={formTimings}
                    onChange={(e) => setFormTimings(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-neutral-700"
                  />
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Full Physical Address
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Full street location details..."
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-neutral-700 uppercase tracking-wider"
                  />
                </div>

                {/* Google Maps Embed URL */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Google Maps Embed iframe Source URL (src)
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    value={formMapUrl}
                    onChange={(e) => setFormMapUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-neutral-700"
                  />
                  <span className="text-[9px] text-neutral-500 uppercase tracking-wider mt-1 block">
                    Copy the source (src attribute) URL inside Google Maps share embed HTML code.
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-neutral-800 flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-400 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Outlet
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
