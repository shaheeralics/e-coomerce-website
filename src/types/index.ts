export interface Shoe {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  sizes: number[];
  colors: string[];
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  badge?: 'New' | 'Sale' | 'Limited Drop' | 'Best Seller';
  specs?: string[];
  materials?: string[];
  totalStock?: number;
}

export interface CartItem {
  id: string; // Composite key: shoe.id + size + color
  shoe: Shoe;
  selectedSize: number;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  total: number;
  items: { shoeId: string; shoeName: string; price: number; size: number; color: string; quantity: number }[];
  paymentMethod: 'cod' | 'card';
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'delivered' | 'cancelled';
  customerPhone?: string;
  userId?: string;
}

export interface FilterOptions {
  category: string[];
  gender: string[];
  sizes: number[];
  colors: string[];
  priceRange: [number, number];
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt?: string;
  sortOrder?: number;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  mapUrl: string;
  timings: string;
  createdAt?: string;
}

