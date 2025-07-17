import { useState, useEffect } from 'react'
import { Review, ReviewStats } from '../types'
import { blink } from '../blink/client'

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const user = await blink.auth.me()
      if (!user) return

      // Try to load from localStorage first (for demo purposes)
      const savedReviews = localStorage.getItem(`reviews_${user.id}`)
      const savedStats = localStorage.getItem(`stats_${user.id}`)

      if (savedReviews && savedStats) {
        setReviews(JSON.parse(savedReviews))
        setStats(JSON.parse(savedStats))
      } else {
        // Initialize with mock data for demo
        const mockReviews: Review[] = [
          {
            id: '1',
            user_id: user.id,
            shop_domain: 'demo-store.myshopify.com',
            product_id: 'prod_1',
            product_title: 'Premium Wireless Headphones',
            customer_name: 'Sarah Johnson',
            customer_email: 'sarah@example.com',
            rating: 5,
            title: 'Amazing sound quality!',
            text: 'These headphones exceeded my expectations. The sound quality is crystal clear and the battery life is incredible. Highly recommend!',
            photos: [
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop'
            ],
            videos: [],
            status: 'approved',
            is_verified: true,
            created_at: '2024-01-15T10:30:00Z',
            helpful_votes: 12,
            reply: {
              text: 'Thank you so much for your wonderful review, Sarah! We\'re thrilled you love the sound quality.',
              author: 'Store Owner',
              created_at: '2024-01-15T14:20:00Z'
            }
          },
          {
            id: '2',
            user_id: user.id,
            shop_domain: 'demo-store.myshopify.com',
            product_id: 'prod_2',
            product_title: 'Smart Fitness Watch',
            customer_name: 'Mike Chen',
            customer_email: 'mike@example.com',
            rating: 4,
            title: 'Great features, minor issues',
            text: 'Love the fitness tracking features and the display is bright and clear. Battery could last longer though.',
            photos: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'],
            videos: [],
            status: 'approved',
            is_verified: true,
            created_at: '2024-01-14T16:45:00Z',
            helpful_votes: 8
          },
          {
            id: '3',
            user_id: user.id,
            shop_domain: 'demo-store.myshopify.com',
            product_id: 'prod_3',
            product_title: 'Organic Cotton T-Shirt',
            customer_name: 'Emma Wilson',
            customer_email: 'emma@example.com',
            rating: 5,
            text: 'Super soft and comfortable! The fit is perfect and the quality is outstanding.',
            photos: [],
            videos: [],
            status: 'pending',
            is_verified: false,
            created_at: '2024-01-16T09:15:00Z',
            helpful_votes: 0
          },
          {
            id: '4',
            user_id: user.id,
            shop_domain: 'demo-store.myshopify.com',
            product_id: 'prod_1',
            product_title: 'Premium Wireless Headphones',
            customer_name: 'David Brown',
            customer_email: 'david@example.com',
            rating: 3,
            title: 'Decent but not great',
            text: 'The headphones work fine but I expected better sound quality for the price. Comfort is good though.',
            photos: [],
            videos: [],
            status: 'pending',
            is_verified: true,
            created_at: '2024-01-16T11:30:00Z',
            helpful_votes: 2
          },
          {
            id: '5',
            user_id: user.id,
            shop_domain: 'demo-store.myshopify.com',
            product_id: 'prod_4',
            product_title: 'Leather Wallet',
            customer_name: 'Lisa Garcia',
            customer_email: 'lisa@example.com',
            rating: 5,
            title: 'Beautiful craftsmanship',
            text: 'This wallet is beautifully made with high-quality leather. Perfect size and lots of card slots.',
            photos: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'],
            videos: [],
            status: 'approved',
            is_verified: true,
            created_at: '2024-01-13T14:20:00Z',
            helpful_votes: 15
          }
        ]

        const mockStats: ReviewStats = {
          total_reviews: 142,
          approved_reviews: 108,
          pending_reviews: 28,
          rejected_reviews: 6,
          average_rating: 4.2,
          rating_distribution: {
            5: 72,
            4: 31,
            3: 19,
            2: 12,
            1: 8
          }
        }

        setReviews(mockReviews)
        setStats(mockStats)
        
        // Save to localStorage
        localStorage.setItem(`reviews_${user.id}`, JSON.stringify(mockReviews))
        localStorage.setItem(`stats_${user.id}`, JSON.stringify(mockStats))
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveToStorage = async (updatedReviews: Review[], updatedStats: ReviewStats) => {
    try {
      const user = await blink.auth.me()
      if (user) {
        localStorage.setItem(`reviews_${user.id}`, JSON.stringify(updatedReviews))
        localStorage.setItem(`stats_${user.id}`, JSON.stringify(updatedStats))
      }
    } catch (error) {
      console.error('Error saving to storage:', error)
    }
  }

  const approveReview = async (reviewId: string) => {
    try {
      const updatedReviews = reviews.map(review => 
        review.id === reviewId 
          ? { ...review, status: 'approved' as const }
          : review
      )
      
      const updatedStats = stats ? {
        ...stats,
        pending_reviews: stats.pending_reviews - 1,
        approved_reviews: stats.approved_reviews + 1
      } : null

      setReviews(updatedReviews)
      if (updatedStats) {
        setStats(updatedStats)
        await saveToStorage(updatedReviews, updatedStats)
      }
    } catch (error) {
      console.error('Error approving review:', error)
    }
  }

  const rejectReview = async (reviewId: string) => {
    try {
      const updatedReviews = reviews.map(review => 
        review.id === reviewId 
          ? { ...review, status: 'rejected' as const }
          : review
      )
      
      const updatedStats = stats ? {
        ...stats,
        pending_reviews: stats.pending_reviews - 1,
        rejected_reviews: stats.rejected_reviews + 1
      } : null

      setReviews(updatedReviews)
      if (updatedStats) {
        setStats(updatedStats)
        await saveToStorage(updatedReviews, updatedStats)
      }
    } catch (error) {
      console.error('Error rejecting review:', error)
    }
  }

  const deleteReview = async (reviewId: string) => {
    try {
      const reviewToDelete = reviews.find(r => r.id === reviewId)
      const updatedReviews = reviews.filter(review => review.id !== reviewId)
      
      const updatedStats = stats && reviewToDelete ? {
        ...stats,
        total_reviews: stats.total_reviews - 1,
        [reviewToDelete.status === 'approved' ? 'approved_reviews' : 
         reviewToDelete.status === 'pending' ? 'pending_reviews' : 
         'rejected_reviews']: stats[reviewToDelete.status === 'approved' ? 'approved_reviews' : 
                                  reviewToDelete.status === 'pending' ? 'pending_reviews' : 
                                  'rejected_reviews'] - 1
      } : null

      setReviews(updatedReviews)
      if (updatedStats) {
        setStats(updatedStats)
        await saveToStorage(updatedReviews, updatedStats)
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const addReview = async (review: Omit<Review, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const user = await blink.auth.me()
      if (!user) return

      const newReview: Review = {
        ...review,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        user_id: user.id
      }
      
      const updatedReviews = [newReview, ...reviews]
      const updatedStats = stats ? {
        ...stats,
        total_reviews: stats.total_reviews + 1,
        pending_reviews: stats.pending_reviews + 1,
        rating_distribution: {
          ...stats.rating_distribution,
          [review.rating]: stats.rating_distribution[review.rating as keyof typeof stats.rating_distribution] + 1
        }
      } : null

      setReviews(updatedReviews)
      if (updatedStats) {
        setStats(updatedStats)
        await saveToStorage(updatedReviews, updatedStats)
      }
    } catch (error) {
      console.error('Error adding review:', error)
    }
  }

  return {
    reviews,
    stats,
    loading,
    approveReview,
    rejectReview,
    deleteReview,
    addReview
  }
}