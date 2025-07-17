import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Mail, 
  Palette,
  Star,
  LogOut,
  Store,
  Shield,
  TrendingUp,
  Send,
  HelpCircle,
  Play
} from 'lucide-react'
import { blink } from '../blink/client'
import { useShopify } from '../contexts/ShopifyContext'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Reviews', href: '/reviews', icon: MessageSquare },
  { name: 'Moderation', href: '/moderation', icon: Shield },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Campaigns', href: '/campaigns', icon: Send },
  { name: 'Q&A', href: '/qna', icon: HelpCircle },
  { name: 'Email Templates', href: '/email-templates', icon: Mail },
  { name: 'Widget', href: '/widget', icon: Palette },
  { name: 'Widget Demo', href: '/widget-demo', icon: Play },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { isConnected } = useShopify()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center px-6 border-b">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">TrustLoop</span>
          </div>
        </div>
        
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {/* Shopify Connection Status */}
            <li className="mb-4">
              <Link
                to="/shopify-setup"
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${location.pathname === '/shopify-setup'
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Store className="mr-3 h-5 w-5" />
                <span>Shopify Setup</span>
                {isConnected && (
                  <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </Link>
            </li>

            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive 
                        ? 'bg-green-50 text-green-700 border-r-2 border-green-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={() => blink.auth.logout()}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}