'use client'

import { FiAlertCircle, FiX } from 'react-icons/fi'

interface ErrorModalProps {
  isOpen: boolean
  title?: string
  message?: string
  errors?: Array<{
    type: string
    loc: string[]
    msg: string
    input: any
    ctx?: any
  }>
  onClose: () => void
}

export default function ErrorModal({ 
  isOpen, 
  title = 'Lỗi', 
  message,
  errors,
  onClose 
}: ErrorModalProps) {
  if (!isOpen) return null

  const getErrorMessage = (): string => {
    // Nếu errors là mảng từ FastAPI validation
    if (errors && Array.isArray(errors) && errors.length > 0) {
      const errorObj = errors[0]
      // Format: field_name: error_message
      const fieldName = errorObj.loc?.[errorObj.loc?.length - 1] || 'Lỗi'
      const formattedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      return `${formattedFieldName}: ${errorObj.msg}`
    }
    
    // Nếu message là string
    if (message) return message
    
    return 'Có lỗi xảy ra, vui lòng thử lại'
  }

  const displayMessage = getErrorMessage()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in slide-in-from-top-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <FiX className="text-2xl" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="text-3xl text-red-500" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

          {/* Message */}
          <p className="text-gray-600 mb-6 whitespace-pre-line">
            {displayMessage}
          </p>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}