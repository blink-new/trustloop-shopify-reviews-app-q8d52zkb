import { useState, useEffect } from 'react'
import { Product } from '../types'
import { blink } from '../blink/client'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      
      // For now, use mock data since we can't create database tables
      // In a real implementation, this would be:
      // const productsData = await blink.db.products.list({ orderBy: { created_at: 'desc' } })
      
      const mockProducts: Product[] = [
        {
          id: 'prod_1',
          title: 'Premium Wireless Headphones',
          image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
          review_count: 45,
          average_rating: 4.5,
          price: '$199.99'
        },
        {
          id: 'prod_2',
          title: 'Smart Fitness Watch',
          image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
          review_count: 32,
          average_rating: 4.2,
          price: '$299.99'
        },
        {
          id: 'prod_3',
          title: 'Organic Cotton T-Shirt',
          image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
          review_count: 28,
          average_rating: 4.7,
          price: '$29.99'
        },
        {
          id: 'prod_4',
          title: 'Leather Wallet',
          image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
          review_count: 22,
          average_rating: 4.8,
          price: '$79.99'
        }
      ]

      setProducts(mockProducts)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    loading
  }
}