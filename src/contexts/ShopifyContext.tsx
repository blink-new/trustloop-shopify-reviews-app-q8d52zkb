import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ShopifyClient, createShopifyClient, ShopInfo } from '../lib/shopify'
import { blink } from '../blink/client'

interface ShopifyConnection {
  id: string
  userId: string
  shopDomain: string
  accessToken: string
  shopName: string
  shopEmail: string
  plan: string
  currencyCode: string
  timezone: string
  connectedAt: string
}

interface ShopifyContextType {
  shopifyClient: ShopifyClient | null
  shopInfo: ShopInfo | null
  isConnected: boolean
  isLoading: boolean
  connectShop: (shop: string, accessToken: string) => Promise<void>
  disconnectShop: () => Promise<void>
}

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined)

export const useShopify = () => {
  const context = useContext(ShopifyContext)
  if (context === undefined) {
    throw new Error('useShopify must be used within a ShopifyProvider')
  }
  return context
}

interface ShopifyProviderProps {
  children: ReactNode
}

export const ShopifyProvider: React.FC<ShopifyProviderProps> = ({ children }) => {
  const [shopifyClient, setShopifyClient] = useState<ShopifyClient | null>(null)
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadShopifyConnection()
  }, [])

  const loadShopifyConnection = async () => {
    try {
      setIsLoading(true)
      
      // Check if user is authenticated first
      const user = await blink.auth.me()
      if (!user) {
        setIsLoading(false)
        return
      }

      // Try to load existing Shopify connection from localStorage for now
      // In a real app, this would be stored securely in the backend
      const savedConnection = localStorage.getItem('shopify_connection')
      
      if (savedConnection) {
        try {
          const connection = JSON.parse(savedConnection)
          const client = createShopifyClient({
            shop: connection.shopDomain,
            accessToken: connection.accessToken
          })

          // Verify the connection is still valid
          const shop = await client.getShopInfo()
          setShopifyClient(client)
          setShopInfo(shop)
          setIsConnected(true)
        } catch (error) {
          console.error('Invalid Shopify connection:', error)
          // Remove invalid connection
          localStorage.removeItem('shopify_connection')
        }
      }
    } catch (error) {
      console.error('Error loading Shopify connection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const connectShop = async (shop: string, accessToken: string) => {
    try {
      setIsLoading(true)
      
      const client = createShopifyClient({ shop, accessToken })
      
      // Test the connection
      const shopData = await client.getShopInfo()
      
      // Save connection to localStorage for now
      // In a real app, this would be stored securely in the backend
      const connection = {
        shopDomain: shop,
        accessToken: accessToken,
        shopName: shopData.name,
        shopEmail: shopData.email,
        plan: shopData.plan,
        currencyCode: shopData.currency,
        timezone: shopData.timezone,
        connectedAt: new Date().toISOString()
      }
      
      localStorage.setItem('shopify_connection', JSON.stringify(connection))

      setShopifyClient(client)
      setShopInfo(shopData)
      setIsConnected(true)
    } catch (error) {
      console.error('Error connecting to Shopify:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectShop = async () => {
    try {
      localStorage.removeItem('shopify_connection')
      setShopifyClient(null)
      setShopInfo(null)
      setIsConnected(false)
    } catch (error) {
      console.error('Error disconnecting from Shopify:', error)
    }
  }

  const value: ShopifyContextType = {
    shopifyClient,
    shopInfo,
    isConnected,
    isLoading,
    connectShop,
    disconnectShop
  }

  return (
    <ShopifyContext.Provider value={value}>
      {children}
    </ShopifyContext.Provider>
  )
}