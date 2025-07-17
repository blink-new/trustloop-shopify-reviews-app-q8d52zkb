import { useState } from 'react'
import { Palette, Eye, Code, Save, Star, MessageSquare, Grid, List, Layers, Smartphone, Monitor, Tablet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { toast } from 'react-hot-toast'
import WidgetInstaller from '../components/WidgetInstaller'
import AutoWidgetInstaller from '../components/AutoWidgetInstaller'
import ReviewCollectionWidget from '../components/ReviewCollectionWidget'

interface WidgetType {
  id: string
  name: string
  description: string
  category: 'product' | 'homepage' | 'collection' | 'floating'
  preview: string
}

interface WidgetConfig {
  selectedWidget: string
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    fontSize: string
    borderRadius: string
    shadowLevel: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    animation: 'none' | 'fade' | 'slide' | 'bounce' | 'scale'
    borderStyle: 'none' | 'solid' | 'dashed' | 'dotted'
    borderWidth: string
  }
  layout: {
    style: 'grid' | 'list' | 'compact' | 'masonry' | 'carousel' | 'slider'
    columns: number
    spacing: string
    reviewsPerPage: number
    showPhotos: boolean
    showVerifiedBadge: boolean
    showDate: boolean
    showHelpfulness: boolean
    showReviewerAvatar: boolean
    showProductInfo: boolean
    compactMode: boolean
    cardStyle: 'flat' | 'elevated' | 'outlined' | 'minimal'
  }
  display: {
    showEmptyState: boolean
    showRatingDistribution: boolean
    showAverageRating: boolean
    enableFiltering: boolean
    enableSorting: boolean
    showReviewCount: boolean
    showStarBreakdown: boolean
    enablePagination: boolean
    enableInfiniteScroll: boolean
    showLoadMoreButton: boolean
    showSearchBar: boolean
    showWriteReviewButton: boolean
    enablePhotoLightbox: boolean
    showReviewSummary: boolean
  }
  position: {
    location: 'below_description' | 'tab' | 'floating' | 'sidebar' | 'modal' | 'header' | 'footer'
    floatingPosition: 'bottom_right' | 'bottom_left' | 'top_right' | 'top_left' | 'center_right' | 'center_left'
    stickyHeader: boolean
    autoOpen: boolean
    triggerScroll: number
    showOnMobile: boolean
    showOnDesktop: boolean
    zIndex: number
  }
  responsive: {
    mobile: {
      columns: number
      fontSize: string
      spacing: string
      showPhotos: boolean
    }
    tablet: {
      columns: number
      fontSize: string
      spacing: string
      showPhotos: boolean
    }
    desktop: {
      columns: number
      fontSize: string
      spacing: string
      showPhotos: boolean
    }
  }
  advanced: {
    customCSS: string
    enableLazyLoading: boolean
    enableSEO: boolean
    enableAnalytics: boolean
    cacheTimeout: number
    maxImageSize: number
    enableModeration: boolean
    autoTranslate: boolean
    rtlSupport: boolean
    enableAMP: boolean
    loadingAnimation: 'spinner' | 'skeleton' | 'pulse' | 'none'
    errorHandling: 'hide' | 'show' | 'retry'
  }
}

const widgetTypes: WidgetType[] = [
  {
    id: 'product-reviews',
    name: 'Product Reviews Widget',
    description: 'Display reviews on product pages with full functionality',
    category: 'product',
    preview: 'product-reviews'
  },
  {
    id: 'product-summary',
    name: 'Product Rating Summary',
    description: 'Compact rating display with star breakdown',
    category: 'product',
    preview: 'product-summary'
  },
  {
    id: 'product-carousel',
    name: 'Review Carousel',
    description: 'Sliding carousel of featured reviews',
    category: 'product',
    preview: 'product-carousel'
  },
  {
    id: 'homepage-featured',
    name: 'Featured Reviews',
    description: 'Showcase top reviews on homepage',
    category: 'homepage',
    preview: 'homepage-featured'
  },
  {
    id: 'homepage-testimonials',
    name: 'Customer Testimonials',
    description: 'Elegant testimonial section for homepage',
    category: 'homepage',
    preview: 'homepage-testimonials'
  },
  {
    id: 'homepage-ugc-gallery',
    name: 'UGC Photo Gallery',
    description: 'Instagram-style photo grid from reviews',
    category: 'homepage',
    preview: 'homepage-ugc'
  },
  {
    id: 'collection-ratings',
    name: 'Collection Page Ratings',
    description: 'Show ratings on product collection pages',
    category: 'collection',
    preview: 'collection-ratings'
  },
  {
    id: 'floating-tab',
    name: 'Floating Review Tab',
    description: 'Sticky floating tab for easy access',
    category: 'floating',
    preview: 'floating-tab'
  },
  {
    id: 'floating-popup',
    name: 'Review Popup',
    description: 'Modal popup with review collection',
    category: 'floating',
    preview: 'floating-popup'
  }
]

const defaultConfig: WidgetConfig = {
  selectedWidget: 'product-reviews',
  theme: {
    primaryColor: '#00A96E',
    secondaryColor: '#5C6AC4',
    accentColor: '#F59E42',
    backgroundColor: '#FFFFFF',
    textColor: '#374151',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    borderRadius: '8px',
    shadowLevel: 'md',
    animation: 'fade',
    borderStyle: 'none',
    borderWidth: '1px'
  },
  layout: {
    style: 'grid',
    columns: 2,
    spacing: '16px',
    reviewsPerPage: 5,
    showPhotos: true,
    showVerifiedBadge: true,
    showDate: true,
    showHelpfulness: true,
    showReviewerAvatar: false,
    showProductInfo: true,
    compactMode: false,
    cardStyle: 'elevated'
  },
  display: {
    showEmptyState: true,
    showRatingDistribution: true,
    showAverageRating: true,
    enableFiltering: true,
    enableSorting: true,
    showReviewCount: true,
    showStarBreakdown: true,
    enablePagination: false,
    enableInfiniteScroll: true,
    showLoadMoreButton: true,
    showSearchBar: false,
    showWriteReviewButton: true,
    enablePhotoLightbox: true,
    showReviewSummary: true
  },
  position: {
    location: 'below_description',
    floatingPosition: 'bottom_right',
    stickyHeader: false,
    autoOpen: false,
    triggerScroll: 50,
    showOnMobile: true,
    showOnDesktop: true,
    zIndex: 1000
  },
  responsive: {
    mobile: {
      columns: 1,
      fontSize: '13px',
      spacing: '12px',
      showPhotos: true
    },
    tablet: {
      columns: 2,
      fontSize: '14px',
      spacing: '14px',
      showPhotos: true
    },
    desktop: {
      columns: 2,
      fontSize: '14px',
      spacing: '16px',
      showPhotos: true
    }
  },
  advanced: {
    customCSS: '',
    enableLazyLoading: true,
    enableSEO: true,
    enableAnalytics: true,
    cacheTimeout: 300,
    maxImageSize: 2048,
    enableModeration: true,
    autoTranslate: false,
    rtlSupport: false,
    enableAMP: false,
    loadingAnimation: 'skeleton',
    errorHandling: 'retry'
  }
}

export default function WidgetCustomization() {
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig)
  const [saving, setSaving] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  const updateConfig = (section: keyof WidgetConfig, updates: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    toast.success('Widget configuration saved!')
  }

  const generateEmbedCode = () => {
    const selectedWidget = widgetTypes.find(w => w.id === config.selectedWidget)
    return `<!-- TrustLoop ${selectedWidget?.name} -->\n<div id="trustloop-${config.selectedWidget}" data-product-id="{{product.id}}"></div>\n<script>\n  (function() {\n    var script = document.createElement('script');\n    script.src = 'https://cdn.trustloop.com/widget.js';\n    script.async = true;\n    script.onload = function() {\n      TrustLoop.init({\n        widgetType: '${config.selectedWidget}',\n        shopDomain: '${window.location.hostname}',\n        theme: ${JSON.stringify(config.theme, null, 2)},\n        layout: ${JSON.stringify(config.layout, null, 2)},\n        display: ${JSON.stringify(config.display, null, 2)},\n        position: ${JSON.stringify(config.position, null, 2)}\n      });\n    };\n    document.head.appendChild(script);\n  })();\n</script>`
  }

  const getPreviewDimensions = () => {
    switch (previewDevice) {
      case 'mobile': return { width: '375px', height: '600px' }
      case 'tablet': return { width: '768px', height: '600px' }
      default: return { width: '100%', height: '600px' }
    }
  }

  const renderWidgetPreview = () => {
    const selectedWidget = widgetTypes.find(w => w.id === config.selectedWidget)
    const dimensions = getPreviewDimensions()
    const responsiveConfig = config.responsive[previewDevice]

    const getCardStyle = () => {
      const baseStyle = {
        fontFamily: config.theme.fontFamily,
        fontSize: responsiveConfig.fontSize,
        borderRadius: config.theme.borderRadius,
        backgroundColor: config.theme.backgroundColor,
        color: config.theme.textColor
      }

      switch (config.layout.cardStyle) {
        case 'elevated':
          return { ...baseStyle, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
        case 'outlined':
          return { ...baseStyle, border: `${config.theme.borderWidth} ${config.theme.borderStyle} ${config.theme.primaryColor}` }
        case 'minimal':
          return { ...baseStyle, border: 'none', boxShadow: 'none' }
        default:
          return baseStyle
      }
    }

    if (selectedWidget?.category === 'homepage' && config.selectedWidget === 'homepage-featured') {
      return (
        <div style={{ width: dimensions.width, height: dimensions.height, overflow: 'auto' }}>
          <div className="p-6 bg-gray-50" style={{ fontFamily: config.theme.fontFamily }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: config.theme.textColor }}>
                What Our Customers Say
              </h2>
              <p className="text-gray-600">Real reviews from real customers</p>
            </div>
            
            <div className={`grid gap-${responsiveConfig.spacing} grid-cols-${responsiveConfig.columns}`}>
              {[1, 2, 3].map((review) => (
                <div key={review} className="p-6" style={getCardStyle()}>
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-5 w-5 fill-current"
                          style={{ color: config.theme.primaryColor }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mb-4" style={{ color: config.theme.textColor }}>
                    "This product exceeded my expectations. The quality is outstanding and shipping was fast!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium">Sarah Johnson</div>
                      <div className="text-sm text-gray-500">Verified Customer</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (selectedWidget?.category === 'homepage' && config.selectedWidget === 'homepage-ugc') {
      return (
        <div style={{ width: dimensions.width, height: dimensions.height, overflow: 'auto' }}>
          <div className="p-6" style={{ fontFamily: config.theme.fontFamily }}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: config.theme.textColor }}>
                Customer Photos
              </h2>
              <p className="text-gray-600">#YourBrandName</p>
            </div>
            
            <div className={`grid grid-cols-${Math.min(responsiveConfig.columns * 2, 4)} gap-2`}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (selectedWidget?.category === 'floating' && config.selectedWidget === 'floating-tab') {
      return (
        <div style={{ width: dimensions.width, height: dimensions.height, position: 'relative', overflow: 'hidden' }}>
          <div className="w-full h-full bg-gray-100 p-4">
            <div className="text-center text-gray-500">Your website content</div>
          </div>
          
          {/* Floating Tab */}
          <div 
            className="fixed flex items-center space-x-2 px-4 py-3 rounded-l-lg shadow-lg cursor-pointer"
            style={{
              backgroundColor: config.theme.primaryColor,
              color: '#ffffff',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: config.position.zIndex
            }}
          >
            <Star className="h-5 w-5 fill-current" />
            <span className="font-medium">Reviews</span>
            <Badge className="bg-white text-gray-900">4.8</Badge>
          </div>
        </div>
      )
    }

    // Default product reviews widget
    return (
      <div style={{ width: dimensions.width, height: dimensions.height, overflow: 'auto' }}>
        <div className="p-6" style={{ fontFamily: config.theme.fontFamily }}>
          {/* Rating Summary */}
          {config.display.showAverageRating && (
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold" style={{ color: config.theme.primaryColor }}>4.8</div>
                  <div className="flex justify-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-current"
                        style={{ color: config.theme.primaryColor }}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">Based on 127 reviews</div>
                </div>
                
                {config.display.showStarBreakdown && (
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2 text-sm">
                        <span className="w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              backgroundColor: config.theme.primaryColor,
                              width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : rating === 2 ? 2 : 0}%`
                            }}
                          />
                        </div>
                        <span className="w-8 text-gray-600">{rating === 5 ? 89 : rating === 4 ? 25 : rating === 3 ? 10 : rating === 2 ? 3 : 0}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {config.display.showWriteReviewButton && (
                <Button 
                  className="w-full mb-4"
                  style={{ 
                    backgroundColor: config.theme.primaryColor,
                    borderRadius: config.theme.borderRadius
                  }}
                >
                  Write a Review
                </Button>
              )}
            </div>
          )}

          {/* Filters */}
          {config.display.enableFiltering && (
            <div className="flex flex-wrap gap-2 mb-4">
              <select className="px-3 py-1 border rounded text-sm" style={{ borderRadius: config.theme.borderRadius }}>
                <option>All ratings</option>
                <option>5 stars</option>
                <option>4 stars</option>
              </select>
              {config.display.enableSorting && (
                <select className="px-3 py-1 border rounded text-sm" style={{ borderRadius: config.theme.borderRadius }}>
                  <option>Most recent</option>
                  <option>Most helpful</option>
                  <option>Highest rating</option>
                </select>
              )}
              {config.display.showSearchBar && (
                <Input placeholder="Search reviews..." className="flex-1 min-w-[200px]" />
              )}
            </div>
          )}

          {/* Reviews */}
          <div className={`space-y-4 ${config.layout.style === 'grid' ? `grid grid-cols-${responsiveConfig.columns} gap-${responsiveConfig.spacing}` : ''}`}>
            {[1, 2, 3].map((review) => (
              <div 
                key={review}
                className="p-4"
                style={getCardStyle()}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {config.layout.showReviewerAvatar && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    )}
                    <div>
                      <div className="font-medium text-sm">Sarah J.</div>
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-4 w-4 fill-current"
                              style={{ color: star <= 5 ? config.theme.primaryColor : '#e5e7eb' }}
                            />
                          ))}
                        </div>
                        {config.layout.showVerifiedBadge && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{ 
                              backgroundColor: `${config.theme.primaryColor}20`,
                              color: config.theme.primaryColor
                            }}
                          >
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {config.layout.showDate && (
                    <span className="text-sm text-gray-500">2 days ago</span>
                  )}
                </div>
                
                <p className="text-sm mb-3" style={{ color: config.theme.textColor }}>
                  {review === 1 
                    ? "Amazing product! The quality exceeded my expectations and shipping was incredibly fast."
                    : review === 2
                    ? "Great value for money. Would definitely recommend to others."
                    : "Perfect fit and excellent customer service. Very satisfied with my purchase."
                  }
                </p>
                
                {config.layout.showPhotos && responsiveConfig.showPhotos && review === 1 && (
                  <div className="flex space-x-2 mb-3">
                    <div className="w-16 h-16 bg-gray-200 rounded border"></div>
                    <div className="w-16 h-16 bg-gray-200 rounded border"></div>
                  </div>
                )}
                
                {config.layout.showHelpfulness && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Was this helpful?</span>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                        <span>👍</span>
                        <span>5</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                        <span>👎</span>
                        <span>0</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load More */}
          {config.display.showLoadMoreButton && (
            <div className="text-center mt-6">
              <Button 
                variant="outline"
                style={{ 
                  borderColor: config.theme.primaryColor,
                  color: config.theme.primaryColor,
                  borderRadius: config.theme.borderRadius
                }}
              >
                Load More Reviews
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Widget Customization Studio</h1>
          <p className="mt-2 text-gray-600">Create stunning, high-converting review displays with advanced customization</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview on Site
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Widget Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            Choose Widget Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="product" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="product">Product Page</TabsTrigger>
              <TabsTrigger value="homepage">Homepage</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
              <TabsTrigger value="floating">Floating</TabsTrigger>
            </TabsList>

            {['product', 'homepage', 'collection', 'floating'].map((category) => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {widgetTypes
                    .filter(widget => widget.category === category)
                    .map((widget) => (
                      <div
                        key={widget.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          config.selectedWidget === widget.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => updateConfig('selectedWidget', widget.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{widget.name}</h4>
                          {config.selectedWidget === widget.id && (
                            <Badge className="bg-green-500">Selected</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{widget.description}</p>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Widget Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="display">Display</TabsTrigger>
                <TabsTrigger value="position">Position</TabsTrigger>
                <TabsTrigger value="responsive">Responsive</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="theme" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={config.theme.primaryColor}
                        onChange={(e) => updateConfig('theme', { primaryColor: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={config.theme.primaryColor}
                        onChange={(e) => updateConfig('theme', { primaryColor: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={config.theme.secondaryColor}
                        onChange={(e) => updateConfig('theme', { secondaryColor: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={config.theme.secondaryColor}
                        onChange={(e) => updateConfig('theme', { secondaryColor: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={config.theme.backgroundColor}
                        onChange={(e) => updateConfig('theme', { backgroundColor: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={config.theme.backgroundColor}
                        onChange={(e) => updateConfig('theme', { backgroundColor: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Text Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={config.theme.textColor}
                        onChange={(e) => updateConfig('theme', { textColor: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={config.theme.textColor}
                        onChange={(e) => updateConfig('theme', { textColor: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Font Family</Label>
                  <Select
                    value={config.theme.fontFamily}
                    onValueChange={(value) => updateConfig('theme', { fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                      <SelectItem value="Helvetica, Arial, sans-serif">Helvetica</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                      <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Font Size</Label>
                    <Input
                      value={config.theme.fontSize}
                      onChange={(e) => updateConfig('theme', { fontSize: e.target.value })}
                      placeholder="14px"
                    />
                  </div>
                  <div>
                    <Label>Border Radius</Label>
                    <Input
                      value={config.theme.borderRadius}
                      onChange={(e) => updateConfig('theme', { borderRadius: e.target.value })}
                      placeholder="8px"
                    />
                  </div>
                  <div>
                    <Label>Shadow Level</Label>
                    <Select
                      value={config.theme.shadowLevel}
                      onValueChange={(value: any) => updateConfig('theme', { shadowLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                        <SelectItem value="xl">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Animation</Label>
                    <Select
                      value={config.theme.animation}
                      onValueChange={(value: any) => updateConfig('theme', { animation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="fade">Fade</SelectItem>
                        <SelectItem value="slide">Slide</SelectItem>
                        <SelectItem value="bounce">Bounce</SelectItem>
                        <SelectItem value="scale">Scale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Card Style</Label>
                    <Select
                      value={config.layout.cardStyle}
                      onValueChange={(value: any) => updateConfig('layout', { cardStyle: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">Flat</SelectItem>
                        <SelectItem value="elevated">Elevated</SelectItem>
                        <SelectItem value="outlined">Outlined</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Layout Style</Label>
                    <Select
                      value={config.layout.style}
                      onValueChange={(value: any) => updateConfig('layout', { style: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="masonry">Masonry</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Columns</Label>
                    <Input
                      type="number"
                      value={config.layout.columns}
                      onChange={(e) => updateConfig('layout', { columns: parseInt(e.target.value) })}
                      min="1"
                      max="4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Reviews Per Page</Label>
                    <Input
                      type="number"
                      value={config.layout.reviewsPerPage}
                      onChange={(e) => updateConfig('layout', { reviewsPerPage: parseInt(e.target.value) })}
                      min="1"
                      max="20"
                    />
                  </div>
                  <div>
                    <Label>Spacing</Label>
                    <Input
                      value={config.layout.spacing}
                      onChange={(e) => updateConfig('layout', { spacing: e.target.value })}
                      placeholder="16px"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Show Photos</Label>
                    <Switch
                      checked={config.layout.showPhotos}
                      onCheckedChange={(checked) => updateConfig('layout', { showPhotos: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Verified Badge</Label>
                    <Switch
                      checked={config.layout.showVerifiedBadge}
                      onCheckedChange={(checked) => updateConfig('layout', { showVerifiedBadge: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Date</Label>
                    <Switch
                      checked={config.layout.showDate}
                      onCheckedChange={(checked) => updateConfig('layout', { showDate: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Helpfulness</Label>
                    <Switch
                      checked={config.layout.showHelpfulness}
                      onCheckedChange={(checked) => updateConfig('layout', { showHelpfulness: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Reviewer Avatar</Label>
                    <Switch
                      checked={config.layout.showReviewerAvatar}
                      onCheckedChange={(checked) => updateConfig('layout', { showReviewerAvatar: checked })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="display" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Show Average Rating</Label>
                    <Switch
                      checked={config.display.showAverageRating}
                      onCheckedChange={(checked) => updateConfig('display', { showAverageRating: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Star Breakdown</Label>
                    <Switch
                      checked={config.display.showStarBreakdown}
                      onCheckedChange={(checked) => updateConfig('display', { showStarBreakdown: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Enable Filtering</Label>
                    <Switch
                      checked={config.display.enableFiltering}
                      onCheckedChange={(checked) => updateConfig('display', { enableFiltering: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Enable Sorting</Label>
                    <Switch
                      checked={config.display.enableSorting}
                      onCheckedChange={(checked) => updateConfig('display', { enableSorting: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Search Bar</Label>
                    <Switch
                      checked={config.display.showSearchBar}
                      onCheckedChange={(checked) => updateConfig('display', { showSearchBar: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Write Review Button</Label>
                    <Switch
                      checked={config.display.showWriteReviewButton}
                      onCheckedChange={(checked) => updateConfig('display', { showWriteReviewButton: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Enable Photo Lightbox</Label>
                    <Switch
                      checked={config.display.enablePhotoLightbox}
                      onCheckedChange={(checked) => updateConfig('display', { enablePhotoLightbox: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Load More Button</Label>
                    <Switch
                      checked={config.display.showLoadMoreButton}
                      onCheckedChange={(checked) => updateConfig('display', { showLoadMoreButton: checked })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="position" className="space-y-4">
                <div>
                  <Label>Widget Location</Label>
                  <Select
                    value={config.position.location}
                    onValueChange={(value: any) => updateConfig('position', { location: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below_description">Below Product Description</SelectItem>
                      <SelectItem value="tab">In Product Tabs</SelectItem>
                      <SelectItem value="floating">Floating Widget</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="modal">Modal Popup</SelectItem>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.position.location === 'floating' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Floating Position</Label>
                      <Select
                        value={config.position.floatingPosition}
                        onValueChange={(value: any) => updateConfig('position', { floatingPosition: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom_right">Bottom Right</SelectItem>
                          <SelectItem value="bottom_left">Bottom Left</SelectItem>
                          <SelectItem value="top_right">Top Right</SelectItem>
                          <SelectItem value="top_left">Top Left</SelectItem>
                          <SelectItem value="center_right">Center Right</SelectItem>
                          <SelectItem value="center_left">Center Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Z-Index</Label>
                      <Input
                        type="number"
                        value={config.position.zIndex}
                        onChange={(e) => updateConfig('position', { zIndex: parseInt(e.target.value) })}
                        min="1"
                        max="9999"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Show on Mobile</Label>
                    <Switch
                      checked={config.position.showOnMobile}
                      onCheckedChange={(checked) => updateConfig('position', { showOnMobile: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show on Desktop</Label>
                    <Switch
                      checked={config.position.showOnDesktop}
                      onCheckedChange={(checked) => updateConfig('position', { showOnDesktop: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Sticky Header</Label>
                    <Switch
                      checked={config.position.stickyHeader}
                      onCheckedChange={(checked) => updateConfig('position', { stickyHeader: checked })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="responsive" className="space-y-4">
                <div className="space-y-6">
                  {(['mobile', 'tablet', 'desktop'] as const).map((device) => (
                    <div key={device} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3 capitalize flex items-center">
                        {device === 'mobile' && <Smartphone className="h-4 w-4 mr-2" />}
                        {device === 'tablet' && <Tablet className="h-4 w-4 mr-2" />}
                        {device === 'desktop' && <Monitor className="h-4 w-4 mr-2" />}
                        {device} Settings
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Columns</Label>
                          <Input
                            type="number"
                            value={config.responsive[device].columns}
                            onChange={(e) => updateConfig('responsive', {
                              [device]: { ...config.responsive[device], columns: parseInt(e.target.value) }
                            })}
                            min="1"
                            max="4"
                          />
                        </div>
                        <div>
                          <Label>Font Size</Label>
                          <Input
                            value={config.responsive[device].fontSize}
                            onChange={(e) => updateConfig('responsive', {
                              [device]: { ...config.responsive[device], fontSize: e.target.value }
                            })}
                            placeholder="14px"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label>Spacing</Label>
                          <Input
                            value={config.responsive[device].spacing}
                            onChange={(e) => updateConfig('responsive', {
                              [device]: { ...config.responsive[device], spacing: e.target.value }
                            })}
                            placeholder="16px"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Show Photos</Label>
                          <Switch
                            checked={config.responsive[device].showPhotos}
                            onCheckedChange={(checked) => updateConfig('responsive', {
                              [device]: { ...config.responsive[device], showPhotos: checked }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Enable Lazy Loading</Label>
                    <Switch
                      checked={config.advanced.enableLazyLoading}
                      onCheckedChange={(checked) => updateConfig('advanced', { enableLazyLoading: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Enable SEO Schema</Label>
                    <Switch
                      checked={config.advanced.enableSEO}
                      onCheckedChange={(checked) => updateConfig('advanced', { enableSEO: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Enable Analytics</Label>
                    <Switch
                      checked={config.advanced.enableAnalytics}
                      onCheckedChange={(checked) => updateConfig('advanced', { enableAnalytics: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Auto Translate</Label>
                    <Switch
                      checked={config.advanced.autoTranslate}
                      onCheckedChange={(checked) => updateConfig('advanced', { autoTranslate: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>RTL Support</Label>
                    <Switch
                      checked={config.advanced.rtlSupport}
                      onCheckedChange={(checked) => updateConfig('advanced', { rtlSupport: checked })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cache Timeout (seconds)</Label>
                    <Input
                      type="number"
                      value={config.advanced.cacheTimeout}
                      onChange={(e) => updateConfig('advanced', { cacheTimeout: parseInt(e.target.value) })}
                      min="60"
                      max="3600"
                    />
                  </div>
                  <div>
                    <Label>Max Image Size (KB)</Label>
                    <Input
                      type="number"
                      value={config.advanced.maxImageSize}
                      onChange={(e) => updateConfig('advanced', { maxImageSize: parseInt(e.target.value) })}
                      min="500"
                      max="5000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Loading Animation</Label>
                    <Select
                      value={config.advanced.loadingAnimation}
                      onValueChange={(value: any) => updateConfig('advanced', { loadingAnimation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spinner">Spinner</SelectItem>
                        <SelectItem value="skeleton">Skeleton</SelectItem>
                        <SelectItem value="pulse">Pulse</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Error Handling</Label>
                    <Select
                      value={config.advanced.errorHandling}
                      onValueChange={(value: any) => updateConfig('advanced', { errorHandling: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hide">Hide Widget</SelectItem>
                        <SelectItem value="show">Show Error</SelectItem>
                        <SelectItem value="retry">Show Retry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="custom-css">Custom CSS</Label>
                  <Textarea
                    id="custom-css"
                    value={config.advanced.customCSS}
                    onChange={(e) => updateConfig('advanced', { customCSS: e.target.value })}
                    placeholder=".trustloop-widget { /* Your custom styles */ }"
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Live Preview
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              {renderWidgetPreview()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Widget Installation */}
      <AutoWidgetInstaller />
      <WidgetInstaller />

      {/* Embed Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Embed Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Copy and paste this code into your theme where you want the widget to appear.
          </p>
          <Textarea
            value={generateEmbedCode()}
            readOnly
            rows={15}
            className="font-mono text-sm"
          />
          <Button 
            className="mt-4"
            onClick={() => {
              navigator.clipboard.writeText(generateEmbedCode())
              toast.success('Embed code copied to clipboard!')
            }}
          >
            Copy Code
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}