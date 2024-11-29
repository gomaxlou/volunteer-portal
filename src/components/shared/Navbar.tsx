'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { checkAuth, type UserInfo } from '@/lib/auth';
import { UserCircle } from '@/components/icons';

export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  const verifyAuth = async () => {
    const userInfo = await checkAuth();
    setUser(userInfo);
  };

  useEffect(() => {
    setMounted(true);
    verifyAuth();

    // 監聽登入狀態變化
    const handleAuthChange = () => {
      verifyAuth();
    };

    window.addEventListener('auth-state-changed', handleAuthChange);

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
        // 觸發全局事件
        window.dispatchEvent(new CustomEvent('auth-state-changed'));
        // 重新導向到首頁並刷新
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('登出錯誤:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  const navItems = [
    { href: '/', label: '首頁' },
    { href: '/events', label: '活動列表' },
    { href: '/volunteer', label: '志工招募' },
    { href: '/about', label: '團隊介紹' },
    { href: '/news', label: '最新消息' },
    { href: '/reports', label: '團務報告' },
    { href: '/donation', label: '愛心捐款' },
    { href: '/gallery', label: '活動相簿' },
    { href: '/contact', label: '聯絡我們' },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-green-600 whitespace-nowrap">
            志工平台
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-gray-600 hover:text-green-600 rounded-md text-sm font-medium whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Login/User Info */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <UserCircle className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 font-bold hover:text-green-600 transition-colors">
                    {user.chinese_name || user.username}
                  </span>
                  <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors">
                    {user.role === 'admin' ? '管理員' : '志工'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  登出
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap"
              >
                登入
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
