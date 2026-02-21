'use client'

import { useState } from 'react'
import { FiX, FiUser, FiLock, FiMail, FiGithub, FiCalendar } from 'react-icons/fi'
import AdditionalInfoModal from './AdditionalInfoModal'
import ErrorModal from './ErrorModal'
import { API_ENDPOINTS } from '../config/api'

interface LoginModalProps {
  onClose: () => void
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorTitle, setErrorTitle] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [errorDetail, setErrorDetail] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
    dateOfBirth: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLogin) {
      // Đăng ký
      try {
        const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: formData.name,
            email: formData.email,
            password: formData.password,
            date_of_birth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
            gender: formData.gender === '1' ? 'male' : formData.gender === '0' ? 'female' : 'other'
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          
          // Xử lý lỗi từ FastAPI validation
          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              // Lỗi validation từ FastAPI
              setErrorTitle('Đăng ký thất bại')
              setErrorMessage('')
              setErrorDetail(errorData.detail)
            } else if (typeof errorData.detail === 'string') {
              // Lỗi string đơn giản
              setErrorTitle('Đăng ký thất bại')
              setErrorMessage(errorData.detail)
              setErrorDetail(null)
            } else {
              // Lỗi khác
              setErrorTitle('Đăng ký thất bại')
              setErrorMessage('Có lỗi xảy ra, vui lòng thử lại')
              setErrorDetail(null)
            }
          } else {
            setErrorTitle('Đăng ký thất bại')
            setErrorMessage('Có lỗi xảy ra, vui lòng thử lại')
            setErrorDetail(null)
          }
          
          setShowError(true)
          return
        }

        const result = await response.json()
        console.log('Đăng ký thành công:', result)
        
        onClose()
        setTimeout(() => {
          setShowAdditionalInfo(true)
        }, 300)
      } catch (err: any) {
        setErrorTitle('Lỗi kết nối')
        setErrorMessage('Không thể kết nối đến server, vui lòng thử lại')
        setErrorDetail(null)
        setShowError(true)
        console.error(err)
      }
    } else {
      // Đăng nhập
      try {
        const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          
          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              setErrorTitle('Đăng nhập thất bại')
              setErrorMessage('')
              setErrorDetail(errorData.detail)
            } else if (typeof errorData.detail === 'string') {
              setErrorTitle('Đăng nhập thất bại')
              setErrorMessage(errorData.detail)
              setErrorDetail(null)
            } else {
              setErrorTitle('Đăng nhập thất bại')
              setErrorMessage('Email hoặc mật khẩu không chính xác')
              setErrorDetail(null)
            }
          } else {
            setErrorTitle('Đăng nhập thất bại')
            setErrorMessage('Email hoặc mật khẩu không chính xác')
            setErrorDetail(null)
          }
          
          setShowError(true)
          return
        }

        const result = await response.json()
        console.log('Đăng nhập thành công:', result)
        
        localStorage.setItem('access_token', result.access_token)
        localStorage.setItem('user_info', JSON.stringify(result.user))
        
        onClose()
      } catch (err: any) {
        alert('Có lỗi xảy ra, vui lòng thử lại')
        console.error(err)
      }
    }
  }

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login when backend is ready
    console.log(`Login with ${provider}`)
    onClose()
  }

  const SocialLoginButton = ({ 
    provider, 
    icon, 
    bgColor, 
    hoverColor,
    textColor = 'text-white'
  }: { 
    provider: string
    icon: React.ReactNode
    bgColor: string
    hoverColor: string
    textColor?: string
  }) => (
    <button
      onClick={() => handleSocialLogin(provider)}
      className={`${bgColor} ${hoverColor} ${textColor} py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 font-medium border border-gray-200`}
    >
      {icon}
      <span>{provider === 'google' ? 'Google' : provider === 'facebook' ? 'Facebook' : provider === 'github' ? 'GitHub' : 'Apple'}</span>
    </button>
  )

  return (
    <>
      {/* Additional Info Modal */}
      <AdditionalInfoModal 
        isOpen={showAdditionalInfo}
        onClose={() => setShowAdditionalInfo(false)}
        onSuccess={() => {
          console.log('Đã cập nhật thông tin bổ sung')
        }}
      />
      
      {/* Error Modal */}
      <ErrorModal
        isOpen={showError}
        title={errorTitle}
        message={errorMessage}
        errors={errorDetail}
        onClose={() => setShowError(false)}
      />
      
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
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
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </h2>
            <p className="text-center text-gray-500 mt-2">
              {isLogin 
                ? 'Chào mừng trở lại KNP STORE!' 
                : 'Tạo tài khoản mới'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập họ và tên của bạn"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
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
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Nhập email của bạn"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                  Quên mật khẩu?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-semibold mt-6"
            >
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </button>

            {/* Toggle Login/Register */}
            <div className="pt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-500 hover:text-primary-600 font-semibold ml-1"
                >
                  {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
                </button>
              </p>
            </div>
          </form>

          {/* Social Login */}
          <div className="px-8 pt-6 pb-8">
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {isLogin ? 'hoặc đăng nhập với' : 'hoặc đăng ký với'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <SocialLoginButton 
                  provider="google" 
                  icon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path 
                        fill="#4285F4" 
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path 
                        fill="#34A853" 
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path 
                        fill="#FBBC05" 
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path 
                        fill="#EA4335" 
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  }
                  bgColor="bg-white"
                  hoverColor="hover:bg-gray-50"
                  textColor="text-gray-700"
                />
                <SocialLoginButton 
                  provider="facebook" 
                  icon={
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  }
                  bgColor="bg-blue-600"
                  hoverColor="hover:bg-blue-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SocialLoginButton 
                  provider="github" 
                  icon={<FiGithub className="text-xl" />}
                  bgColor="bg-gray-800"
                  hoverColor="hover:bg-gray-900"
                />
                <SocialLoginButton 
                  provider="apple" 
                  icon={
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  }
                  bgColor="bg-black"
                  hoverColor="hover:bg-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}