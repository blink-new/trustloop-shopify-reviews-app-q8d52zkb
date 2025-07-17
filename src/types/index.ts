export interface Review {
  id: string
  user_id: string
  shop_domain: string
  product_id: string
  product_title: string
  customer_name: string
  customer_email: string
  rating: number
  title?: string
  text: string
  photos: string[]
  videos: string[]
  status: 'pending' | 'approved' | 'rejected'
  is_verified: boolean
  created_at: string
  helpful_votes: number
  reply?: {
    text: string
    author: string
    created_at: string
  }
}

export interface ReviewStats {
  total_reviews: number
  approved_reviews: number
  pending_reviews: number
  rejected_reviews: number
  average_rating: number
  rating_distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface Product {
  id: string
  title: string
  image_url: string
  review_count: number
  average_rating: number
  price: string
}

export interface ShopSettings {
  shop_domain: string
  auto_publish: boolean
  email_template: {
    subject: string
    body: string
  }
  widget_theme: {
    primary_color: string
    secondary_color: string
    font_family: string
    layout: 'grid' | 'list' | 'compact'
  }
  review_request: {
    enabled: boolean
    days_after_delivery: number
    follow_up_enabled: boolean
  }
  moderation: {
    profanity_filter: boolean
    min_rating_auto_publish: number
  }
  integrations: {
    klaviyo_enabled: boolean
    google_shopping_enabled: boolean
  }
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: 'review_request' | 'follow_up' | 'thank_you'
  is_active: boolean
}