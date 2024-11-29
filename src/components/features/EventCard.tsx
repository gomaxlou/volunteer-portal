'use client'

import { useEffect, useState } from 'react'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash2 
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { LoadingSkeleton } from '@/components/shared/Loading'
import { Event } from '@/lib/types'
import { checkAuth, type UserInfo } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material'

interface EventCardProps {
  event: Event
  isAuthenticated?: boolean
  isAdmin?: boolean
  priority?: boolean
}

export default function EventCard({ event, isAuthenticated, isAdmin, priority }: EventCardProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  })
  
  if (!event) {
    return <LoadingSkeleton />
  }

  const {
    id,
    title,
    startDate,
    endDate,
    location,
    participants,
    maxParticipants,
    image,
    description,
    registrationDeadline,
    projectManager,
    creatorName,
  } = event

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('刪除失敗')
      }

      setSnackbar({
        open: true,
        message: '活動已成功刪除',
        severity: 'success'
      })
      
      // 重新整理頁面
      router.refresh()
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '刪除失敗',
        severity: 'error'
      })
    }
    setDeleteDialogOpen(false)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <Image
          src={image || '/images/default-event.jpg'}
          alt={title}
          width={800}
          height={400}
          className="w-full h-48 object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isAdmin && (
          <div className="flex space-x-2 mt-4">
            <Link
              href={`/events/${id}/edit`}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <Edit className="w-4 h-4 mr-1" />
              編輯
            </Link>
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              刪除
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(startDate).toLocaleDateString('zh-TW')}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>
              {participants || 0}/{maxParticipants} 人
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>報名截止：{new Date(registrationDeadline).toLocaleDateString('zh-TW')}</span>
          </div>
          {projectManager && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{projectManager.name}</span>
                {projectManager.title && (
                  <span className="ml-2 text-gray-500">({projectManager.title})</span>
                )}
              </div>
              {projectManager.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{projectManager.phone}</span>
                </div>
              )}
              {projectManager.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{projectManager.email}</span>
                </div>
              )}
            </div>
          )}
          {creatorName && (
            <div className="mt-2 text-sm text-gray-500">
              建立者：{creatorName}
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>確認刪除</DialogTitle>
        <DialogContent>
          <p>確定要刪除這個活動嗎？此操作無法復原。</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={handleDelete} color="error">
            確認刪除
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}
