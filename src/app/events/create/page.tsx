'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, TextField, Snackbar, Alert } from '@mui/material'
import { checkAuth, type UserInfo } from '@/lib/auth'

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

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [errors, setErrors] = useState<{
    title?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    description?: string;
    maxParticipants?: string;
    registrationDeadline?: string;
    image?: string;
    projectManagerName?: string;
    projectManagerEmail?: string;
    projectManagerPhone?: string;
    projectManagerTitle?: string;
    projectManagerLine?: string;
    category?: string;
    difficulty?: string;
    transportation?: string;
    meetingPoint?: string;
    schedule?: string;
  }>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showMessage = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // 檢查用戶是否已登入且是管理員
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await checkAuth();
        if (!userData || userData.role !== 'admin') {
          showMessage('請先登入管理員帳號', 'error');
          router.push('/login');
          return;
        }
        setIsAuthorized(true);
        setUser(userData);
      } catch (error) {
        showMessage('系統錯誤，請稍後再試', 'error');
        router.push('/login');
      }
    };
    
    checkAuthStatus();
  }, [router]);

  // 如果未授權，顯示載入中或返回 null
  if (!isAuthorized || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg mb-2">檢查授權中...</div>
          <div className="text-sm text-gray-500">請稍候</div>
        </div>
      </div>
    );
  }

  const validateForm = (formData: FormData): boolean => {
    const newErrors: any = {};
    
    // 驗證必填欄位
    const requiredFields = [
      'title', 
      'location', 
      'description', 
      'projectManagerName', 
      'projectManagerEmail', 
      'projectManagerPhone',
      'maxParticipants',
      'startDate',
      'endDate',
      'registrationDeadline'
    ];
    requiredFields.forEach(field => {
      if (!formData.get(field)) {
        newErrors[field] = '此欄位為必填';
      }
    });

    // 驗證日期
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const registrationDeadline = new Date(formData.get('registrationDeadline') as string);
    const now = new Date();

    if (registrationDeadline < now) {
      newErrors.registrationDeadline = '報名截止日期不能早於現在';
    }
    if (startDate < now) {
      newErrors.startDate = '開始日期不能早於現在';
    }
    if (endDate < startDate) {
      newErrors.endDate = '結束日期不能早於開始日期';
    }
    if (registrationDeadline > startDate) {
      newErrors.registrationDeadline = '報名截止日期必須早於活動開始日期';
    }

    // 驗證參與人數
    const maxParticipants = parseInt(formData.get('maxParticipants') as string);
    if (isNaN(maxParticipants) || maxParticipants < 1) {
      newErrors.maxParticipants = '請輸入有效的參與人數（至少1人）';
    }

    // 驗證 Email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const projectManagerEmail = formData.get('projectManagerEmail') as string;
    if (projectManagerEmail && !emailRegex.test(projectManagerEmail)) {
      newErrors.projectManagerEmail = '請輸入有效的 Email 格式';
    }

    // 驗證電話格式
    const phoneRegex = /^[0-9+\-() ]{8,}$/;
    const projectManagerPhone = formData.get('projectManagerPhone') as string;
    if (projectManagerPhone && !phoneRegex.test(projectManagerPhone)) {
      newErrors.projectManagerPhone = '請輸入有效的電話號碼';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 獲取表單數據
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 重新檢查登入狀態
    const currentUser = await checkAuth();
    if (!currentUser || currentUser.role !== 'admin') {
      showMessage('登入已過期，請重新登入', 'error');
      setIsAuthorized(false);
      setUser(null);
      router.push('/login');
      return;
    }

    if (!validateForm(formData)) {
      showMessage('請修正表單中的錯誤', 'error');
      return;
    }

    setLoading(true);

    try {
      // Handle image upload first
      const imageFile = (form.querySelector('input[type="file"]') as HTMLInputElement).files?.[0];
      let imageUrl = '/images/default-event.jpg';  // 設定預設圖片
      
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
          credentials: 'include'
        });

        if (uploadResponse.status === 401) {
          showMessage('登入已過期，請重新登入', 'error');
          setIsAuthorized(false);
          setUser(null);
          router.push('/login');
          return;
        }

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.error || '圖片上傳失敗');
        }

        const { url } = await uploadResponse.json();
        imageUrl = url;
      }

      const eventData: EventFormData = {
        title: formData.get('title') as string,
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
        location: formData.get('location') as string,
        description: formData.get('description') as string,
        maxParticipants: parseInt(formData.get('maxParticipants') as string),
        registrationDeadline: formData.get('registrationDeadline') as string,
        image: imageUrl,  // 使用預設圖片或上傳的圖片URL
        projectManagerName: formData.get('projectManagerName') as string,
        projectManagerTitle: formData.get('projectManagerTitle') as string,
        projectManagerEmail: formData.get('projectManagerEmail') as string,
        projectManagerPhone: formData.get('projectManagerPhone') as string,
        projectManagerLine: formData.get('projectManagerLine') as string,
        category: formData.get('category') as string,
        difficulty: formData.get('difficulty') as string,
        requirements: (formData.get('requirements') as string)?.split('\n').filter(Boolean) || [],
        benefits: (formData.get('benefits') as string)?.split('\n').filter(Boolean) || [],
        items: (formData.get('items') as string)?.split('\n').filter(Boolean) || [],
        notes: (formData.get('notes') as string)?.split('\n').filter(Boolean) || [],
        transportation: formData.get('transportation') as string,
        meetingPoint: formData.get('meetingPoint') as string,
        schedule: formData.get('schedule') as string,
        status: 'active'
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(eventData)
      })

      if (response.status === 401) {
        showMessage('登入已過期，請重新登入', 'error');
        setIsAuthorized(false);
        setUser(null);
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '新增活動失敗')
      }

      showMessage('活動已成功創建！', 'success');
      router.push('/events')
      router.refresh()
    } catch (error) {
      showMessage(
        error instanceof Error ? error.message : '新增活動失敗',
        'error'
      );
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">新增活動</h1>
      
      <Button
        type="submit"
        form="createEventForm"
        disabled={loading}
        variant="contained"
        color="primary"
        fullWidth
        className="mb-6"
      >
        {loading ? '處理中...' : '新增活動'}
      </Button>

      <form id="createEventForm" onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* 基本資訊 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            活動名稱 <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            name="title"
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
            required
            className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入活動描述"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            最大參與人數 <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="number"
            name="maxParticipants"
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
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  // Handle file upload here
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const img = document.createElement('img');
                    img.src = reader.result as string;
                    img.onload = () => {
                      // Show preview
                      const preview = document.getElementById('imagePreview') as HTMLImageElement;
                      if (preview) {
                        preview.src = reader.result as string;
                        preview.style.display = 'block';
                      }
                    };
                  };
                  reader.readAsDataURL(file);
                }
              }}
              disabled={loading}
            />
            <div className="w-32 h-32 border rounded-lg overflow-hidden">
              <img
                id="imagePreview"
                alt="活動圖片預覽"
                className="w-full h-full object-cover"
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            建議上傳 16:9 比例的圖片，檔案大小不超過 2MB
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            負責人姓名 <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            name="projectManagerName"
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
            type="text"
            name="projectManagerPhone"
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入負責人Line"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            活動類別
          </label>
          <input
            type="text"
            name="category"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入活動類別"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            活動難度
          </label>
          <input
            type="text"
            name="difficulty"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入活動難度"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            參與要求
          </label>
          <textarea
            name="requirements"
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
            className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入注意事項（每行一項）"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            交通資訊
          </label>
          <input
            type="text"
            name="transportation"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入集合地點"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            活動時間表
          </label>
          <input
            type="text"
            name="schedule"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入活動時間表"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          color="primary"
          fullWidth
          className="mt-6"
        >
          {loading ? '處理中...' : '新增活動'}
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}
