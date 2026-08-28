const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function adminLoginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Please enter both username and password' };
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: username, password }),
      credentials: 'include'
    });

    const json = await res.json();
    if (!res.ok || json.error) {
      return { error: json.error || 'Incorrect username or password. Please try again.' };
    }

    if (typeof window !== 'undefined') {
      window.location.href = '/admin';
    }
    return { error: null };
  } catch (error) {
    console.error('Admin login error:', error);
    return { error: 'Connection error to backend API.' };
  }
}

export async function adminLogoutAction() {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Admin logout error:', error);
  } finally {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  }
}
