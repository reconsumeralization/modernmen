import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Scissors, ArrowLeft } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface Barber {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
}

const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Mock data
  const services: Service[] = [
    { id: '1', name: 'Classic Haircut', duration: 45, price: 35, description: 'Traditional haircut with modern styling' },
    { id: '2', name: 'Beard Trim', duration: 30, price: 20, description: 'Professional beard grooming and styling' },
    { id: '3', name: 'Haircut & Beard', duration: 60, price: 50, description: 'Complete package with haircut and beard' },
    { id: '4', name: 'Hot Towel Shave', duration: 45, price: 40, description: 'Luxury straight razor shave with hot towel' },
  ];

  const barbers: Barber[] = [
    { id: '1', name: 'Mike Johnson', avatar: '/placeholder-user.jpg', specialties: ['Haircuts', 'Fades'], rating: 4.9 },
    { id: '2', name: 'Sarah Davis', avatar: '/placeholder-user.jpg', specialties: ['Beard Grooming', 'Color'], rating: 4.8 },
    { id: '3', name: 'Alex Chen', avatar: '/placeholder-user.jpg', specialties: ['Traditional Cuts', 'Styling'], rating: 4.7 },
  ];

  const availableTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setStep(3);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep(4);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(5);
  };

  const handleBookingSubmit = () => {
    // In a real app, this would submit to API
    console.log('Booking submitted:', {
      service: selectedService,
      barber: selectedBarber,
      date: selectedDate,
      time: selectedTime,
      notes
    });

    // Navigate to confirmation or dashboard
    navigate('/');
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose a Service</h2>
        <p className="text-gray-600 mt-2">Select the service you'd like to book</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceSelect(service)}
            className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <span className="text-lg font-bold text-blue-600">${service.price}</span>
            </div>
            <p className="text-gray-600 mb-2">{service.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {service.duration} minutes
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Barber</h2>
        <p className="text-gray-600 mt-2">Select a barber for your {selectedService?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {barbers.map((barber) => (
          <div
            key={barber.id}
            onClick={() => handleBarberSelect(barber)}
            className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200 text-center"
          >
            <img
              src={barber.avatar}
              alt={barber.name}
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{barber.name}</h3>
            <div className="flex items-center justify-center mb-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{barber.rating}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-1">
              {barber.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Select Date</h2>
        <p className="text-gray-600 mt-2">Choose your preferred date</p>
      </div>

      <div className="max-w-md mx-auto">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateSelect(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {selectedDate && (
        <div className="text-center">
          <button
            onClick={() => setStep(4)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue to Time Selection
          </button>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Select Time</h2>
        <p className="text-gray-600 mt-2">Choose your preferred time for {selectedDate}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {availableTimes.map((time) => (
          <button
            key={time}
            onClick={() => handleTimeSelect(time)}
            className="px-4 py-3 border border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Confirm Your Booking</h2>
        <p className="text-gray-600 mt-2">Review your appointment details</p>
      </div>

      <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Scissors className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{selectedService?.name}</p>
              <p className="text-sm text-gray-600">{selectedService?.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{selectedBarber?.name}</p>
              <p className="text-sm text-gray-600">⭐ {selectedBarber?.rating} rating</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <p className="font-medium text-gray-900">{selectedDate}</p>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <p className="font-medium text-gray-900">{selectedTime}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <span className="text-lg font-bold text-blue-600">${selectedService?.price}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests or notes for your barber..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="text-center">
        <button
          onClick={handleBookingSubmit}
          className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg font-medium"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div className={`w-12 h-1 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Service</span>
            <span>Barber</span>
            <span>Date</span>
            <span>Time</span>
            <span>Confirm</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
    </div>
  );
};

export default BookingForm;
