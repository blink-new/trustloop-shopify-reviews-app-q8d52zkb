import { useState, useEffect } from 'react'
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
  }, [isConnected, shopifyClient])

  const checkInstallation = async () => {
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
  }

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
          <CardTitle className=\"flex items-center\">
            <Zap className=\"h-5 w-5 mr-2\" />
            Automatic Widget Installation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className=\"h-4 w-4\" />
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
        <CardTitle className=\"flex items-center justify-between\">
          <div className=\"flex items-center\">
            <Zap className=\"h-5 w-5 mr-2\" />
            Automatic Widget Installation
          </div>
          {checking && <Loader2 className=\"h-4 w-4 animate-spin\" />}
        </CardTitle>
      </CardHeader>
      <CardContent className=\"space-y-4\">
        <div className=\"flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border\">\n          <div>\n            <h3 className=\"font-medium text-gray-900\">One-Click Installation</h3>\n            <p className=\"text-sm text-gray-600\">Automatically install all TrustLoop widgets on your store</p>\n          </div>\n          <Badge className={installed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>\n            {installed ? 'Installed' : 'Not Installed'}\n          </Badge>\n        </div>\n\n        {error && (\n          <Alert variant=\"destructive\">\n            <AlertCircle className=\"h-4 w-4\" />\n            <AlertDescription>{error}</AlertDescription>\n          </Alert>\n        )}\n\n        <div className=\"space-y-3\">\n          <div className=\"flex items-start space-x-3\">\n            <div className=\"flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center\">\n              <span className=\"text-sm font-medium text-blue-600\">1</span>\n            </div>\n            <div>\n              <h4 className=\"font-medium\">Script Tag Installation</h4>\n              <p className=\"text-sm text-gray-600\">Adds TrustLoop widgets to your store automatically</p>\n            </div>\n          </div>\n          <div className=\"flex items-start space-x-3\">\n            <div className=\"flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center\">\n              <span className=\"text-sm font-medium text-blue-600\">2</span>\n            </div>\n            <div>\n              <h4 className=\"font-medium\">Webhook Setup</h4>\n              <p className=\"text-sm text-gray-600\">Automatically triggers review requests after orders</p>\n            </div>\n          </div>\n          <div className=\"flex items-start space-x-3\">\n            <div className=\"flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center\">\n              <span className=\"text-sm font-medium text-blue-600\">3</span>\n            </div>\n            <div>\n              <h4 className=\"font-medium\">Smart Detection</h4>\n              <p className=\"text-sm text-gray-600\">Widgets appear on the right pages automatically</p>\n            </div>\n          </div>\n        </div>\n\n        <div className=\"flex space-x-3\">\n          {!installed ? (\n            <Button \n              onClick={handleInstall} \n              disabled={installing}\n              className=\"flex-1\"\n            >\n              {installing ? (\n                <>\n                  <Loader2 className=\"h-4 w-4 mr-2 animate-spin\" />\n                  Installing...\n                </>\n              ) : (\n                <>\n                  <Zap className=\"h-4 w-4 mr-2\" />\n                  Install Widgets\n                </>\n              )}\n            </Button>\n          ) : (\n            <>\n              <Button \n                onClick={handleUninstall} \n                disabled={installing}\n                variant=\"destructive\"\n                className=\"flex-1\"\n              >\n                {installing ? (\n                  <>\n                    <Loader2 className=\"h-4 w-4 mr-2 animate-spin\" />\n                    Uninstalling...\n                  </>\n                ) : (\n                  'Uninstall Widgets'\n                )}\n              </Button>\n              <Button variant=\"outline\" asChild>\n                <a href={`https://${shopInfo.domain}`} target=\"_blank\" rel=\"noopener noreferrer\">\n                  <ExternalLink className=\"h-4 w-4 mr-2\" />\n                  View Store\n                </a>\n              </Button>\n            </>\n          )}\n        </div>\n\n        {installed && (\n          <Alert>\n            <CheckCircle className=\"h-4 w-4\" />\n            <AlertDescription>\n              <strong>Widgets installed successfully!</strong> Your review widgets are now active on your store. \n              Visit your store to see them in action.\n            </AlertDescription>\n          </Alert>\n        )}\n\n        {/* Script Tags List */}\n        {scriptTags.length > 0 && (\n          <div className=\"mt-6\">\n            <h4 className=\"font-medium mb-3 flex items-center\">\n              <Settings className=\"h-4 w-4 mr-2\" />\n              Installed Script Tags\n            </h4>\n            <div className=\"space-y-2\">\n              {scriptTags.map((tag: any) => (\n                <div key={tag.id} className=\"flex items-center justify-between p-3 bg-gray-50 rounded-lg\">\n                  <div>\n                    <p className=\"text-sm font-medium truncate\">{tag.src}</p>\n                    <p className=\"text-xs text-gray-500\">Event: {tag.event}</p>\n                  </div>\n                  <Badge variant={tag.src.includes('trustloop') ? 'default' : 'secondary'}>\n                    {tag.src.includes('trustloop') ? 'TrustLoop' : 'Other'}\n                  </Badge>\n                </div>\n              ))}\n            </div>\n          </div>\n        )}\n      </CardContent>\n    </Card>\n  )\n}