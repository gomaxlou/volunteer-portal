'use client'

import { MessageCircle, Phone, HelpCircle, Share2, ArrowUp, List } from 'lucide-react'
import Link from 'next/link'

const sidebarItems = [
  { icon: MessageCircle, label: 'Messenger', href: '#messenger' },
  { icon: Phone, label: '電話', href: '#phone' },
  { icon: HelpCircle, label: '線上詢問', href: '#inquiry' },
  { icon: Share2, label: '分享', href: '#share' },
  { icon: ArrowUp, label: '回頂', href: '#top' },
  { icon: List, label: '出團列表', href: '/trips' },
]

export default function Sidebar() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col space-y-4 bg-white/90 backdrop-blur-sm rounded-full py-4 px-2 shadow-lg">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          if (item.label === '回頂') {
            return (
              <button
                key={item.label}
                onClick={scrollToTop}
                className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                title={item.label}
              >
                <Icon className="h-6 w-6" />
                <span className="sr-only">{item.label}</span>
              </button>
            )
          }
          return (
            <Link
              key={item.label}
              href={item.href}
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
              title={item.label}
            >
              <Icon className="h-6 w-6" />
              <span className="sr-only">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
