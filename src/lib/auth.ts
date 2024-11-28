// 用戶信息類型
export interface UserInfo {
  id?: number;
  username: string;
  role: 'admin' | 'user';
  chinese_name?: string;
}

// 檢查是否有 auth token
export function hasAuthToken(): boolean {
  try {
    const cookies = document.cookie.split(';');
    const hasToken = cookies.some(cookie => {
      const [name, value] = cookie.trim().split('=');
      return name === 'auth-token' && value;
    });
    return hasToken;
  } catch (error) {
    return false;
  }
}

// 檢查用戶是否已登入
export async function checkAuth(): Promise<UserInfo | null> {
  try {
    // 先檢查是否有 token
    if (!hasAuthToken()) {
      return null;
    }

    const response = await fetch('/api/auth/me', {
      credentials: 'include',
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error('驗證失敗');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    return null;
  }
}

// 登出
export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    throw error;
  }
}
