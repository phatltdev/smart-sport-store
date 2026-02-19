'use client'

import { useState } from 'react'
import { FiSearch, FiShoppingCart, FiMenu, FiCamera, FiLogIn } from 'react-icons/fi'
import ImageSearchModal from './ImageSearchModal'
import LoginModal from './LoginModal'

export default function Header() {
  const [searchText, setSearchText] = useState('')
  const [showImageSearch, setShowImageSearch] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement text search when backend is ready
    console.log('Searching for:', searchText)
  }

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FiMenu className="text-2xl text-gray-700 cursor-pointer md:hidden" />
              <h1 className="text-2xl md:text-3xl font-bold text-primary-600">
                KNP STORE
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
              >
                <FiLogIn className="text-lg" />
                <span className="hidden md:inline">Đăng nhập</span>
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
                <FiShoppingCart className="text-2xl text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowImageSearch(true)}
                className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 whitespace-nowrap"
                title="Tìm kiếm bằng hình ảnh"
              >
                <FiCamera className="text-xl" />
                <span className="hidden md:inline">Tìm bằng ảnh</span>
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition flex items-center gap-2"
            >
              <FiSearch className="text-xl" />
              <span className="hidden md:inline">Tìm kiếm</span>
            </button>
          </form>

          <nav className="mt-4 flex flex-wrap gap-2 text-sm">
            <a href="#" className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition">
              Tất cả sản phẩm
            </a>
            <a href="#" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition">
              Giày thể thao
            </a>
            <a href="#" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition">
              Quần áo
            </a>
            <a href="#" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition">
              Phụ kiện
            </a>
            <a href="#" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition">
              Dụng cụ
            </a>
          </nav>
        </div>
      </header>

      {showImageSearch && (
        <ImageSearchModal onClose={() => setShowImageSearch(false)} />
      )}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}
    </>
  )
}