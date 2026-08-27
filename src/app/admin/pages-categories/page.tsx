'use client';

import React, { useState, useEffect } from 'react';
import { 
  getCategorySettingsAction, 
  updateCategorySettingAction,
  getCustomPagesAction,
  saveCustomPageAction,
  deleteCustomPageAction
} from '@/lib/actions';
import { CustomPage } from '@/types';
import { ToggleLeft, ToggleRight, Plus, Trash2, Edit2, X, Save, Loader2, ClipboardList, CheckSquare } from 'lucide-react';

export default function AdminPagesCategoriesPage() {
  const [categories, setCategories] = useState<{ category_name: string; is_visible: boolean }[]>([]);
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingPages, setLoadingPages] = useState(true);

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoadingCats(true);
    try {
      const data = await getCategorySettingsAction();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCats(false);
    }
  };

  const loadPages = async () => {
    setLoadingPages(true);
    try {
      const data = await getCustomPagesAction();
      setPages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPages(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadPages();
  }, []);

  const handleToggleCategory = async (name: string, currentStatus: boolean) => {
    try {
      const success = await updateCategorySettingAction(name, !currentStatus);
      if (success) {
        setCategories(prev => prev.map(c => c.category_name === name ? { ...c, is_visible: !currentStatus } : c));
      } else {
        alert('Failed to update category visibility.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating category visibility.');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormTitle('');
    setFormSlug('');
    setFormContent('');
    setFormIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (page: CustomPage) => {
    setModalMode('edit');
    setEditingId(page.id);
    setFormTitle(page.title);
    setFormSlug(page.slug);
    setFormContent(page.content);
    setFormIsPublished(page.isPublished);
    setIsModalOpen(true);
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom page?')) return;
    try {
      const success = await deleteCustomPageAction(id);
      if (success) {
        setPages(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Failed to delete custom page.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting page.');
    }
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (modalMode === 'create') {
      // Auto slugify
      setFormSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formSlug || !formContent) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    const pageId = editingId || `page_${Math.random().toString(36).substring(2, 11)}`;

    const pageData: CustomPage = {
      id: pageId,
      title: formTitle,
      slug: formSlug.toLowerCase().trim().replace(/\s+/g, '-'),
      content: formContent,
      isPublished: formIsPublished
    };

    try {
      const success = await saveCustomPageAction(pageData);
      if (success) {
        setIsModalOpen(false);
        loadPages();
      } else {
        alert('Failed to save page.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving custom page.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl relative font-sans text-neutral-100">
      
      {/* Title Header */}
      <div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Navigation Control</span>
        <h1 className="text-2xl font-black uppercase tracking-widest text-white mt-1">Pages & Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Category Visibility Control */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 p-6 space-y-6">
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-white">Category Navigation Visibility</h2>
            <p className="text-[10px] text-neutral-500 uppercase mt-1">Toggle ON/OFF to show/hide category pages from the public storefront.</p>
          </div>

          {loadingCats ? (
            <div className="py-10 text-center text-neutral-550 uppercase tracking-widest text-xs animate-pulse">
              Loading settings...
            </div>
          ) : (
            <div className="divide-y divide-neutral-850/40">
              {categories.map((cat) => (
                <div key={cat.category_name} className="py-4 flex items-center justify-between first:pt-0">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{cat.category_name}</span>
                    <span className="text-[9px] text-neutral-500 block uppercase tracking-widest">
                      {cat.is_visible ? 'Visible to public' : 'Hidden from storefront'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleToggleCategory(cat.category_name, cat.is_visible)}
                    className="p-1 hover:opacity-80 transition-opacity cursor-pointer text-white"
                  >
                    {cat.is_visible ? (
                      <ToggleRight className="w-9 h-9 text-emerald-400 stroke-[1.2]" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-neutral-600 stroke-[1.2]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Custom Pages CRUD */}
        <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-white">Custom Static Pages</h2>
              <p className="text-[10px] text-neutral-500 uppercase mt-1">Create static pages (e.g., About Us, Privacy Policy).</p>
            </div>
            <button
              onClick={openCreateModal}
              className="px-3.5 py-2 bg-white text-neutral-950 hover:bg-neutral-200 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Page</span>
            </button>
          </div>

          {loadingPages ? (
            <div className="py-10 text-center text-neutral-550 uppercase tracking-widest text-xs animate-pulse">
              Loading pages...
            </div>
          ) : pages.length === 0 ? (
            <div className="py-12 text-center text-neutral-600 border border-dashed border-neutral-850">
              <ClipboardList className="w-7 h-7 text-neutral-700 mx-auto mb-2" />
              <p className="text-xs uppercase tracking-widest">No custom pages created</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-850/40 text-xs">
              {pages.map((p) => (
                <div key={p.id} className="py-4 flex justify-between items-center first:pt-0">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white uppercase tracking-wider block">{p.title}</span>
                    <span className="text-[9px] text-neutral-500 block font-mono tracking-normal">slug: /p/{p.slug}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {p.isPublished ? (
                      <span className="text-[9px] font-bold text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 tracking-widest">
                        Published
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-neutral-500 uppercase bg-neutral-900 border border-neutral-800 px-2 py-0.5 tracking-widest">
                        Draft
                      </span>
                    )}

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-xs transition-colors cursor-pointer"
                        aria-label="Edit page"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePage(p.id)}
                        className="p-2 bg-neutral-900 hover:bg-red-950/20 border border-neutral-800 hover:border-red-900/30 text-neutral-400 hover:text-red-400 rounded-xs transition-colors cursor-pointer"
                        aria-label="Delete page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Slide-over custom page editor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex bg-neutral-950/65 backdrop-blur-xs justify-end animate-fade-in">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => !isSubmitting && setIsModalOpen(false)} />

          <div className="relative w-full max-w-2xl bg-neutral-950 border-l border-neutral-800 flex flex-col h-full shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Page Publisher</span>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  {modalMode === 'create' ? 'Create Custom Page' : `Edit Custom Page`}
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
                {/* Title */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Terms of Service"
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white uppercase focus:outline-hidden focus:border-neutral-700"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Slug path URL (lower-case)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. terms-of-service"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white lowercase focus:outline-hidden focus:border-neutral-700"
                  />
                  <span className="text-[9px] text-neutral-500 uppercase tracking-wider mt-1 block">
                    Your page will be live at: /p/{formSlug || '[slug]'}
                  </span>
                </div>

                {/* Content body */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Page Body Content (Text only)
                  </label>
                  <textarea
                    required
                    rows={12}
                    placeholder="Write page content here..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full p-4 bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-hidden focus:border-neutral-700 leading-relaxed uppercase tracking-wider"
                  />
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800 p-4">
                  <button
                    type="button"
                    onClick={() => setFormIsPublished(!formIsPublished)}
                    className="text-white hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    {formIsPublished ? (
                      <ToggleRight className="w-8 h-8 text-emerald-400 stroke-[1.2]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-neutral-600 stroke-[1.2]" />
                    )}
                  </button>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider block">Publish Page</span>
                    <span className="text-[9px] text-neutral-500 block uppercase tracking-widest">
                      {formIsPublished ? 'Visible to public instantly' : 'Keep as private draft'}
                    </span>
                  </div>
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
                      Save Page
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
