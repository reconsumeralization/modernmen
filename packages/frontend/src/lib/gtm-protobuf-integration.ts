/**
 * YOLO GTM-Protobuf Integration for Modern Men Salon
 * 
 * This module bridges the gap between protobuf API responses and GTM tracking
 * to provide comprehensive analytics for the salon management system.
 */

import { apiClient } from './protobuf-client';

// GTM Event Types
export interface GTMEvent {
  event: string;
  event_category: string;
  event_action: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Enhanced appointment data with tracking
export interface AppointmentWithTracking {
  appointment: any;
  tracking_data: {
    customer_tier: string;
    service_category: string;
    appointment_value: number;
    booking_channel: string;
    stylist_experience: string;
  };
}

// GTM Integration Class
export class GTMProtobufIntegration {
  private gtmId: string;

  constructor(gtmId: string = process.env.NEXT_PUBLIC_GTM_ID || '') {
    this.gtmId = gtmId;
  }

  // Push event to GTM
  private pushToGTM(event: GTMEvent): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.event, {
        event_category: event.event_category,
        event_action: event.event_action,
        event_label: event.event_label,
        value: event.value,
        ...event.custom_parameters,
      });
    }
  }

  // Track appointment creation with protobuf data
  async trackAppointmentCreation(appointmentData: any): Promise<void> {
    try {
      // Create appointment via protobuf API
      const response = await apiClient.appointments.createAppointment(appointmentData);
      
      if (response.success && response.data) {
        // Extract tracking data
        const trackingData = this.extractAppointmentTrackingData(response.data);
        
        // Push to GTM
        this.pushToGTM({
          event: 'appointment_created',
          event_category: 'booking',
          event_action: 'create',
          event_label: trackingData.service_category,
          value: trackingData.appointment_value,
          custom_parameters: {
            customer_tier: trackingData.customer_tier,
            service_category: trackingData.service_category,
            appointment_value: trackingData.appointment_value,
            booking_channel: trackingData.booking_channel,
            stylist_experience: trackingData.stylist_experience,
            appointment_id: response.data.id,
          },
        });

        console.log('✅ Appointment created and tracked:', response.data.id);
      } else {
        // Track failed appointment creation
        this.pushToGTM({
          event: 'appointment_creation_failed',
          event_category: 'booking',
          event_action: 'error',
          event_label: 'api_error',
          custom_parameters: {
            error_message: response.error,
          },
        });
      }
    } catch (error) {
      console.error('❌ Failed to track appointment creation:', error);
    }
  }

  // Track customer registration
  async trackCustomerRegistration(customerData: any): Promise<void> {
    try {
      const response = await apiClient.customers.createCustomer(customerData);
      
      if (response.success && response.data) {
        this.pushToGTM({
          event: 'customer_registered',
          event_category: 'customer',
          event_action: 'register',
          event_label: 'new_customer',
          custom_parameters: {
            customer_id: response.data.id,
            customer_tier: response.data.tier || 'BRONZE',
            registration_source: 'website',
          },
        });
      }
    } catch (error) {
      console.error('❌ Failed to track customer registration:', error);
    }
  }

  // Track appointment completion
  async trackAppointmentCompletion(appointmentId: string): Promise<void> {
    try {
      const response = await apiClient.appointments.getAppointment(appointmentId);
      
      if (response.success && response.data) {
        const trackingData = this.extractAppointmentTrackingData(response.data);
        
        this.pushToGTM({
          event: 'appointment_completed',
          event_category: 'booking',
          event_action: 'complete',
          event_label: trackingData.service_category,
          value: trackingData.appointment_value,
          custom_parameters: {
            appointment_id: appointmentId,
            service_category: trackingData.service_category,
            appointment_value: trackingData.appointment_value,
            customer_tier: trackingData.customer_tier,
          },
        });
      }
    } catch (error) {
      console.error('❌ Failed to track appointment completion:', error);
    }
  }

  // Track customer loyalty points earned
  async trackLoyaltyPointsEarned(customerId: string, pointsEarned: number): Promise<void> {
    this.pushToGTM({
      event: 'loyalty_points_earned',
      event_category: 'loyalty',
      event_action: 'earn',
      event_label: 'points_earned',
      value: pointsEarned,
      custom_parameters: {
        customer_id: customerId,
        points_earned: pointsEarned,
      },
    });
  }

  // Track service booking funnel
  trackServiceBookingFunnel(step: string, serviceData?: any): void {
    this.pushToGTM({
      event: 'booking_funnel',
      event_category: 'conversion',
      event_action: step,
      event_label: serviceData?.category || 'general',
      custom_parameters: {
        funnel_step: step,
        service_name: serviceData?.name,
        service_price: serviceData?.price,
      },
    });
  }

  // Extract tracking data from appointment
  private extractAppointmentTrackingData(appointment: any): any {
    return {
      customer_tier: appointment.customer?.tier || 'BRONZE',
      service_category: appointment.service?.category || 'general',
      appointment_value: appointment.price || 0,
      booking_channel: 'website',
      stylist_experience: appointment.stylist?.experience_level || 'standard',
    };
  }

  // Track page views with protobuf context
  trackPageView(pageName: string, contextData?: any): void {
    this.pushToGTM({
      event: 'page_view',
      event_category: 'engagement',
      event_action: 'view',
      event_label: pageName,
      custom_parameters: {
        page_name: pageName,
        user_type: contextData?.userType || 'guest',
        customer_tier: contextData?.customerTier,
        ...contextData,
      },
    });
  }

  // Track search functionality
  trackSearch(searchTerm: string, resultsCount: number): void {
    this.pushToGTM({
      event: 'search',
      event_category: 'engagement',
      event_action: 'search',
      event_label: searchTerm,
      value: resultsCount,
      custom_parameters: {
        search_term: searchTerm,
        results_count: resultsCount,
      },
    });
  }
}

// Create default instance
export const gtmProtobufIntegration = new GTMProtobufIntegration();

// React Hook for GTM-Protobuf integration
export function useGTMProtobufIntegration() {
  return gtmProtobufIntegration;
}

// Utility function to track protobuf API calls
export function trackProtobufAPICall(
  apiName: string, 
  action: string, 
  success: boolean, 
  responseTime?: number
): void {
  gtmProtobufIntegration.pushToGTM({
    event: 'api_call',
    event_category: 'performance',
    event_action: action,
    event_label: apiName,
    value: responseTime,
    custom_parameters: {
      api_name: apiName,
      success: success,
      response_time_ms: responseTime,
    },
  });
}
