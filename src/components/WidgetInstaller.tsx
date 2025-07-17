import { useState } from 'react'
import { Copy, Check, ExternalLink, Code, Download, Star, ShoppingCart, Home, Grid } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { toast } from '../hooks/use-toast'

export default function WidgetInstaller() {
  const [copied, setCopied] = useState<string | null>(null)

  const widgets = {
    product: {
      name: 'Product Page Widget',
      description: 'Display reviews on your product pages',
      icon: Star,
      code: `<!-- TrustLoop Product Reviews Widget -->
<div id="trustloop-reviews" data-product-id="{{product.id}}"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`
    },
    collection: {
      name: 'Collection Page Widget',
      description: 'Show star ratings on product listings',
      icon: Grid,
      code: `<!-- TrustLoop Collection Ratings Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/collection-widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`
    },
    cart: {
      name: 'Cart Page Widget',
      description: 'Social proof and trust badges in cart',
      icon: ShoppingCart,
      code: `<!-- TrustLoop Cart Social Proof Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/cart-widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`
    },
    homepage: {
      name: 'Homepage Carousel',
      description: 'Featured reviews carousel for homepage',
      icon: Home,
      code: `<!-- TrustLoop Homepage Reviews Carousel -->
<div id="trustloop-carousel"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/homepage-carousel.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`
    }
  }

  const copyToClipboard = (code: string, widgetType: string) => {
    navigator.clipboard.writeText(code)
    setCopied(widgetType)
    toast.toast({
      title: "Code copied to clipboard!",
      description: "You can now paste it into your theme files.",
    })
    setTimeout(() => setCopied(null), 2000)
  }

  const downloadAllWidgets = () => {
    const allCode = Object.entries(widgets).map(([key, widget]) => 
      `/* ${widget.name} */\n${widget.code}\n\n`
    ).join('')

    const blob = new Blob([allCode], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'trustloop-widgets.txt'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Widget Installation
          </div>
          <Button onClick={downloadAllWidgets} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="product" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {Object.entries(widgets).map(([key, widget]) => (
              <TabsTrigger key={key} value={key} className="flex items-center space-x-1">
                <widget.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{widget.name.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(widgets).map(([key, widget]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{widget.name}</h3>
                  <p className="text-sm text-gray-600">{widget.description}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Ready</Badge>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Embed Code
                </label>
                <Textarea
                  value={widget.code}
                  readOnly
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => copyToClipboard(widget.code, key)} 
                  className="flex-1"
                >
                  {copied === key ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied === key ? 'Copied!' : 'Copy Code'}
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://help.shopify.com/en/manual/online-store/themes/theme-structure/extend/edit-theme-code" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Guide
                  </a>
                </Button>
              </div>

              {/* Widget-specific instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Installation Instructions</h4>
                {key === 'product' && (
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Go to Shopify admin → Online Store → Themes</li>
                    <li>2. Click "Actions" → "Edit code" on your active theme</li>
                    <li>3. Open the product template (product.liquid or product-form.liquid)</li>
                    <li>4. Paste code after the product description or form</li>
                    <li>5. Save the file</li>
                  </ol>
                )}
                {key === 'collection' && (
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Go to Shopify admin → Online Store → Themes</li>
                    <li>2. Click "Actions" → "Edit code" on your active theme</li>
                    <li>3. Open collection.liquid or collection-template.liquid</li>
                    <li>4. Paste code in the &lt;head&gt; section or before &lt;/body&gt;</li>
                    <li>5. Save the file - ratings will auto-appear on product cards</li>
                  </ol>
                )}
                {key === 'cart' && (
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Go to Shopify admin → Online Store → Themes</li>
                    <li>2. Click "Actions" → "Edit code" on your active theme</li>
                    <li>3. Open cart.liquid or cart-template.liquid</li>
                    <li>4. Paste code in the &lt;head&gt; section or before &lt;/body&gt;</li>
                    <li>5. Save the file - social proof will auto-appear in cart</li>
                  </ol>
                )}
                {key === 'homepage' && (
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Go to Shopify admin → Online Store → Themes</li>
                    <li>2. Click "Actions" → "Edit code" on your active theme</li>
                    <li>3. Open index.liquid (homepage template)</li>
                    <li>4. Paste code where you want the reviews carousel</li>
                    <li>5. Save the file</li>
                  </ol>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Global Installation Option */}
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">💡 Pro Tip: One-Click Installation</h4>
          <p className="text-sm text-purple-800 mb-3">
            Install all widgets at once by adding this single script to your theme.liquid file before &lt;/head&gt;:
          </p>
          <div className="bg-white rounded border p-3 font-mono text-xs">
            {`<script src="${window.location.origin}/trustloop-all.js" async></script>`}
          </div>
          <p className="text-xs text-purple-700 mt-2">
            This will automatically detect page types and load the appropriate widgets.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}