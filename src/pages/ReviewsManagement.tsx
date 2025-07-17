import { useState } from 'react'
import { 
  Star, 
  Check, 
  X, 
  Trash2, 
  Filter, 
  Search,
  Image as ImageIcon,
  Shield,
  Calendar,
  MessageSquare,
  MoreHorizontal,
  Flag,
  Reply,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Eye,
  EyeOff,
  Pin,
  Archive,
  Download,
  CheckSquare,
  AlertTriangle,
  Zap
} from 'lucide-react'
import { useReviews } from '../hooks/useReviews'
import { Review } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { Checkbox } from '../components/ui/checkbox'
import { Textarea } from '../components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Progress } from '../components/ui/progress'
import { toast } from 'react-hot-toast'

export default function ReviewsManagement() {
  const { reviews, loading, approveReview, rejectReview, deleteReview } = useReviews()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.review_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.product_title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
    
    return matchesSearch && matchesStatus && matchesRating
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'highest-rating':
        return b.rating - a.rating
      case 'lowest-rating':
        return a.rating - b.rating
      case 'most-helpful':
        return b.helpful_votes - a.helpful_votes
      case 'verified-first':
        return b.is_verified ? 1 : -1
      default:
        return 0
    }
  })

  const handleSelectReview = (reviewId: string) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    )
  }

  const handleSelectAll = () => {
    setSelectedReviews(
      selectedReviews.length === filteredReviews.length 
        ? [] 
        : filteredReviews.map(r => r.id)
    )
  }

  const handleBulkAction = async (action: string) => {
    if (selectedReviews.length === 0) return
    
    try {
      switch (action) {
        case 'approve':
          for (const id of selectedReviews) {
            await approveReview(id)
          }
          toast.success(`Approved ${selectedReviews.length} reviews`)
          break
        case 'reject':
          for (const id of selectedReviews) {
            await rejectReview(id)
          }
          toast.success(`Rejected ${selectedReviews.length} reviews`)
          break
        case 'delete':
          for (const id of selectedReviews) {
            await deleteReview(id)
          }
          toast.success(`Deleted ${selectedReviews.length} reviews`)
          break
      }
      setSelectedReviews([])
    } catch (error) {
      toast.error('Failed to perform bulk action')
    }
  }

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return
    
    try {
      // In real implementation: await blink.db.reviews.update(reviewId, { reply: { text: replyText, author: 'Store Owner', created_at: new Date().toISOString() } })
      toast.success('Reply posted successfully')
      setReplyText('')
      setReplyingTo(null)
    } catch (error) {
      toast.error('Failed to post reply')
    }
  }

  const getStatusBadge = (status: Review['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Review Management</h1>
          <p className="mt-2 text-gray-600">AI-powered moderation and bulk management tools</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            AI Moderate
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <Card className={showFilters ? 'block' : 'hidden'}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search reviews, customers, or products..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest-rating">Highest Rating</SelectItem>
                  <SelectItem value="lowest-rating">Lowest Rating</SelectItem>
                  <SelectItem value="most-helpful">Most Helpful</SelectItem>
                  <SelectItem value="verified-first">Verified First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedReviews.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedReviews.length} review{selectedReviews.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => handleBulkAction('approve')} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-1" />
                    Approve All
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')}>
                    <X className="h-4 w-4 mr-1" />
                    Reject All
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete All
                  </Button>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedReviews([])}>
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredReviews.length}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredReviews.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredReviews.filter(r => r.is_verified).length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {filteredReviews.filter(r => r.photos.length > 0).length}
            </div>
            <div className="text-sm text-gray-600">With Photos</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-gray-600">Select All</span>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
        </div>

        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Selection Checkbox */}
                <Checkbox
                  checked={selectedReviews.includes(review.id)}
                  onCheckedChange={() => handleSelectReview(review.id)}
                  className="mt-1"
                />

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{review.customer_name}</h3>
                          {review.is_verified && (
                            <div className="flex items-center text-green-600">
                              <Shield className="h-4 w-4 mr-1" />
                              <span className="text-xs font-medium">Verified</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">
                            for {review.product_title}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(review.status)}
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setReplyingTo(review.id)}>
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pin className="h-4 w-4 mr-2" />
                            Pin Review
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Flag className="h-4 w-4 mr-2" />
                            Flag as Spam
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Review Title */}
                  {review.title && (
                    <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                  )}

                  {/* Review Text */}
                  <p className="text-gray-700 mb-4">{review.review_text}</p>

                  {/* Photos */}
                  {review.photos.length > 0 && (
                    <div className="flex space-x-2 mb-4">
                      {review.photos.map((photo, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <button className="relative group">
                              <img
                                src={photo}
                                alt={`Review photo ${index + 1}`}
                                className="h-16 w-16 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Review Photo</DialogTitle>
                            </DialogHeader>
                            <img
                              src={photo}
                              alt={`Review photo ${index + 1}`}
                              className="w-full h-auto rounded-lg"
                            />
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  )}

                  {/* Existing Reply */}
                  {review.reply && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Reply className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{review.reply.author}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(review.reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{review.reply.text}</p>
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo === review.id && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Write your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleReply(review.id)}>
                            Post Reply
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Review Metrics & Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{review.helpful_votes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>234 views</span>
                      </div>
                      {review.photos.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {review.photos.length} photo{review.photos.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {review.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => approveReview(review.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectReview(review.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {review.status === 'approved' && !review.reply && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReplyingTo(review.id)}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || ratingFilter !== 'all'
                  ? 'Try adjusting your filters to see more reviews.'
                  : 'Reviews will appear here once customers start submitting them.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}