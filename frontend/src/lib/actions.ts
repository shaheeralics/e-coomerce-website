import { Shoe, Order, CustomPage, StoreLocation } from '@/types';

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

// Storefront Server-Like API Actions calling backend REST endpoints

export async function getShoesAction(): Promise<Shoe[]> {
  const data = await fetchFromApi<Shoe[]>('/api/shoes');
  return data || [];
}

export async function getShoeByIdAction(id: string): Promise<Shoe | null> {
  return fetchFromApi<Shoe>(`/api/shoes/${id}`);
}

export async function createOrderAction(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData),
      credentials: 'include'
    });
    if (!res.ok) {
      throw new Error('Failed to create order via API');
    }
    const json = await res.json();
    return json.order;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Category Visibility Actions
export async function getCategorySettingsAction() {
  const data = await fetchFromApi<{ category_name: string; is_visible: boolean; sort_order: number }[]>('/api/categories');
  return data || [];
}

export async function updateCategorySettingAction(categoryName: string, isVisible: boolean) {
  try {
    const res = await fetch(`${API_URL}/api/categories/${categoryName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isVisible }),
      credentials: 'include'
    });
    if (!res.ok) return false;
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Custom Page Actions
export async function getCustomPagesAction() {
  const data = await fetchFromApi<CustomPage[]>('/api/pages');
  return data || [];
}

export async function getCustomPageBySlugAction(slug: string) {
  return fetchFromApi<CustomPage>(`/api/pages/${slug}`);
}

export async function saveCustomPageAction(page: CustomPage) {
  try {
    const res = await fetch(`${API_URL}/api/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(page),
      credentials: 'include'
    });
    if (!res.ok) return false;
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function deleteCustomPageAction(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/pages/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) return false;
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function reorderCategoriesAction(orders: { categoryName: string; sortOrder: number }[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/categories/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orders }),
      credentials: 'include'
    });
    if (!res.ok) return false;
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function reorderCustomPagesAction(orders: { id: string; sortOrder: number }[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/pages/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orders }),
      credentials: 'include'
    });
    if (!res.ok) return false;
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Store Location Actions
export async function getStoreLocationsAction() {
  const data = await fetchFromApi<StoreLocation[]>('/api/locations');
  return data || [];
}

export async function saveStoreLocationAction(store: StoreLocation) {
  try {
    const res = await fetch(`${API_URL}/api/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(store),
      credentials: 'include'
    });
    if (!res.ok) return false;
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function deleteStoreLocationAction(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/locations/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) return false;
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Order Tracking Action
export async function getOrderByTrackingAction(orderId: string, emailOrPhone: string) {
  return fetchFromApi<Order>(`/api/orders/track?orderId=${encodeURIComponent(orderId)}&emailOrPhone=${encodeURIComponent(emailOrPhone)}`);
}

// File Upload Action
export async function uploadImageAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    if (!res.ok) {
      return { success: false, error: 'File upload failed' };
    }
    return await res.json();
  } catch (error) {
    console.error('File upload error:', error);
    return { success: false, error: String(error) };
  }
}
