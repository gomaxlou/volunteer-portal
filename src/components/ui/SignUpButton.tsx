'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

interface SignUpButtonProps {
  activityId: number;
  title: string;
  date: string;
  maxParticipants?: number;
  currentParticipants?: number;
  className?: string;
  isAuthenticated?: boolean;
}

const SignUpButton: React.FC<SignUpButtonProps> = ({
  activityId,
  title,
  date,
  maxParticipants,
  currentParticipants = 0,
  className = '',
  isAuthenticated = false,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isFull = maxParticipants ? currentParticipants >= maxParticipants : false;
  const spotsLeft = maxParticipants ? maxParticipants - currentParticipants : null;

  const handleSignUp = async () => {
    if (!isAuthenticated) {
      // 儲存目前頁面 URL 到 localStorage，登入後可以返回
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/login');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSignUp = async () => {
    setIsLoading(true);
    try {
      // TODO: 實作報名 API 呼叫
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬 API 呼叫
      
      toast.success('報名成功！');
      setShowConfirmModal(false);
      // 重新整理頁面以更新報名人數
      router.refresh();
    } catch (error) {
      toast.error('報名失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        <button
          onClick={handleSignUp}
          disabled={isFull || isLoading}
          className={`
            w-full px-6 py-3 rounded-lg font-medium text-white
            transition-colors duration-200
            ${isFull
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
            }
          `}
        >
          {isLoading ? (
            <LoadingSpinner size={5} color="white" />
          ) : isFull ? (
            '名額已滿'
          ) : (
            '立即報名'
          )}
        </button>
        
        {maxParticipants && (
          <p className="text-sm text-center text-gray-600">
            {isFull ? (
              <span className="text-red-500">報名已額滿</span>
            ) : (
              <>尚餘 <span className="font-medium text-green-600">{spotsLeft}</span> 個名額</>
            )}
          </p>
        )}
      </div>

      {/* 確認視窗 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* 背景遮罩 */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => !isLoading && setShowConfirmModal(false)}
            />

            {/* 模態框 */}
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-green-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    確認報名
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      您即將報名參加「{title}」活動，活動日期為 {date}。
                      報名成功後，我們會寄送確認信至您的信箱。
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={confirmSignUp}
                  className={`
                    inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white
                    rounded-md border border-transparent sm:ml-3 sm:w-auto sm:text-sm
                    ${isLoading
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                    }
                  `}
                >
                  {isLoading ? '處理中...' : '確認報名'}
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowConfirmModal(false)}
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpButton;
