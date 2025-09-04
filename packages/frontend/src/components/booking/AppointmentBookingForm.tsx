/**
 * YOLO Appointment Booking Form with Protobuf-GTM Integration
 * 
 * This component demonstrates how protobuf APIs and GTM tracking work together
 * to provide both functionality and analytics for the Modern Men Salon.
 */

'use client';

import { useState } from 'react';
import { useGTMProtobufIntegration } from '@/lib/gtm-protobuf-integration';
import { apiClient } from '@/lib/protobuf-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface BookingFormData {
  customer_id: string;
  stylist_id: string;
  service_id: string;
  date_time: string;
  notes?: string;
}

export default function AppointmentBookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    customer_id: '',
    stylist_id: '',
    service_id: '',
    date_time: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const gtmIntegration = useGTMProtobufIntegration();

  // Mock data - in real app, this would come from protobuf APIs
  const services = [
    { id: 'service_1', name: 'Haircut & Style', price: 45, category: 'haircut' },
    { id: 'service_2', name: 'Beard Trim', price: 25, category: 'beard' },
    { id: 'service_3', name: 'Haircut & Beard', price: 60, category: 'combo' },
    { id: 'service_4', name: 'Kids Haircut', price: 30, category: 'kids' },
  ];

  const stylists = [
    { id: 'stylist_1', name: 'Mike Johnson', experience: 'senior' },
    { id: 'stylist_2', name: 'David Smith', experience: 'junior' },
    { id: 'stylist_3', name: 'Chris Wilson', experience: 'senior' },
  ];

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceSelection = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    handleInputChange('service_id', serviceId);
    
    // Track service selection in GTM
    gtmIntegration.trackServiceBookingFunnel('service_selected', service);
  };

  const handleStylistSelection = (stylistId: string) => {
    const stylist = stylists.find(s => s.id === stylistId);
    handleInputChange('stylist_id', stylistId);
    
    // Track stylist selection in GTM
    gtmIntegration.trackServiceBookingFunnel('stylist_selected', stylist);
  };

  const handleDateSelection = (dateTime: string) => {
    handleInputChange('date_time', dateTime);
    
    // Track date selection in GTM
    gtmIntegration.trackServiceBookingFunnel('date_selected', { dateTime });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Track booking attempt in GTM
      gtmIntegration.trackServiceBookingFunnel('booking_attempt', {
        service_id: formData.service_id,
        stylist_id: formData.stylist_id,
      });

      // Create appointment using protobuf API with GTM tracking
      await gtmIntegration.trackAppointmentCreation(formData);

      toast.success('Appointment booked successfully!');
      
      // Track successful booking
      gtmIntegration.trackServiceBookingFunnel('booking_completed', {
        service_id: formData.service_id,
        stylist_id: formData.stylist_id,
      });

      // Reset form
      setFormData({
        customer_id: '',
        stylist_id: '',
        service_id: '',
        date_time: '',
        notes: '',
      });
      setCurrentStep(1);

    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Failed to book appointment. Please try again.');
      
      // Track booking failure
      gtmIntegration.trackServiceBookingFunnel('booking_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    gtmIntegration.trackServiceBookingFunnel(`step_${currentStep}_completed`);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const selectedService = services.find(s => s.id === formData.service_id);
  const selectedStylist = stylists.find(s => s.id === formData.stylist_id);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Book Your Appointment</CardTitle>
        <CardDescription>
          Step {currentStep} of 3 - Let's get you scheduled at Modern Men
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="service">Select Service</Label>
                <Select value={formData.service_id} onValueChange={handleServiceSelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{service.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ${service.price}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedService && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">{selectedService.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Category: {selectedService.category}
                  </p>
                  <p className="text-lg font-semibold">${selectedService.price}</p>
                </div>
              )}
              
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={!formData.service_id}
                className="w-full"
              >
                Next: Choose Stylist
              </Button>
            </div>
          )}

          {/* Step 2: Stylist Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="stylist">Select Stylist</Label>
                <Select value={formData.stylist_id} onValueChange={handleStylistSelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your stylist" />
                  </SelectTrigger>
                  <SelectContent>
                    {stylists.map((stylist) => (
                      <SelectItem key={stylist.id} value={stylist.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{stylist.name}</span>
                          <span className="text-sm text-muted-foreground capitalize">
                            {stylist.experience}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedStylist && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">{selectedStylist.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    Experience: {selectedStylist.experience}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={nextStep}
                  disabled={!formData.stylist_id}
                  className="flex-1"
                >
                  Next: Schedule
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Date & Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="date_time">Select Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.date_time}
                  onChange={(e) => handleDateSelection(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Special Requests (Optional)</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any special requests or notes for your stylist..."
                  rows={3}
                />
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Service:</strong> {selectedService?.name}</p>
                  <p><strong>Stylist:</strong> {selectedStylist?.name}</p>
                  <p><strong>Date:</strong> {formData.date_time ? new Date(formData.date_time).toLocaleString() : 'Not selected'}</p>
                  <p><strong>Total:</strong> ${selectedService?.price}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading || !formData.date_time}
                  className="flex-1"
                >
                  {isLoading ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
