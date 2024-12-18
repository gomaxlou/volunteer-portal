'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromCookie } from '@/lib/auth';
import type { UserInfo } from '@/lib/auth';

interface EventFormData {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description?: string;
  image?: string;
  maxParticipants: number;
  registrationDeadline: string;
  projectManagerName: string;
  projectManagerTitle?: string;
  projectManagerEmail: string;
  projectManagerPhone: string;
  projectManagerLine?: string;
  category?: string;
  difficulty?: string;
  requirements?: string[];
  benefits?: string[];
  items?: string[];
  notes?: string[];
  transportation?: string;
  meetingPoint?: string;
  schedule?: string;
  status?: string;
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EventFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('圖片上傳失敗');
      }

      const { url } = await response.json();
      setFormData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          image: url
        };
      });
    } catch (error) {
      console.error('圖片上傳失敗:', error);
      setError('圖片上傳失敗，請稍後再試');
    }
  };

  useEffect(() => {
    // 檢查用戶權限
    const checkUser = async () => {
      console.log('Checking user authentication');
      const userData = await getUserFromCookie();
      console.log('User data:', userData);
      
      setUser(userData);
      setIsLoading(false);
      
      if (!userData || userData.role !== 'admin') {
        console.log('Unauthorized user, redirecting to home');
        router.push('/');
      }
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    // 獲取活動資料
    const fetchEvent = async () => {
      console.log('Fetching event data for ID:', resolvedParams.id);
      try {
        const response = await fetch(`/api/events/${resolvedParams.id}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          
          if (response.status === 401) {
            console.log('Unauthorized, redirecting to login');
            router.push('/login');
            return;
          }
          throw new Error(errorText);
        }
        
        const event = await response.json();
        console.log('Event data:', event);
        setFormData(event);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('無法載入活動資料');
      }
    };

    if (!isLoading && user?.role === 'admin') {
      console.log('User is admin, fetching event');
      fetchEvent();
    }
  }, [resolvedParams.id, isLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/events/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      router.push('/events');
    } catch (err) {
      console.error('Error updating event:', err);
      setError('更新活動失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;

    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  if (isLoading) {
    return <div>載入中...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (!formData) {
    return <div>載入活動資料中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">編輯活動</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* 基本資訊 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">基本資訊</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                活動名稱 <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入活動名稱"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  開始日期 <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  結束日期 <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                地點 <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入活動地點"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                活動描述 <span className="text-red-500 font-bold">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入活動描述"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                活動圖片
              </label>
              <div className="flex gap-4 items-start">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                  onChange={handleImageChange}
                />
                <div className="w-32 h-32 border rounded-lg overflow-hidden">
                  <img
                    id="imagePreview"
                    src={formData.image || '/images/default-event.jpg'}
                    alt="活動圖片預覽"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                建議上傳 16:9 比例的圖片，檔案大小不超過 2MB
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                最大參與人數 <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                required
                min="1"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入最大參與人數"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                報名截止日期 <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 負責人資訊 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">負責人資訊</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                負責人姓名 <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="projectManagerName"
                value={formData.projectManagerName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入負責人姓名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                負責人職稱
              </label>
              <input
                type="text"
                name="projectManagerTitle"
                value={formData.projectManagerTitle || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入負責人職稱"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                負責人Email <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="email"
                name="projectManagerEmail"
                value={formData.projectManagerEmail}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入負責人Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                負責人電話 <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="tel"
                name="projectManagerPhone"
                value={formData.projectManagerPhone}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入負責人電話"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                負責人Line
              </label>
              <input
                type="text"
                name="projectManagerLine"
                value={formData.projectManagerLine || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入負責人Line"
              />
            </div>
          </div>
        </div>

        {/* 活動詳細資訊 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">活動詳細資訊</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                活動類別
              </label>
              <input
                type="text"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入活動類別"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                活動難度
              </label>
              <select
                name="difficulty"
                value={formData.difficulty || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">請選擇</option>
                <option value="easy">簡單</option>
                <option value="medium">中等</option>
                <option value="hard">困難</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                參與要求
              </label>
              <textarea
                name="requirements"
                value={formData.requirements?.join('\n') || ''}
                onChange={(e) => {
                  const requirements = e.target.value.split('\n').filter(Boolean);
                  setFormData(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      requirements,
                    };
                  });
                }}
                className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入參與要求（每行一項）"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                活動福利
              </label>
              <textarea
                name="benefits"
                value={Array.isArray(formData.benefits) ? formData.benefits.join('\n') : ''}
                onChange={(e) => {
                  const benefits = e.target.value.split('\n').filter(Boolean);
                  setFormData(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      benefits,
                    };
                  });
                }}
                className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入活動福利（每行一項）"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                活動物品
              </label>
              <textarea
                name="items"
                value={Array.isArray(formData.items) ? formData.items.join('\n') : ''}
                onChange={(e) => {
                  const items = e.target.value.split('\n').filter(Boolean);
                  setFormData(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      items,
                    };
                  });
                }}
                className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入活動物品（每行一項）"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                注意事項
              </label>
              <textarea
                name="notes"
                value={formData.notes?.join('\n') || ''}
                onChange={(e) => {
                  const notes = e.target.value.split('\n').filter(Boolean);
                  setFormData(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      notes,
                    };
                  });
                }}
                className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入注意事項（每行一項）"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                交通資訊
              </label>
              <textarea
                name="transportation"
                value={formData.transportation || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded h-24 focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入交通資訊"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                集合地點
              </label>
              <input
                type="text"
                name="meetingPoint"
                value={formData.meetingPoint || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入集合地點"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                活動流程
              </label>
              <textarea
                name="schedule"
                value={formData.schedule || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入活動流程"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                狀態
              </label>
              <select
                name="status"
                value={formData.status || 'draft'}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">草稿</option>
                <option value="published">已發布</option>
                <option value="closed">已結束</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={isSubmitting}
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? '儲存中...' : '儲存'}
          </button>
        </div>
      </form>
    </div>
  );
}
