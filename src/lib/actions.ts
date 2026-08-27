'use server';

import { 
  getDbShoes, 
  getDbShoeById, 
  saveDbOrder,
  getDbCategorySettings,
  updateDbCategorySetting,
  getDbCustomPages,
  getDbCustomPageBySlug,
  saveDbCustomPage,
  deleteDbCustomPage,
  getDbStoreLocations,
  saveDbStoreLocation,
  deleteDbStoreLocation,
  getDbOrderByTracking
} from './mysql-store';
import { Shoe, Order, CustomPage, StoreLocation } from '@/types';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Storefront Server Actions for Client Components

export async function getShoesAction(): Promise<Shoe[]> {
  return getDbShoes();
}

export async function getShoeByIdAction(id: string): Promise<Shoe | null> {
  return getDbShoeById(id);
}

export async function createOrderAction(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
  return saveDbOrder(orderData);
}

// Category Visibility Actions
export async function getCategorySettingsAction() {
  return getDbCategorySettings();
}

export async function updateCategorySettingAction(categoryName: string, isVisible: boolean) {
  return updateDbCategorySetting(categoryName, isVisible);
}

// Custom Page Actions
export async function getCustomPagesAction() {
  return getDbCustomPages();
}

export async function getCustomPageBySlugAction(slug: string) {
  return getDbCustomPageBySlug(slug);
}

export async function saveCustomPageAction(page: CustomPage) {
  return saveDbCustomPage(page);
}

export async function deleteCustomPageAction(id: string) {
  return deleteDbCustomPage(id);
}

// Store Location Actions
export async function getStoreLocationsAction() {
  return getDbStoreLocations();
}

export async function saveStoreLocationAction(store: StoreLocation) {
  return saveDbStoreLocation(store);
}

export async function deleteStoreLocationAction(id: string) {
  return deleteDbStoreLocation(id);
}

// Order Tracking Action
export async function getOrderByTrackingAction(orderId: string, emailOrPhone: string) {
  return getDbOrderByTracking(orderId, emailOrPhone);
}

// File Upload Action
export async function uploadImageAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save under public/uploads
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique name
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = join(uploadDir, filename);

    await writeFile(filePath, buffer);
    return { success: true, url: `/uploads/${filename}` };
  } catch (error) {
    console.error('File upload error:', error);
    return { success: false, error: String(error) };
  }
}

