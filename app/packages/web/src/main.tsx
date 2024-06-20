import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { store } from '@/redux/store'
import './index.css'

const root = document.getElementById('root') as HTMLDivElement

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryClientProvider>
    </NextUIProvider>
  </React.StrictMode>
)
