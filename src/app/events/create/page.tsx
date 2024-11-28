'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, TextField, TextareaAutosize, Snackbar, Alert } from '@mui/material'
import { checkAuth, type UserInfo } from '@/lib/auth'

interface EventFormData {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  maxParticipants: number;
  registrationDeadline: string;
  image?: string;
  projectManager: {
    name: string;
    email: string;
    phone: string;
  };
  details: {
    requirements: string[];
    notes: string[];
  };
}

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
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
        setUser(userData);
        
        if (!userData || userData.role !== 'admin') {
          showMessage('請先登入管理員帳號', 'error');
          router.push('/login');
          return;
        }
        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        showMessage('系統錯誤，請稍後再試', 'error');
        router.push('/login');
      }
    };
    
    checkAuthStatus();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isAuthorized || !user) {
      showMessage('請先登入管理員帳號', 'error');
      router.push('/login');
      return;
    }
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Handle image upload first
      const imageFile = (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement).files?.[0];
      let imageUrl = formData.get('image') as string;
      
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.error || '圖片上傳失敗');
        }

        const { url } = await uploadResponse.json();
        imageUrl = url;
      }

      // 驗證日期
      const startDate = new Date(formData.get('startDate') as string);
      const endDate = new Date(formData.get('endDate') as string);
      const registrationDeadline = new Date(formData.get('registrationDeadline') as string);
      const now = new Date();

      if (registrationDeadline < now) {
        throw new Error('報名截止日期不能早於現在');
      }
      if (startDate < now) {
        throw new Error('開始日期不能早於現在');
      }
      if (endDate < startDate) {
        throw new Error('結束日期不能早於開始日期');
      }
      if (registrationDeadline > startDate) {
        throw new Error('報名截止日期必須早於活動開始日期');
      }

      // 驗證參與人數
      const maxParticipants = parseInt(formData.get('maxParticipants') as string);
      if (isNaN(maxParticipants) || maxParticipants < 1) {
        throw new Error('請輸入有效的參與人數');
      }

      const eventData: EventFormData = {
        title: formData.get('title') as string,
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
        location: formData.get('location') as string,
        description: formData.get('description') as string,
        maxParticipants,
        registrationDeadline: formData.get('registrationDeadline') as string,
        image: imageUrl || '/images/default-event.jpg',
        projectManager: {
          name: formData.get('pmName') as string,
          email: formData.get('pmEmail') as string,
          phone: formData.get('pmPhone') as string
        },
        details: {
          requirements: (formData.get('requirements') as string)?.split('\n').filter(Boolean) || [],
          notes: (formData.get('notes') as string)?.split('\n').filter(Boolean) || []
        }
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(eventData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '新增活動失敗')
      }

      showMessage('活動已成功創建！', 'success');
      router.push('/events')
      router.refresh()
    } catch (error) {
      console.error('Create event error:', error);
      showMessage(
        error instanceof Error ? error.message : '新增活動失敗',
        'error'
      );
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">創建新活動</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            活動名稱 *
          </label>
          <TextField
            id="title"
            name="title"
            required
            placeholder="請輸入活動名稱"
            disabled={loading}
            fullWidth
            variant="outlined"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">
              開始日期 *
            </label>
            <TextField
              id="startDate"
              name="startDate"
              type="datetime-local"
              required
              disabled={loading}
              fullWidth
              variant="outlined"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              結束日期 *
            </label>
            <TextField
              id="endDate"
              name="endDate"
              type="datetime-local"
              required
              disabled={loading}
              fullWidth
              variant="outlined"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            地點 *
          </label>
          <TextField
            id="location"
            name="location"
            required
            placeholder="請輸入活動地點"
            disabled={loading}
            fullWidth
            variant="outlined"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            活動描述 *
          </label>
          <TextareaAutosize
            id="description"
            name="description"
            required
            placeholder="請輸入活動描述"
            minRows={4}
            disabled={loading}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium mb-1">
              最大參與人數 *
            </label>
            <TextField
              id="maxParticipants"
              name="maxParticipants"
              type="number"
              required
              inputProps={{ min: "1" }}
              disabled={loading}
              fullWidth
              variant="outlined"
            />
          </div>
          <div>
            <label htmlFor="registrationDeadline" className="block text-sm font-medium mb-1">
              報名截止日期 *
            </label>
            <TextField
              id="registrationDeadline"
              name="registrationDeadline"
              type="datetime-local"
              required
              disabled={loading}
              fullWidth
              variant="outlined"
            />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
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
          <label htmlFor="pmName" className="block text-sm font-medium mb-1">
            負責人姓名 *
          </label>
          <TextField
            id="pmName"
            name="pmName"
            required
            placeholder="請輸入負責人姓名"
            disabled={loading}
            fullWidth
            variant="outlined"
          />
        </div>

        <div>
          <label htmlFor="pmEmail" className="block text-sm font-medium mb-1">
            負責人Email *
          </label>
          <TextField
            id="pmEmail"
            name="pmEmail"
            type="email"
            required
            placeholder="請輸入負責人Email"
            disabled={loading}
            fullWidth
            variant="outlined"
          />
        </div>

        <div>
          <label htmlFor="pmPhone" className="block text-sm font-medium mb-1">
            負責人電話 *
          </label>
          <TextField
            id="pmPhone"
            name="pmPhone"
            required
            placeholder="請輸入負責人電話"
            disabled={loading}
            fullWidth
            variant="outlined"
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium mb-1">
            參與要求
          </label>
          <TextareaAutosize
            id="requirements"
            name="requirements"
            placeholder="請輸入參與要求（每行一項）"
            minRows={4}
            disabled={loading}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            注意事項
          </label>
          <TextareaAutosize
            id="notes"
            name="notes"
            placeholder="請輸入注意事項（每行一項）"
            minRows={4}
            disabled={loading}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          color="primary"
          fullWidth
        >
          {loading ? '處理中...' : '創建活動'}
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
