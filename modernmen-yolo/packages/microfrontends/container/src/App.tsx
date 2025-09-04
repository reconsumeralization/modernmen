import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load microfrontends
const CustomerPortal = lazy(() => import('customerPortal/App'));
const BarberPortal = lazy(() => import('barberPortal/App'));
const AdminPortal = lazy(() => import('adminPortal/App'));
const MarketingSite = lazy(() => import('marketingSite/App'));

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Marketing Site - Default route */}
                <Route path="/" element={<MarketingSite />} />

                {/* Customer Portal */}
                <Route path="/customer/*" element={<CustomerPortal />} />

                {/* Barber Portal */}
                <Route path="/barber/*" element={<BarberPortal />} />

                {/* Admin Portal */}
                <Route path="/admin/*" element={<AdminPortal />} />

                {/* Catch all - redirect to marketing site */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </QueryClientProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
