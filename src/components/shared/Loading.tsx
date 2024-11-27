'use client'

interface LoadingProps {
  type?: 'spinner' | 'skeleton'
  className?: string
  height?: string
}

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-600" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-white" />
        </div>
      </div>
    </div>
  )
}

export function LoadingSkeleton({ className = '', height = 'h-96' }: LoadingProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md animate-pulse ${height} ${className}`}
    >
      <div className="h-48 bg-gray-200 rounded-t-lg" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  )
}

export default function Loading({ type = 'spinner', className = '', height = 'h-96' }: LoadingProps) {
  if (type === 'spinner') {
    return <LoadingSpinner />
  }
  return <LoadingSkeleton className={className} height={height} />
}
