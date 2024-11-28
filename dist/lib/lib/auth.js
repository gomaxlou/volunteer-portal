"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromCookie = getUserFromCookie;
exports.setUserCookie = setUserCookie;
exports.clearUserCookie = clearUserCookie;
// 從 cookie 中獲取用戶信息
function getUserFromCookie() {
    if (typeof window === 'undefined')
        return null;
    const userStr = document.cookie
        .split('; ')
        .find(row => row.startsWith('user-info='));
    if (!userStr)
        return null;
    try {
        return JSON.parse(decodeURIComponent(userStr.split('=')[1]));
    }
    catch (_a) {
        return null;
    }
}
// 設置用戶信息到 cookie
function setUserCookie(user) {
    document.cookie = `user-info=${encodeURIComponent(JSON.stringify(user))}; path=/`;
    // 觸發 storage 事件以更新其他頁面
    window.dispatchEvent(new Event('storage'));
}
// 清除用戶信息
function clearUserCookie() {
    document.cookie = 'user-info=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.dispatchEvent(new Event('storage'));
}
