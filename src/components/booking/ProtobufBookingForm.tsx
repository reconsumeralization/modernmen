/**
 * YOLO Protobuf.js + GTM Booking Form for Modern Men Salon
 * 
 * This component demonstrates the complete integration of protobuf.js
 * serialization with GTM tracking for appointment booking.
 */

'use client';

import { useState } from 'react';
import { useProtobufGTMIntegration, createAppointmentMessage, createCustomerMessage } from '@/lib/protobuf-gtm-integration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface BookingFormData {
  customer_id: string;
  stylist_id: string;
  service_id: string;
  date_time: string;
  notes?: string;
}

export default function ProtobufBookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    customer_id: '',
    stylist_id: '',
    service_id: '',
    date_time: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  const protobufGTM = useProtobufGTMIntegration();

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
    
    // Track service selection with protobuf context
    protobufGTM.trackBookingFunnel('service_selected', {
      service_id: serviceId,
      service_name: service?.name,
      service_price: service?.price,
      protobuf_ready: true,
    });
  };

  const handleStylistSelection = (stylistId: string) => {
    const stylist = stylists.find(s => s.id === stylistId);
    handleInputChange('stylist_id', stylistId);
    
    // Track stylist selection with protobuf context
    protobufGTM.trackBookingFunnel('stylist_selected', {
      stylist_id: stylistId,
      stylist_name: stylist?.name,
      stylist_experience: stylist?.experience,
      protobuf_ready: true,
    });
  };

  const handleDateSelection = (dateTime: string) => {
    handleInputChange('date_time', dateTime);
    
    // Track date selection with protobuf context
    protobufGTM.trackBookingFunnel('date_selected', {
      date_time: dateTime,
      protobuf_ready: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Track booking attempt
      protobufGTM.trackBookingFunnel('booking_attempt', {
        service_id: formData.service_id,
        stylist_id: formData.stylist_id,
        protobuf_ready: true,
      });

      // Create appointment message with protobuf
      const appointmentMessage = createAppointmentMessage({
        customer_id: formData.customer_id || 'temp_customer',
        stylist_id: formData.stylist_id,
        service_id: formData.service_id,
        date_time: formData.date_time,
        notes: formData.notes,
        price: services.find(s => s.id === formData.service_id)?.price || 0,
      });

      // Create appointment using protobuf + GTM integration
      const result = await protobufGTM.trackAppointmentCreation(appointmentMessage);

      // Calculate performance metrics
      const metrics = protobufGTM.compareSerializationSizes(appointmentMessage, {} as any);
      setPerformanceMetrics(metrics);

      toast.success('Appointment booked successfully with protobuf!');
      
      // Track successful booking
      protobufGTM.trackBookingFunnel('booking_completed', {
        service_id: formData.service_id,
        stylist_id: formData.stylist_id,
        appointment_id: result.id,
        protobuf_used: true,
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
      protobufGTM.trackBookingFunnel('booking_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        protobuf_used: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    protobufGTM.trackBookingFunnel(`step_${currentStep}_completed`, {
      protobuf_ready: true,
    });
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const selectedService = services.find(s => s.id === formData.service_id);
  const selectedStylist = stylists.find(s => s.id === formData.stylist_id);

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Book Your Appointment
            <Badge variant="secondary" className="text-xs">
              Protobuf + GTM
            </Badge>
          </CardTitle>
          <CardDescription>
            Step {currentStep} of 3 - Type-safe booking with protobuf serialization and GTM tracking
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
                    {isLoading ? 'Booking with Protobuf...' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Performance Metrics Display */}
      {performanceMetrics && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Protobuf Performance Metrics</CardTitle>
            <CardDescription>
              Comparison of JSON vs Protobuf serialization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {performanceMetrics.jsonSize} bytes
                </div>
                <div className="text-sm text-muted-foreground">JSON Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {performanceMetrics.protobufSize} bytes
                </div>
                <div className="text-sm text-muted-foreground">Protobuf Size</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">
                  {performanceMetrics.compressionRatio.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Compression Ratio</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {performanceMetrics.sizeReduction.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Size Reduction</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
