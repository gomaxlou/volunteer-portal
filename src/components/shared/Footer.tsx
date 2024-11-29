import Link from 'next/link'
import { Facebook, Instagram, Mail, Phone, MapPin } from '@/components/icons'

export default function Footer() {
  return (
    <footer className="bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 聯絡資訊 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">聯絡資訊</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-600" />
                <span>+886 123 456 789</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-600" />
                <a href="mailto:contact@volunteer-portal.com" className="hover:text-blue-600">
                  contact@volunteer-portal.com
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-600" />
                <span>台北市信義區信義路五段7號</span>
              </div>
            </div>
          </div>

          {/* 快速連結 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速連結</h3>
            <div className="space-y-2">
              <div>
                <Link href="/about" className="hover:text-blue-600">
                  關於我們
                </Link>
              </div>
              <div>
                <Link href="/events" className="hover:text-blue-600">
                  出團行程
                </Link>
              </div>
              <div>
                <Link href="/gallery" className="hover:text-blue-600">
                  活動相簿
                </Link>
              </div>
              <div>
                <Link href="/donate" className="hover:text-blue-600">
                  愛心捐款
                </Link>
              </div>
            </div>
          </div>

          {/* 社群媒體 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">社群媒體</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/volunteer-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com/volunteer-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-600"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Volunteer Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
