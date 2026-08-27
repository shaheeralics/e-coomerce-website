'use server';

import { getDbOrders, updateDbOrderStatus } from '@/lib/mysql-store';
import { revalidatePath } from 'next/cache';

export async function changeOrderStatus(orderId: string, status: string) {
  try {
    const success = await updateDbOrderStatus(orderId, status);
    revalidatePath('/admin/orders');
    revalidatePath('/admin');
    return { success };
  } catch (error) {
    console.error('Failed to change order status:', error);
    return { success: false, error: String(error) };
  }
}

export async function fetchOrders() {
  return getDbOrders();
}
