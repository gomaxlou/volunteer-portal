'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromCookie } from '@/lib/auth';

interface EventFormData {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  image?: string;
  maxParticipants: number;
  registrationDeadline: string;
  projectManager: {
    name: string;
    title?: string;
    phone: string;
    email?: string;
    line?: string;
  };
}

export default function NewEventPage() {
  const router = useRouter();
  const user = getUserFromCookie();

  // 如果不是管理員，重定向到首頁
  if (!user || user.role !== 'admin') {
    router.push('/');
    return null;
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const image = formData.get('image') as string;
    const eventData: EventFormData = {
      title: formData.get('title') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
      image: image && image.trim() !== '' ? image : undefined,
      maxParticipants: parseInt(formData.get('maxParticipants') as string),
      registrationDeadline: formData.get('registrationDeadline') as string,
      projectManager: {
        name: formData.get('pmName') as string,
        title: formData.get('pmTitle') as string || undefined,
        phone: formData.get('pmPhone') as string,
        email: formData.get('pmEmail') as string || undefined,
        line: formData.get('pmLine') as string || undefined,
      }
    };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '新增活動失敗');
      }

      router.push('/trips');
      router.refresh();
    } catch (error) {
      console.error('新增活動失敗:', error);
      alert(error instanceof Error ? error.message : '系統錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">新增活動</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本資訊 */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">基本資訊</h2>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  活動名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    開始日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    結束日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  活動地點 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  活動說明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  id="description"
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  活動圖片網址
                </label>
                <input
                  type="url"
                  name="image"
                  id="image"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            {/* 報名資訊 */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">報名資訊</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
                    報名人數上限 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    id="maxParticipants"
                    required
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700">
                    報名截止日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="registrationDeadline"
                    id="registrationDeadline"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* 專案負責人資訊 */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">專案負責人資訊</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pmName" className="block text-sm font-medium text-gray-700">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pmName"
                    id="pmName"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="pmTitle" className="block text-sm font-medium text-gray-700">
                    職稱
                  </label>
                  <input
                    type="text"
                    name="pmTitle"
                    id="pmTitle"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="pmPhone" className="block text-sm font-medium text-gray-700">
                    電話 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="pmPhone"
                    id="pmPhone"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="pmEmail" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="pmEmail"
                    id="pmEmail"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="pmLine" className="block text-sm font-medium text-gray-700">
                    LINE ID
                  </label>
                  <input
                    type="text"
                    name="pmLine"
                    id="pmLine"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isSubmitting ? '處理中...' : '新增活動'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
