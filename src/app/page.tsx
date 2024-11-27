'use client'

import { Suspense, useState, useMemo } from 'react'
import { LoadingSkeleton } from '@/components/shared/Loading'
import { mockEvents } from '@/lib/mock-data'
import EventCard from '@/components/features/EventCard'
import { EVENT_STATUS, EVENT_STATUS_LABELS } from '@/lib/constants'
import MultiSelect from '@/components/shared/MultiSelect'

export default function HomePage() {
  // 取得所有活動並排序
  const allEvents = useMemo(() => 
    [...mockEvents].sort((a, b) => b.date.localeCompare(a.date))
  , [])

  // 取得所有月份
  const availableMonths = useMemo(() => {
    const months = new Set(
      allEvents.map(event => event.date.substring(0, 7))
    )
    return Array.from(months).sort().reverse()
  }, [allEvents])

  // 月份選項
  const monthOptions = useMemo(() => 
    availableMonths.map(month => {
      const [year, monthNum] = month.split('-')
      return {
        value: month,
        label: `${year}年${monthNum}月`
      }
    })
  , [availableMonths])

  // 狀態選項
  const statusOptions = useMemo(() => 
    Object.entries(EVENT_STATUS_LABELS).map(([value, label]) => ({
      value,
      label
    }))
  , [])

  // 預設顯示全部，可複選月份和狀態
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set())
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set())

  // 判斷活動狀態
  const getEventStatus = (event: typeof mockEvents[0]) => {
    const now = new Date()
    const eventDate = new Date(event.date)
    const registrationDeadline = new Date(event.registrationDeadline)
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    if (eventDate < now) {
      return EVENT_STATUS.EXPIRED
    }
    if (registrationDeadline < now) {
      return EVENT_STATUS.REGISTRATION_CLOSED
    }
    if (event.participants >= event.maxParticipants) {
      return EVENT_STATUS.FULL
    }
    if (registrationDeadline <= threeDaysFromNow) {
      return EVENT_STATUS.DEADLINE_SOON
    }
    if (event.participants / event.maxParticipants >= 0.8) {
      return EVENT_STATUS.ALMOST_FULL
    }
    return EVENT_STATUS.AVAILABLE
  }

  // 根據選擇的月份和狀態過濾活動
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const eventMonth = event.date.substring(0, 7)
      const eventStatus = getEventStatus(event)

      // 如果沒有選擇任何月份或狀態，顯示所有活動
      if (selectedMonths.size === 0 && selectedStatuses.size === 0) {
        return true
      }

      // 如果只選擇了月份
      if (selectedMonths.size > 0 && selectedStatuses.size === 0) {
        return selectedMonths.has(eventMonth)
      }

      // 如果只選擇了狀態
      if (selectedMonths.size === 0 && selectedStatuses.size > 0) {
        return selectedStatuses.has(eventStatus)
      }

      // 如果同時選擇了月份和狀態
      return selectedMonths.has(eventMonth) && selectedStatuses.has(eventStatus)
    })
  }, [allEvents, selectedMonths, selectedStatuses])

  // 將活動依月份分組
  const groupedEvents = useMemo(() => {
    const groups = new Map<string, typeof allEvents>()
    filteredEvents.forEach(event => {
      const month = event.date.substring(0, 7)
      if (!groups.has(month)) {
        groups.set(month, [])
      }
      groups.get(month)?.push(event)
    })
    return groups
  }, [filteredEvents])

  // 格式化月份顯示
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    return `${year}年${month}月`
  }

  // 格式化日期顯示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const isExpired = date < today
    return {
      displayDate: `${dateStr.substring(5).replace('-', '/')}`,  // 顯示 MM/DD
      isExpired
    }
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            志工活動
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            探索各種志工活動，一起為社會貢獻心力
          </p>

          {/* 篩選器區域 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            <MultiSelect
              options={monthOptions}
              value={selectedMonths}
              onChange={setSelectedMonths}
              placeholder="選擇月份"
            />
            <MultiSelect
              options={statusOptions}
              value={selectedStatuses}
              onChange={setSelectedStatuses}
              placeholder="選擇活動狀態"
            />
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="space-y-16">
            {Array.from(groupedEvents.entries()).map(([month, events]) => (
              <div key={month}>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  {formatMonth(month)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.map((event) => {
                    const { displayDate, isExpired } = formatDate(event.date)
                    return (
                      <Suspense key={event.id} fallback={<LoadingSkeleton />}>
                        <div className="relative">
                          <EventCard {...event} />
                          {isExpired && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              已結束
                            </div>
                          )}
                        </div>
                      </Suspense>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {selectedMonths.size > 0 || selectedStatuses.size > 0
                ? '沒有符合篩選條件的活動'
                : '目前沒有任何活動'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
