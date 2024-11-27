import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { LoadingSkeleton } from '@/components/shared/Loading'
import EventDetail from '@/components/features/EventDetail'
import { mockEvents } from '@/lib/mock-data'

interface EventPageProps {
  params: {
    id: string
  }
}

export default function EventPage({ params }: EventPageProps) {
  const event = mockEvents.find(event => event.id === params.id)

  if (!event) {
    notFound()
  }

  return (
    <Suspense fallback={<LoadingSkeleton height="h-screen" />}>
      <EventDetail event={event} />
    </Suspense>
  )
}
