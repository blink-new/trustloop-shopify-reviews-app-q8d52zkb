import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { ShopifyProvider } from './contexts/ShopifyContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ReviewsManagement from './pages/ReviewsManagement'
import Settings from './pages/Settings'
import EmailTemplates from './pages/EmailTemplates'
import WidgetCustomization from './pages/WidgetCustomization'
import ShopifySetup from './pages/ShopifySetup'
import Analytics from './pages/Analytics'
import Campaigns from './pages/Campaigns'
import QnA from './pages/QnA'
import Moderation from './pages/Moderation'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="mb-6">
            <div className="bg-green-600 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <svg className="h-8 w-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading TrustLoop...</h2>
          <p className="text-gray-600">Initializing your review management dashboard</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-600 p-3 rounded-full">
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">TrustLoop</h1>
            <p className="text-lg text-gray-600 mb-2">Shopify Reviews & UGC Solution</p>
            <p className="text-sm text-gray-500">Build trust and increase conversions with authentic customer reviews</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Automated review collection
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Photo & video reviews
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Advanced analytics & insights
            </div>
          </div>
          
          <button
            onClick={() => blink.auth.login()}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign In to Continue
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            Secure authentication powered by Blink
          </p>
        </div>
      </div>
    )
  }

  return (
    <ShopifyProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reviews" element={<ReviewsManagement />} />
            <Route path="/moderation" element={<Moderation />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/qna" element={<QnA />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/email-templates" element={<EmailTemplates />} />
            <Route path="/widget" element={<WidgetCustomization />} />
            <Route path="/shopify-setup" element={<ShopifySetup />} />
          </Routes>
        </Layout>
      </Router>
    </ShopifyProvider>
  )
}

export default App