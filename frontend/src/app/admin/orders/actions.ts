const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function changeOrderStatus(orderId: string, status: string) {
  try {
    const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status }),
      credentials: 'include'
    });
    if (!res.ok) return { success: false, error: 'API Error' };
    const json = await res.json();
    return { success: !!json.success };
  } catch (error) {
    console.error('Failed to change order status:', error);
    return { success: false, error: String(error) };
  }
}

export async function fetchOrders() {
  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      credentials: 'include'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}
