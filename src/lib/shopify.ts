// Secure Shopify API client that uses backend functions
export interface ShopifyConfig {
  shop: string
  accessToken: string
}

export interface ShopInfo {
  id: string
  name: string
  email: string
  domain: string
  myshopifyDomain: string
  plan: string
  currency: string
  timezone: string
}

export interface Product {
  id: string
  title: string
  handle: string
  description: string
  status: string
  vendor: string
  productType: string
  image_url: string
  price: string
  compareAtPrice?: string
  createdAt: string
  updatedAt: string
}

export class ShopifyClient {
  private shop: string
  private accessToken: string

  constructor(config: ShopifyConfig) {
    this.shop = config.shop
    this.accessToken = config.accessToken
  }

  async testConnection(): Promise<ShopInfo> {
    try {
      const response = await fetch('https://q8d52zkb--shopify-connect.functions.blink.new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop: this.shop,
          accessToken: this.accessToken
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to Shopify')
      }

      if (!data.success) {
        throw new Error(data.error || 'Connection failed')
      }

      return data.shop
    } catch (error) {
      console.error('Error testing Shopify connection:', error)
      throw error
    }
  }

  async getProducts(limit = 50): Promise<Product[]> {
    try {
      const response = await fetch('https://q8d52zkb--shopify-products.functions.blink.new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop: this.shop,
          accessToken: this.accessToken,
          limit
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products')
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch products')
      }

      return data.products
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  async getShopInfo(): Promise<ShopInfo> {
    return this.testConnection()
  }

  async getOrders(limit = 50) {
    // TODO: Implement with backend function
    return []
  }

  async createScriptTag(src: string) {
    try {
      const response = await fetch('https://q8d52zkb--shopify-script-tags.functions.blink.new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop: this.shop,
          accessToken: this.accessToken,
          action: 'create',
          src
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create script tag')
      }

      return data.script_tag
    } catch (error) {
      console.error('Error creating script tag:', error)
      throw error
    }
  }

  async deleteScriptTag(id: string) {
    try {
      const response = await fetch('https://q8d52zkb--shopify-script-tags.functions.blink.new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop: this.shop,
          accessToken: this.accessToken,
          action: 'delete',
          id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete script tag')
      }

      return data.deleted
    } catch (error) {
      console.error('Error deleting script tag:', error)
      throw error
    }
  }

  async listScriptTags() {
    try {
      const response = await fetch('https://q8d52zkb--shopify-script-tags.functions.blink.new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop: this.shop,
          accessToken: this.accessToken,
          action: 'list'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to list script tags')
      }

      return data.script_tags || []
    } catch (error) {
      console.error('Error listing script tags:', error)
      throw error
    }
  }

  async createWebhook(topic: string, address: string) {
    try {
      const response = await fetch('https://q8d52zkb--shopify-webhooks.functions.blink.new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop: this.shop,
          accessToken: this.accessToken,
          topic,
          address
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create webhook')
      }

      return data.webhook
    } catch (error) {
      console.error('Error creating webhook:', error)
      throw error
    }
  }
}

export const createShopifyClient = (config: ShopifyConfig) => {
  return new ShopifyClient(config)
}