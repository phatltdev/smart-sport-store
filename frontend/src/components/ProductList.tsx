'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ProductCard from './ProductCard'

export interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  rating: number
  sold: number
}

// Mock data generator - will be replaced with API calls
const generateMockProducts = (startId: number, count: number): Product[] => {
  const categories = ['Giày thể thao', 'Quần áo', 'Phụ kiện', 'Dụng cụ']
  const products: Product[] = []

  for (let i = 0; i < count; i++) {
    const productId = startId + i
    products.push({
      id: productId,
      name: `Sản phẩm thể thao ${productId}`,
      price: Math.floor(Math.random() * 2000000) + 200000,
      image: `https://placehold.co/400x400/3b82f6/ffffff?text=SP+${productId}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      rating: Math.floor(Math.random() * 2) + 3.5,
      sold: Math.floor(Math.random() * 1000)
    })
  }

  return products
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  const PRODUCTS_PER_PAGE = 12

  // Load products (mock API call)
  const loadProducts = useCallback(async (pageNum: number) => {
    setLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // TODO: Replace with actual API call when backend is ready
    // const response = await fetch(`/api/products?page=${pageNum}&limit=${PRODUCTS_PER_PAGE}`)
    // const data = await response.json()

    const startId = (pageNum - 1) * PRODUCTS_PER_PAGE + 1
    const newProducts = generateMockProducts(startId, PRODUCTS_PER_PAGE)

    if (pageNum === 1) {
      setProducts(newProducts)
    } else {
      setProducts(prev => [...prev, ...newProducts])
    }

    // Simulate pagination limit (e.g., 50 products max)
    if (pageNum >= 5) {
      setHasMore(false)
    }

    setLoading(false)
  }, [])

  // Initial load
  useEffect(() => {
    loadProducts(1)
  }, [loadProducts])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1)
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading])

  // Load more products when page changes
  useEffect(() => {
    if (page > 1) {
      loadProducts(page)
    }
  }, [page, loadProducts])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Sản phẩm nổi bật
        </h2>
        <p className="text-gray-600">
          Khám phá các sản phẩm thể thao chất lượng cao
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {!loading && hasMore && (
          <p className="text-gray-500">Đang tải thêm sản phẩm...</p>
        )}
        {!hasMore && products.length > 0 && (
          <p className="text-gray-500 py-4">Đã hiển thị tất cả sản phẩm</p>
        )}
      </div>
    </div>
  )
}