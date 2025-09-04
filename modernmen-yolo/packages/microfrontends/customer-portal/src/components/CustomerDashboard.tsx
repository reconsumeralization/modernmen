import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  User,
  CreditCard,
  Star,
  Gift,
  History,
  Settings,
  Plus,
  MapPin,
  Phone
} from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  barber: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  price: number;
}

interface CustomerStats {
  totalAppointments: number;
  completedAppointments: number;
  loyaltyPoints: number;
  currentTier: string;
  nextTierPoints: number;
}

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - In real app, this would come from API
  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['customer-appointments'],
    queryFn: async (): Promise<Appointment[]> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: '1',
          date: '2024-01-20',
          time: '14:00',
          service: 'Classic Haircut',
          barber: 'Mike Johnson',
          status: 'confirmed',
          price: 35
        },
        {
          id: '2',
          date: '2024-01-15',
          time: '10:00',
          service: 'Beard Trim',
          barber: 'Sarah Davis',
          status: 'completed',
          price: 20
        }
      ];
    }
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['customer-stats'],
    queryFn: async (): Promise<CustomerStats> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        totalAppointments: 12,
        completedAppointments: 10,
        loyaltyPoints: 245,
        currentTier: 'Gold',
        nextTierPoints: 300
      };
    }
  });

  const upcomingAppointments = appointments?.filter(apt =>
    apt.status === 'confirmed' || apt.status === 'pending'
  ) || [];

  const recentAppointments = appointments?.filter(apt =>
    apt.status === 'completed'
  ).slice(0, 3) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (appointmentsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-600 mt-2">Manage your appointments and account</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalAppointments || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.completedAppointments || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Gift className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.loyaltyPoints || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Tier</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.currentTier || 'Bronze'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/book"
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Book Appointment
            </Link>
            <Link
              to="/appointments"
              className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              <History className="h-5 w-5 mr-2" />
              View History
            </Link>
            <Link
              to="/profile"
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              <Settings className="h-5 w-5 mr-2" />
              Profile Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
          <Link
            to="/appointments"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View all
          </Link>
        </div>
        <div className="p-6">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming appointments</p>
              <Link
                to="/book"
                className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Book your first appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{appointment.service}</h3>
                      <p className="text-sm text-gray-600">with {appointment.barber}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.date} at {appointment.time}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${appointment.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Appointments */}
      {recentAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Appointments</h2>
            <Link
              to="/appointments"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{appointment.service}</h3>
                      <p className="text-sm text-gray-600">with {appointment.barber}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.date}
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${appointment.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
