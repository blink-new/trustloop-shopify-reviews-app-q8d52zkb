import { useState } from 'react'
import { Star, Play, Smartphone, Monitor, Tablet, Settings, Palette, Eye, Code, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Switch } from '../components/ui/switch'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { toast } from 'react-hot-toast'
import ReviewCollectionWidget from '../components/ReviewCollectionWidget'
import { useReviews } from '../hooks/useReviews'

interface DemoConfig {
  device: 'mobile' | 'tablet' | 'desktop'
  theme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    borderRadius: number
  }
  product: {
    name: string
    image: string
  }
  showInstructions: boolean
}

const demoProducts = [
  {
    name: 'Premium Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'
  },
  {
    name: 'Smart Fitness Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop'
  },
  {
    name: 'Organic Cotton T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'
  },
  {
    name: 'Leather Wallet',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop'
  }
]

export default function WidgetDemo() {
  const { addReview } = useReviews()
  const [config, setConfig] = useState<DemoConfig>({
    device: 'desktop',
    theme: {
      primaryColor: '#00A96E',
      secondaryColor: '#5C6AC4',
      fontFamily: 'Inter',
      borderRadius: 8
    },
    product: demoProducts[0],
    showInstructions: true
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedDemo, setCompletedDemo] = useState(false)

  const updateConfig = (updates: Partial<DemoConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const updateTheme = (themeUpdates: Partial<DemoConfig['theme']>) => {
    setConfig(prev => ({
      ...prev,
      theme: { ...prev.theme, ...themeUpdates }
    }))
  }

  const handleReviewSubmit = async (reviewData: any) => {
    // Add the review to the system
    await addReview({
      shop_domain: 'demo-store.myshopify.com',
      product_id: 'demo-product',
      product_title: config.product.name,
      customer_name: reviewData.customerName,
      customer_email: reviewData.customerEmail,
      rating: reviewData.rating,
      title: reviewData.title,
      text: reviewData.text,
      photos: reviewData.files?.filter((f: File) => f.type.startsWith('image/')).map((f: File) => URL.createObjectURL(f)) || [],
      videos: reviewData.files?.filter((f: File) => f.type.startsWith('video/')).map((f: File) => URL.createObjectURL(f)) || [],
      status: 'pending',
      is_verified: false,
      helpful_votes: 0
    })

    setCompletedDemo(true)
    toast.success('Demo review submitted! Check the Reviews page to see it.')
  }

  const getDeviceDimensions = () => {
    switch (config.device) {
      case 'mobile':
        return { width: '375px', height: '600px', scale: 0.8 }
      case 'tablet':
        return { width: '768px', height: '600px', scale: 0.9 }
      default:
        return { width: '100%', height: '600px', scale: 1 }
    }
  }

  const startDemo = () => {
    setIsPlaying(true)
    setCompletedDemo(false)
    toast.success('Demo started! Try submitting a review to see how it works.')
  }

  const resetDemo = () => {
    setIsPlaying(false)
    setCompletedDemo(false)
    toast.success('Demo reset!')
  }

  const exportWidget = () => {
    const widgetCode = `
<!-- TrustLoop Review Collection Widget -->
<div id="trustloop-review-widget" data-product-id="{{product.id}}"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.trustloop.com/widget.js';
    script.async = true;
    script.onload = function() {
      TrustLoop.initReviewWidget({
        shopDomain: '${window.location.hostname}',
        theme: ${JSON.stringify(config.theme, null, 2)},
        productName: '{{product.title}}',
        productImage: '{{product.featured_image | img_url: '200x200'}}'
      });
    };
    document.head.appendChild(script);
  })();
</script>
    `.trim()

    navigator.clipboard.writeText(widgetCode)
    toast.success('Widget code copied to clipboard!')
  }

  const dimensions = getDeviceDimensions()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interactive Widget Demo</h1>
          <p className="mt-2 text-gray-600">Experience your review collection widget in action</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={exportWidget}>
            <Code className="h-4 w-4 mr-2" />
            Export Code
          </Button>
          <Button onClick={isPlaying ? resetDemo : startDemo}>
            <Play className="h-4 w-4 mr-2" />
            {isPlaying ? 'Reset Demo' : 'Start Demo'}
          </Button>
        </div>
      </div>

      {/* Demo Status */}
      {isPlaying && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium text-green-900">Demo Active</p>
                  <p className="text-sm text-green-700">
                    {completedDemo 
                      ? 'Demo completed! Your test review has been added to the system.' 
                      : 'Try submitting a review to see the complete flow.'
                    }
                  </p>
                </div>
              </div>
              {completedDemo && (
                <Badge className="bg-green-600">
                  ✓ Review Submitted
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Demo Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="device" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="device">Device</TabsTrigger>
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="product">Product</TabsTrigger>
              </TabsList>

              <TabsContent value="device" className="space-y-4">
                <div>
                  <Label>Preview Device</Label>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant={config.device === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateConfig({ device: 'mobile' })}
                    >
                      <Smartphone className="h-4 w-4 mr-1" />
                      Mobile
                    </Button>
                    <Button
                      variant={config.device === 'tablet' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateConfig({ device: 'tablet' })}
                    >
                      <Tablet className="h-4 w-4 mr-1" />
                      Tablet
                    </Button>
                    <Button
                      variant={config.device === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateConfig({ device: 'desktop' })}
                    >
                      <Monitor className="h-4 w-4 mr-1" />
                      Desktop
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Show Instructions</Label>
                  <Switch
                    checked={config.showInstructions}
                    onCheckedChange={(checked) => updateConfig({ showInstructions: checked })}
                  />
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Device Info</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div>Width: {dimensions.width}</div>
                    <div>Height: {dimensions.height}</div>
                    <div>Scale: {(dimensions.scale * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="theme" className="space-y-4">
                <div>
                  <Label>Primary Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type="color"
                      value={config.theme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.theme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      placeholder="#00A96E"
                    />
                  </div>
                </div>

                <div>
                  <Label>Secondary Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type="color"
                      value={config.theme.secondaryColor}
                      onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.theme.secondaryColor}
                      onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                      placeholder="#5C6AC4"
                    />
                  </div>
                </div>

                <div>
                  <Label>Font Family</Label>
                  <Select
                    value={config.theme.fontFamily}
                    onValueChange={(value) => updateTheme({ fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Border Radius</Label>
                  <Input
                    type="number"
                    value={config.theme.borderRadius}
                    onChange={(e) => updateTheme({ borderRadius: parseInt(e.target.value) })}
                    min="0"
                    max="20"
                    className="mt-1"
                  />
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Theme Preview</h4>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: config.theme.primaryColor }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: config.theme.secondaryColor }}
                    ></div>
                    <span className="text-sm text-purple-800" style={{ fontFamily: config.theme.fontFamily }}>
                      {config.theme.fontFamily}
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="product" className="space-y-4">
                <div>
                  <Label>Demo Product</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {demoProducts.map((product, index) => (
                      <button
                        key={index}
                        onClick={() => updateConfig({ product })}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                          config.product.name === product.name
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="text-left">
                          <div className="font-medium text-sm">{product.name}</div>
                          {config.product.name === product.name && (
                            <Badge className="bg-green-500 text-xs mt-1">Selected</Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Current Product</h4>
                  <div className="flex items-center space-x-2">
                    <img 
                      src={config.product.image} 
                      alt={config.product.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span className="text-sm text-orange-800">{config.product.name}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Widget Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Live Widget Preview
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{config.device}</Badge>
                <Badge 
                  className="text-white"
                  style={{ backgroundColor: config.theme.primaryColor }}
                >
                  Interactive
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {config.showInstructions && !isPlaying && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">How to Use This Demo</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click "Start Demo" to activate the interactive widget</li>
                  <li>• Fill out the review form completely to test the flow</li>
                  <li>• Upload photos or videos to see media handling</li>
                  <li>• Submit the review to see it added to your Reviews page</li>
                  <li>• Customize colors, fonts, and products using the left panel</li>
                </ul>
              </div>
            )}

            <div className="flex justify-center">
              <div 
                className="border rounded-lg overflow-hidden bg-gray-50 transition-all duration-300"
                style={{ 
                  width: dimensions.width,
                  height: dimensions.height,
                  transform: `scale(${dimensions.scale})`,
                  transformOrigin: 'top center'
                }}
              >
                <div className="w-full h-full overflow-auto p-4">
                  {isPlaying ? (
                    <ReviewCollectionWidget
                      productId="demo-product"
                      productName={config.product.name}
                      productImage={config.product.image}
                      theme={config.theme}
                      onSubmit={handleReviewSubmit}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Play className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Widget Preview</h3>
                        <p className="text-gray-600 mb-4">Click "Start Demo" to see the interactive widget</p>
                        <Button onClick={startDemo}>
                          <Play className="h-4 w-4 mr-2" />
                          Start Interactive Demo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isPlaying && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Demo Actions</h4>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={resetDemo}>
                    Reset Demo
                  </Button>
                  <Button size="sm" variant="outline" onClick={exportWidget}>
                    <Download className="h-4 w-4 mr-1" />
                    Export Code
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success('Widget settings saved!')}>
                    Save Configuration
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Integration Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="shopify" className="w-full">
            <TabsList>
              <TabsTrigger value="shopify">Shopify</TabsTrigger>
              <TabsTrigger value="woocommerce">WooCommerce</TabsTrigger>
              <TabsTrigger value="custom">Custom HTML</TabsTrigger>
            </TabsList>

            <TabsContent value="shopify" className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Shopify Integration Steps</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Go to your Shopify admin → Online Store → Themes</li>
                  <li>Click "Actions" → "Edit code" on your active theme</li>
                  <li>Open the product template file (usually product.liquid or product-form.liquid)</li>
                  <li>Add the widget code where you want the review collection to appear</li>
                  <li>Save the file and test on your store</li>
                </ol>
              </div>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`<!-- Add this to your product template -->
<div id="trustloop-review-widget" data-product-id="{{ product.id }}"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.trustloop.com/widget.js';
    script.async = true;
    script.onload = function() {
      TrustLoop.initReviewWidget({
        shopDomain: '{{ shop.domain }}',
        theme: ${JSON.stringify(config.theme, null, 2)},
        productName: '{{ product.title }}',
        productImage: '{{ product.featured_image | img_url: "200x200" }}'
      });
    };
    document.head.appendChild(script);
  })();
</script>`}</pre>
              </div>
            </TabsContent>

            <TabsContent value="woocommerce" className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">WooCommerce Integration Steps</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Access your WordPress admin → Appearance → Theme Editor</li>
                  <li>Edit the single-product.php file or use a child theme</li>
                  <li>Add the widget code in the product content area</li>
                  <li>Update the file and test on your store</li>
                </ol>
              </div>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`<!-- Add this to your WooCommerce product template -->
<div id="trustloop-review-widget" data-product-id="<?php echo get_the_ID(); ?>"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.trustloop.com/widget.js';
    script.async = true;
    script.onload = function() {
      TrustLoop.initReviewWidget({
        shopDomain: '<?php echo $_SERVER["HTTP_HOST"]; ?>',
        theme: ${JSON.stringify(config.theme, null, 2)},
        productName: '<?php echo get_the_title(); ?>',
        productImage: '<?php echo get_the_post_thumbnail_url(get_the_ID(), "medium"); ?>'
      });
    };
    document.head.appendChild(script);
  })();
</script>`}</pre>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Custom HTML Integration</h4>
                <p className="text-sm text-gray-600 mb-4">
                  For custom websites, add this code to your product pages where you want the review widget to appear.
                </p>
              </div>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`<!-- Add this to your HTML -->
<div id="trustloop-review-widget" data-product-id="your-product-id"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.trustloop.com/widget.js';
    script.async = true;
    script.onload = function() {
      TrustLoop.initReviewWidget({
        shopDomain: 'your-domain.com',
        theme: ${JSON.stringify(config.theme, null, 2)},
        productName: 'Your Product Name',
        productImage: 'https://your-domain.com/product-image.jpg'
      });
    };
    document.head.appendChild(script);
  })();
</script>`}</pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}