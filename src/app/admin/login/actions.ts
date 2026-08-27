'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function adminLoginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'velocity_admin_2026';

  if (!username || !password) {
    return { error: 'Please enter both username and password' };
  }

  if (username === expectedUsername && password === expectedPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
  } else {
    return { error: 'Incorrect username or password. Please try again.' };
  }

  redirect('/admin');
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}
