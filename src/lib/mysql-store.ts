import { query, testConnection, dbPool } from './db';
import { Shoe, Order, CartItem, CustomPage, StoreLocation } from '@/types';
import { MOCK_SHOES } from './mock-shoes';

// In-Memory Database Fallbacks (for when MySQL is offline)
let inMemoryShoes: Shoe[] = [...MOCK_SHOES];
let inMemoryOrders: Order[] = [
  {
    id: 'order_1',
    customerName: 'Jane Doe',
    email: 'jane@example.com',
    address: '456 Fashion Ave, New York',
    city: 'New York',
    postalCode: '10001',
    total: 345.60,
    items: [
      { shoeId: 'velocity-stratus-v1', shoeName: 'Velocity Stratus V1', price: 160.00, size: 40, color: 'Infrared Red', quantity: 1 },
      { shoeId: 'velocity-aeromax-blue', shoeName: 'Velocity Aeromax', price: 145.00, size: 41, color: 'Deep Ocean Blue', quantity: 1 }
    ],
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'pending'
  },
  {
    id: 'order_2',
    customerName: 'Alex Runner',
    email: 'alex@example.com',
    address: '789 Trail Road, Denver',
    city: 'Denver',
    postalCode: '80201',
    total: 160.00,
    items: [
      { shoeId: 'velocity-stratus-v1', shoeName: 'Velocity Stratus V1', price: 160.00, size: 42, color: 'Infrared Red', quantity: 1 }
    ],
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'completed'
  }
];

let inMemoryCategorySettings = [
  { category_name: 'Men', is_visible: true },
  { category_name: 'Women', is_visible: true },
  { category_name: 'Kids', is_visible: true },
  { category_name: 'Running', is_visible: true },
  { category_name: 'Casual', is_visible: true },
  { category_name: 'Limited Drops', is_visible: true }
];

let inMemoryCustomPages: CustomPage[] = [
  {
    id: 'about-us',
    title: 'About Velocity',
    slug: 'about-us',
    content: 'Welcome to VELOCITY. We build premium, carbon-neutral activewear and running shoes designed for ultimate speed, durability, and minimal environmental impact. Our mission is to combine cutting-edge materials science with striking minimalist aesthetics. Join us in stepping into a sustainable future.',
    isPublished: true,
    createdAt: new Date().toISOString()
  }
];

let inMemoryStoreLocations: StoreLocation[] = [
  {
    id: 'store_lahore_1',
    name: 'Velocity Lahore Flagship',
    address: 'M.M. Alam Road, Gulberg III, Lahore, Pakistan',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.372439265239!2d74.348612!3d31.513904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045bda0a8f85%3A0x67db23af7e0340c2!2sM.M.%20Alam%20Rd%2C%20Amber!5e0!3m2!1sen!2spk!4v1700000000000',
    timings: 'Mon - Sat: 11:00 AM - 10:00 PM, Sun: 2:00 PM - 8:00 PM',
    createdAt: new Date().toISOString()
  }
];

// Helper to parse JSON fields safely
const parseJsonField = (field: any): any[] => {
  if (!field) return [];
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  }
  return field;
};

// 1. Get All Shoes
export async function getDbShoes(): Promise<Shoe[]> {
  const isOnline = await testConnection();
  if (!isOnline) {
    console.log('[MySQL Store] Offline. Using in-memory shoes.');
    return inMemoryShoes.filter(s => !(s as any).isDeleted);
  }

  try {
    // Get all products
    const dbProducts = await query<any[]>('SELECT * FROM products WHERE is_deleted = false ORDER BY created_at DESC');
    
    // Get all variants
    const dbVariants = await query<any[]>('SELECT * FROM product_variants');

    // Map database structures to Shoe structures
    return dbProducts.map(p => {
      const variants = dbVariants.filter(v => v.product_id === p.id);
      const sizes = variants.filter(v => v.stock_quantity > 0).map(v => v.size).sort((a, b) => a - b);
      const allSizes = variants.map(v => v.size).sort((a, b) => a - b);
      
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: parseFloat(p.price),
        originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
        category: p.category as any,
        images: parseJsonField(p.images),
        sizes: sizes.length > 0 ? sizes : allSizes, // Fallback if all size stocks are 0
        colors: p.id === 'velocity-luna-knit-women' ? ['Blush Pink / Rose Gold', 'Orchid Purple', 'Alabaster White'] : ['Classic White', 'Midnight Black', 'Slate Grey'], // Default colorways, or color lookup
        inStock: variants.some(v => v.stock_quantity > 0),
        rating: parseFloat(p.rating),
        reviewsCount: p.reviews_count,
        badge: p.badge as any,
        specs: parseJsonField(p.specs),
        materials: parseJsonField(p.materials),
        totalStock: variants.reduce((sum, v) => sum + v.stock_quantity, 0)
      };
    });
  } catch (error) {
    console.error('[MySQL Store] getDbShoes error, falling back:', error);
    return inMemoryShoes.filter(s => !(s as any).isDeleted);
  }
}

// 2. Get Shoe By ID
export async function getDbShoeById(id: string): Promise<Shoe | null> {
  const isOnline = await testConnection();
  if (!isOnline) {
    return inMemoryShoes.find(s => s.id === id && !(s as any).isDeleted) || null;
  }

  try {
    const dbProducts = await query<any[]>('SELECT * FROM products WHERE id = ? AND is_deleted = false', [id]);
    if (dbProducts.length === 0) return null;
    
    const p = dbProducts[0];
    const dbVariants = await query<any[]>('SELECT * FROM product_variants WHERE product_id = ?', [id]);
    
    const sizes = dbVariants.filter(v => v.stock_quantity > 0).map(v => v.size).sort((a, b) => a - b);
    const allSizes = dbVariants.map(v => v.size).sort((a, b) => a - b);

    // Hardcode colors mapping or retrieve from names
    let colors = ['Classic White', 'Midnight Black', 'Slate Grey'];
    if (p.id === 'velocity-stratus-v1') colors = ['Infrared Red', 'Midnight Black', 'Platinum Grey'];
    if (p.id === 'velocity-aeromax-blue') colors = ['Deep Ocean Blue', 'Cool Grey', 'Neon Green'];
    if (p.id === 'velocity-trailblazer-rugged') colors = ['Earthy Olive / Volt', 'Cargo Charcoal', 'Trail Rust Orange'];
    if (p.id === 'velocity-zenith-limited') colors = ['Chromatic Silver', 'Holographic Violet', 'Ghost White'];
    if (p.id === 'velocity-luna-knit-women') colors = ['Blush Pink / Rose Gold', 'Orchid Purple', 'Alabaster White'];
    if (p.id === 'velocity-eco-breeze') colors = ['Eco Sand', 'Sage Green', 'Cloud Grey'];
    if (p.id === 'velocity-phantom-pro') colors = ['Pitch Black / Carbon', 'Hyper Volt Neon'];
    if (p.id === 'velocity-apex-trainer') colors = ['Asphalt Grey / Crimson', 'Total White / Gum'];

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: parseFloat(p.price),
      originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
      category: p.category as any,
      images: parseJsonField(p.images),
      sizes: sizes.length > 0 ? sizes : allSizes,
      colors: colors,
      inStock: dbVariants.some(v => v.stock_quantity > 0),
      rating: parseFloat(p.rating),
      reviewsCount: p.reviews_count,
      badge: p.badge as any,
      specs: parseJsonField(p.specs),
      materials: parseJsonField(p.materials),
      totalStock: dbVariants.reduce((sum, v) => sum + v.stock_quantity, 0)
    };
  } catch (error) {
    console.error('[MySQL Store] getDbShoeById error, falling back:', error);
    return inMemoryShoes.find(s => s.id === id) || null;
  }
}

// 3. Get All Orders (Admin)
export async function getDbOrders(): Promise<Order[]> {
  const isOnline = await testConnection();
  if (!isOnline) {
    return inMemoryOrders;
  }

  try {
    const dbOrders = await query<any[]>('SELECT * FROM orders ORDER BY created_at DESC');
    const dbOrderItems = await query<any[]>('SELECT * FROM order_items');

    return dbOrders.map(o => {
      const items = dbOrderItems.filter(item => item.order_id === o.id).map(item => ({
        shoeId: item.product_id,
        shoeName: item.product_name,
        price: parseFloat(item.price),
        size: item.size,
        color: item.color,
        quantity: item.quantity
      }));

      return {
        id: o.id,
        customerName: o.customer_name,
        email: o.customer_email,
        address: o.shipping_address,
        city: o.city,
        postalCode: o.postal_code,
        total: parseFloat(o.total_amount),
        items: items,
        paymentMethod: o.payment_method as any,
        createdAt: o.created_at,
        status: o.order_status.toLowerCase() as any,
        customerPhone: o.customer_phone,
        userId: o.user_id || undefined
      };
    });
  } catch (error) {
    console.error('[MySQL Store] getDbOrders error, falling back:', error);
    return inMemoryOrders;
  }
}

// 4. Update Order Status (Admin Actions)
export async function updateDbOrderStatus(orderId: string, status: string): Promise<boolean> {
  const isOnline = await testConnection();
  
  // Normalize status for standard DB storage (capitalize e.g., 'Pending', 'Shipped')
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  if (!isOnline) {
    const orderIndex = inMemoryOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      inMemoryOrders[orderIndex].status = status.toLowerCase() as any;
      return true;
    }
    return false;
  }

  try {
    await query('UPDATE orders SET order_status = ? WHERE id = ?', [formattedStatus, orderId]);
    return true;
  } catch (error) {
    console.error('[MySQL Store] updateDbOrderStatus error:', error);
    return false;
  }
}

// 5. Submit Order (Customer Checkout Action with transaction & stock updates)
export async function saveDbOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
  const orderId = `order_${Math.random().toString(36).substring(2, 11)}`;
  const createdAt = new Date().toISOString();
  const status = 'pending';

  const isOnline = await testConnection();
  if (!isOnline) {
    // In-memory stock deduction check
    for (const item of orderData.items) {
      const match = inMemoryShoes.find(s => s.id === item.shoeId);
      if (match) {
        // Simple stock mock check (always succeeds for mock simplicity or logs stock)
        console.log(`[MySQL Store] (Offline Mode) Stock checked for ${match.name} size ${item.size}`);
      }
    }

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt,
      status: status as any
    };

    inMemoryOrders.unshift(newOrder);
    return newOrder;
  }

  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();

    // A. Verify and deduct stock for each variant item
    for (const item of orderData.items) {
      const [rows] = await connection.execute<any[]>(
        'SELECT stock_quantity FROM product_variants WHERE product_id = ? AND size = ?',
        [item.shoeId, item.size]
      );

      if (rows.length === 0) {
        throw new Error(`Size ${item.size} is not available for product ID: ${item.shoeId}`);
      }

      const availableStock = rows[0].stock_quantity;
      if (availableStock < item.quantity) {
        throw new Error(`Insufficient stock for size ${item.size}. Only ${availableStock} left.`);
      }

      // Deduct stock
      await connection.execute(
        'UPDATE product_variants SET stock_quantity = stock_quantity - ? WHERE product_id = ? AND size = ?',
        [item.quantity, item.shoeId, item.size]
      );
    }

    // B. Create the order row
    await connection.execute(
      'INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, city, postal_code, payment_method, order_status, total_amount, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        orderId,
        orderData.customerName,
        orderData.email,
        orderData.customerPhone || '',
        orderData.address,
        orderData.city,
        orderData.postalCode || '',
        orderData.paymentMethod,
        'Pending',
        orderData.total,
        orderData.userId || null
      ]
    );

    // C. Create order items records
    for (const item of orderData.items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, product_name, size, color, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          orderId,
          item.shoeId,
          item.shoeName,
          item.size,
          item.color,
          item.price,
          item.quantity
        ]
      );
    }

    await connection.commit();

    return {
      ...orderData,
      id: orderId,
      createdAt,
      status: 'pending'
    };
  } catch (error) {
    await connection.rollback();
    console.error('[MySQL Store] Transaction failed, order aborted:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// 6. Add New Product (Admin Dashboard)
export async function addDbProduct(shoe: Omit<Shoe, 'rating' | 'reviewsCount'>, variantStock: Record<number, number>): Promise<boolean> {
  const isOnline = await testConnection();

  const formattedImages = JSON.stringify(shoe.images);
  const formattedSpecs = JSON.stringify(shoe.specs || []);
  const formattedMaterials = JSON.stringify(shoe.materials || []);

  if (!isOnline) {
    const newShoe: Shoe = {
      ...shoe,
      rating: 5.0,
      reviewsCount: 0,
      inStock: Object.values(variantStock).some(qty => qty > 0),
      sizes: Object.keys(variantStock).map(Number).filter(size => variantStock[size] > 0)
    };
    inMemoryShoes.unshift(newShoe);
    return true;
  }

  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();

    // A. Insert product details
    await connection.execute(
      'INSERT INTO products (id, name, slug, price, original_price, description, category, gender, images, badge, rating, reviews_count, specs, materials) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0, ?, ?)',
      [
        shoe.id,
        shoe.name,
        shoe.id, // slug as ID
        shoe.price,
        shoe.originalPrice || null,
        shoe.description,
        shoe.category,
        shoe.category === 'women' ? 'women' : shoe.category === 'men' ? 'men' : 'unisex',
        formattedImages,
        shoe.badge || null,
        formattedSpecs,
        formattedMaterials
      ]
    );

    // B. Insert product variants
    for (const size of [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]) {
      const stock = variantStock[size] || 0;
      await connection.execute(
        'INSERT INTO product_variants (product_id, size, stock_quantity) VALUES (?, ?, ?)',
        [shoe.id, size, stock]
      );
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    console.error('[MySQL Store] addDbProduct error:', error);
    return false;
  } finally {
    connection.release();
  }
}

// 7. Update Product Details & Inventory (Admin Dashboard)
export async function updateDbProduct(shoeId: string, shoeUpdate: Omit<Shoe, 'rating' | 'reviewsCount'>, variantStock: Record<number, number>): Promise<boolean> {
  const isOnline = await testConnection();

  if (!isOnline) {
    const idx = inMemoryShoes.findIndex(s => s.id === shoeId);
    if (idx !== -1) {
      inMemoryShoes[idx] = {
        ...inMemoryShoes[idx],
        ...shoeUpdate,
        sizes: Object.keys(variantStock).map(Number).filter(size => variantStock[size] > 0),
        inStock: Object.values(variantStock).some(qty => qty > 0)
      };
      return true;
    }
    return false;
  }

  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();

    const formattedImages = JSON.stringify(shoeUpdate.images);
    const formattedSpecs = JSON.stringify(shoeUpdate.specs || []);
    const formattedMaterials = JSON.stringify(shoeUpdate.materials || []);

    // A. Update products table details
    await connection.execute(
      'UPDATE products SET name = ?, price = ?, original_price = ?, description = ?, category = ?, images = ?, badge = ?, specs = ?, materials = ? WHERE id = ?',
      [
        shoeUpdate.name,
        shoeUpdate.price,
        shoeUpdate.originalPrice || null,
        shoeUpdate.description,
        shoeUpdate.category,
        formattedImages,
        shoeUpdate.badge || null,
        formattedSpecs,
        formattedMaterials,
        shoeId
      ]
    );

    // B. Upsert product variants (update if exists, insert if not)
    for (const size of [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]) {
      const stock = variantStock[size] || 0;
      const [rows] = await connection.execute<any[]>(
        'SELECT id FROM product_variants WHERE product_id = ? AND size = ?',
        [shoeId, size]
      );

      if (rows.length > 0) {
        await connection.execute(
          'UPDATE product_variants SET stock_quantity = ? WHERE product_id = ? AND size = ?',
          [stock, shoeId, size]
        );
      } else {
        await connection.execute(
          'INSERT INTO product_variants (product_id, size, stock_quantity) VALUES (?, ?, ?)',
          [shoeId, size, stock]
        );
      }
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    console.error('[MySQL Store] updateDbProduct error:', error);
    return false;
  } finally {
    connection.release();
  }
}

// 8. Delete Product (Admin Dashboard) - Now Soft Delete
export async function deleteDbProduct(shoeId: string): Promise<boolean> {
  const isOnline = await testConnection();
  if (!isOnline) {
    const idx = inMemoryShoes.findIndex(s => s.id === shoeId);
    if (idx !== -1) {
      (inMemoryShoes[idx] as any).isDeleted = true;
      return true;
    }
    return false;
  }

  try {
    await query('UPDATE products SET is_deleted = true WHERE id = ?', [shoeId]);
    return true;
  } catch (error) {
    console.error('[MySQL Store] deleteDbProduct error:', error);
    return false;
  }
}

// 8b. Restore Soft-Deleted Product
export async function restoreDbProduct(shoeId: string): Promise<boolean> {
  const isOnline = await testConnection();
  if (!isOnline) {
    const idx = inMemoryShoes.findIndex(s => s.id === shoeId);
    if (idx !== -1) {
      (inMemoryShoes[idx] as any).isDeleted = false;
      return true;
    }
    return false;
  }

  try {
    await query('UPDATE products SET is_deleted = false WHERE id = ?', [shoeId]);
    return true;
  } catch (error) {
    console.error('[MySQL Store] restoreDbProduct error:', error);
    return false;
  }
}

// 8c. Permanent Hard-Delete Product
export async function hardDeleteDbProduct(shoeId: string): Promise<boolean> {
  const isOnline = await testConnection();
  if (!isOnline) {
    inMemoryShoes = inMemoryShoes.filter(s => s.id !== shoeId);
    return true;
  }

  try {
    await query('DELETE FROM products WHERE id = ?', [shoeId]);
    return true;
  } catch (error) {
    console.error('[MySQL Store] hardDeleteDbProduct error:', error);
    return false;
  }
}

// 8d. Get All Soft-Deleted Shoes (Trash Bin)
export async function getDbDeletedShoes(): Promise<Shoe[]> {
  const isOnline = await testConnection();
  if (!isOnline) {
    return inMemoryShoes.filter(s => (s as any).isDeleted);
  }

  try {
    const dbProducts = await query<any[]>('SELECT * FROM products WHERE is_deleted = true ORDER BY created_at DESC');
    const dbVariants = await query<any[]>('SELECT * FROM product_variants');

    return dbProducts.map(p => {
      const variants = dbVariants.filter(v => v.product_id === p.id);
      const sizes = variants.filter(v => v.stock_quantity > 0).map(v => v.size).sort((a, b) => a - b);
      const allSizes = variants.map(v => v.size).sort((a, b) => a - b);
      
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: parseFloat(p.price),
        originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
        category: p.category as any,
        images: parseJsonField(p.images),
        sizes: sizes.length > 0 ? sizes : allSizes,
        colors: p.id === 'velocity-luna-knit-women' ? ['Blush Pink / Rose Gold', 'Orchid Purple', 'Alabaster White'] : ['Classic White', 'Midnight Black', 'Slate Grey'],
        inStock: variants.some(v => v.stock_quantity > 0),
        rating: parseFloat(p.rating),
        reviewsCount: p.reviews_count,
        badge: p.badge as any,
        specs: parseJsonField(p.specs),
        materials: parseJsonField(p.materials),
        totalStock: variants.reduce((sum, v) => sum + v.stock_quantity, 0)
      };
    });
  } catch (error) {
    console.error('[MySQL Store] getDbDeletedShoes error:', error);
    return [];
  }
}

// 9. Load Variant stock numbers for Admin forms
export async function getDbVariantsStock(shoeId: string): Promise<Record<number, number>> {
  const defaultStock: Record<number, number> = {};
  [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46].forEach(size => {
    defaultStock[size] = 10; // Default fallback stock for forms
  });

  const isOnline = await testConnection();
  if (!isOnline) {
    const shoe = inMemoryShoes.find(s => s.id === shoeId);
    if (shoe) {
      [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46].forEach(size => {
        defaultStock[size] = shoe.sizes.includes(size) ? 12 : 0;
      });
    }
    return defaultStock;
  }

  try {
    const dbVariants = await query<any[]>('SELECT size, stock_quantity FROM product_variants WHERE product_id = ?', [shoeId]);
    const stockMap: Record<number, number> = {};
    
    // Prepopulate map with size: 0
    [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46].forEach(size => {
      stockMap[size] = 0;
    });

    dbVariants.forEach(row => {
      stockMap[row.size] = row.stock_quantity;
    });

    return stockMap;
  } catch (error) {
    console.error('[MySQL Store] getDbVariantsStock error, falling back:', error);
    return defaultStock;
  }
}

// 10. Category Visibility
export async function getDbCategorySettings(): Promise<{ category_name: string; is_visible: boolean }[]> {
  const isOnline = await testConnection();
  if (!isOnline) {
    return inMemoryCategorySettings;
  }
  try {
    const rows = await query<any[]>('SELECT category_name, is_visible FROM category_settings');
    return rows.map(r => ({
      category_name: r.category_name,
      is_visible: r.is_visible === 1 || r.is_visible === true || r.is_visible === '1'
    }));
  } catch (error) {
    console.error('[MySQL Store] getDbCategorySettings error, falling back:', error);
    return inMemoryCategorySettings;
  }
}

export async function updateDbCategorySetting(categoryName: string, isVisible: boolean): Promise<boolean> {
  const isOnline = await testConnection();
  if (!isOnline) {
    const setting = inMemoryCategorySettings.find(s => s.category_name.toLowerCase() === categoryName.toLowerCase());
    if (setting) {
      setting.is_visible = isVisible;
      return true;
    }
    return false;
  }
  try {
    await query('UPDATE category_settings SET is_visible = ? WHERE category_name = ?', [isVisible ? 1 : 0, categoryName]);
    return true;
  } catch (error) {
    console.error('[MySQL Store] updateDbCategorySetting error:', error);
    return false;
  }
}

// 11. Custom Pages
export async function getDbCustomPages(): Promise<CustomPage[]> {
  const isOnline = await testConnection();
  if (!isOnline) {
    return inMemoryCustomPages;
  }
  try {
    const rows = await query<any[]>('SELECT * FROM custom_pages ORDER BY created_at DESC');
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      content: r.content,
      isPublished: r.is_published === 1 || r.is_published === true || r.is_published === '1',
      createdAt: r.created_at
    }));
  } catch (error) {
    console.error('[MySQL Store] getDbCustomPages error, falling back:', error);
    return inMemoryCustomPages;
  }
}

export async function getDbCustomPageBySlug(slug: string): Promise<CustomPage | null> {
  const isOnline = await testConnection();
  if (!isOnline) {
    return inMemoryCustomPages.find(p => p.slug === slug) || null;
  }
  try {
    const rows = await query<any[]>('SELECT * FROM custom_pages WHERE slug = ?', [slug]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      title: r.title,
      slug: r.slug,
      content: r.content,
      isPublished: r.is_published === 1 || r.is_published === true || r.is_published === '1',
      createdAt: r.created_at
    };
  } catch (error) {
    console.error('[MySQL Store] getDbCustomPageBySlug error, falling back:', error);
    return inMemoryCustomPages.find(p => p.slug === slug) || null;
  }
}

export async function saveDbCustomPage(page: CustomPage): Promise<boolean> {
  const isOnline = await testConnection();
  if (!isOnline) {
    const idx = inMemoryCustomPages.findIndex(p => p.id === page.id);
    if (idx !== -1) {
      inMemoryCustomPages[idx] = { ...page, createdAt: inMemoryCustomPages[idx].createdAt };
    } else {
      inMemoryCustomPages.unshift({ ...page, createdAt: new Date().toISOString() });
    }
    return true;
  }
  try {
    const rows = await query<any[]>('SELECT id FROM custom_pages WHERE id = ?', [page.id]);
    if (rows.length > 0) {
      await query(
        'UPDATE custom_pages SET title = ?, slug = ?, content = ?, is_published = ? WHERE id = ?',
        [page.title, page.slug, page.content, page.isPublished ? 1 : 0, page.id]
      );
    } else {
      await query(
        'INSERT INTO custom_pages (id, title, slug, content, is_published) VALUES (?, ?, ?, ?, ?)',
        [page.id, page.title, page.slug, page.content, page.isPublished ? 1 : 0]
      );
    }
    return true;
  } catch (error) {
    console.error('[MySQL Store] saveDbCustomPage error:', error);
    return false;
  }
}

export async function deleteDbCustomPage(id: string): Promise<boolean> {
  const isOnline = await testConnection();
  if (!isOnline) {
    inMemoryCustomPages = inMemoryCustomPages.filter(p => p.id !== id);
    return true;
  }
  try {
    await query('DELETE FROM custom_pages WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('[MySQL Store] deleteDbCustomPage error:', error);
    return false;
  }
}

// 12. Store Locations
export async function getDbStoreLocations(): Promise<StoreLocation[]> {
  const isOnline = await testConnection();
  if (!isOnline) {
    return inMemoryStoreLocations;
  }
  try {
    const rows = await query<any[]>('SELECT * FROM store_locations ORDER BY created_at DESC');
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      address: r.address,
      mapUrl: r.map_url,
      timings: r.timings,
      createdAt: r.created_at
    }));
  } catch (error) {
    console.error('[MySQL Store] getDbStoreLocations error, falling back:', error);
    return inMemoryStoreLocations;
  }
}

export async function saveDbStoreLocation(store: StoreLocation): Promise<boolean> {
  const isOnline = await testConnection();
  if (!isOnline) {
    const idx = inMemoryStoreLocations.findIndex(s => s.id === store.id);
    if (idx !== -1) {
      inMemoryStoreLocations[idx] = { ...store, createdAt: inMemoryStoreLocations[idx].createdAt };
    } else {
      inMemoryStoreLocations.unshift({ ...store, createdAt: new Date().toISOString() });
    }
    return true;
  }
  try {
    const rows = await query<any[]>('SELECT id FROM store_locations WHERE id = ?', [store.id]);
    if (rows.length > 0) {
      await query(
        'UPDATE store_locations SET name = ?, address = ?, map_url = ?, timings = ? WHERE id = ?',
        [store.name, store.address, store.mapUrl, store.timings, store.id]
      );
    } else {
      await query(
        'INSERT INTO store_locations (id, name, address, map_url, timings) VALUES (?, ?, ?, ?, ?)',
        [store.id, store.name, store.address, store.mapUrl, store.timings]
      );
    }
    return true;
  } catch (error) {
    console.error('[MySQL Store] saveDbStoreLocation error:', error);
    return false;
  }
}

export async function deleteDbStoreLocation(id: string): Promise<boolean> {
  const isOnline = await testConnection();
  if (!isOnline) {
    inMemoryStoreLocations = inMemoryStoreLocations.filter(s => s.id !== id);
    return true;
  }
  try {
    await query('DELETE FROM store_locations WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('[MySQL Store] deleteDbStoreLocation error:', error);
    return false;
  }
}

// 13. Order Tracking
export async function getDbOrderByTracking(orderId: string, emailOrPhone: string): Promise<Order | null> {
  const isOnline = await testConnection();
  const searchStr = emailOrPhone.trim();
  if (!isOnline) {
    const o = inMemoryOrders.find(
      ord => ord.id.toLowerCase() === orderId.toLowerCase() &&
      (ord.email.toLowerCase() === searchStr.toLowerCase() || (ord.customerPhone && ord.customerPhone.trim() === searchStr))
    );
    return o || null;
  }
  try {
    const dbOrders = await query<any[]>(
      'SELECT * FROM orders WHERE id = ? AND (LOWER(customer_email) = LOWER(?) OR customer_phone = ?)',
      [orderId, searchStr, searchStr]
    );
    if (dbOrders.length === 0) return null;
    const o = dbOrders[0];
    const dbOrderItems = await query<any[]>('SELECT * FROM order_items WHERE order_id = ?', [o.id]);

    const items = dbOrderItems.map(item => ({
      shoeId: item.product_id,
      shoeName: item.product_name,
      price: parseFloat(item.price),
      size: item.size,
      color: item.color,
      quantity: item.quantity
    }));

    return {
      id: o.id,
      customerName: o.customer_name,
      email: o.customer_email,
      address: o.shipping_address,
      city: o.city,
      postalCode: o.postal_code,
      total: parseFloat(o.total_amount),
      items: items,
      paymentMethod: o.payment_method as any,
      createdAt: o.created_at,
      status: o.order_status.toLowerCase() as any,
      customerPhone: o.customer_phone,
      userId: o.user_id || undefined
    };
  } catch (error) {
    console.error('[MySQL Store] getDbOrderByTracking error:', error);
    return null;
  }
}

