import { useState, useEffect } from 'react'
import { ShopSettings } from '../types'
import { blink } from '../blink/client'

export function useSettings() {
  const [settings, setSettings] = useState<ShopSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      
      // For now, use mock data since we can't create database tables
      // In a real implementation, this would be:
      // const settingsData = await blink.db.shopSettings.list({ limit: 1 })
      
      const mockSettings: ShopSettings = {
        shop_domain: 'demo-store.myshopify.com',
        auto_publish: false,
        email_template: {
          subject: 'How was your recent purchase?',
          body: 'Hi {{customer_name}},\\n\\nWe hope you\'re loving your recent purchase of {{product_name}}! We\'d love to hear about your experience.\\n\\nLeave a review: {{review_link}}\\n\\nThanks!\\nThe Team'
        },
        widget_theme: {
          primary_color: '#00A96E',
          secondary_color: '#5C6AC4',
          font_family: 'Inter',
          layout: 'grid'
        },
        review_request: {
          enabled: true,
          days_after_delivery: 7,
          follow_up_enabled: true
        },
        moderation: {
          profanity_filter: true,
          min_rating_auto_publish: 3
        },
        integrations: {
          klaviyo_enabled: false,
          google_shopping_enabled: true
        }
      }

      setSettings(mockSettings)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<ShopSettings>) => {
    try {
      const updatedSettings = { ...settings, ...updates } as ShopSettings
      
      // In real implementation: await blink.db.shopSettings.update(settingsId, updates)
      setSettings(updatedSettings)
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  return {
    settings,
    loading,
    updateSettings
  }
}