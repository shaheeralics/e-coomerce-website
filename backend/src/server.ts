import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Database connection on start
import { testConnection, query } from './lib/db';
import { initAuthTables } from './lib/user-store';

// Import mysql-store helpers
import {
  getDbShoes,
  getDbDeletedShoes,
  getDbShoeById,
  addDbProduct,
  updateDbProduct,
  deleteDbProduct,
  restoreDbProduct,
  hardDeleteDbProduct,
  getDbVariantsStock,
  getDbCategorySettings,
  updateDbCategorySetting,
  updateDbCategorySortOrders,
  getDbCustomPages,
  getDbCustomPageBySlug,
  saveDbCustomPage,
  deleteDbCustomPage,
  updateDbCustomPageSortOrders,
  getDbStoreLocations,
  saveDbStoreLocation,
  deleteDbStoreLocation,
  getDbOrders,
  getDbOrderByTracking,
  saveDbOrder,
  updateDbOrderStatus
} from './lib/mysql-store';

// Import user-store helpers
import {
  getUserByEmail,
  createUser,
  getUserOrders
} from './lib/user-store';

// Import auth-utils
import {
  hashPassword,
  verifyPassword,
  signSession,
  verifySession
} from './lib/auth-utils';

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Dynamic origin mirroring with credentials support
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve static uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// Setup Multer storage for image file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Database initialization
testConnection().then(async (online) => {
  console.log(`Database Status: ${online ? 'ONLINE' : 'OFFLINE (In-memory fallback activated)'}`);
  if (online) {
    try {
      await initAuthTables();
      console.log('Database tables successfully initialized.');
    } catch (err) {
      console.error('Failed to initialize database tables:', err);
    }
  }
});

// Helper: Retrieve session user from cookie
const getSessionUser = (req: express.Request) => {
  const token = req.cookies['customer_session'];
  if (!token) return null;
  return verifySession(token);
};

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

// Get Current User Session
app.get('/api/auth/session', (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.json({ session: null });
  }
  res.json({
    session: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role || 'customer'
    }
  });
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const userId = `user_${Math.random().toString(36).substring(2, 11)}`;
    const passwordHash = hashPassword(password);

    const success = await createUser(userId, name, email, passwordHash, 'customer');
    if (!success) {
      return res.status(500).json({ error: 'Database error creating account.' });
    }

    const token = signSession({ userId, name, email, role: 'customer' });
    res.cookie('customer_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    res.json({ success: true, user: { userId, name, email, role: 'customer' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal signup error.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  let searchEmail = email.trim();
  if (searchEmail.toLowerCase() === 'admin') {
    searchEmail = 'admin@velocity.com';
  }

  try {
    const user = await getUserByEmail(searchEmail);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = signSession({ userId: user.id, name: user.name, email: user.email, role: user.role });
    res.cookie('customer_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.devsil.com' : undefined,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    if (user.role === 'admin') {
      res.cookie('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.devsil.com' : undefined,
        path: '/',
        maxAge: 1000 * 60 * 60 * 24
      });
    }

    res.json({ success: true, user: { userId: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal login error.' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  // Options for the new cross-subdomain cookie
  const cookieOptionsWithDomain = { 
    domain: process.env.NODE_ENV === 'production' ? '.devsil.com' : undefined, 
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const
  };
  
  // Options for the old cookie (before the domain fix was added)
  const cookieOptionsWithoutDomain = { 
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const
  };

  // Clear both versions to eliminate zombie cookies
  res.clearCookie('customer_session', cookieOptionsWithDomain);
  res.clearCookie('admin_session', cookieOptionsWithDomain);
  res.clearCookie('customer_session', cookieOptionsWithoutDomain);
  res.clearCookie('admin_session', cookieOptionsWithoutDomain);
  res.json({ success: true });
});

// ==========================================
// 2. SHOES ENDPOINTS
// ==========================================

// Get all shoes
app.get('/api/shoes', async (req, res) => {
  try {
    const shoes = await getDbShoes();
    res.json(shoes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shoes.' });
  }
});

// Get trashed shoes
app.get('/api/shoes/trash', async (req, res) => {
  try {
    const shoes = await getDbDeletedShoes();
    res.json(shoes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deleted shoes.' });
  }
});

// Get variants stock mapping for specific shoe
app.get('/api/shoes/:id/variants', async (req, res) => {
  try {
    const stock = await getDbVariantsStock(req.params.id);
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch variants stock.' });
  }
});

// Get specific shoe
app.get('/api/shoes/:id', async (req, res) => {
  try {
    const shoe = await getDbShoeById(req.params.id);
    if (!shoe) return res.status(404).json({ error: 'Shoe not found.' });
    res.json(shoe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shoe details.' });
  }
});

// Create Shoe
app.post('/api/shoes', async (req, res) => {
  try {
    const { shoe, variantStock } = req.body;
    const success = await addDbProduct(shoe, variantStock);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create shoe.' });
  }
});

// Update Shoe
app.put('/api/shoes/:id', async (req, res) => {
  try {
    const { shoeUpdate, variantStock } = req.body;
    const success = await updateDbProduct(req.params.id, shoeUpdate, variantStock);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update shoe.' });
  }
});

// Restore Shoe
app.post('/api/shoes/:id/restore', async (req, res) => {
  try {
    const success = await restoreDbProduct(req.params.id);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to restore shoe.' });
  }
});

// Soft Delete Shoe
app.delete('/api/shoes/:id/soft', async (req, res) => {
  try {
    const success = await deleteDbProduct(req.params.id);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to soft delete shoe.' });
  }
});

// Hard Delete Shoe
app.delete('/api/shoes/:id/hard', async (req, res) => {
  try {
    const success = await hardDeleteDbProduct(req.params.id);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to hard delete shoe.' });
  }
});

// ==========================================
// 3. CATEGORIES ENDPOINTS
// ==========================================

app.get('/api/categories', async (req, res) => {
  try {
    const data = await getDbCategorySettings();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category settings.' });
  }
});

app.put('/api/categories/reorder', async (req, res) => {
  try {
    const { orders } = req.body;
    const success = await updateDbCategorySortOrders(orders);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder categories.' });
  }
});

app.put('/api/categories/:name', async (req, res) => {
  try {
    const { isVisible } = req.body;
    const success = await updateDbCategorySetting(req.params.name, isVisible);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category setting.' });
  }
});

// ==========================================
// 4. CUSTOM PAGES ENDPOINTS
// ==========================================

app.get('/api/pages', async (req, res) => {
  try {
    const pages = await getDbCustomPages();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pages.' });
  }
});

app.put('/api/pages/reorder', async (req, res) => {
  try {
    const { orders } = req.body;
    const success = await updateDbCustomPageSortOrders(orders);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder pages.' });
  }
});

app.get('/api/pages/:slug', async (req, res) => {
  try {
    const page = await getDbCustomPageBySlug(req.params.slug);
    if (!page) return res.status(404).json({ error: 'Page not found.' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch page.' });
  }
});

app.post('/api/pages', async (req, res) => {
  try {
    const pageData = req.body;
    const success = await saveDbCustomPage(pageData);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save page.' });
  }
});

app.delete('/api/pages/:id', async (req, res) => {
  try {
    const success = await deleteDbCustomPage(req.params.id);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete page.' });
  }
});

// ==========================================
// 5. STORE LOCATIONS ENDPOINTS
// ==========================================

app.get('/api/locations', async (req, res) => {
  try {
    const locations = await getDbStoreLocations();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch store locations.' });
  }
});

app.post('/api/locations', async (req, res) => {
  try {
    const locationData = req.body;
    const success = await saveDbStoreLocation(locationData);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save location.' });
  }
});

app.delete('/api/locations/:id', async (req, res) => {
  try {
    const success = await deleteDbStoreLocation(req.params.id);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete location.' });
  }
});

// ==========================================
// 6. ORDERS ENDPOINTS
// ==========================================

// Get All Orders (Admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await getDbOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// Get User Orders (Customer Session)
app.get('/api/orders/customer', async (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  try {
    const orders = await getUserOrders(user.userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer orders.' });
  }
});

// Create Order
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const order = await saveDbOrder(orderData);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

// Update Order Status
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const success = await updateDbOrderStatus(req.params.id, status);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// Order Tracking Lookups
app.get('/api/orders/track', async (req, res) => {
  const { orderId, emailOrPhone } = req.query;
  if (!orderId || !emailOrPhone) {
    return res.status(400).json({ error: 'Order ID and email/phone are required.' });
  }

  try {
    const order = await getDbOrderByTracking(String(orderId), String(emailOrPhone));
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to track order.' });
  }
});

// Get low stock variants count
app.get('/api/shoes/low-stock-count', async (req, res) => {
  const isOnline = await testConnection();
  if (!isOnline) {
    return res.json({ count: 2 });
  }
  try {
    const results = await query<{ count: number }[]>('SELECT COUNT(*) as count FROM product_variants WHERE stock_quantity < 5 AND stock_quantity >= 0');
    res.json({ count: results[0]?.count || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to query stock' });
  }
});

// Get total customers count (Admin)
app.get('/api/admin/customers-count', async (req, res) => {
  const isOnline = await testConnection();
  if (!isOnline) {
    return res.json({ count: 1 });
  }
  try {
    const result = await query<{ count: number }[]>('SELECT COUNT(*) as count FROM users WHERE role = "customer"');
    res.json({ count: result[0]?.count || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to count customers' });
  }
});

// ==========================================
// 7. FILE UPLOAD ENDPOINT
// ==========================================

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  // Construct absolute/relative URL from server context
  const host = req.get('host');
  const protocol = req.protocol;
  const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend Server listening on port ${PORT}`);
});
