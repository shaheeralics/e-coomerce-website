import { getShoesAction, getShoeByIdAction, createOrderAction } from '../actions';
import { Shoe, Order } from '@/types';

// Route storefront requests through Next.js server actions
// to prevent compiling MySQL node modules into browser assets.

export const getShoes = async (): Promise<Shoe[]> => {
  return getShoesAction();
};

export const getShoeById = async (id: string): Promise<Shoe | null> => {
  return getShoeByIdAction(id);
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
  return createOrderAction(orderData);
};
