import { useState } from 'react'
import { 
  Shield, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Flag,
  Zap,
  Filter,
  Search,
  BarChart3,
  Settings,
  Users,
  MessageSquare
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Switch } from '../components/ui/switch'
import { Label } from '../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Progress } from '../components/ui/progress'

interface ModerationItem {
  id: string
  type: 'review' | 'question' | 'photo' | 'video'
  content: {
    text?: string
    mediaUrl?: string
    rating?: number
  }
  customer: {
    name: string
    email: string
    isVerified: boolean
    riskScore: number
  }
  product: {
    id: string
    name: string
  }
  aiAnalysis: {
    spamScore: number
    sentimentScore: number
    languageDetected: string
    flaggedReasons: string[]
    suggestedAction: 'approve' | 'reject' | 'review'
    confidence: number
  }
  metadata: {
    ipAddress: string
    userAgent: string
    submittedAt: string
    source: string
  }
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
}

const mockModerationItems: ModerationItem[] = [
  {
    id: '1',
    type: 'review',
    content: {
      text: 'This product is absolutely amazing! Best purchase I\'ve made this year. Highly recommend to everyone!',
      rating: 5
    },
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      isVerified: true,
      riskScore: 15
    },
    product: {
      id: 'prod_1',
      name: 'Premium Wireless Headphones'
    },
    aiAnalysis: {
      spamScore: 12,
      sentimentScore: 95,
      languageDetected: 'en',
      flaggedReasons: [],
      suggestedAction: 'approve',
      confidence: 92
    },
    metadata: {
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      submittedAt: '2024-01-15T10:30:00Z',
      source: 'email_campaign'
    },
    status: 'pending'
  },
  {
    id: '2',
    type: 'review',
    content: {
      text: 'AMAZING PRODUCT!!! BUY NOW!!! BEST DEAL EVER!!! 5 STARS!!!',
      rating: 5
    },
    customer: {
      name: 'John Smith',
      email: 'john.smith.fake@tempmail.com',
      isVerified: false,
      riskScore: 85
    },
    product: {
      id: 'prod_2',
      name: 'Smart Fitness Tracker'
    },
    aiAnalysis: {
      spamScore: 89,
      sentimentScore: 78,
      languageDetected: 'en',
      flaggedReasons: ['excessive_caps', 'promotional_language', 'suspicious_email', 'fake_enthusiasm'],
      suggestedAction: 'reject',
      confidence: 94
    },
    metadata: {
      ipAddress: '10.0.0.1',
      userAgent: 'Bot/1.0',
      submittedAt: '2024-01-15T11:45:00Z',
      source: 'widget'
    },
    status: 'flagged'
  },
  {
    id: '3',
    type: 'photo',
    content: {
      mediaUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
    },
    customer: {
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      isVerified: true,
      riskScore: 25
    },
    product: {
      id: 'prod_1',
      name: 'Premium Wireless Headphones'
    },
    aiAnalysis: {
      spamScore: 5,
      sentimentScore: 80,
      languageDetected: 'n/a',
      flaggedReasons: [],
      suggestedAction: 'approve',
      confidence: 88
    },
    metadata: {
      ipAddress: '192.168.1.5',
      userAgent: 'Mozilla/5.0...',
      submittedAt: '2024-01-15T09:15:00Z',
      source: 'follow_up_email'
    },
    status: 'pending'
  }
]

export default function Moderation() {
  const [items, setItems] = useState<ModerationItem[]>(mockModerationItems)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [autoModerationEnabled, setAutoModerationEnabled] = useState(true)
  const [spamThreshold, setSpamThreshold] = useState(75)

  const filteredItems = items.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    const matchesSearch = item.content.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesType && matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: ModerationItem['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case 'flagged':
        return <Badge className="bg-orange-100 text-orange-800">Flagged</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  const getRiskBadge = (score: number) => {
    if (score < 30) return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
    if (score < 70) return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
    return <Badge className="bg-red-100 text-red-800">High Risk</Badge>
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const moderateItem = (itemId: string, action: 'approve' | 'reject') => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' }
        : item
    ))
  }

  const bulkModerate = (action: 'approve' | 'reject') => {
    const pendingItems = filteredItems.filter(item => item.status === 'pending')
    const itemIds = pendingItems.map(item => item.id)
    
    setItems(prev => prev.map(item => 
      itemIds.includes(item.id)
        ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' }
        : item
    ))
  }

  const autoModerate = () => {
    setItems(prev => prev.map(item => {
      if (item.status !== 'pending') return item
      
      if (item.aiAnalysis.spamScore >= spamThreshold) {
        return { ...item, status: 'rejected' }
      } else if (item.aiAnalysis.confidence >= 85 && item.aiAnalysis.suggestedAction === 'approve') {
        return { ...item, status: 'approved' }
      }
      
      return item
    }))
  }

  const stats = {
    total: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    approved: items.filter(i => i.status === 'approved').length,
    rejected: items.filter(i => i.status === 'rejected').length,
    flagged: items.filter(i => i.status === 'flagged').length,
    avgSpamScore: items.reduce((sum, i) => sum + i.aiAnalysis.spamScore, 0) / items.length,
    avgConfidence: items.reduce((sum, i) => sum + i.aiAnalysis.confidence, 0) / items.length
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Moderation</h1>
          <p className="mt-2 text-gray-600">Intelligent content moderation with machine learning</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={autoModerate} className="bg-purple-600 hover:bg-purple-700">
            <Zap className="h-4 w-4 mr-2" />
            Auto-Moderate
          </Button>
          <Button onClick={() => bulkModerate('approve')} variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            Bulk Approve
          </Button>
          <Button onClick={() => bulkModerate('reject')} variant="outline">
            <XCircle className="h-4 w-4 mr-2" />
            Bulk Reject
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-50">
                <MessageSquare className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-50">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Spam Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgSpamScore.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Confidence</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgConfidence.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Auto-Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="queue">Moderation Queue</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search content, customer, or product..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="review">Reviews</SelectItem>
                    <SelectItem value="question">Questions</SelectItem>
                    <SelectItem value="photo">Photos</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Moderation Items */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className={item.status === 'flagged' ? 'border-red-200 bg-red-50' : ''}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-50">
                        {item.type === 'review' && <MessageSquare className="h-5 w-5" />}
                        {item.type === 'photo' && <Eye className="h-5 w-5" />}
                        {item.type === 'question' && <Flag className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">{item.type}</h3>
                        <p className="text-sm text-gray-600">{item.product.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(item.status)}
                      {getRiskBadge(item.customer.riskScore)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    {item.content.text && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-700">{item.content.text}</p>
                        {item.content.rating && (
                          <div className="flex items-center mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-lg ${star <= item.content.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {item.content.mediaUrl && (
                      <div className="mb-4">
                        <img 
                          src={item.content.mediaUrl} 
                          alt="User content"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  {/* AI Analysis */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-blue-900 flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        AI Analysis
                      </h4>
                      <Badge className={`${getConfidenceColor(item.aiAnalysis.confidence)} bg-transparent border-current`}>
                        {item.aiAnalysis.confidence}% confidence
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-blue-700">Spam Score</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={item.aiAnalysis.spamScore} className="flex-1" />
                          <span className="text-sm font-medium">{item.aiAnalysis.spamScore}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">Sentiment</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={item.aiAnalysis.sentimentScore} className="flex-1" />
                          <span className="text-sm font-medium">{item.aiAnalysis.sentimentScore}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">Language</p>
                        <p className="font-medium text-blue-900 uppercase">{item.aiAnalysis.languageDetected}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">Suggested</p>
                        <Badge className={item.aiAnalysis.suggestedAction === 'approve' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {item.aiAnalysis.suggestedAction}
                        </Badge>
                      </div>
                    </div>

                    {item.aiAnalysis.flaggedReasons.length > 0 && (
                      <div>
                        <p className="text-sm text-blue-700 mb-2">Flagged Issues:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.aiAnalysis.flaggedReasons.map((reason, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {reason.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{item.customer.name}</span>
                        {item.customer.isVerified && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <span>Risk: {item.customer.riskScore}%</span>
                      <span>Source: {item.metadata.source}</span>
                      <span>{new Date(item.metadata.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {item.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => moderateItem(item.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moderateItem(item.id, 'reject')}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm" variant="outline">
                        <Flag className="h-4 w-4 mr-1" />
                        Flag for Review
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items to moderate</h3>
                  <p className="text-gray-600">
                    All content has been reviewed or no items match your filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Moderation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Auto-Moderation</Label>
                  <p className="text-sm text-gray-600">Automatically approve or reject content based on AI analysis</p>
                </div>
                <Switch 
                  checked={autoModerationEnabled}
                  onCheckedChange={setAutoModerationEnabled}
                />
              </div>

              <div>
                <Label className="text-base font-medium">Spam Detection Threshold</Label>
                <p className="text-sm text-gray-600 mb-3">Content with spam score above this threshold will be automatically rejected</p>
                <div className="flex items-center space-x-4">
                  <Progress value={spamThreshold} className="flex-1" />
                  <span className="text-sm font-medium w-12">{spamThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={spamThreshold}
                  onChange={(e) => setSpamThreshold(parseInt(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">Language Detection</Label>
                  <p className="text-sm text-gray-600 mb-2">Automatically detect and filter content language</p>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label className="text-base font-medium">Sentiment Analysis</Label>
                  <p className="text-sm text-gray-600 mb-2">Analyze emotional tone of reviews</p>
                  <Switch defaultChecked />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Blocked Keywords</Label>
                <p className="text-sm text-gray-600 mb-2">Content containing these words will be flagged</p>
                <Input placeholder="Enter keywords separated by commas" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Moderation Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Auto-Approved</span>
                    <span className="font-bold">{((stats.approved / stats.total) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Auto-Rejected</span>
                    <span className="font-bold">{((stats.rejected / stats.total) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Manual Review</span>
                    <span className="font-bold">{(((stats.pending + stats.flagged) / stats.total) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Confidence</span>
                    <span className="font-bold">{stats.avgConfidence.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">High Confidence (&gt;90%)</span>
                    <span className="font-bold">
                      {items.filter(i => i.aiAnalysis.confidence > 90).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Flagged Items</span>
                    <span className="font-bold">{stats.flagged}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}