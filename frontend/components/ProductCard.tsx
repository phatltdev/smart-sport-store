'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiShoppingCart, FiStar } from 'react-icons/fi'
import type { Product } from './ProductList'
import LoginModal from './LoginModal'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showLogin, setShowLogin] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleAddToCart = () => {
    // Show login modal when adding to cart
    setShowLogin(true)
    console.log('Added to cart:', product.id)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{Math.floor(Math.random() * 30) + 10}%
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>

          <div className="flex items-center mb-2">
            <div className="flex items-center text-yellow-400">
              <FiStar className="fill-current" />
              <span className="ml-1 text-sm text-gray-600">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="ml-3 text-sm text-gray-500">
              Đã bán {product.sold}
            </span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-gray-400 line-through">
                {formatPrice(product.price * 1.3)}
              </p>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition flex items-center justify-center gap-2 font-semibold"
          >
            <FiShoppingCart className="text-lg" />
            Thêm vào giỏ
          </button>
        </div>
      </div>
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}
    </>
  )
}