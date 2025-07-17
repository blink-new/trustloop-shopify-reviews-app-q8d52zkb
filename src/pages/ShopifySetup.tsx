import { useState } from 'react'
import { useShopify } from '../contexts/ShopifyContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Alert, AlertDescription } from '../components/ui/alert'
import { CheckCircle, ExternalLink, Store, AlertCircle } from 'lucide-react'

export default function ShopifySetup() {
  const { isConnected, shopInfo, connectShop, disconnectShop, isLoading } = useShopify()
  const [shop, setShop] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [error, setError] = useState('')
  const [connecting, setConnecting] = useState(false)

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setConnecting(true)

    try {
      // Clean up shop domain
      const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\.myshopify\.com.*$/, '') + '.myshopify.com'
      await connectShop(cleanShop, accessToken)
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Shopify')
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectShop()
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect from Shopify')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Shopify connection...</p>
        </div>
      </div>
    )
  }

  if (isConnected && shopInfo) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopify Connection</h1>
          <p className="mt-2 text-gray-600">Your store is connected and ready to collect reviews</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Connected Store</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Store className="h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold">{shopInfo.name}</h3>
                <p className="text-gray-600">{shopInfo.domain}</p>
                <p className="text-sm text-gray-500">Plan: {shopInfo.plan}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => window.open(`https://${shopInfo.domain}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Store
              </Button>
              <Button
                variant="destructive"
                onClick={handleDisconnect}
              >
                Disconnect Store
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Install Widget</h4>
                  <p className="text-sm text-gray-600">Go to Widget Customization to install the review widget on your store</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Configure Email Templates</h4>
                  <p className="text-sm text-gray-600">Set up automated review request emails for your customers</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Test & Launch</h4>
                  <p className="text-sm text-gray-600">Place a test order and verify the review collection flow</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Connect Your Shopify Store</h1>
        <p className="mt-2 text-gray-600">Connect TrustLoop to your Shopify store to start collecting reviews</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Shopify Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <Label htmlFor="shop">Shop Domain</Label>
              <Input
                id="shop"
                type="text"
                placeholder="your-store.myshopify.com"
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter your Shopify store domain (e.g., your-store.myshopify.com)
              </p>
            </div>

            <div>
              <Label htmlFor="accessToken">Private App Access Token</Label>
              <Input
                id="accessToken"
                type="password"
                placeholder="shpat_..."
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Create a private app in your Shopify admin with the required permissions
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={connecting || !shop || !accessToken}
              className="w-full"
            >
              {connecting ? 'Connecting...' : 'Connect Store'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Create a Private App</h4>
              <p className="text-sm text-gray-600 mb-2">
                Go to your Shopify admin → Settings → Apps and sales channels → Develop apps → Create an app
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">2. Configure API Permissions</h4>
              <p className="text-sm text-gray-600 mb-2">Enable the following Admin API access scopes:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li><code>read_products</code> - Read product information</li>
                <li><code>read_orders</code> - Read order information</li>
                <li><code>write_script_tags</code> - Install review widgets</li>
                <li><code>read_themes</code> - Theme integration</li>
              </ul>
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> If you don't see <code>write_webhooks</code> in the scopes list, that's normal. 
                  Webhook permissions are automatically included with other scopes in newer Shopify apps.
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">3. Get Access Token</h4>
              <p className="text-sm text-gray-600">
                After creating the app, install it and copy the Admin API access token (starts with "shpat_")
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}