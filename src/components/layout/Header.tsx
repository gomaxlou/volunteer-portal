'use client';

import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { checkAuth, logout, type UserInfo } from '@/lib/auth';

const navItems = [
  { name: '首頁', href: '/' },
  { name: '活動列表', href: '/events' },
  { name: '志工招募', href: '/volunteer' },
  { name: '團隊介紹', href: '/about' },
  { name: '最新消息', href: '/news' },
  { name: '團務報告', href: '/reports' },
  { name: '愛心捐款', href: '/donate' },
  { name: '活動相簿', href: '/gallery' },
  { name: '聯絡我們', href: '/contact' },
];

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const updateAuth = async () => {
      const userInfo = await checkAuth();
      setUser(userInfo);
      
      // 檢查是否剛剛登入
      const isNewLogin = searchParams.get('login') === 'success';
      if (isNewLogin && userInfo) {
        setShowWelcome(true);
        // 3秒後隱藏歡迎消息
        setTimeout(() => setShowWelcome(false), 3000);
      }
    };

    updateAuth();
    // 每分鐘檢查一次身份狀態
    const interval = setInterval(updateAuth, 60000);
    return () => clearInterval(interval);
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      // 錯誤處理
    }
  };

  // 點擊外部時關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md relative">
      {/* 歡迎消息 */}
      {showWelcome && (
        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white py-2 text-center transition-all duration-500 ease-in-out">
          <p className="text-sm">
            歡迎回來，{user?.username}！
          </p>
        </div>
      )}

      <nav className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-500 ${showWelcome ? 'mt-10' : ''}`} aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              志工平台
            </Link>
          </div>

          {/* 桌面版選單 */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium text-gray-700 hover:text-gray-900"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* 使用者選單 */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-600" />
                    <div className="ml-2 flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900">
                        {user.chinese_name || user.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.role === 'admin' ? '管理員' : '一般用戶'}
                      </span>
                    </div>
                  </div>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 text-sm border-b border-gray-100">
                      <div className="font-medium text-gray-900">{user?.chinese_name || user.username}</div>
                      <div className={`text-xs mt-0.5 ${user?.role === 'admin' ? 'text-yellow-600' : 'text-gray-500'}`}>
                        {user?.role === 'admin' ? '管理員' : '一般用戶'}
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                      >
                        登出
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                <LogIn className="h-4 w-4" />
                <span>登入</span>
              </Link>
            )}

            {/* 手機版選單按鈕 */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">開啟選單</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 手機版選單 */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50">
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="text-2xl font-bold">志工平台</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">關閉選單</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    {user ? (
                      <>
                        <div className="mb-4 px-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-900">{user.chinese_name || user.username}</div>
                              <div className={`text-xs ${user.role === 'admin' ? 'text-yellow-600' : 'text-gray-500'}`}>
                                {user.role === 'admin' ? '管理員' : '一般用戶'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <LogOut className="h-5 w-5 mr-2" />
                            登出
                          </div>
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <LogIn className="h-5 w-5 mr-2" />
                          登入
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
