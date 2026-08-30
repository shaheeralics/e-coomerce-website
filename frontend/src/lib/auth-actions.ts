const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 1. Signup Action (Client-side API call)
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
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, confirmPassword }),
      credentials: 'include'
    });

    const json = await res.json();
    if (!res.ok || json.error) {
      return { error: json.error || 'Failed to create account.' };
    }

    if (typeof window !== 'undefined') {
      window.location.href = '/profile';
    }
    return { error: null };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'Connection error to backend API.' };
  }
}

// 2. Login Action (Client-side API call)
export async function customerLoginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please fill in all fields.' };
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const json = await res.json();
    if (!res.ok || json.error) {
      return { error: json.error || 'Invalid email or password.' };
    }

    if (typeof window !== 'undefined') {
      if (json.user && json.user.role === 'admin') {
        window.location.href = '/';
      } else {
        window.location.href = '/profile';
      }
    }
    return { error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Connection error to backend API.' };
  }
}

// 3. Logout Action (Client-side API call)
export async function customerLogoutAction() {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
}

// 4. Retrieve Active Customer Session
export async function getCustomerSession() {
  try {
    const res = await fetch(`${API_URL}/api/auth/session`, {
      credentials: 'include'
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.session;
  } catch (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
}

// 5. Fetch orders for active customer session
export async function fetchCustomerOrdersAction() {
  try {
    const res = await fetch(`${API_URL}/api/orders/customer`, {
      credentials: 'include'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Fetch customer orders error:', error);
    return [];
  }
}
