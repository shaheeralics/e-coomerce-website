import { Shoe } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      credentials: 'include'
    });
    if (!res.ok) {
      return null;
    }
    return await res.json() as T;
  } catch (err) {
    console.error(`API Fetch Error [${endpoint}]:`, err);
    return null;
  }
}

export async function fetchShoesList() {
  const data = await fetchFromApi<Shoe[]>('/api/shoes');
  return data || [];
}

export async function fetchDeletedShoesList() {
  const data = await fetchFromApi<Shoe[]>('/api/shoes/trash');
  return data || [];
}

export async function fetchVariantsStock(shoeId: string) {
  const data = await fetchFromApi<Record<number, number>>(`/api/shoes/${shoeId}/variants`);
  return data || {};
}

export async function createProduct(shoe: Omit<Shoe, 'rating' | 'reviewsCount'>, variantStock: Record<number, number>) {
  try {
    const res = await fetch(`${API_URL}/api/shoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ shoe, variantStock }),
      credentials: 'include'
    });
    if (!res.ok) return { success: false, error: 'API Error' };
    const json = await res.json();
    return { success: !!json.success };
  } catch (error) {
    console.error('Failed to create product:', error);
    return { success: false, error: String(error) };
  }
}

export async function modifyProduct(shoeId: string, shoeUpdate: Omit<Shoe, 'rating' | 'reviewsCount'>, variantStock: Record<number, number>) {
  try {
    const res = await fetch(`${API_URL}/api/shoes/${shoeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ shoeUpdate, variantStock }),
      credentials: 'include'
    });
    if (!res.ok) return { success: false, error: 'API Error' };
    const json = await res.json();
    return { success: !!json.success };
  } catch (error) {
    console.error('Failed to update product:', error);
    return { success: false, error: String(error) };
  }
}

export async function removeProduct(shoeId: string) {
  try {
    const res = await fetch(`${API_URL}/api/shoes/${shoeId}/soft`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) return { success: false, error: 'API Error' };
    const json = await res.json();
    return { success: !!json.success };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false, error: String(error) };
  }
}

export async function restoreProduct(shoeId: string) {
  try {
    const res = await fetch(`${API_URL}/api/shoes/${shoeId}/restore`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!res.ok) return { success: false, error: 'API Error' };
    const json = await res.json();
    return { success: !!json.success };
  } catch (error) {
    console.error('Failed to restore product:', error);
    return { success: false, error: String(error) };
  }
}

export async function hardDeleteProduct(shoeId: string) {
  try {
    const res = await fetch(`${API_URL}/api/shoes/${shoeId}/hard`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) return { success: false, error: 'API Error' };
    const json = await res.json();
    return { success: !!json.success };
  } catch (error) {
    console.error('Failed to hard delete product:', error);
    return { success: false, error: String(error) };
  }
}
