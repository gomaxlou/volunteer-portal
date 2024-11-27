'use client'

import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">聯絡資訊</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-5 w-5" />
                <span>+886 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>contact@volunteer-portal.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>台北市信義區信義路五段7號</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">快速連結</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-green-600">
                  關於我們
                </Link>
              </li>
              <li>
                <Link href="/trips" className="text-gray-600 hover:text-green-600">
                  出團行程
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-600 hover:text-green-600">
                  活動相簿
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-600 hover:text-green-600">
                  愛心捐款
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">社群媒體</h3>
            <div className="flex space-x-4">
              <Link
                href="#facebook"
                className="text-gray-600 hover:text-green-600"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="#instagram"
                className="text-gray-600 hover:text-green-600"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Volunteer Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
