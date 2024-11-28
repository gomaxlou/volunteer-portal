'use client'

import { ReactNode } from 'react'
import Footer from './Footer'
import Sidebar from './Sidebar'

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
