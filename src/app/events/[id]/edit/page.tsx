'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromCookie } from '@/lib/auth';
import { Event, mockEvents } from '@/lib/mock-data';

interface EventFormData extends Omit<Event, 'id' | 'participants'> {
  projectManager: {
    name: string;
    title: string;
    phone: string;
    email: string;
    line?: string;
  };
}

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const user = getUserFromCookie();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EventFormData | null>(null);

  // 如果不是管理員，重定向到首頁
  if (!user || user.role !== 'admin') {
    router.push('/');
    return null;
  }

  useEffect(() => {
    // 獲取活動資料
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (response.ok) {
          const event = await response.json();
          const { id, participants, ...eventData } = event;
          setFormData(eventData);
        } else {
          setError('找不到活動');
          router.push('/');
        }
      } catch (err) {
        setError('載入活動資料失敗');
      }
    };

    fetchEvent();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/events/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.message || '更新活動失敗');
      }
    } catch (err) {
      setError('系統錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('projectManager.')) {
      const field = name.split('.')[1];
      setFormData((prev) => prev ? ({
        ...prev,
        projectManager: {
          ...prev.projectManager,
          [field]: value,
        },
      }) : null);
    } else {
      setFormData((prev) => prev ? ({
        ...prev,
        [name]: value,
      }) : null);
    }
  };

  if (!formData) {
    return (
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">編輯活動</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本資訊 */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">基本資訊</h2>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  活動名稱
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  活動日期
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  活動地點
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  活動說明
                </label>
                <textarea
                  name="description"
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
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
                  required
                  value={formData.image}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            {/* 報名資訊 */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">報名資訊</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
                    報名人數上限
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    id="maxParticipants"
                    required
                    min="1"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700">
                    報名截止日期
                  </label>
                  <input
                    type="date"
                    name="registrationDeadline"
                    id="registrationDeadline"
                    required
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* 專案負責人資訊 */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">專案負責人資訊</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="projectManager.name" className="block text-sm font-medium text-gray-700">
                    姓名
                  </label>
                  <input
                    type="text"
                    name="projectManager.name"
                    id="projectManager.name"
                    required
                    value={formData.projectManager.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="projectManager.title" className="block text-sm font-medium text-gray-700">
                    職稱
                  </label>
                  <input
                    type="text"
                    name="projectManager.title"
                    id="projectManager.title"
                    required
                    value={formData.projectManager.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="projectManager.phone" className="block text-sm font-medium text-gray-700">
                    電話
                  </label>
                  <input
                    type="tel"
                    name="projectManager.phone"
                    id="projectManager.phone"
                    required
                    value={formData.projectManager.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="projectManager.email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="projectManager.email"
                    id="projectManager.email"
                    required
                    value={formData.projectManager.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="projectManager.line" className="block text-sm font-medium text-gray-700">
                    LINE ID（選填）
                  </label>
                  <input
                    type="text"
                    name="projectManager.line"
                    id="projectManager.line"
                    value={formData.projectManager.line}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

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
                {isSubmitting ? '處理中...' : '更新活動'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
