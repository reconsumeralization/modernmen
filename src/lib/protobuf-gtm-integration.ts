/**
 * YOLO Protobuf.js + GTM Integration for Modern Men Salon
 * 
 * This module combines protobuf.js serialization with GTM tracking
 * to provide both type-safe data handling and comprehensive analytics.
 */

import * as protobuf from 'protobufjs';

// GTM Event Types
export interface GTMEvent {
  event: string;
  event_category: string;
  event_action: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Protobuf Message Types
export interface AppointmentMessage {
  id?: string;
  customer_id: string;
  stylist_id: string;
  service_id: string;
  date_time: string;
  duration_minutes?: number;
  status?: string;
  notes?: string;
  price?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerMessage {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  status?: string;
  tier?: string;
  loyalty_points?: number;
  preferred_stylist_id?: string;
  preferences?: string[];
  created_at?: string;
  updated_at?: string;
}

// Protobuf Root and Messages
let root: protobuf.Root;
let AppointmentMessage: protobuf.Type;
let CustomerMessage: protobuf.Type;

// Initialize protobuf messages
async function initializeProtobuf() {
  try {
    // Create protobuf root
    root = new protobuf.Root();
    
    // Define Appointment message
    AppointmentMessage = new protobuf.Type("Appointment")
      .add(new protobuf.Field("id", 1, "string", "optional"))
      .add(new protobuf.Field("customer_id", 2, "string"))
      .add(new protobuf.Field("stylist_id", 3, "string"))
      .add(new protobuf.Field("service_id", 4, "string"))
      .add(new protobuf.Field("date_time", 5, "string"))
      .add(new protobuf.Field("duration_minutes", 6, "int32", "optional"))
      .add(new protobuf.Field("status", 7, "string", "optional"))
      .add(new protobuf.Field("notes", 8, "string", "optional"))
      .add(new protobuf.Field("price", 9, "double", "optional"))
      .add(new protobuf.Field("created_at", 10, "string", "optional"))
      .add(new protobuf.Field("updated_at", 11, "string", "optional"));

    // Define Customer message
    CustomerMessage = new protobuf.Type("Customer")
      .add(new protobuf.Field("id", 1, "string", "optional"))
      .add(new protobuf.Field("first_name", 2, "string"))
      .add(new protobuf.Field("last_name", 3, "string"))
      .add(new protobuf.Field("email", 4, "string"))
      .add(new protobuf.Field("phone", 5, "string"))
      .add(new protobuf.Field("avatar_url", 6, "string", "optional"))
      .add(new protobuf.Field("status", 7, "string", "optional"))
      .add(new protobuf.Field("tier", 8, "string", "optional"))
      .add(new protobuf.Field("loyalty_points", 9, "int32", "optional"))
      .add(new protobuf.Field("preferred_stylist_id", 10, "string", "optional"))
      .add(new protobuf.Field("preferences", 11, "string", "repeated"))
      .add(new protobuf.Field("created_at", 12, "string", "optional"))
      .add(new protobuf.Field("updated_at", 13, "string", "optional"));

    // Add to root
    root.define("modernmen").add(AppointmentMessage).add(CustomerMessage);
    
    console.log('✅ Protobuf messages initialized');
  } catch (error) {
    console.error('❌ Failed to initialize protobuf:', error);
  }
}

// GTM Integration Class
export class ProtobufGTMIntegration {
  private gtmId: string;
  private isInitialized: boolean = false;

  constructor(gtmId: string = process.env.NEXT_PUBLIC_GTM_ID || '') {
    this.gtmId = gtmId;
    this.initialize();
  }

  private async initialize() {
    if (!this.isInitialized) {
      await initializeProtobuf();
      this.isInitialized = true;
    }
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

  // Serialize data to protobuf binary
  private serializeToProtobuf(data: any, messageType: protobuf.Type): Uint8Array {
    try {
      const message = messageType.create(data);
      const buffer = messageType.encode(message).finish();
      return new Uint8Array(buffer);
    } catch (error) {
      console.error('❌ Protobuf serialization failed:', error);
      throw error;
    }
  }

  // Deserialize protobuf binary to object
  private deserializeFromProtobuf(data: Uint8Array, messageType: protobuf.Type): any {
    try {
      const message = messageType.decode(data);
      return messageType.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
      });
    } catch (error) {
      console.error('❌ Protobuf deserialization failed:', error);
      throw error;
    }
  }

  // Track appointment creation with protobuf serialization
  async trackAppointmentCreation(appointmentData: AppointmentMessage): Promise<any> {
    await this.initialize();
    
    try {
      // Track the attempt
      this.pushToGTM({
        event: 'appointment_creation_attempt',
        event_category: 'booking',
        event_action: 'attempt',
        event_label: 'protobuf_serialization',
        custom_parameters: {
          service_id: appointmentData.service_id,
          stylist_id: appointmentData.stylist_id,
        },
      });

      // Serialize to protobuf
      const serialized = this.serializeToProtobuf(appointmentData, AppointmentMessage);
      
      // Track serialization success
      this.pushToGTM({
        event: 'protobuf_serialization_success',
        event_category: 'performance',
        event_action: 'serialize',
        event_label: 'appointment',
        value: serialized.length,
        custom_parameters: {
          original_size: JSON.stringify(appointmentData).length,
          compressed_size: serialized.length,
          compression_ratio: (serialized.length / JSON.stringify(appointmentData).length * 100).toFixed(2),
        },
      });

      // Simulate API call with protobuf data
      const response = await this.sendProtobufData('/api/appointments', serialized);
      
      // Deserialize response
      const deserialized = this.deserializeFromProtobuf(response, AppointmentMessage);
      
      // Track successful creation
      this.pushToGTM({
        event: 'appointment_created',
        event_category: 'booking',
        event_action: 'create',
        event_label: 'success',
        value: appointmentData.price || 0,
        custom_parameters: {
          appointment_id: deserialized.id,
          service_id: appointmentData.service_id,
          stylist_id: appointmentData.stylist_id,
          protobuf_used: true,
        },
      });

      return deserialized;
    } catch (error) {
      // Track failure
      this.pushToGTM({
        event: 'appointment_creation_failed',
        event_category: 'booking',
        event_action: 'error',
        event_label: 'protobuf_error',
        custom_parameters: {
          error_message: error instanceof Error ? error.message : 'Unknown error',
          service_id: appointmentData.service_id,
        },
      });
      throw error;
    }
  }

  // Track customer registration with protobuf
  async trackCustomerRegistration(customerData: CustomerMessage): Promise<any> {
    await this.initialize();
    
    try {
      // Track registration attempt
      this.pushToGTM({
        event: 'customer_registration_attempt',
        event_category: 'customer',
        event_action: 'attempt',
        event_label: 'protobuf_serialization',
      });

      // Serialize to protobuf
      const serialized = this.serializeToProtobuf(customerData, CustomerMessage);
      
      // Track serialization
      this.pushToGTM({
        event: 'protobuf_serialization_success',
        event_category: 'performance',
        event_action: 'serialize',
        event_label: 'customer',
        value: serialized.length,
        custom_parameters: {
          original_size: JSON.stringify(customerData).length,
          compressed_size: serialized.length,
        },
      });

      // Send to API
      const response = await this.sendProtobufData('/api/customers', serialized);
      
      // Deserialize response
      const deserialized = this.deserializeFromProtobuf(response, CustomerMessage);
      
      // Track successful registration
      this.pushToGTM({
        event: 'customer_registered',
        event_category: 'customer',
        event_action: 'register',
        event_label: 'success',
        custom_parameters: {
          customer_id: deserialized.id,
          customer_tier: customerData.tier || 'BRONZE',
          protobuf_used: true,
        },
      });

      return deserialized;
    } catch (error) {
      this.pushToGTM({
        event: 'customer_registration_failed',
        event_category: 'customer',
        event_action: 'error',
        event_label: 'protobuf_error',
        custom_parameters: {
          error_message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  // Send protobuf data to API
  private async sendProtobufData(endpoint: string, data: Uint8Array): Promise<Uint8Array> {
    const startTime = performance.now();
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-protobuf',
          'Accept': 'application/x-protobuf',
          'Content-Length': data.length.toString(),
        },
        body: data,
      });

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = new Uint8Array(await response.arrayBuffer());
      
      // Track API performance
      this.pushToGTM({
        event: 'protobuf_api_call',
        event_category: 'performance',
        event_action: 'api_call',
        event_label: endpoint,
        value: Math.round(responseTime),
        custom_parameters: {
          endpoint: endpoint,
          request_size: data.length,
          response_size: responseData.length,
          response_time_ms: Math.round(responseTime),
          status_code: response.status,
        },
      });

      return responseData;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Track API failure
      this.pushToGTM({
        event: 'protobuf_api_error',
        event_category: 'performance',
        event_action: 'api_error',
        event_label: endpoint,
        value: Math.round(responseTime),
        custom_parameters: {
          endpoint: endpoint,
          error_message: error instanceof Error ? error.message : 'Unknown error',
          response_time_ms: Math.round(responseTime),
        },
      });
      
      throw error;
    }
  }

  // Track protobuf performance metrics
  trackProtobufPerformance(operation: string, originalSize: number, protobufSize: number): void {
    const compressionRatio = (protobufSize / originalSize * 100).toFixed(2);
    const sizeReduction = ((originalSize - protobufSize) / originalSize * 100).toFixed(2);
    
    this.pushToGTM({
      event: 'protobuf_performance',
      event_category: 'performance',
      event_action: operation,
      event_label: 'compression',
      value: protobufSize,
      custom_parameters: {
        original_size: originalSize,
        protobuf_size: protobufSize,
        compression_ratio: compressionRatio,
        size_reduction_percent: sizeReduction,
      },
    });
  }

  // Track booking funnel with protobuf context
  trackBookingFunnel(step: string, data?: any): void {
    this.pushToGTM({
      event: 'booking_funnel',
      event_category: 'conversion',
      event_action: step,
      event_label: 'protobuf_integrated',
      custom_parameters: {
        funnel_step: step,
        protobuf_ready: true,
        ...data,
      },
    });
  }

  // Track search with protobuf serialization
  async trackSearchWithProtobuf(searchTerm: string, results: any[]): Promise<void> {
    await this.initialize();
    
    try {
      // Serialize search results to protobuf
      const serialized = this.serializeToProtobuf({ results }, AppointmentMessage);
      
      this.pushToGTM({
        event: 'search_with_protobuf',
        event_category: 'engagement',
        event_action: 'search',
        event_label: searchTerm,
        value: results.length,
        custom_parameters: {
          search_term: searchTerm,
          results_count: results.length,
          protobuf_size: serialized.length,
          protobuf_used: true,
        },
      });
    } catch (error) {
      console.error('❌ Search tracking failed:', error);
    }
  }

  // Utility: Compare JSON vs Protobuf sizes
  compareSerializationSizes(data: any, messageType: protobuf.Type): {
    jsonSize: number;
    protobufSize: number;
    compressionRatio: number;
    sizeReduction: number;
  } {
    const jsonString = JSON.stringify(data);
    const jsonSize = new TextEncoder().encode(jsonString).length;
    const serialized = this.serializeToProtobuf(data, messageType);
    const protobufSize = serialized.length;
    const compressionRatio = (protobufSize / jsonSize * 100);
    const sizeReduction = ((jsonSize - protobufSize) / jsonSize * 100);

    return {
      jsonSize,
      protobufSize,
      compressionRatio,
      sizeReduction,
    };
  }
}

// Create default instance
export const protobufGTMIntegration = new ProtobufGTMIntegration();

// React Hook for protobuf-GTM integration
export function useProtobufGTMIntegration() {
  return protobufGTMIntegration;
}

// Utility functions
export function createAppointmentMessage(data: Partial<AppointmentMessage>): AppointmentMessage {
  return {
    customer_id: data.customer_id || '',
    stylist_id: data.stylist_id || '',
    service_id: data.service_id || '',
    date_time: data.date_time || new Date().toISOString(),
    duration_minutes: data.duration_minutes || 60,
    status: data.status || 'PENDING',
    notes: data.notes || '',
    price: data.price || 0,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
  };
}

export function createCustomerMessage(data: Partial<CustomerMessage>): CustomerMessage {
  return {
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    email: data.email || '',
    phone: data.phone || '',
    avatar_url: data.avatar_url || '',
    status: data.status || 'ACTIVE',
    tier: data.tier || 'BRONZE',
    loyalty_points: data.loyalty_points || 0,
    preferred_stylist_id: data.preferred_stylist_id || '',
    preferences: data.preferences || [],
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
  };
}
