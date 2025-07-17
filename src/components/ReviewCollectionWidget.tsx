import { useState } from 'react'
import { Star, Upload, X, Send, CheckCircle, Camera, Video } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'

interface ReviewCollectionWidgetProps {
  productId?: string
  productName?: string
  productImage?: string
  onSubmit?: (review: any) => void
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
    borderRadius?: number
  }
}

export default function ReviewCollectionWidget({
  productId = 'demo-product',
  productName = 'Premium Wireless Headphones',
  productImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
  onSubmit,
  theme = {
    primaryColor: '#00A96E',
    secondaryColor: '#5C6AC4',
    fontFamily: 'Inter',
    borderRadius: 8
  }
}: ReviewCollectionWidgetProps) {
  const [step, setStep] = useState<'rating' | 'details' | 'media' | 'success'>('rating')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating)
    setTimeout(() => setStep('details'), 300)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      return (isImage || isVideo) && isValidSize
    })
    
    setUploadedFiles(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 files
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!rating || !reviewText.trim() || !customerName.trim() || !customerEmail.trim()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const reviewData = {
        productId,
        rating,
        title: title.trim(),
        text: reviewText.trim(),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        files: uploadedFiles,
        submittedAt: new Date().toISOString()
      }

      onSubmit?.(reviewData)
      setStep('success')
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep('rating')
    setRating(0)
    setHoverRating(0)
    setTitle('')
    setReviewText('')
    setCustomerName('')
    setCustomerEmail('')
    setUploadedFiles([])
    setAgreedToTerms(false)
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Very Good'
      case 5: return 'Excellent'
      default: return 'Rate this product'
    }
  }

  const progress = step === 'rating' ? 25 : step === 'details' ? 50 : step === 'media' ? 75 : 100

  return (
    <Card 
      className="w-full max-w-2xl mx-auto shadow-lg"
      style={{ 
        fontFamily: theme.fontFamily,
        borderRadius: `${theme.borderRadius}px`
      }}
    >
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <img 
            src={productImage} 
            alt={productName}
            className="w-16 h-16 object-cover rounded-lg border"
          />
          <div className="text-left">
            <CardTitle className="text-lg">{productName}</CardTitle>
            <p className="text-sm text-gray-600">Share your experience</p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${progress}%`,
              backgroundColor: theme.primaryColor 
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">Step {step === 'rating' ? 1 : step === 'details' ? 2 : step === 'media' ? 3 : 4} of 4</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 'rating' && (
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">How would you rate this product?</h3>
              <p className="text-gray-600 mb-6">Click a star to rate</p>
            </div>
            
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <p 
              className="text-lg font-medium transition-all duration-200"
              style={{ color: theme.primaryColor }}
            >
              {getRatingText(hoverRating || rating)}
            </p>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex justify-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{getRatingText(rating)} rating selected</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Your Name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="title">Review Title (Optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="mt-1"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
            </div>

            <div>
              <Label htmlFor="reviewText">Your Review *</Label>
              <Textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell others about your experience with this product..."
                className="mt-1 min-h-[120px]"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{reviewText.length}/1000 characters</p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep('rating')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep('media')}
                disabled={!reviewText.trim() || !customerName.trim() || !customerEmail.trim()}
                className="flex-1"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'media' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Add Photos or Videos (Optional)</h3>
              <p className="text-gray-600">Help others by showing your experience</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <Camera className="w-8 h-8 text-gray-400" />
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                  <p className="text-xs text-gray-500">Supports: JPG, PNG, GIF, MP4, MOV (max 10MB each)</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div>
                <p className="font-medium mb-3">Uploaded Files ({uploadedFiles.length}/5)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Video className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </Label>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep('details')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!agreedToTerms || isSubmitting}
                className="flex-1"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6 py-8">
            <div className="flex justify-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${theme.primaryColor}20` }}
              >
                <CheckCircle 
                  className="w-8 h-8"
                  style={{ color: theme.primaryColor }}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Thank you for your review!</h3>
              <p className="text-gray-600 mb-4">
                Your review has been submitted and will be published after moderation.
              </p>
              <Badge 
                className="text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Review submitted successfully
              </Badge>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your review will be moderated within 24 hours</li>
                <li>• You'll receive an email confirmation once it's published</li>
                <li>• Other customers will be able to see your helpful feedback</li>
              </ul>
            </div>

            <Button
              onClick={resetForm}
              variant="outline"
              className="w-full"
            >
              Submit Another Review
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}