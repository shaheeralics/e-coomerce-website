import { query } from './db';
import { Order } from '../types';
import { hashPassword } from './auth-utils';

// Initialize the database tables if they do not exist
export async function initAuthTables() {
  try {
    // 1. Create users table with role
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Add role column to users if it does not exist (in case table was created before)
    const userColumns = await query<any[]>('SHOW COLUMNS FROM users LIKE "role"');
    if (userColumns.length === 0) {
      await query('ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT "customer"');
      console.log('[MySQL] Added role column to users table.');
    }

    // 2. Add user_id column to orders if it does not exist
    const columns = await query<any[]>('SHOW COLUMNS FROM orders LIKE "user_id"');
    if (columns.length === 0) {
      await query('ALTER TABLE orders ADD COLUMN user_id VARCHAR(100) NULL');
      console.log('[MySQL] Added user_id column to orders table.');
    }

    // 3. Add is_deleted column to products if it does not exist
    const productColumns = await query<any[]>('SHOW COLUMNS FROM products LIKE "is_deleted"');
    if (productColumns.length === 0) {
      await query('ALTER TABLE products ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE');
      console.log('[MySQL] Added is_deleted column to products table.');
    }

    // 4. Seed default admin user if none exists
    const adminUsers = await query<any[]>('SELECT id FROM users WHERE role = "admin"');
    if (adminUsers.length === 0) {
      const adminId = 'user_admin_pawanda';
      const adminName = 'Pawanda Admin';
      const adminEmail = 'website@pawanda.com';
      const rawPassword = process.env.ADMIN_PASSWORD || 'Pawanda499%';
      const pwdHash = hashPassword(rawPassword);
      
      await query(
        'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, "admin")',
        [adminId, adminName, adminEmail.toLowerCase(), pwdHash]
      );
      console.log('[MySQL] Seeded default admin user: website@pawanda.com');
    }

    // 5. Create custom_pages table
    await query(`
      CREATE TABLE IF NOT EXISTS custom_pages (
        id VARCHAR(100) NOT NULL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. Create category_settings table
    await query(`
      CREATE TABLE IF NOT EXISTS category_settings (
        category_name VARCHAR(100) NOT NULL PRIMARY KEY,
        is_visible BOOLEAN NOT NULL DEFAULT TRUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. Create store_locations table
    await query(`
      CREATE TABLE IF NOT EXISTS store_locations (
        id VARCHAR(100) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        map_url TEXT NOT NULL,
        timings VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Schema Migrations: Add sort_order to custom_pages and category_settings if they don't exist
    try {
      await query(`ALTER TABLE custom_pages ADD COLUMN sort_order INT NOT NULL DEFAULT 0`);
      console.log('[MySQL Migration] Added sort_order to custom_pages');
    } catch (err) {
      // Ignore if column already exists
    }

    try {
      await query(`ALTER TABLE category_settings ADD COLUMN sort_order INT NOT NULL DEFAULT 0`);
      console.log('[MySQL Migration] Added sort_order to category_settings');
    } catch (err) {
      // Ignore if column already exists
    }

    // 8. Seed default category_settings if empty
    const existingSettings = await query<any[]>('SELECT category_name FROM category_settings');
    if (existingSettings.length === 0) {
      const defaultCategories = ['Men', 'Women', 'Kids', 'Running', 'Casual', 'Limited Drops'];
      for (const cat of defaultCategories) {
        await query('INSERT INTO category_settings (category_name, is_visible) VALUES (?, true)', [cat]);
      }
      console.log('[MySQL] Seeded default category settings.');
    }

    // 9. Seed default store location if empty
    const existingStores = await query<any[]>('SELECT id FROM store_locations');
    if (existingStores.length === 0) {
      await query(
        'INSERT INTO store_locations (id, name, address, map_url, timings) VALUES (?, ?, ?, ?, ?)',
        [
          'store_lahore_1',
          'Velocity Lahore Flagship',
          'M.M. Alam Road, Gulberg III, Lahore, Pakistan',
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.372439265239!2d74.348612!3d31.513904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045bda0a8f85%3A0x67db23af7e0340c2!2sM.M.%20Alam%20Rd%2C%20Lahore!5e0!3m2!1sen!2spk!4v1700000000000',
          'Mon - Sat: 11:00 AM - 10:00 PM, Sun: 2:00 PM - 8:00 PM'
        ]
      );
      console.log('[MySQL] Seeded default store location.');
    }

    // 10. Seed default custom page if empty
    const existingPages = await query<any[]>('SELECT id FROM custom_pages');
    if (existingPages.length === 0) {
      await query(
        'INSERT INTO custom_pages (id, title, slug, content, is_published) VALUES (?, ?, ?, ?, true)',
        [
          'about-us',
          'About Velocity',
          'about-us',
          'Welcome to VELOCITY. We build premium, carbon-neutral activewear and running shoes designed for ultimate speed, durability, and minimal environmental impact. Our mission is to combine cutting-edge materials science with striking minimalist aesthetics. Join us in stepping into a sustainable future.',
          true
        ]
      );
      console.log('[MySQL] Seeded default custom page.');
    }
  } catch (error) {
    console.error('[MySQL] Failed to initialize user auth tables:', error);
  }
}

// User object type definitions
export interface UserDb {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'customer' | 'admin';
  created_at: string;
}

// Register a new customer
export async function createUser(id: string, name: string, email: string, passwordHash: string, role: string = 'customer'): Promise<boolean> {
  try {
    await query(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [id, name, email.toLowerCase(), passwordHash, role]
    );
    return true;
  } catch (error) {
    console.error('[MySQL] createUser error:', error);
    return false;
  }
}

// Find customer by email
export async function getUserByEmail(email: string): Promise<UserDb | null> {
  try {
    const users = await query<UserDb[]>(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    if (users.length === 0) return null;
    return users[0];
  } catch (error) {
    console.error('[MySQL] getUserByEmail error:', error);
    return null;
  }
}

// Find customer by ID
export async function getUserById(id: string): Promise<UserDb | null> {
  try {
    const users = await query<UserDb[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    if (users.length === 0) return null;
    return users[0];
  } catch (error) {
    console.error('[MySQL] getUserById error:', error);
    return null;
  }
}

// Fetch order history for a specific customer
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    // Select orders belonging to this user
    const dbOrders = await query<any[]>(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    if (dbOrders.length === 0) return [];

    // Select order items for these orders
    const orderIds = dbOrders.map(o => o.id);
    const placeholders = orderIds.map(() => '?').join(',');
    const dbOrderItems = await query<any[]>(
      `SELECT * FROM order_items WHERE order_id IN (${placeholders})`,
      orderIds
    );

    // Map rows to clean Order objects
    return dbOrders.map(o => {
      const items = dbOrderItems
        .filter(item => item.order_id === o.id)
        .map(item => ({
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
        customerPhone: o.customer_phone
      };
    });
  } catch (error) {
    console.error('[MySQL] getUserOrders error:', error);
    return [];
  }
}

// Fetch all registered customers along with their order counts
export async function getDbCustomersSummary(): Promise<any[]> {
  try {
    return await query<any[]>(`
      SELECT u.id, u.name, u.email, u.created_at, COUNT(o.id) as total_orders
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
  } catch (error) {
    console.error('[MySQL] getDbCustomersSummary error:', error);
    return [];
  }
}
