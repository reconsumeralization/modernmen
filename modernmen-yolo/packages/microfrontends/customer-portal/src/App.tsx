import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomerDashboard from './components/CustomerDashboard';
import BookingForm from './components/BookingForm';
import AppointmentHistory from './components/AppointmentHistory';
import ProfileSettings from './components/ProfileSettings';
import LoyaltyProgram from './components/LoyaltyProgram';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<CustomerDashboard />} />
          <Route path="/book" element={<BookingForm />} />
          <Route path="/appointments" element={<AppointmentHistory />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/loyalty" element={<LoyaltyProgram />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
};

export default App;
