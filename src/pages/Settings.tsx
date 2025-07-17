import { useState } from 'react'
import { Save, Store, Mail, Palette, Shield, Globe, Zap, Bell, Users, BarChart3, Lock } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { toast } from 'react-hot-toast'

export default function Settings() {
  const { settings, loading, updateSettings } = useSettings()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    toast.success('Settings saved successfully!')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Configure your review collection and display preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general" className="flex items-center">
            <Store className="h-4 w-4 mr-1" />
            General
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center">
            <Palette className="h-4 w-4 mr-1" />
            Display
          </TabsTrigger>
          <TabsTrigger value="collection" className="flex items-center">
            <Mail className="h-4 w-4 mr-1" />
            Collection
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center">
            <Zap className="h-4 w-4 mr-1" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center">
            <Globe className="h-4 w-4 mr-1" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center">
            <Lock className="h-4 w-4 mr-1" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2" />
                Store Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shop-domain">Shop Domain</Label>
                  <Input
                    id="shop-domain"
                    value={settings.shop_domain}
                    onChange={(e) => updateSettings({ shop_domain: e.target.value })}
                    placeholder="your-store.myshopify.com"
                  />
                </div>
                <div>
                  <Label htmlFor="shop-name">Shop Name</Label>
                  <Input
                    id="shop-name"
                    value="Your Store"
                    placeholder="Your Store Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-publish Reviews</Label>
                    <p className="text-sm text-gray-600">
                      Automatically approve and publish new reviews without manual moderation
                    </p>
                  </div>
                  <Switch
                    checked={settings.auto_publish}
                    onCheckedChange={(checked) => updateSettings({ auto_publish: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Review Request Emails</Label>
                    <p className="text-sm text-gray-600">
                      Automatically send review request emails after delivery
                    </p>
                  </div>
                  <Switch
                    checked={settings.review_request.enabled}
                    onCheckedChange={(checked) => updateSettings({ 
                      review_request: { ...settings.review_request, enabled: checked }
                    })}
                  />
                </div>
              </div>

              {settings.review_request.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="days-after-delivery">Days after delivery</Label>
                    <Input
                      id="days-after-delivery"
                      type="number"
                      value={settings.review_request.days_after_delivery}
                      onChange={(e) => updateSettings({
                        review_request: { 
                          ...settings.review_request, 
                          days_after_delivery: parseInt(e.target.value) || 7 
                        }
                      })}
                      min="1"
                      max="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="follow-up-days">Follow-up after (days)</Label>
                    <Input
                      id="follow-up-days"
                      type="number"
                      value="14"
                      min="1"
                      max="60"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-reminders">Max reminders</Label>
                    <Input
                      id="max-reminders"
                      type="number"
                      value="2"
                      min="1"
                      max="5"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Customer Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Purchase Verification</Label>
                    <p className="text-sm text-gray-600">
                      Only allow reviews from verified purchasers
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Anonymous Reviews</Label>
                    <p className="text-sm text-gray-600">
                      Let customers submit reviews without providing their name
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Review Voting</Label>
                    <p className="text-sm text-gray-600">
                      Allow customers to vote on review helpfulness
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Reviewer Location</Label>
                    <p className="text-sm text-gray-600">
                      Display customer's country/region with reviews
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div>
                <Label htmlFor="review-guidelines">Review Guidelines</Label>
                <Textarea
                  id="review-guidelines"
                  placeholder="Enter guidelines that customers will see when submitting reviews..."
                  rows={3}
                  defaultValue="Please be honest and constructive in your review. Focus on the product quality, shipping experience, and overall satisfaction."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Widget Theme & Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={settings.widget_theme.primary_color}
                      onChange={(e) => updateSettings({
                        widget_theme: { ...settings.widget_theme, primary_color: e.target.value }
                      })}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.widget_theme.primary_color}
                      onChange={(e) => updateSettings({
                        widget_theme: { ...settings.widget_theme, primary_color: e.target.value }
                      })}
                      placeholder="#00A96E"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={settings.widget_theme.secondary_color}
                      onChange={(e) => updateSettings({
                        widget_theme: { ...settings.widget_theme, secondary_color: e.target.value }
                      })}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.widget_theme.secondary_color}
                      onChange={(e) => updateSettings({
                        widget_theme: { ...settings.widget_theme, secondary_color: e.target.value }
                      })}
                      placeholder="#5C6AC4"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value="#F59E42"
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value="#F59E42"
                      placeholder="#F59E42"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select
                    value={settings.widget_theme.font_family}
                    onValueChange={(value) => updateSettings({
                      widget_theme: { ...settings.widget_theme, font_family: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="layout">Layout Style</Label>
                  <Select
                    value={settings.widget_theme.layout}
                    onValueChange={(value: 'grid' | 'list' | 'compact') => updateSettings({
                      widget_theme: { ...settings.widget_theme, layout: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Display Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Show customer photos</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Show verified badges</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Show review dates</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Show star breakdown</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Widget Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Enable filtering</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable sorting</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable pagination</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Show empty state</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Widget Preview</h4>
                <div 
                  className="border rounded-lg p-4 bg-white"
                  style={{ 
                    fontFamily: settings.widget_theme.font_family,
                    borderColor: settings.widget_theme.primary_color 
                  }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="h-4 w-4 fill-current"
                          style={{ color: star <= 4 ? settings.widget_theme.primary_color : '#e5e7eb' }}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.0 out of 5</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    "Great product! Really happy with my purchase."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">- John D.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collection Settings */}
        <TabsContent value="collection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Review Collection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Collection Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Email requests</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>SMS requests</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>On-site popups</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>QR codes in packaging</Label>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Media Collection</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Allow photo uploads</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Allow video uploads</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require media for incentives</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Auto-resize images</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="max-photos">Max photos per review</Label>
                  <Input
                    id="max-photos"
                    type="number"
                    defaultValue="5"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <Label htmlFor="max-video-size">Max video size (MB)</Label>
                  <Input
                    id="max-video-size"
                    type="number"
                    defaultValue="50"
                    min="10"
                    max="200"
                  />
                </div>
                <div>
                  <Label htmlFor="min-review-length">Min review length (chars)</Label>
                  <Input
                    id="min-review-length"
                    type="number"
                    defaultValue="20"
                    min="0"
                    max="500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="custom-fields">Custom Review Fields</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Add custom questions to your review form (one per line)
                </p>
                <Textarea
                  id="custom-fields"
                  placeholder="How would you rate the fit?&#10;Would you recommend this to a friend?&#10;What's your favorite feature?"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incentives & Rewards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Offer review incentives</Label>
                    <Switch defaultChecked />
                  </div>
                  
                  <div>
                    <Label>Incentive Type</Label>
                    <Select defaultValue="discount">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discount">Discount Code</SelectItem>
                        <SelectItem value="points">Loyalty Points</SelectItem>
                        <SelectItem value="free_shipping">Free Shipping</SelectItem>
                        <SelectItem value="gift_card">Gift Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Text Review Reward</Label>
                      <Input defaultValue="5%" placeholder="5% or $5" />
                    </div>
                    <div>
                      <Label>Photo Review Reward</Label>
                      <Input defaultValue="10%" placeholder="10% or $10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Video Review Reward</Label>
                    <Input defaultValue="15%" placeholder="15% or $15" />
                  </div>

                  <div>
                    <Label>Reward Expiry (days)</Label>
                    <Input type="number" defaultValue="30" min="1" max="365" />
                  </div>

                  <div>
                    <Label>Minimum Order for Reward</Label>
                    <Input defaultValue="$50" placeholder="$50" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>One reward per customer</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Moderation Settings */}
        <TabsContent value="moderation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Content Moderation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Profanity Filter</Label>
                      <p className="text-sm text-gray-600">
                        Automatically filter out inappropriate language
                      </p>
                    </div>
                    <Switch
                      checked={settings.moderation.profanity_filter}
                      onCheckedChange={(checked) => updateSettings({
                        moderation: { ...settings.moderation, profanity_filter: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>AI Spam Detection</Label>
                      <p className="text-sm text-gray-600">
                        Use AI to detect and flag potential spam reviews
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Photo Approval</Label>
                      <p className="text-sm text-gray-600">
                        Manually approve all photo uploads
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="min-rating">Minimum rating for auto-publish</Label>
                    <Select
                      value={settings.moderation.min_rating_auto_publish.toString()}
                      onValueChange={(value) => updateSettings({
                        moderation: { 
                          ...settings.moderation, 
                          min_rating_auto_publish: parseInt(value) 
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 star and above</SelectItem>
                        <SelectItem value="2">2 stars and above</SelectItem>
                        <SelectItem value="3">3 stars and above</SelectItem>
                        <SelectItem value="4">4 stars and above</SelectItem>
                        <SelectItem value="5">5 stars only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="review-delay">Review publication delay (hours)</Label>
                    <Input
                      id="review-delay"
                      type="number"
                      defaultValue="0"
                      min="0"
                      max="72"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notification-emails">Moderation notification emails</Label>
                    <Input
                      id="notification-emails"
                      placeholder="admin@yourstore.com, manager@yourstore.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="blocked-words">Blocked Words/Phrases</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Reviews containing these words will be flagged for manual review (one per line)
                </p>
                <Textarea
                  id="blocked-words"
                  placeholder="competitor name&#10;inappropriate word&#10;spam phrase"
                  rows={4}
                />
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Moderation Queue</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-700">12</div>
                    <div className="text-yellow-600">Pending Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-700">3</div>
                    <div className="text-yellow-600">Flagged Photos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-700">1</div>
                    <div className="text-yellow-600">Spam Detected</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Settings */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Automation Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border">
                  <div>
                    <div className="font-medium">Auto-send review requests</div>
                    <div className="text-sm text-gray-600">Send email 7 days after delivery</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Active</Badge>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border">
                  <div>
                    <div className="font-medium">Follow-up reminders</div>
                    <div className="text-sm text-gray-600">Send reminder if no review after 14 days</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Active</Badge>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border">
                  <div>
                    <div className="font-medium">Thank you emails</div>
                    <div className="text-sm text-gray-600">Send thank you with discount after review</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Active</Badge>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border">
                  <div>
                    <div className="font-medium">Photo review incentives</div>
                    <div className="text-sm text-gray-600">Extra reward for reviews with photos</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Inactive</Badge>
                    <Switch />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div>
                    <div className="font-medium">VIP customer flow</div>
                    <div className="text-sm text-gray-600">Special treatment for repeat customers</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Inactive</Badge>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email send time</Label>
                  <Input type="time" defaultValue="10:00" />
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select defaultValue="America/New_York">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Third-party Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">Klaviyo</div>
                        <div className="text-sm text-gray-600">Email marketing sync</div>
                      </div>
                    </div>
                    <Switch
                      checked={settings.integrations.klaviyo_enabled}
                      onCheckedChange={(checked) => updateSettings({
                        integrations: { ...settings.integrations, klaviyo_enabled: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Google Analytics</div>
                        <div className="text-sm text-gray-600">Track review interactions</div>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Store className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Google Shopping</div>
                        <div className="text-sm text-gray-600">Include reviews in product feed</div>
                      </div>
                    </div>
                    <Switch
                      checked={settings.integrations.google_shopping_enabled}
                      onCheckedChange={(checked) => updateSettings({
                        integrations: { ...settings.integrations, google_shopping_enabled: checked }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Bell className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium">Slack</div>
                        <div className="text-sm text-gray-600">Review notifications</div>
                      </div>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-medium">Zendesk</div>
                        <div className="text-sm text-gray-600">Customer support integration</div>
                      </div>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-medium">Zapier</div>
                        <div className="text-sm text-gray-600">Connect to 3000+ apps</div>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Advanced Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Performance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Enable lazy loading</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Cache reviews</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Compress images</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div>
                    <Label>Cache duration (minutes)</Label>
                    <Input type="number" defaultValue="30" min="5" max="1440" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">SEO & Schema</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Include schema markup</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Generate sitemap</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Meta descriptions</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div>
                    <Label>Reviews per sitemap</Label>
                    <Input type="number" defaultValue="1000" min="100" max="5000" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="custom-css">Custom CSS</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Add custom CSS to override widget styles
                </p>
                <Textarea
                  id="custom-css"
                  placeholder=".trustloop-widget { /* Your custom styles */ }"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>API Rate Limit (requests/minute)</Label>
                  <Input type="number" defaultValue="100" min="10" max="1000" />
                </div>
                <div>
                  <Label>Webhook Timeout (seconds)</Label>
                  <Input type="number" defaultValue="30" min="5" max="120" />
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Export All Data
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Reset All Settings
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Delete All Reviews
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}