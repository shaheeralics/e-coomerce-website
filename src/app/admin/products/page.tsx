'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  fetchShoesList, 
  fetchDeletedShoesList, 
  fetchVariantsStock, 
  createProduct, 
  modifyProduct, 
  removeProduct, 
  restoreProduct, 
  hardDeleteProduct 
} from './actions';
import { Shoe } from '@/types';
import { Package, Plus, Trash2, Edit2, X, Save, Loader2, RotateCcw, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { uploadImageAction } from '@/lib/actions';

function ImageUploadField({
  label,
  value,
  onChange,
  required = false
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadImageAction(formData);
      if (res.success && res.url) {
        onChange(res.url);
      } else {
        alert(res.error || 'Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">{label}</label>
      
      {value ? (
        <div className="relative aspect-square w-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group overflow-hidden">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-neutral-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-red-950 border border-red-900 hover:bg-red-900 hover:text-white text-red-300 rounded-full transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-none p-5 text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer min-h-[120px] ${
            dragOver ? 'border-white bg-neutral-900/30' : 'border-neutral-800 bg-neutral-900/10'
          }`}
        >
          {uploading ? (
            <div className="space-y-1 flex flex-col items-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
              <span className="text-[9px] font-bold text-neutral-450 uppercase tracking-widest">Uploading...</span>
            </div>
          ) : (
            <label className="cursor-pointer space-y-1 flex flex-col items-center w-full h-full justify-center">
              <input
                type="file"
                accept="image/*"
                required={required}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              <UploadCloud className="w-6 h-6 text-neutral-500" />
              <span className="text-[9px] font-bold text-neutral-350 uppercase tracking-widest">
                Drag & Drop / Click
              </span>
            </label>
          )}
        </div>
      )}
    </div>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [deletedShoes, setDeletedShoes] = useState<Shoe[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active');
  const [loading, setLoading] = useState(true);
  const [loadingDeleted, setLoadingDeleted] = useState(false);

  // Modal Open/Close states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingShoeId, setEditingShoeId] = useState<string | null>(null);

  // Form Fields State
  const [formId, setFormId] = useState(''); // Slug
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState(120);
  const [formOriginalPrice, setFormOriginalPrice] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('casual');
  const [formBadge, setFormBadge] = useState<string>('');
  const [formDescription, setFormDescription] = useState('');
  
  // Image URLs
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');

  // Specs & Materials (one item per line text areas)
  const [formSpecs, setFormSpecs] = useState('');
  const [formMaterials, setFormMaterials] = useState('');

  // Sizing stock levels matrix
  const allSizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
  const [sizeStock, setSizeStock] = useState<Record<number, number>>({});

  // Submit progress loader
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    // Defer state updates out of the synchronous render-effect pipeline
    await Promise.resolve();
    setLoading(true);
    try {
      const data = await fetchShoesList();
      setShoes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDeletedData = async () => {
    // Defer state updates out of the synchronous render-effect pipeline
    await Promise.resolve();
    setLoadingDeleted(true);
    try {
      const data = await fetchDeletedShoesList();
      setDeletedShoes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDeleted(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingShoeId(null);
    setFormId('');
    setFormName('');
    setFormPrice(120);
    setFormOriginalPrice('');
    setFormCategory('casual');
    setFormBadge('');
    setFormDescription('');
    setImg1('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop');
    setImg2('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop');
    setImg3('');
    setFormSpecs('Heel-to-toe drop: 8mm\nWeight: 240g');
    setFormMaterials('Upper: Recycled wood fiber\nOutsole: Sugarcane SweetFoam');
    
    // Default size stock mapping
    const initStock: Record<number, number> = {};
    allSizes.forEach(size => {
      initStock[size] = 10;
    });
    setSizeStock(initStock);

    setIsModalOpen(true);
  };

  const openEditModal = async (shoe: Shoe) => {
    setModalMode('edit');
    setEditingShoeId(shoe.id);
    setFormId(shoe.id);
    setFormName(shoe.name);
    setFormPrice(shoe.price);
    setFormOriginalPrice(shoe.originalPrice ? String(shoe.originalPrice) : '');
    setFormCategory(shoe.category);
    setFormBadge(shoe.badge || '');
    setFormDescription(shoe.description);
    
    // Images
    setImg1(shoe.images[0] || '');
    setImg2(shoe.images[1] || '');
    setImg3(shoe.images[2] || '');

    // Specs & Materials joins
    setFormSpecs(shoe.specs?.join('\n') || '');
    setFormMaterials(shoe.materials?.join('\n') || '');

    // Load size stocks from backend
    try {
      const stock = await fetchVariantsStock(shoe.id);
      setSizeStock(stock);
    } catch {
      const fallbackStock: Record<number, number> = {};
      allSizes.forEach(size => {
        fallbackStock[size] = shoe.sizes.includes(size) ? 12 : 0;
      });
      setSizeStock(fallbackStock);
    }

    setIsModalOpen(true);
  };

  // Listen for Admin Bar quick actions via query parameters
  useEffect(() => {
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'add') {
      openCreateModal();
      window.history.replaceState({}, '', '/admin/products');
    } else if (action === 'edit' && id) {
      const shoeToEdit = shoes.find(s => s.id === id);
      if (shoeToEdit) {
        openEditModal(shoeToEdit);
        window.history.replaceState({}, '', '/admin/products');
      }
    }
  }, [searchParams, shoes]);

  useEffect(() => {
    loadData();
    loadDeletedData();
  }, []);

  const handleDelete = async (shoeId: string) => {
    if (!confirm('Are you sure you want to soft-delete this shoe? It will be moved to the Trash Bin and can be restored later.')) return;
    try {
      const res = await removeProduct(shoeId);
      if (res.success) {
        setShoes(prev => prev.filter(s => s.id !== shoeId));
        loadDeletedData(); // Refresh trash list
      } else {
        alert('Failed to soft-delete product.');
      }
    } catch (err) {
      console.error(err);
      alert('Error soft-deleting product.');
    }
  };

  const handleRestore = async (shoeId: string) => {
    try {
      const res = await restoreProduct(shoeId);
      if (res.success) {
        setDeletedShoes(prev => prev.filter(s => s.id !== shoeId));
        loadData(); // Refresh active list
      } else {
        alert('Failed to restore product.');
      }
    } catch (err) {
      console.error(err);
      alert('Error restoring product.');
    }
  };

  const handlePermanentDelete = async (shoeId: string) => {
    if (!confirm('WARNING: Are you sure you want to permanently delete this product? This will physically remove it and all related stock records from the database. This action CANNOT be undone!')) return;
    try {
      const res = await hardDeleteProduct(shoeId);
      if (res.success) {
        setDeletedShoes(prev => prev.filter(s => s.id !== shoeId));
      } else {
        alert('Failed to permanently delete product.');
      }
    } catch (err) {
      console.error(err);
      alert('Error permanently deleting product.');
    }
  };

  const handleStockChange = (size: number, val: string) => {
    const num = parseInt(val) || 0;
    setSizeStock(prev => ({
      ...prev,
      [size]: Math.max(0, num)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !formName) {
      alert('Please fill out Name and Product ID Slug');
      return;
    }

    setIsSubmitting(true);

    const images = [img1, img2, img3].filter(Boolean);
    const specs = formSpecs.split('\n').filter(Boolean);
    const materials = formMaterials.split('\n').filter(Boolean);

    const shoeData: Omit<Shoe, 'rating' | 'reviewsCount'> = {
      id: formId.trim().toLowerCase().replace(/\s+/g, '-'),
      name: formName,
      description: formDescription,
      price: formPrice,
      originalPrice: formOriginalPrice ? parseFloat(formOriginalPrice) : undefined,
      category: formCategory,
      images,
      colors: ['Classic White', 'Midnight Black', 'Slate Grey'],
      badge: (formBadge as any) || undefined,
      specs,
      materials,
      sizes: Object.keys(sizeStock).map(Number).filter(size => sizeStock[size] > 0),
      inStock: Object.values(sizeStock).some(qty => qty > 0)
    };

    try {
      if (modalMode === 'create') {
        const res = await createProduct(shoeData, sizeStock);
        if (res.success) {
          setIsModalOpen(false);
          loadData(); // Reload list
        } else {
          alert('Failed to create product. ID might already exist.');
        }
      } else {
        const res = await modifyProduct(editingShoeId!, shoeData, sizeStock);
        if (res.success) {
          setIsModalOpen(false);
          loadData(); // Reload list
        } else {
          alert('Failed to update product.');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl relative">
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Warehouse Stocks</span>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white mt-1">Product Inventory</h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="flex gap-6 border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
            activeTab === 'active' ? 'border-white text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          Active Catalog ({shoes.length})
        </button>
        <button
          onClick={() => setActiveTab('trash')}
          className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
            activeTab === 'trash' ? 'border-white text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          Trash Bin ({deletedShoes.length})
        </button>
      </div>

      {/* Tables View Wrapper */}
      <div className="bg-neutral-950 border border-neutral-800 p-6">
        
        {/* TAB 1: Active Catalog */}
        {activeTab === 'active' && (
          <div>
            {loading ? (
              <div className="py-20 text-center text-neutral-500 uppercase tracking-widest animate-pulse">
                Loading products...
              </div>
            ) : shoes.length === 0 ? (
              <div className="py-20 text-center text-neutral-500 border border-dashed border-neutral-850">
                <Package className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
                <p className="text-xs uppercase tracking-widest">No products in catalog</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                      <th className="pb-3">Thumbnail</th>
                      <th className="pb-3">Shoe Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Total Stock</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850/30 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    {shoes.map(shoe => (
                      <tr key={shoe.id} className="hover:bg-neutral-900/10">
                        
                        {/* Thumbnail */}
                        <td className="py-4">
                          <div className="relative w-12 h-12 bg-neutral-900 border border-neutral-800">
                            <img
                              src={shoe.images[0]}
                              alt={shoe.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        {/* Title */}
                        <td className="py-4 font-bold text-white">
                          <div>
                            <div>{shoe.name}</div>
                            <div className="text-[10px] text-neutral-500 font-mono tracking-normal lowercase mt-0.5">{shoe.id}</div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4">{shoe.category}</td>

                        {/* Price */}
                        <td className="py-4 text-white">Rs. {shoe.price.toLocaleString()}</td>

                        {/* Stock */}
                        <td className="py-4 font-extrabold">
                          {shoe.totalStock !== undefined ? shoe.totalStock : 'N/A'}
                        </td>

                        {/* Status */}
                        <td className="py-4">
                          {shoe.inStock ? (
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2 py-0.5">
                              Low/Out
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(shoe)}
                              className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-xs transition-colors cursor-pointer"
                              aria-label="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(shoe.id)}
                              className="p-2 bg-neutral-900 hover:bg-red-950/20 border border-neutral-800 hover:border-red-900/30 text-neutral-400 hover:text-red-400 rounded-xs transition-colors cursor-pointer"
                              aria-label="Delete product"
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
        )}

        {/* TAB 2: Trash Bin */}
        {activeTab === 'trash' && (
          <div>
            {loadingDeleted ? (
              <div className="py-20 text-center text-neutral-500 uppercase tracking-widest animate-pulse">
                Loading Trash Bin...
              </div>
            ) : deletedShoes.length === 0 ? (
              <div className="py-20 text-center text-neutral-500 border border-dashed border-neutral-850">
                <Trash2 className="w-8 h-8 text-neutral-750 mx-auto mb-3" />
                <p className="text-xs uppercase tracking-widest">Trash Bin is empty</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                      <th className="pb-3">Thumbnail</th>
                      <th className="pb-3">Shoe Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Total Stock</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850/30 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    {deletedShoes.map(shoe => (
                      <tr key={shoe.id} className="hover:bg-neutral-900/10">
                        
                        {/* Thumbnail */}
                        <td className="py-4">
                          <div className="relative w-12 h-12 bg-neutral-900 border border-neutral-800">
                            <img
                              src={shoe.images[0]}
                              alt={shoe.name}
                              className="w-full h-full object-cover grayscale opacity-70"
                            />
                          </div>
                        </td>

                        {/* Title */}
                        <td className="py-4 font-bold text-white opacity-80">
                          <div>
                            <div>{shoe.name}</div>
                            <div className="text-[10px] text-neutral-500 font-mono tracking-normal lowercase mt-0.5">{shoe.id}</div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 text-neutral-450">{shoe.category}</td>

                        {/* Price */}
                        <td className="py-4 text-neutral-400">Rs. {shoe.price.toLocaleString()}</td>

                        {/* Stock */}
                        <td className="py-4 text-neutral-400 font-semibold">{shoe.totalStock}</td>

                        {/* Actions */}
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleRestore(shoe.id)}
                              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-emerald-900/30 text-emerald-450 hover:text-emerald-300 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                              title="Restore to Active Catalog"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(shoe.id)}
                              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-red-950/20 border border-neutral-800 hover:border-red-900/40 text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                              title="Permanently Hard Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Permanently</span>
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
        )}
      </div>

      {/* Editor Slide-Over Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex bg-neutral-950/65 backdrop-blur-xs justify-end animate-fade-in">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => !isSubmitting && setIsModalOpen(false)} />

          <div className="relative w-full max-w-2xl bg-neutral-950 border-l border-neutral-800 flex flex-col h-full shadow-2xl animate-slide-in">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Inventory Management</span>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  {modalMode === 'create' ? 'Create New Product' : `Edit Product: ${editingShoeId}`}
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
              
              {/* Product Info Section */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-900 pb-2">
                  01. Product Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Velocity Zoom"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white uppercase focus:outline-hidden focus:border-neutral-700"
                    />
                  </div>

                  {/* ID Slug */}
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Product ID (Slug)
                    </label>
                    <input
                      type="text"
                      required
                      disabled={modalMode === 'edit'}
                      placeholder="e.g. velocity-zoom"
                      value={formId}
                      onChange={(e) => setFormId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white lowercase focus:outline-hidden focus:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Sale / Discounted Price (Rs.)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formPrice}
                      onChange={(e) => setFormPrice(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-neutral-700"
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Original / Compare-at Price (Rs. / Sale only)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 180"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-neutral-700"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white uppercase focus:outline-hidden focus:border-neutral-700"
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="running">Running</option>
                      <option value="casual">Casual</option>
                      <option value="limited">Limited</option>
                      <option value="kids">Kids</option>
                    </select>
                  </div>

                  {/* Badge */}
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Display Badge
                    </label>
                    <select
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white uppercase focus:outline-hidden focus:border-neutral-700"
                    >
                      <option value="">None</option>
                      <option value="New">New</option>
                      <option value="Sale">Sale</option>
                      <option value="Limited Drop">Limited Drop</option>
                      <option value="Best Seller">Best Seller</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Product descriptive narrative..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-neutral-700 uppercase tracking-wider"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Galleries Section */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-900 pb-2">
                  02. Photo Galleries (Drag-and-Drop / Pick File)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ImageUploadField
                    label="Primary Image"
                    value={img1}
                    onChange={setImg1}
                    required={modalMode === 'create'}
                  />
                  <ImageUploadField
                    label="Alternate Image 1"
                    value={img2}
                    onChange={setImg2}
                  />
                  <ImageUploadField
                    label="Alternate Image 2"
                    value={img3}
                    onChange={setImg3}
                  />
                </div>
              </div>

              {/* Specifications and Materials Section */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-900 pb-2 mb-3">
                    03. Specifications (One per line)
                  </h3>
                  <textarea
                    rows={4}
                    placeholder="Weight: 240g&#10;Heel drop: 8mm"
                    value={formSpecs}
                    onChange={(e) => setFormSpecs(e.target.value)}
                    className="w-full p-4 bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-neutral-700 uppercase tracking-wider"
                  />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-900 pb-2 mb-3">
                    04. Materials Care (One per line)
                  </h3>
                  <textarea
                    rows={4}
                    placeholder="100% Eucalyptus fibers&#10;SweetFoam Sole"
                    value={formMaterials}
                    onChange={(e) => setFormMaterials(e.target.value)}
                    className="w-full p-4 bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-neutral-700 uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* Sizing stock levels matrix */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-900 pb-2">
                  05. Size Stock Matrix (Quantity)
                </h3>
                
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {allSizes.map(size => (
                    <div key={size} className="p-2.5 bg-neutral-900 border border-neutral-850 flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-bold text-neutral-400">EU {size}</span>
                      <input
                        type="number"
                        min="0"
                        value={sizeStock[size] !== undefined ? sizeStock[size] : 0}
                        onChange={(e) => handleStockChange(size, e.target.value)}
                        className="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-800 text-xs text-white text-center focus:outline-hidden focus:border-neutral-700"
                      />
                    </div>
                  ))}
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
                      Save Product
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

export default function AdminProductsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-neutral-500 uppercase tracking-widest animate-pulse font-sans">
        Loading Products Inventory Control...
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
