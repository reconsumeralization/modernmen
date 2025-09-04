import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, User, Star, ArrowLeft, Filter } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  barber: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no_show';
  price: number;
  rating?: number;
  review?: string;
}

const AppointmentHistory: React.FC = () => {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointment-history'],
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
          price: 20,
          rating: 5,
          review: 'Great service as always!'
        },
        {
          id: '3',
          date: '2024-01-10',
          time: '16:00',
          service: 'Haircut & Beard',
          barber: 'Alex Chen',
          status: 'completed',
          price: 50,
          rating: 4,
          review: 'Good cut, a bit rushed at the end'
        },
        {
          id: '4',
          date: '2024-01-05',
          time: '11:00',
          service: 'Hot Towel Shave',
          barber: 'Mike Johnson',
          status: 'completed',
          price: 40,
          rating: 5,
          review: 'Excellent shave, very relaxing'
        }
      ];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment History</h1>
            <p className="text-gray-600 mt-2">View and manage your past and upcoming appointments</p>
          </div>

          <Link
            to="/book"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Book New Appointment
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
              All Appointments
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Upcoming
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Completed
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Cancelled
            </button>
          </nav>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-6">
        {appointments?.map((appointment) => (
          <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{appointment.service}</h3>
                  <p className="text-gray-600">with {appointment.barber}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">${appointment.price}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                  {appointment.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {appointment.date}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {appointment.time}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {appointment.barber}
                </div>
              </div>

              {appointment.status === 'completed' && (
                <div className="flex items-center space-x-2">
                  {renderStars(appointment.rating || 0)}
                  <span className="text-sm text-gray-600 ml-2">
                    {appointment.rating}/5
                  </span>
                </div>
              )}
            </div>

            {appointment.review && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700 italic">"{appointment.review}"</p>
              </div>
            )}

            <div className="mt-4 flex justify-end space-x-3">
              {appointment.status === 'confirmed' && (
                <>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50">
                    Cancel
                  </button>
                </>
              )}

              {appointment.status === 'completed' && !appointment.rating && (
                <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50">
                  Leave Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {(!appointments || appointments.length === 0) && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
          <p className="text-gray-600 mb-6">You haven't booked any appointments yet. Get started by booking your first appointment!</p>
          <Link
            to="/book"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Book Your First Appointment
          </Link>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;
