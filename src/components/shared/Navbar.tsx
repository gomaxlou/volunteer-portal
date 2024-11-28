'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { checkAuth, type UserInfo } from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    setMounted(true);
    const verifyAuth = async () => {
      const userInfo = await checkAuth();
      setUser(userInfo);
    };

    verifyAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
        router.refresh();
        router.replace('/login');
      }
    } catch (error) {
      console.error('登出錯誤:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              志工系統
            </Link>
            {user && (
              <Link 
                href="/events/create" 
                className="text-gray-600 hover:text-gray-900"
              >
                建立活動
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  登出
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
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
