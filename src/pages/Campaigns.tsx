import { useState } from 'react'
import { Send, Calendar, Users, TrendingUp, Play, Pause, Settings, Plus, Mail, Clock, Target, BarChart3, Filter, Search, Edit, Trash2, Copy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Switch } from '../components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { toast } from 'react-hot-toast'

interface Campaign {
  id: string
  name: string
  type: 'review_request' | 'follow_up' | 'thank_you'
  status: 'active' | 'paused' | 'draft'
  trigger: {
    event: 'order_delivered' | 'order_fulfilled' | 'manual'
    delay_days: number
    conditions: {
      min_order_value?: number
      product_tags?: string[]
      customer_segments?: string[]
    }
  }
  template: {
    subject: string
    preview: string
  }
  stats: {
    sent: number
    opened: number
    clicked: number
    reviews_received: number
  }
  created_at: string
  last_sent: string
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Post-Delivery Review Request',
    type: 'review_request',
    status: 'active',
    trigger: {
      event: 'order_delivered',
      delay_days: 3,
      conditions: {
        min_order_value: 25
      }
    },
    template: {
      subject: 'How was your recent purchase?',
      preview: 'We hope you\'re loving your new product! Share your experience...'
    },
    stats: {
      sent: 1247,
      opened: 892,
      clicked: 234,
      reviews_received: 89
    },
    created_at: '2024-01-10T10:00:00Z',
    last_sent: '2024-01-16T14:30:00Z'
  },
  {
    id: '2',
    name: 'Follow-up Reminder',
    type: 'follow_up',
    status: 'active',
    trigger: {
      event: 'order_delivered',
      delay_days: 10,
      conditions: {}
    },
    template: {
      subject: 'Quick reminder: Share your experience',
      preview: 'We noticed you haven\'t had a chance to review your purchase yet...'
    },
    stats: {
      sent: 456,
      opened: 298,
      clicked: 87,
      reviews_received: 34
    },
    created_at: '2024-01-08T15:00:00Z',
    last_sent: '2024-01-16T09:15:00Z'
  },
  {
    id: '3',
    name: 'Premium Customer Thank You',
    type: 'thank_you',
    status: 'paused',
    trigger: {
      event: 'manual',
      delay_days: 0,
      conditions: {
        min_order_value: 100,
        customer_segments: ['vip', 'premium']
      }
    },
    template: {
      subject: 'Thank you for your review!',
      preview: 'Your feedback means the world to us. Here\'s a special discount...'
    },
    stats: {
      sent: 89,
      opened: 76,
      clicked: 45,
      reviews_received: 0
    },
    created_at: '2024-01-05T12:00:00Z',
    last_sent: '2024-01-14T16:45:00Z'
  }
]

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
    }
  }

  const getTypeIcon = (type: Campaign['type']) => {
    switch (type) {
      case 'review_request':
        return <Mail className="h-4 w-4" />
      case 'follow_up':
        return <Clock className="h-4 w-4" />
      case 'thank_you':
        return <Target className="h-4 w-4" />
    }
  }

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ))
    toast.success('Campaign status updated!')
  }

  const duplicateCampaign = (campaign: Campaign) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      stats: { sent: 0, opened: 0, clicked: 0, reviews_received: 0 },
      created_at: new Date().toISOString(),
      last_sent: ''
    }
    setCampaigns(prev => [newCampaign, ...prev])
    toast.success('Campaign duplicated!')
  }

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId))
    toast.success('Campaign deleted!')
  }

  // Calculate overall stats
  const totalStats = campaigns.reduce((acc, campaign) => ({
    sent: acc.sent + campaign.stats.sent,
    opened: acc.opened + campaign.stats.opened,
    clicked: acc.clicked + campaign.stats.clicked,
    reviews_received: acc.reviews_received + campaign.stats.reviews_received
  }), { sent: 0, opened: 0, clicked: 0, reviews_received: 0 })

  const openRate = totalStats.sent > 0 ? (totalStats.opened / totalStats.sent) * 100 : 0
  const clickRate = totalStats.opened > 0 ? (totalStats.clicked / totalStats.opened) * 100 : 0
  const conversionRate = totalStats.sent > 0 ? (totalStats.reviews_received / totalStats.sent) * 100 : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
          <p className="mt-2 text-gray-600">Automate review collection with targeted email campaigns</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Campaign Name</Label>
                <Input placeholder="Enter campaign name..." />
              </div>
              <div>
                <Label>Campaign Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="review_request">Review Request</SelectItem>
                    <SelectItem value="follow_up">Follow-up Reminder</SelectItem>
                    <SelectItem value="thank_you">Thank You</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setCreateDialogOpen(false)}>Create Campaign</Button>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.sent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">{openRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-50">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">{clickRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-50">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gray-50">
                    {getTypeIcon(campaign.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{campaign.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(campaign.status)}
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleCampaignStatus(campaign.id)}
                    >
                      {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => duplicateCampaign(campaign)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteCampaign(campaign.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Campaign Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trigger:</span>
                      <span className="capitalize">{campaign.trigger.event.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delay:</span>
                      <span>{campaign.trigger.delay_days} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subject:</span>
                      <span className="truncate max-w-48">{campaign.template.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last sent:</span>
                      <span>{campaign.last_sent ? new Date(campaign.last_sent).toLocaleDateString() : 'Never'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sent: {campaign.stats.sent}</span>
                        <span>Opened: {campaign.stats.opened} ({campaign.stats.sent > 0 ? ((campaign.stats.opened / campaign.stats.sent) * 100).toFixed(1) : 0}%)</span>
                      </div>
                      <Progress value={campaign.stats.sent > 0 ? (campaign.stats.opened / campaign.stats.sent) * 100 : 0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Clicked: {campaign.stats.clicked}</span>
                        <span>Reviews: {campaign.stats.reviews_received} ({campaign.stats.sent > 0 ? ((campaign.stats.reviews_received / campaign.stats.sent) * 100).toFixed(1) : 0}%)</span>
                      </div>
                      <Progress value={campaign.stats.sent > 0 ? (campaign.stats.reviews_received / campaign.stats.sent) * 100 : 0} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCampaigns.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more campaigns.'
                  : 'Create your first email campaign to start collecting reviews automatically.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}