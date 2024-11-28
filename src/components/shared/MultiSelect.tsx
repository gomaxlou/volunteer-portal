'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: readonly Option[]
  selectedValues: Set<string>
  onChange: (selectedValues: Set<string>) => void
  placeholder?: string
  className?: string
}

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = '請選擇',  // 添加默認值
  className = ''
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 點擊外部關閉下拉選單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 處理選項切換
  const handleToggleOption = (optionValue: string) => {
    const newValue = new Set(selectedValues)
    if (newValue.has(optionValue)) {
      newValue.delete(optionValue)
    } else {
      newValue.add(optionValue)
    }
    onChange(newValue)
  }

  // 清除所有選擇
  const handleClearAll = () => {
    onChange(new Set())
    setIsOpen(false)
  }

  // 獲取已選擇的選項標籤
  const getSelectedLabels = () => {
    return Array.from(selectedValues)
      .map(v => options.find(opt => opt.value === v)?.label)
      .filter(Boolean)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 選擇器按鈕 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <div className="flex items-center justify-between">
          <span className="block truncate">
            {selectedValues.size > 0 ? `已選擇 ${selectedValues.size} 項` : placeholder}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <button
              onClick={handleClearAll}
              className="w-full text-left text-sm text-gray-500 hover:text-gray-700 py-1 px-2 rounded hover:bg-gray-50"
            >
              清除所有選擇
            </button>
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className="w-full text-left flex items-center justify-between px-4 py-2 hover:bg-gray-50"
                  onClick={() => handleToggleOption(option.value)}
                >
                  <span className="text-sm text-gray-700">{option.label}</span>
                  {selectedValues.has(option.value) && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 已選擇的標籤 */}
      {selectedValues.size > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {getSelectedLabels().map((label, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              {label}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleOption(Array.from(selectedValues)[index])
                }}
                className="ml-1 hover:text-green-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
