import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { RouterProvider } from 'react-router-dom'
import { AppRoutes } from './routes'
import { Provider } from 'react-redux'
import { store } from './store'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    
    // Add global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      this.setState({ hasError: true, error: error || new Error(message) })
      return true // Prevents default error handling
    }

    // Add promise rejection handler
    window.onunhandledrejection = (event) => {
      this.setState({ 
        hasError: true, 
        error: event.reason instanceof Error ? event.reason : new Error(event.reason) 
      })
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  componentWillUnmount() {
    // Clean up error handlers
    window.onerror = null
    window.onunhandledrejection = null
  }

  

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
          <div className='p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md'>
            <h2 className='text-xl font-bold text-red-600 mb-2'>
              Something went wrong
            </h2>
            <p className='text-gray-500 mb-4'>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    // <React.StrictMode>
      <ErrorBoundary>
        <div className='min-h-screen bg-background'>
          <Provider store={store}>
            <RouterProvider router={AppRoutes} />
            <Toaster />
          </Provider>
        </div>
      </ErrorBoundary>
    // </React.StrictMode>
  )
}

export default App
