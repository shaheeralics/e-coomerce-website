'use server';

import { 
  getDbShoes, 
  addDbProduct, 
  updateDbProduct, 
  deleteDbProduct, 
  getDbVariantsStock,
  getDbDeletedShoes,
  restoreDbProduct,
  hardDeleteDbProduct 
} from '@/lib/mysql-store';
import { Shoe } from '@/types';
import { revalidatePath } from 'next/cache';

export async function fetchShoesList() {
  return getDbShoes();
}

export async function fetchDeletedShoesList() {
  return getDbDeletedShoes();
}

export async function fetchVariantsStock(shoeId: string) {
  return getDbVariantsStock(shoeId);
}

export async function createProduct(shoe: Omit<Shoe, 'rating' | 'reviewsCount'>, variantStock: Record<number, number>) {
  try {
    const success = await addDbProduct(shoe, variantStock);
    revalidatePath('/admin/products');
    revalidatePath('/shoes');
    revalidatePath('/');
    return { success };
  } catch (error) {
    console.error('Failed to create product:', error);
    return { success: false, error: String(error) };
  }
}

export async function modifyProduct(shoeId: string, shoeUpdate: Omit<Shoe, 'rating' | 'reviewsCount'>, variantStock: Record<number, number>) {
  try {
    const success = await updateDbProduct(shoeId, shoeUpdate, variantStock);
    revalidatePath('/admin/products');
    revalidatePath(`/shoes/${shoeId}`);
    revalidatePath('/shoes');
    revalidatePath('/');
    return { success };
  } catch (error) {
    console.error('Failed to update product:', error);
    return { success: false, error: String(error) };
  }
}

export async function removeProduct(shoeId: string) {
  try {
    const success = await deleteDbProduct(shoeId);
    revalidatePath('/admin/products');
    revalidatePath('/shoes');
    revalidatePath(`/shoes/${shoeId}`);
    revalidatePath('/');
    return { success };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false, error: String(error) };
  }
}

export async function restoreProduct(shoeId: string) {
  try {
    const success = await restoreDbProduct(shoeId);
    revalidatePath('/admin/products');
    revalidatePath('/shoes');
    revalidatePath(`/shoes/${shoeId}`);
    revalidatePath('/');
    return { success };
  } catch (error) {
    console.error('Failed to restore product:', error);
    return { success: false, error: String(error) };
  }
}

export async function hardDeleteProduct(shoeId: string) {
  try {
    const success = await hardDeleteDbProduct(shoeId);
    revalidatePath('/admin/products');
    revalidatePath('/shoes');
    revalidatePath(`/shoes/${shoeId}`);
    revalidatePath('/');
    return { success };
  } catch (error) {
    console.error('Failed to hard delete product:', error);
    return { success: false, error: String(error) };
  }
}
