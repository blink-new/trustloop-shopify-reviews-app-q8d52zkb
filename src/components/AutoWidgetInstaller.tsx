import { useState, useEffect, useCallback } from 'react'
import { useShopify } from '../contexts/ShopifyContext'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { CheckCircle, ExternalLink, Code, AlertCircle, Loader2, Zap, Settings } from 'lucide-react'
import { Badge } from './ui/badge'

export default function AutoWidgetInstaller() {
  const { shopifyClient, shopInfo, isConnected } = useShopify()
  const [installing, setInstalling] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [error, setError] = useState('')
  const [scriptTags, setScriptTags] = useState<any[]>([])
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (isConnected && shopifyClient) {
      checkInstallation()
    }
  }, [isConnected, shopifyClient, checkInstallation])

  const checkInstallation = useCallback(async () => {
    if (!shopifyClient) return

    setChecking(true)
    try {
      const tags = await shopifyClient.listScriptTags()
      setScriptTags(tags)
      
      // Check if TrustLoop widget is already installed
      const trustloopTag = tags.find((tag: any) => 
        tag.src && tag.src.includes('trustloop-all.js')
      )
      setInstalled(!!trustloopTag)
    } catch (err: any) {
      console.error('Error checking installation:', err)
    } finally {
      setChecking(false)
    }
  }, [shopifyClient])

  const handleInstall = async () => {
    if (!shopifyClient || !shopInfo) return

    setInstalling(true)
    setError('')

    try {
      // Get the current domain for the script URL
      const currentDomain = window.location.hostname
      const scriptUrl = `https://${currentDomain}/trustloop-all.js`

      // Install the main widget script
      const scriptTag = await shopifyClient.createScriptTag(scriptUrl)

      if (scriptTag) {
        setInstalled(true)
        
        // Create webhook for order fulfillment
        try {
          await shopifyClient.createWebhook(
            'orders/fulfilled',
            'https://q8d52zkb--review-webhook.functions.blink.new'
          )
        } catch (webhookError) {
          console.warn('Webhook creation failed (may already exist):', webhookError)
        }

        // Refresh the script tags list
        await checkInstallation()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to install widget')
    } finally {
      setInstalling(false)
    }
  }

  const handleUninstall = async () => {
    if (!shopifyClient) return

    setInstalling(true)
    setError('')

    try {
      // Find and remove TrustLoop script tags
      const trustloopTags = scriptTags.filter((tag: any) => 
        tag.src && tag.src.includes('trustloop-all.js')
      )

      for (const tag of trustloopTags) {
        await shopifyClient.deleteScriptTag(tag.id.toString())
      }

      setInstalled(false)
      await checkInstallation()
    } catch (err: any) {
      setError(err.message || 'Failed to uninstall widget')
    } finally {
      setInstalling(false)
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Automatic Widget Installation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your Shopify store first to use automatic installation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Automatic Widget Installation
          </div>
          {checking && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
          <div>
            <h3 className="font-medium text-gray-900">One-Click Installation</h3>
            <p className="text-sm text-gray-600">Automatically install all TrustLoop widgets on your store</p>
          </div>
          <Badge className={installed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {installed ? 'Installed' : 'Not Installed'}
          </Badge>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">1</span>
            </div>
            <div>
              <h4 className="font-medium">Script Tag Installation</h4>
              <p className="text-sm text-gray-600">Adds TrustLoop widgets to your store automatically</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">2</span>
            </div>
            <div>
              <h4 className="font-medium">Webhook Setup</h4>
              <p className="text-sm text-gray-600">Automatically triggers review requests after orders</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">3</span>
            </div>
            <div>
              <h4 className="font-medium">Smart Detection</h4>
              <p className="text-sm text-gray-600">Widgets appear on the right pages automatically</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          {!installed ? (
            <Button 
              onClick={handleInstall} 
              disabled={installing}
              className="flex-1"
            >
              {installing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Installing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Install Widgets
                </>
              )}
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleUninstall} 
                disabled={installing}
                variant="destructive"
                className="flex-1"
              >
                {installing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uninstalling...
                  </>
                ) : (
                  'Uninstall Widgets'
                )}
              </Button>
              <Button variant="outline" asChild>
                <a href={`https://${shopInfo.domain}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Store
                </a>
              </Button>
            </>
          )}
        </div>

        {installed && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Widgets installed successfully!</strong> Your review widgets are now active on your store. 
              Visit your store to see them in action.
            </AlertDescription>
          </Alert>
        )}

        {/* Script Tags List */}
        {scriptTags.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Installed Script Tags
            </h4>
            <div className="space-y-2">
              {scriptTags.map((tag: any) => (
                <div key={tag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium truncate">{tag.src}</p>
                    <p className="text-xs text-gray-500">Event: {tag.event}</p>
                  </div>
                  <Badge variant={tag.src.includes('trustloop') ? 'default' : 'secondary'}>
                    {tag.src.includes('trustloop') ? 'TrustLoop' : 'Other'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}