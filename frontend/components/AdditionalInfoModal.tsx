'use client'

import { useState } from 'react'
import { FiX, FiCalendar, FiUser } from 'react-icons/fi'
import { API_ENDPOINTS } from '../config/api'

interface AdditionalInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AdditionalInfoModal({ isOpen, onClose, onSuccess }: AdditionalInfoModalProps) {
  const [formData, setFormData] = useState({
    gender: '',
    dateOfBirth: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.gender || !formData.dateOfBirth) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Chuẩn bị dữ liệu
      const payload = {
        gender: formData.gender === '1' ? 'male' : formData.gender === '0' ? 'female' : 'other',
        date_of_birth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null
      }

      // Gọi API để cập nhật thông tin
      const response = await fetch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Cập nhật thông tin thất bại')
      }

      const result = await response.json()
      console.log('Cập nhật thành công:', result)

      // Lưu thông tin vào localStorage
      localStorage.setItem('user_gender', formData.gender)
      localStorage.setItem('user_date_of_birth', formData.dateOfBirth)

      // Đóng modal và gọi callback thành công
      onClose()
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <FiX className="text-2xl" />
        </button>

        {/* Header */}
        <div className="pt-8 pb-6 px-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Hoàn thiện thông tin cá nhân
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Vui lòng bổ sung thông tin để hoàn tất đăng ký
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <FiUser />
                Giới tính
              </span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: '1' })}
                className={`py-3 px-4 rounded-lg border-2 transition font-medium ${
                  formData.gender === '1'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                Nam
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: '0' })}
                className={`py-3 px-4 rounded-lg border-2 transition font-medium ${
                  formData.gender === '0'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                Nữ
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: '2' })}
                className={`py-3 px-4 rounded-lg border-2 transition font-medium ${
                  formData.gender === '2'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                Khác
              </button>
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <FiCalendar />
                Ngày sinh
              </span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý...' : 'Lưu thông tin'}
          </button>

          {/* Skip Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition"
          >
            Bỏ qua
          </button>
        </form>
      </div>
    </div>
  )
}