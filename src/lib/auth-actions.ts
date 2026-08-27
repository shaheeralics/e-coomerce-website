'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createUser, getUserByEmail } from './user-store';
import { hashPassword, verifyPassword, signSession, verifySession } from './auth-utils';

// Helper to validate email format
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 1. Signup Action
export async function customerSignupAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!name || !email || !password || !confirmPassword) {
    return { error: 'All fields are required.' };
  }

  if (!validateEmail(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { error: 'An account with this email already exists.' };
    }

    // Generate unique ID and hash password
    const userId = `user_${Math.random().toString(36).substring(2, 11)}`;
    const passwordHash = hashPassword(password);

    // Save to local MySQL database
    const success = await createUser(userId, name, email, passwordHash, 'customer');
    if (!success) {
      return { error: 'Failed to create account due to a database error.' };
    }

    // Sign and set session cookie
    const token = signSession({ userId, name, email, role: 'customer' });
    const cookieStore = await cookies();
    cookieStore.set('customer_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }

  redirect('/profile');
}

// 2. Login Action
export async function customerLoginAction(prevState: any, formData: FormData) {
  const emailInput = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!emailInput || !password) {
    return { error: 'Please fill in all fields.' };
  }

  // Support logging in with 'admin' username in addition to 'admin@velocity.com'
  let searchEmail = emailInput.trim();
  if (searchEmail.toLowerCase() === 'admin') {
    searchEmail = 'admin@velocity.com';
  }

  let redirectPath = '/';

  try {
    // Find user in database
    const user = await getUserByEmail(searchEmail);
    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    // Verify password hash
    const isPasswordValid = verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return { error: 'Invalid email or password.' };
    }

    // Sign and set session cookie
    const token = signSession({ userId: user.id, name: user.name, email: user.email, role: user.role });
    const cookieStore = await cookies();
    cookieStore.set('customer_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    if (user.role === 'admin') {
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
      redirectPath = '/admin';
    } else {
      cookieStore.delete('admin_session');
      redirectPath = '/';
    }

  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An unexpected database error occurred.' };
  }

  redirect(redirectPath);
}

// 3. Logout Action
export async function customerLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('customer_session');
  cookieStore.delete('admin_session');
  redirect('/login');
}

// 4. Retrieve Active Customer Session
export async function getCustomerSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_session')?.value;
    if (!token) return null;

    const payload = verifySession(token);
    if (!payload) return null;

    return {
      userId: payload.userId as string,
      name: payload.name as string,
      email: payload.email as string,
      role: (payload.role || 'customer') as string,
    };
  } catch (error) {
    console.error('getCustomerSession error:', error);
    return null;
  }
}

// 5. Fetch orders for active customer session
export async function fetchCustomerOrdersAction() {
  const session = await getCustomerSession();
  if (!session) return [];
  
  const { getUserOrders } = await import('./user-store');
  return getUserOrders(session.userId);
}
