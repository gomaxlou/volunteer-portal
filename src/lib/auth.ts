// 用戶信息類型
export interface UserInfo {
  id?: number;
  username: string;
  role: 'admin' | 'user';
  chinese_name?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 驗證 JWT Token
export async function verifyJwtToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  
  try {
    // 基本的 token 格式驗證
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // 檢查是否過期
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    if (!exp || Date.now() >= exp * 1000) return false;

    return true;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return false;
  }
}

// 檢查是否有 auth token
export function hasAuthToken(): boolean {
  try {
    const cookies = document.cookie.split(';');
    const hasToken = cookies.some(cookie => {
      const [name, value] = cookie.trim().split('=');
      return name === 'auth-token' && value;
    });
    console.log('Has auth token:', hasToken);
    return hasToken;
  } catch (error) {
    console.error('Error checking auth token:', error);
    return false;
  }
}

// 清除認證狀態
export function clearAuthState() {
  console.log('Clearing auth state');
  // 清除 cookie
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  
  // 觸發全局事件，通知其他組件用戶已登出
  const event = new CustomEvent('auth-state-changed', { detail: { authenticated: false } });
  window.dispatchEvent(event);
}

// 檢查用戶是否已登入
export async function checkAuth(): Promise<UserInfo | null> {
  try {
    console.log('Checking auth status');
    // 先檢查是否有 token
    if (!hasAuthToken()) {
      console.log('No auth token found');
      return null;
    }

    const response = await fetch('/api/auth/me', {
      credentials: 'include',
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.log('Auth check failed: Unauthorized');
        clearAuthState();
        return null;
      }
      throw new Error('驗證失敗');
    }

    const data = await response.json();
    console.log('Auth check successful:', data);
    return data.user;
  } catch (error) {
    console.error('Auth check error:', error);
    clearAuthState();
    return null;
  }
}

// 從 cookie 獲取用戶信息
export async function getUserFromCookie(): Promise<UserInfo | null> {
  try {
    console.log('Getting user from cookie');
    const user = await checkAuth();
    console.log('User from cookie:', user);
    return user;
  } catch (error) {
    console.error('Error getting user from cookie:', error);
    return null;
  }
}

// 登出
export async function logout(): Promise<void> {
  try {
    console.log('Logging out');
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('登出失敗');
    }
    
    clearAuthState();
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
