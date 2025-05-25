import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { RouterProvider } from 'react-router-dom'
import { AppRoutes } from './routes'
import { Provider } from 'react-redux'
import { store } from './store'
import ErrorFallback from './components/ui/ErrorFallback'

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
        <ErrorFallback />
      )
    }
    return this.props.children
  }
}

function App() {
  return (
      <ErrorBoundary>
        <div className='min-h-screen bg-background'>
          <Provider store={store}>
            <RouterProvider router={AppRoutes} />
            <Toaster />
          </Provider>
        </div>
      </ErrorBoundary>
  )
}

export default App
