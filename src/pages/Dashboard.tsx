import { Star, TrendingUp, MessageSquare, Clock, CheckCircle, XCircle, AlertTriangle, Target, Users, Calendar, Filter, Download, BarChart3 } from 'lucide-react'
import { useReviews } from '../hooks/useReviews'
import { useProducts } from '../hooks/useProducts'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Progress } from '../components/ui/progress'
import { useState } from 'react'

export default function Dashboard() {
  const { stats, loading: reviewsLoading } = useReviews()
  const { products, loading: productsLoading } = useProducts()
  const [timeframe, setTimeframe] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('overview')

  // Advanced metrics calculations
  const conversionImpact = stats ? {
    withReviews: 4.8,
    withoutReviews: 2.1,
    lift: 128.6
  } : null

  const sentimentAnalysis = stats ? {
    positive: 78,
    neutral: 15,
    negative: 7
  } : null

  const responseRate = stats ? {
    emailsSent: 1250,
    reviewsReceived: 127,
    rate: ((127 / 1250) * 100).toFixed(1)
  } : null

  const weeklyTrend = [
    { day: 'Mon', reviews: 12, rating: 4.2 },
    { day: 'Tue', reviews: 18, rating: 4.3 },
    { day: 'Wed', reviews: 15, rating: 4.1 },
    { day: 'Thu', reviews: 22, rating: 4.4 },
    { day: 'Fri', reviews: 19, rating: 4.2 },
    { day: 'Sat', reviews: 25, rating: 4.5 },
    { day: 'Sun', reviews: 16, rating: 4.0 }
  ]

  if (reviewsLoading || productsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Reviews',
      value: stats?.total_reviews || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'vs last month'
    },
    {
      title: 'Average Rating',
      value: stats?.average_rating?.toFixed(1) || '0.0',
      change: '+0.2',
      changeType: 'positive' as const,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'vs last month'
    },
    {
      title: 'Response Rate',
      value: `${responseRate?.rate || 0}%`,
      change: '+3.2%',
      changeType: 'positive' as const,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'email to review'
    },
    {
      title: 'Conversion Lift',
      value: `+${conversionImpact?.lift || 0}%`,
      change: '+15%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'with reviews'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Dashboard</h1>
          <p className="mt-2 text-gray-600">Deep insights into your review performance and business impact</p>
        </div>
        <div className="flex space-x-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Rating Distribution
                  <Badge variant="outline">{stats?.total_reviews || 0} total</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = stats?.rating_distribution[rating as keyof typeof stats.rating_distribution] || 0
                    const percentage = stats?.total_reviews ? (count / stats.total_reviews) * 100 : 0
                    
                    return (
                      <div key={rating} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium w-6">{rating}</span>
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{count}</span>
                            <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Conversion Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">With Reviews</p>
                      <p className="text-sm text-green-700">8,420 visitors</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{conversionImpact?.withReviews}%</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-900">Without Reviews</p>
                      <p className="text-sm text-red-700">3,180 visitors</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{conversionImpact?.withoutReviews}%</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Conversion Lift</span>
                      <span className="text-2xl font-bold text-green-600">+{conversionImpact?.lift}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Collection Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Review Collection Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{responseRate?.emailsSent}</div>
                  <div className="text-sm text-gray-600">Emails Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{responseRate?.reviewsReceived}</div>
                  <div className="text-sm text-gray-600">Reviews Received</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{responseRate?.rate}%</div>
                  <div className="text-sm text-gray-600">Response Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Enhanced Product Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Product Performance Matrix
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => {
                  const performanceScore = (product.average_rating * 20) + (product.review_count / 10)
                  const performanceLevel = performanceScore > 90 ? 'excellent' : 
                                         performanceScore > 70 ? 'good' : 
                                         performanceScore > 50 ? 'average' : 'needs-attention'
                  
                  return (
                    <div key={product.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={product.image_url} 
                          alt={product.title}
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{product.title}</h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm text-gray-600">
                                {product.average_rating.toFixed(1)}
                              </span>
                            </div>
                            <Badge variant="secondary">
                              {product.review_count} reviews
                            </Badge>
                            <Badge className={
                              performanceLevel === 'excellent' ? 'bg-green-100 text-green-800' :
                              performanceLevel === 'good' ? 'bg-blue-100 text-blue-800' :
                              performanceLevel === 'average' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {performanceLevel === 'excellent' ? 'Excellent' :
                               performanceLevel === 'good' ? 'Good' :
                               performanceLevel === 'average' ? 'Average' : 'Needs Attention'}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-sm text-gray-500">Performance Score</div>
                          <div className="text-lg font-bold">{performanceScore.toFixed(0)}/100</div>
                          <Progress value={performanceScore} className="w-20" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          {/* Sentiment Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-medium">Positive</span>
                    <span className="font-bold">{sentimentAnalysis?.positive}%</span>
                  </div>
                  <Progress value={sentimentAnalysis?.positive} className="h-3" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-600 font-medium">Neutral</span>
                    <span className="font-bold">{sentimentAnalysis?.neutral}%</span>
                  </div>
                  <Progress value={sentimentAnalysis?.neutral} className="h-3" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-medium">Negative</span>
                    <span className="font-bold">{sentimentAnalysis?.negative}%</span>
                  </div>
                  <Progress value={sentimentAnalysis?.negative} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Quality Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">High Quality Reviews</span>
                    </div>
                    <span className="font-bold text-green-600">89</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">Verified Purchases</span>
                    </div>
                    <span className="font-bold text-blue-600">94%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium">Avg. Review Length</span>
                    </div>
                    <span className="font-bold text-purple-600">127 chars</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Weekly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Review Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Review Volume by Day</h4>
                  <div className="flex items-end justify-between h-32 bg-gray-50 rounded-lg p-4">
                    {weeklyTrend.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                          style={{ 
                            height: `${(day.reviews / 25) * 80}px`,
                            width: '24px'
                          }}
                          title={`${day.reviews} reviews`}
                        />
                        <span className="text-xs text-gray-600 mt-2">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Average Rating Trend</h4>
                  <div className="flex items-end justify-between h-32 bg-gray-50 rounded-lg p-4">
                    {weeklyTrend.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-yellow-500 rounded-t transition-all duration-300 hover:bg-yellow-600"
                          style={{ 
                            height: `${(day.rating / 5) * 80}px`,
                            width: '24px'
                          }}
                          title={`${day.rating} stars`}
                        />
                        <span className="text-xs text-gray-600 mt-2">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}