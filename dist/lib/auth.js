"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAuthToken = hasAuthToken;
exports.clearAuthState = clearAuthState;
exports.checkAuth = checkAuth;
exports.logout = logout;
// 檢查是否有 auth token
function hasAuthToken() {
    try {
        const cookies = document.cookie.split(';');
        const hasToken = cookies.some(cookie => {
            const [name, value] = cookie.trim().split('=');
            return name === 'auth-token' && value;
        });
        return hasToken;
    }
    catch (error) {
        return false;
    }
}
// 清除認證狀態
function clearAuthState() {
    // 清除 cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    // 觸發全局事件，通知其他組件用戶已登出
    const event = new CustomEvent('auth-state-changed', { detail: { authenticated: false } });
    window.dispatchEvent(event);
}
// 檢查用戶是否已登入
async function checkAuth() {
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
                clearAuthState();
                return null;
            }
            throw new Error('驗證失敗');
        }
        const data = await response.json();
        return data.user;
    }
    catch (error) {
        clearAuthState();
        return null;
    }
}
// 登出
async function logout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
    }
    finally {
        clearAuthState();
    }
}
