import { useState } from 'react'
import { Mail, Send, Eye, Save, Plus, Copy, Trash2, Edit3, Palette, Settings, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Switch } from '../components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { toast } from 'react-hot-toast'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  type: 'review_request' | 'follow_up' | 'thank_you' | 'reminder' | 'incentive'
  is_active: boolean
  trigger_days?: number
  incentive_type?: 'discount' | 'points' | 'free_shipping'
  incentive_value?: string
  created_at: string
  last_modified: string
}

interface EmailSettings {
  sender_name: string
  sender_email: string
  reply_to: string
  auto_send: boolean
  send_time: string
  timezone: string
  frequency_cap: number
  unsubscribe_link: boolean
  tracking_enabled: boolean
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Initial Review Request',
    subject: 'How was your recent purchase from {{shop_name}}?',
    type: 'review_request',
    is_active: true,
    trigger_days: 7,
    created_at: '2024-01-15',
    last_modified: '2024-01-15',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Review Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #00A96E 0%, #00C878 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Thank you for your purchase!</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">We'd love to hear about your experience</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 20px 0;">Hi {{customer_name}},</p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 20px 0;">
        We hope you're absolutely loving your recent purchase of <strong style="color: #00A96E;">{{product_name}}</strong>!
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 30px 0;">
        Your feedback means the world to us and helps other customers make informed decisions. Would you mind taking just 2 minutes to share your experience?
      </p>
      
      <!-- Product Info -->
      <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 30px 0; border-left: 4px solid #00A96E;">
        <div style="display: flex; align-items: center;">
          <img src="{{product_image}}" alt="{{product_name}}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 20px;">
          <div>
            <h3 style="margin: 0 0 5px 0; color: #111827; font-size: 18px;">{{product_name}}</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Order #{{order_number}}</p>
          </div>
        </div>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="{{review_link}}" style="background: linear-gradient(135deg, #00A96E 0%, #00C878 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0, 169, 110, 0.3); transition: all 0.3s ease;">
          ⭐ Write Your Review
        </a>
      </div>
      
      <!-- Incentive -->
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
        <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 18px;">🎁 Thank You Gift</h3>
        <p style="margin: 0 0 15px 0; color: #92400e; font-size: 16px;">
          As a thank you for your time, we'll send you a <strong>10% discount code</strong> for your next purchase!
        </p>
        <p style="margin: 0; color: #92400e; font-size: 14px; opacity: 0.8;">
          The discount will be emailed to you after your review is submitted
        </p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 30px 0 0 0;">
        Thank you for choosing {{shop_name}}. We truly appreciate your business!
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 20px 0 0 0;">
        Best regards,<br>
        <strong>The {{shop_name}} Team</strong>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
        © 2024 {{shop_name}}. All rights reserved.
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        <a href="{{unsubscribe_link}}" style="color: #9ca3af; text-decoration: none;">Unsubscribe</a> | 
        <a href="{{privacy_policy}}" style="color: #9ca3af; text-decoration: none;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
    `
  },
  {
    id: '2',
    name: 'Follow-up Reminder',
    subject: 'Quick reminder: Share your {{product_name}} experience',
    type: 'follow_up',
    is_active: true,
    trigger_days: 14,
    created_at: '2024-01-15',
    last_modified: '2024-01-15',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Review Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #5C6AC4 0%, #6366F1 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">We'd love your feedback!</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 20px 0;">Hi {{customer_name}},</p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 20px 0;">
        We noticed you haven't had a chance to review your recent purchase of <strong style="color: #5C6AC4;">{{product_name}}</strong> yet.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 30px 0;">
        Your opinion matters to us and helps other customers make better decisions. It only takes a minute!
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="{{review_link}}" style="background: linear-gradient(135deg, #5C6AC4 0%, #6366F1 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(92, 106, 196, 0.3);">
          Leave a Review
        </a>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 30px 0 0 0;">
        Thank you for choosing {{shop_name}}!
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 20px 0 0 0;">
        Best regards,<br>
        <strong>The {{shop_name}} Team</strong>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        <a href="{{unsubscribe_link}}" style="color: #9ca3af; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
    `
  },
  {
    id: '3',
    name: 'Thank You with Discount',
    subject: 'Thank you for your review! Here\'s your 10% discount 🎁',
    type: 'thank_you',
    is_active: true,
    incentive_type: 'discount',
    incentive_value: '10%',
    created_at: '2024-01-15',
    last_modified: '2024-01-15',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #F59E42 0%, #F97316 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🎉 Thank you for your review!</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 20px 0;">Hi {{customer_name}},</p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 20px 0;">
        Thank you so much for taking the time to review <strong style="color: #F59E42;">{{product_name}}</strong>!
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 30px 0;">
        Your feedback helps us improve our products and helps other customers make informed decisions.
      </p>
      
      <!-- Discount Code -->
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px dashed #F59E42; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
        <h2 style="margin: 0 0 10px 0; color: #92400e; font-size: 24px; font-weight: 700;">{{discount_code}}</h2>
        <p style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600;">10% OFF Your Next Purchase</p>
        <p style="margin: 0; color: #92400e; font-size: 14px;">Valid for 30 days • Minimum order $50</p>
        
        <div style="margin-top: 20px;">
          <a href="{{shop_url}}" style="background: #F59E42; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px;">
            Shop Now
          </a>
        </div>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 30px 0 0 0;">
        We appreciate your business and look forward to serving you again!
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 20px 0 0 0;">
        Best regards,<br>
        <strong>The {{shop_name}} Team</strong>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        © 2024 {{shop_name}}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `
  }
]

const defaultSettings: EmailSettings = {
  sender_name: 'Your Store',
  sender_email: 'reviews@yourstore.com',
  reply_to: 'support@yourstore.com',
  auto_send: true,
  send_time: '10:00',
  timezone: 'America/New_York',
  frequency_cap: 3,
  unsubscribe_link: true,
  tracking_enabled: true
}

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(templates[0])
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(defaultSettings)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('templates')

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    toast.success('Templates and settings saved successfully!')
  }

  const handleSendTest = async () => {
    toast.success('Test email sent to your email address!')
  }

  const updateTemplate = (updates: Partial<EmailTemplate>) => {
    const updatedTemplate = { ...selectedTemplate, ...updates, last_modified: new Date().toISOString().split('T')[0] }
    setSelectedTemplate(updatedTemplate)
    setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t))
  }

  const duplicateTemplate = (template: EmailTemplate) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      created_at: new Date().toISOString().split('T')[0],
      last_modified: new Date().toISOString().split('T')[0]
    }
    setTemplates(prev => [...prev, newTemplate])
    toast.success('Template duplicated successfully!')
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId))
    if (selectedTemplate.id === templateId) {
      setSelectedTemplate(templates[0])
    }
    toast.success('Template deleted successfully!')
  }

  const getPreviewHtml = () => {
    return selectedTemplate.html
      .replace(/{{customer_name}}/g, 'John Doe')
      .replace(/{{product_name}}/g, 'Premium Wireless Headphones')
      .replace(/{{shop_name}}/g, 'Your Store')
      .replace(/{{order_number}}/g, '#1001')
      .replace(/{{discount_code}}/g, 'REVIEW10')
      .replace(/{{review_link}}/g, '#')
      .replace(/{{shop_url}}/g, '#')
      .replace(/{{unsubscribe_link}}/g, '#')
      .replace(/{{privacy_policy}}/g, '#')
      .replace(/{{product_image}}/g, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Templates & Automation</h1>
          <p className="mt-2 text-gray-600">Create beautiful, high-converting email campaigns</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Email Preview: {selectedTemplate.name}</DialogTitle>
              </DialogHeader>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="mb-4 p-3 bg-white rounded border">
                  <strong>Subject:</strong> {selectedTemplate.subject}
                </div>
                <div 
                  className="bg-white rounded border"
                  dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                />
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleSendTest}>
            <Send className="h-4 w-4 mr-2" />
            Send Test
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Template List */}
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">Templates</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`relative group border rounded-lg transition-colors ${
                        selectedTemplate.id === template.id
                          ? 'bg-green-50 border-green-200'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="w-full text-left p-3"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium text-sm">{template.name}</div>
                          <div className="flex items-center space-x-1">
                            {template.is_active && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {template.type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          Modified: {template.last_modified}
                        </div>
                      </button>
                      
                      {/* Action buttons */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              duplicateTemplate(template)
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteTemplate(template.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Template Editor */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Edit3 className="h-5 w-5 mr-2" />
                    {selectedTemplate.name}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={selectedTemplate.is_active}
                      onCheckedChange={(checked) => updateTemplate({ is_active: checked })}
                    />
                    <Label className="text-sm">Active</Label>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="editor" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="editor" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                          id="template-name"
                          value={selectedTemplate.name}
                          onChange={(e) => updateTemplate({ name: e.target.value })}
                          placeholder="Enter template name..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-type">Template Type</Label>
                        <Select
                          value={selectedTemplate.type}
                          onValueChange={(value: EmailTemplate['type']) => updateTemplate({ type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="review_request">Review Request</SelectItem>
                            <SelectItem value="follow_up">Follow-up Reminder</SelectItem>
                            <SelectItem value="thank_you">Thank You</SelectItem>
                            <SelectItem value="reminder">Reminder</SelectItem>
                            <SelectItem value="incentive">Incentive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Email Subject</Label>
                      <Input
                        id="subject"
                        value={selectedTemplate.subject}
                        onChange={(e) => updateTemplate({ subject: e.target.value })}
                        placeholder="Enter email subject..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="html-content">HTML Content</Label>
                      <p className="text-sm text-gray-600 mb-2">
                        Available variables: {{customer_name}}, {{product_name}}, {{shop_name}}, {{order_number}}, {{review_link}}, {{discount_code}}
                      </p>
                      <Textarea
                        id="html-content"
                        value={selectedTemplate.html}
                        onChange={(e) => updateTemplate({ html: e.target.value })}
                        rows={20}
                        className="font-mono text-sm"
                        placeholder="Enter HTML content..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="design" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Color Scheme</h4>
                        <div className="space-y-3">
                          <div>
                            <Label>Primary Color</Label>
                            <div className="flex items-center space-x-2">
                              <Input type="color" value="#00A96E" className="w-12 h-10 p-1" />
                              <Input value="#00A96E" placeholder="#00A96E" />
                            </div>
                          </div>
                          <div>
                            <Label>Secondary Color</Label>
                            <div className="flex items-center space-x-2">
                              <Input type="color" value="#5C6AC4" className="w-12 h-10 p-1" />
                              <Input value="#5C6AC4" placeholder="#5C6AC4" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Typography</h4>
                        <div className="space-y-3">
                          <div>
                            <Label>Font Family</Label>
                            <Select defaultValue="inter">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="inter">Inter</SelectItem>
                                <SelectItem value="helvetica">Helvetica</SelectItem>
                                <SelectItem value="arial">Arial</SelectItem>
                                <SelectItem value="georgia">Georgia</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Header Style</Label>
                            <Select defaultValue="gradient">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gradient">Gradient</SelectItem>
                                <SelectItem value="solid">Solid Color</SelectItem>
                                <SelectItem value="minimal">Minimal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4">
                    {selectedTemplate.type === 'review_request' && (
                      <div>
                        <Label htmlFor="trigger-days">Send after delivery (days)</Label>
                        <Input
                          id="trigger-days"
                          type="number"
                          value={selectedTemplate.trigger_days || 7}
                          onChange={(e) => updateTemplate({ trigger_days: parseInt(e.target.value) })}
                          min="1"
                          max="30"
                        />
                      </div>
                    )}

                    {selectedTemplate.type === 'thank_you' && (
                      <div className="space-y-4">
                        <div>
                          <Label>Incentive Type</Label>
                          <Select
                            value={selectedTemplate.incentive_type || 'discount'}
                            onValueChange={(value: 'discount' | 'points' | 'free_shipping') => 
                              updateTemplate({ incentive_type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="discount">Discount Code</SelectItem>
                              <SelectItem value="points">Loyalty Points</SelectItem>
                              <SelectItem value="free_shipping">Free Shipping</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Incentive Value</Label>
                          <Input
                            value={selectedTemplate.incentive_value || '10%'}
                            onChange={(e) => updateTemplate({ incentive_value: e.target.value })}
                            placeholder="10% or $10"
                          />
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Template Variables</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                        <div><code>{{customer_name}}</code> - Customer's name</div>
                        <div><code>{{product_name}}</code> - Product title</div>
                        <div><code>{{shop_name}}</code> - Your shop name</div>
                        <div><code>{{order_number}}</code> - Order number</div>
                        <div><code>{{review_link}}</code> - Link to review form</div>
                        <div><code>{{discount_code}}</code> - Generated discount code</div>
                        <div><code>{{product_image}}</code> - Product image URL</div>
                        <div><code>{{shop_url}}</code> - Your shop URL</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Automation Workflows</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2 border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Review Request Flow</h4>
                      <Switch defaultChecked />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Automatically send review requests after delivery
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Day 7:</span>
                        <span>Initial Request</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Day 14:</span>
                        <span>Follow-up</span>
                      </div>
                      <div className="flex justify-between">
                        <span>After Review:</span>
                        <span>Thank You + Discount</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Incentive Campaign</h4>
                      <Switch />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Offer rewards for photo/video reviews
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Text Review:</span>
                        <span>5% Discount</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Photo Review:</span>
                        <span>10% Discount</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Video Review:</span>
                        <span>15% Discount</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">VIP Customer Flow</h4>
                      <Switch />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Special treatment for repeat customers
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Trigger:</span>
                        <span>3+ Orders</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Template:</span>
                        <span>VIP Request</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reward:</span>
                        <span>20% Discount</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Automation Rules</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-sm">Send review request after delivery</div>
                      <div className="text-xs text-gray-600">Trigger: Order status = delivered + 7 days</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-sm">Follow-up for non-responders</div>
                      <div className="text-xs text-gray-600">Trigger: No review after 14 days</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-sm">Thank you email with discount</div>
                      <div className="text-xs text-gray-600">Trigger: Review submitted</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sender-name">Sender Name</Label>
                    <Input
                      id="sender-name"
                      value={emailSettings.sender_name}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, sender_name: e.target.value }))}
                      placeholder="Your Store"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sender-email">Sender Email</Label>
                    <Input
                      id="sender-email"
                      type="email"
                      value={emailSettings.sender_email}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, sender_email: e.target.value }))}
                      placeholder="reviews@yourstore.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reply-to">Reply-To Email</Label>
                    <Input
                      id="reply-to"
                      type="email"
                      value={emailSettings.reply_to}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, reply_to: e.target.value }))}
                      placeholder="support@yourstore.com"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="send-time">Preferred Send Time</Label>
                    <Input
                      id="send-time"
                      type="time"
                      value={emailSettings.send_time}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, send_time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={emailSettings.timezone}
                      onValueChange={(value) => setEmailSettings(prev => ({ ...prev, timezone: value }))}
                    >
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
                  <div>
                    <Label htmlFor="frequency-cap">Max emails per customer (per month)</Label>
                    <Input
                      id="frequency-cap"
                      type="number"
                      value={emailSettings.frequency_cap}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, frequency_cap: parseInt(e.target.value) }))}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-send emails</Label>
                    <p className="text-sm text-gray-600">Automatically send emails based on triggers</p>
                  </div>
                  <Switch
                    checked={emailSettings.auto_send}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, auto_send: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Include unsubscribe link</Label>
                    <p className="text-sm text-gray-600">Required for compliance</p>
                  </div>
                  <Switch
                    checked={emailSettings.unsubscribe_link}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, unsubscribe_link: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email tracking</Label>
                    <p className="text-sm text-gray-600">Track opens and clicks</p>
                  </div>
                  <Switch
                    checked={emailSettings.tracking_enabled}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, tracking_enabled: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}