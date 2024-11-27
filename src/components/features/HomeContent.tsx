'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Loading, { LoadingSkeleton } from '@/components/shared/Loading'

const HeroSection = dynamic(() => import('@/components/features/HeroSection'), {
  loading: () => <LoadingSkeleton height="h-[60vh] min-h-[400px]" />,
})

const EventCard = dynamic(() => import('@/components/features/EventCard'), {
  loading: () => <LoadingSkeleton />,
})

const mockEvents = [
  {
    id: '1',
    title: '社區環境清潔日',
    date: '2024-03-15',
    location: '台北市大安區',
    participants: 15,
    maxParticipants: 30,
    image: 'https://picsum.photos/id/1059/800/600',
    description: '一起為社區環境盡一份心力，創造更美好的生活空間。',
  },
  {
    id: '2',
    title: '長者關懷活動',
    date: '2024-03-20',
    location: '新北市三重區',
    participants: 8,
    maxParticipants: 20,
    image: 'https://picsum.photos/id/1071/800/600',
    description: '探訪社區長者，陪伴聊天，提供生活協助。',
  },
  {
    id: '3',
    title: '兒童教育志工',
    date: '2024-03-25',
    location: '台北市信義區',
    participants: 12,
    maxParticipants: 15,
    image: 'https://picsum.photos/id/1076/800/600',
    description: '為弱勢家庭兒童提供課業輔導及品格教育。',
  },
]

export default function HomeContent() {
  return (
    <>
      <Suspense fallback={<LoadingSkeleton height="h-[60vh] min-h-[400px]" />}>
        <HeroSection />
      </Suspense>
      
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            近期活動
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockEvents.map((event) => (
              <Suspense key={event.id} fallback={<LoadingSkeleton />}>
                <EventCard {...event} />
              </Suspense>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
