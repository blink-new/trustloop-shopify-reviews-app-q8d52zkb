import { useState } from 'react'
import { 
  MessageCircle, 
  Search, 
  Filter, 
  Plus,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  CheckCircle,
  Clock,
  User,
  Store
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Avatar, AvatarFallback } from '../components/ui/avatar'

interface Question {
  id: string
  productId: string
  productName: string
  question: string
  askedBy: {
    name: string
    isVerified: boolean
    avatar?: string
  }
  askedAt: string
  answers: Answer[]
  upvotes: number
  downvotes: number
  status: 'pending' | 'answered' | 'featured'
  category: 'sizing' | 'shipping' | 'features' | 'compatibility' | 'general'
}

interface Answer {
  id: string
  answer: string
  answeredBy: {
    name: string
    type: 'customer' | 'merchant' | 'expert'
    isVerified: boolean
    avatar?: string
  }
  answeredAt: string
  upvotes: number
  downvotes: number
  isHelpful: boolean
  isFeatured: boolean
}

const mockQuestions: Question[] = [
  {
    id: '1',
    productId: 'prod_1',
    productName: 'Premium Wireless Headphones',
    question: 'How is the battery life on these headphones? I need them for long flights.',
    askedBy: {
      name: 'Sarah M.',
      isVerified: true
    },
    askedAt: '2024-01-15T10:30:00Z',
    answers: [
      {
        id: 'a1',
        answer: 'The battery life is excellent! I get about 30 hours of playback time with ANC off, and about 20 hours with it on. Perfect for long flights.',
        answeredBy: {
          name: 'Mike R.',
          type: 'customer',
          isVerified: true
        },
        answeredAt: '2024-01-15T14:20:00Z',
        upvotes: 12,
        downvotes: 1,
        isHelpful: true,
        isFeatured: false
      },
      {
        id: 'a2',
        answer: 'Our headphones feature industry-leading battery technology with up to 30 hours of playback. They also support fast charging - 10 minutes gives you 3 hours of playback.',
        answeredBy: {
          name: 'TechStore Support',
          type: 'merchant',
          isVerified: true
        },
        answeredAt: '2024-01-15T16:45:00Z',
        upvotes: 8,
        downvotes: 0,
        isHelpful: true,
        isFeatured: true
      }
    ],
    upvotes: 15,
    downvotes: 2,
    status: 'answered',
    category: 'features'
  },
  {
    id: '2',
    productId: 'prod_1',
    productName: 'Premium Wireless Headphones',
    question: 'Do these work well with iPhone and Android devices?',
    askedBy: {
      name: 'Alex K.',
      isVerified: false
    },
    askedAt: '2024-01-16T09:15:00Z',
    answers: [],
    upvotes: 3,
    downvotes: 0,
    status: 'pending',
    category: 'compatibility'
  },
  {
    id: '3',
    productId: 'prod_2',
    productName: 'Smart Fitness Tracker',
    question: 'Is this waterproof? Can I wear it while swimming?',
    askedBy: {
      name: 'Emma L.',
      isVerified: true
    },
    askedAt: '2024-01-14T16:20:00Z',
    answers: [
      {
        id: 'a3',
        answer: 'Yes! It has 5ATM water resistance rating. I swim with mine regularly and it works perfectly.',
        answeredBy: {
          name: 'David P.',
          type: 'customer',
          isVerified: true
        },
        answeredAt: '2024-01-14T18:30:00Z',
        upvotes: 7,
        downvotes: 0,
        isHelpful: true,
        isFeatured: false
      }
    ],
    upvotes: 9,
    downvotes: 0,
    status: 'answered',
    category: 'features'
  }
]

export default function QnA() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [newAnswer, setNewAnswer] = useState('')

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || question.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || question.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status: Question['status']) => {
    switch (status) {
      case 'answered':
        return <Badge className="bg-green-100 text-green-800">Answered</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'featured':
        return <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
    }
  }

  const getCategoryBadge = (category: Question['category']) => {
    const colors = {
      sizing: 'bg-purple-100 text-purple-800',
      shipping: 'bg-blue-100 text-blue-800',
      features: 'bg-green-100 text-green-800',
      compatibility: 'bg-orange-100 text-orange-800',
      general: 'bg-gray-100 text-gray-800'
    }
    
    return <Badge className={colors[category]}>{category}</Badge>
  }

  const getAnswererIcon = (type: Answer['answeredBy']['type']) => {
    switch (type) {
      case 'merchant':
        return <Store className="h-4 w-4 text-blue-600" />
      case 'expert':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const submitAnswer = () => {
    if (!selectedQuestion || !newAnswer.trim()) return

    const answer: Answer = {
      id: `a${Date.now()}`,
      answer: newAnswer,
      answeredBy: {
        name: 'Store Owner',
        type: 'merchant',
        isVerified: true
      },
      answeredAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      isHelpful: false,
      isFeatured: false
    }

    setQuestions(prev => prev.map(q => 
      q.id === selectedQuestion.id 
        ? { ...q, answers: [...q.answers, answer], status: 'answered' as const }
        : q
    ))

    setNewAnswer('')
    setSelectedQuestion(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Questions & Answers</h1>
          <p className="mt-2 text-gray-600">Help customers make informed decisions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Answered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {questions.filter(q => q.status === 'answered').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-50">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {questions.filter(q => q.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-50">
                <ThumbsUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Helpfulness</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(questions.reduce((sum, q) => sum + q.upvotes, 0) / questions.length).toFixed(1)}
                </p>
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
                  placeholder="Search questions..."
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
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sizing">Sizing</SelectItem>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="features">Features</SelectItem>
                <SelectItem value="compatibility">Compatibility</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id}>
            <CardContent className="p-6">
              {/* Question Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{question.productName}</h3>
                    {getStatusBadge(question.status)}
                    {getCategoryBadge(question.category)}
                  </div>
                  <p className="text-gray-700 mb-2">{question.question}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{question.askedBy.name}</span>
                      {question.askedBy.isVerified && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <span>{new Date(question.askedAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{question.upvotes}</span>
                      <ThumbsDown className="h-4 w-4" />
                      <span>{question.downvotes}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {question.status === 'pending' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedQuestion(question)}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Answer
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Answer Question</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-900 mb-1">Question:</p>
                            <p className="text-gray-700">{question.question}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your Answer
                            </label>
                            <Textarea
                              value={newAnswer}
                              onChange={(e) => setNewAnswer(e.target.value)}
                              placeholder="Provide a helpful answer..."
                              rows={4}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setSelectedQuestion(null)}>
                              Cancel
                            </Button>
                            <Button onClick={submitAnswer}>
                              Submit Answer
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button size="sm" variant="outline">
                    <Flag className="h-4 w-4 mr-1" />
                    Feature
                  </Button>
                </div>
              </div>

              {/* Answers */}
              {question.answers.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
                  </h4>
                  <div className="space-y-4">
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="border-l-4 border-gray-200 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {answer.answeredBy.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">{answer.answeredBy.name}</span>
                            {getAnswererIcon(answer.answeredBy.type)}
                            {answer.answeredBy.isVerified && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {answer.isFeatured && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">Featured</Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(answer.answeredAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{answer.answer}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-green-600">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{answer.upvotes}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-red-600">
                            <ThumbsDown className="h-4 w-4" />
                            <span>{answer.downvotes}</span>
                          </button>
                          {answer.isHelpful && (
                            <Badge variant="outline" className="text-xs">
                              Helpful
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredQuestions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters to see more questions.'
                  : 'Questions will appear here when customers ask about your products.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}