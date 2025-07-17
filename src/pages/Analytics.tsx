import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Eye,
  Star,
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

interface AnalyticsData {
  conversionMetrics: {
    visitorsWithReviews: number
    visitorsWithoutReviews: number
    conversionWithReviews: number
    conversionWithoutReviews: number
    conversionLift: number
  }
  reviewImpact: {
    averageOrderValue: number
    reviewInfluencedSales: number
    totalRevenue: number
    reviewDrivenRevenue: number
  }
  engagement: {
    reviewViews: number
    photoViews: number
    helpfulVotes: number
    reviewShares: number
  }
  trends: {
    reviewVolume: Array<{ date: string; count: number }>
    ratingTrends: Array<{ date: string; rating: number }>
    conversionTrends: Array<{ date: string; rate: number }>
  }
  topPerformers: Array<{
    productId: string
    productName: string
    reviewCount: number
    averageRating: number
    conversionRate: number
    revenue: number
  }>
  underPerformers: Array<{
    productId: string
    productName: string
    reviewCount: number
    averageRating: number
    conversionRate: number
    issues: string[]
  }>
}

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('30d')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        conversionMetrics: {
          visitorsWithReviews: 8420,
          visitorsWithoutReviews: 3180,
          conversionWithReviews: 4.8,
          conversionWithoutReviews: 2.1,
          conversionLift: 128.6
        },
        reviewImpact: {
          averageOrderValue: 127.50,
          reviewInfluencedSales: 342,
          totalRevenue: 43650,
          reviewDrivenRevenue: 28420
        },
        engagement: {
          reviewViews: 15420,
          photoViews: 8930,
          helpfulVotes: 1240,
          reviewShares: 89
        },
        trends: {
          reviewVolume: [
            { date: '2024-01-01', count: 12 },
            { date: '2024-01-02', count: 18 },
            { date: '2024-01-03', count: 15 },
            { date: '2024-01-04', count: 22 },
            { date: '2024-01-05', count: 19 }
          ],
          ratingTrends: [
            { date: '2024-01-01', rating: 4.2 },
            { date: '2024-01-02', rating: 4.3 },
            { date: '2024-01-03', rating: 4.1 },
            { date: '2024-01-04', rating: 4.4 },
            { date: '2024-01-05', rating: 4.2 }
          ],
          conversionTrends: [
            { date: '2024-01-01', rate: 3.2 },
            { date: '2024-01-02', rate: 3.8 },
            { date: '2024-01-03', rate: 4.1 },
            { date: '2024-01-04', rate: 4.5 },
            { date: '2024-01-05', rate: 4.8 }
          ]
        },
        topPerformers: [
          {
            productId: 'prod_1',
            productName: 'Premium Wireless Headphones',
            reviewCount: 89,
            averageRating: 4.7,
            conversionRate: 6.2,
            revenue: 12450
          },
          {
            productId: 'prod_2',
            productName: 'Smart Fitness Tracker',
            reviewCount: 67,
            averageRating: 4.5,
            conversionRate: 5.8,
            revenue: 9870
          }
        ],
        underPerformers: [
          {
            productId: 'prod_3',
            productName: 'Bluetooth Speaker',
            reviewCount: 23,
            averageRating: 3.2,
            conversionRate: 1.8,
            issues: ['Low rating', 'Battery complaints', 'Sound quality issues']
          }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [timeframe])

  const exportReport = () => {
    // Simulate export
    const csvContent = `Product,Reviews,Rating,Conversion Rate,Revenue\n${data?.topPerformers.map(p => 
      `${p.productName},${p.reviewCount},${p.averageRating},${p.conversionRate}%,$${p.revenue}`
    ).join('\n')}`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trustloop-analytics-${timeframe}.csv`
    a.click()
  }

  if (loading) {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="mt-2 text-gray-600">Deep insights into review performance and conversion impact</p>
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
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Conversion Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Lift</p>
                <p className="text-2xl font-bold text-green-600">+{data?.conversionMetrics.conversionLift}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Review-Driven Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${data?.reviewImpact.reviewDrivenRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-50">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Review Views</p>
                <p className="text-2xl font-bold text-gray-900">{data?.engagement.reviewViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-50">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Influenced Sales</p>
                <p className="text-2xl font-bold text-gray-900">{data?.reviewImpact.reviewInfluencedSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="conversion" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conversion">Conversion Analysis</TabsTrigger>
          <TabsTrigger value="performance">Product Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="conversion" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">With Reviews</p>
                      <p className="text-sm text-green-700">{data?.conversionMetrics.visitorsWithReviews.toLocaleString()} visitors</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{data?.conversionMetrics.conversionWithReviews}%</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-900">Without Reviews</p>
                      <p className="text-sm text-red-700">{data?.conversionMetrics.visitorsWithoutReviews.toLocaleString()} visitors</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{data?.conversionMetrics.conversionWithoutReviews}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-bold">${data?.reviewImpact.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Review-Driven Revenue</span>
                    <span className="font-bold text-green-600">${data?.reviewImpact.reviewDrivenRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Order Value</span>
                    <span className="font-bold">${data?.reviewImpact.averageOrderValue}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Revenue Attribution</span>
                      <span className="font-bold text-green-600">
                        {((data?.reviewImpact.reviewDrivenRevenue || 0) / (data?.reviewImpact.totalRevenue || 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.topPerformers.map((product) => (
                    <div key={product.productId} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{product.productName}</h3>
                        <Badge className="bg-green-100 text-green-800">Top Performer</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Reviews: </span>
                          <span className="font-medium">{product.reviewCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Rating: </span>
                          <span className="font-medium flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            {product.averageRating}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Conversion: </span>
                          <span className="font-medium text-green-600">{product.conversionRate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Revenue: </span>
                          <span className="font-medium">${product.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.underPerformers.map((product) => (
                    <div key={product.productId} className="p-4 border rounded-lg border-red-200">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{product.productName}</h3>
                        <Badge variant="destructive">Needs Attention</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Reviews: </span>
                          <span className="font-medium">{product.reviewCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Rating: </span>
                          <span className="font-medium flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            {product.averageRating}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Conversion: </span>
                          <span className="font-medium text-red-600">{product.conversionRate}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Issues:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.issues.map((issue, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{data?.engagement.reviewViews.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Review Views</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-8 w-8 text-purple-600 mx-auto mb-2 flex items-center justify-center text-lg">📸</div>
                <p className="text-2xl font-bold text-gray-900">{data?.engagement.photoViews.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Photo Views</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-8 w-8 text-green-600 mx-auto mb-2 flex items-center justify-center text-lg">👍</div>
                <p className="text-2xl font-bold text-gray-900">{data?.engagement.helpfulVotes.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Helpful Votes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-8 w-8 text-orange-600 mx-auto mb-2 flex items-center justify-center text-lg">📤</div>
                <p className="text-2xl font-bold text-gray-900">{data?.engagement.reviewShares}</p>
                <p className="text-sm text-gray-600">Review Shares</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Review Volume Trend</h4>
                  <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-between p-4">
                    {data?.trends.reviewVolume.map((point, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-blue-500 rounded-t"
                          style={{ 
                            height: `${(point.count / 25) * 80}px`,
                            width: '20px'
                          }}
                        />
                        <span className="text-xs text-gray-600 mt-1">
                          {new Date(point.date).getDate()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Average Rating Trend</h4>
                  <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-between p-4">
                    {data?.trends.ratingTrends.map((point, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-yellow-500 rounded-t"
                          style={{ 
                            height: `${(point.rating / 5) * 80}px`,
                            width: '20px'
                          }}
                        />
                        <span className="text-xs text-gray-600 mt-1">
                          {new Date(point.date).getDate()}
                        </span>
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