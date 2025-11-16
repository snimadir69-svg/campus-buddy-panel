import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Xavfsiz fetch funktsiyasi
 * Har bir so'rovga access token qo'shadi
 * 401 xatolari uchun logout qiladi
 */
export async function authFetch(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Access token qo'shish
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Faqat 401 (Unauthorized) bo'lsa - logout qilish va yo'naltirish
    if (response.status === 401) {
      handleLogout();
      throw new Error('Session expired. Please login again.');
    }

    // 500 (Server Error) bo'lsa - faqat xabar chiqarish, logout qilmaydi
    if (response.status === 500) {
      // Faqat xatolik log qilinadi, logout va redirect yo'q
      console.error('Server error. Please try again later.');
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

/**
 * Logout - tokenlarni o'chirish va login sahifasiga yo'naltirish
 */
function handleLogout(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('currentUser');
  // Login sahifasiga yo'naltirish
  window.location.href = '/login';
}

/**
 * Logout API so'rovi yuborish
 */
export async function logoutUser(): Promise<void> {
  try {
    await authFetch(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    handleLogout();
  }
}
