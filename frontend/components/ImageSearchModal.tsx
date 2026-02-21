'use client'

import { useState, useRef } from 'react'
import { FiX, FiUpload, FiSearch } from 'react-icons/fi'
import Image from 'next/image'

interface ImageSearchModalProps {
  onClose: () => void
}

export default function ImageSearchModal({ onClose }: ImageSearchModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSearch = () => {
    if (selectedImage) {
      // TODO: Implement image search API call when backend is ready
      console.log('Searching with image:', selectedImage)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Tìm kiếm bằng hình ảnh</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FiX className="text-2xl text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedImage ? (
              <div className="space-y-4">
                <div className="relative w-full h-64 mx-auto">
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    fill
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-red-500 hover:text-red-600 underline"
                >
                  Xóa và chọn ảnh khác
                </button>
              </div>
            ) : (
              <>
                <FiUpload className="text-6xl text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-2">
                  Kéo thả hình ảnh vào đây
                </p>
                <p className="text-sm text-gray-500 mb-4">hoặc</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                >
                  Chọn file từ máy tính
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </>
            )}
          </div>

          {selectedImage && (
            <button
              onClick={handleSearch}
              className="w-full mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 text-lg font-semibold"
            >
              <FiSearch className="text-xl" />
              Tìm kiếm sản phẩm tương tự
            </button>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Gợi ý:</strong> Tải lên hình ảnh sản phẩm rõ ràng để tìm kiếm
              các sản phẩm tương tự. Hệ thống sẽ phân tích hình ảnh và đề xuất các sản
              phẩm phù hợp nhất.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

