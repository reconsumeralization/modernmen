/**
 * YOLO Protobuf Client for Modern Men Salon
 * 
 * This client provides type-safe API access using protobuf definitions
 * for the Modern Men Hair Salon management system.
 */

import { ApiResponse, createSuccessResponse, createErrorResponse } from './protobuf';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Appointment API Client
export class AppointmentApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async createAppointment(data: {
    customer_id: string;
    stylist_id: string;
    service_id: string;
    date_time: string;
    notes?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return createSuccessResponse(result, 'Appointment created successfully');
    } catch (error) {
      return createErrorResponse(
        'Failed to create appointment',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  async getAppointment(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/appointments/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return createSuccessResponse(result);
    } catch (error) {
      return createErrorResponse(
        'Failed to get appointment',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  async updateAppointment(id: string, data: {
    date_time?: string;
    stylist_id?: string;
    service_id?: string;
    notes?: string;
    status?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return createSuccessResponse(result, 'Appointment updated successfully');
    } catch (error) {
      return createErrorResponse(
        'Failed to update appointment',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/appointments/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return createSuccessResponse(result, 'Appointment cancelled successfully');
    } catch (error) {
      return createErrorResponse(
        'Failed to cancel appointment',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  async listAppointments(params: {
    customer_id?: string;
    stylist_id?: string;
    date_from?: string;
    date_to?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<any>> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/appointments?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return createSuccessResponse(result);
    } catch (error) {
      return createErrorResponse(
        'Failed to list appointments',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}

// Customer API Client
export class CustomerApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async createCustomer(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar_url?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return createSuccessResponse(result, 'Customer created successfully');
    } catch (error) {
      return createErrorResponse(
        'Failed to create customer',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  async getCustomer(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/customers/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return createSuccessResponse(result);
    } catch (error) {
      return createErrorResponse(
        'Failed to get customer',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  async updateCustomer(id: string, data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
    status?: string;
    tier?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return createSuccessResponse(result, 'Customer updated successfully');
    } catch (error) {
      return createErrorResponse(
        'Failed to update customer',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  async getCustomerHistory(id: string, params: {
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<any>> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/customers/${id}/history?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return createSuccessResponse(result);
    } catch (error) {
      return createErrorResponse(
        'Failed to get customer history',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}

// Main API Client Factory
export class ModernMenApiClient {
  public appointments: AppointmentApiClient;
  public customers: CustomerApiClient;

  constructor(baseUrl: string = API_BASE_URL) {
    this.appointments = new AppointmentApiClient(baseUrl);
    this.customers = new CustomerApiClient(baseUrl);
  }

  // Utility method to check API health
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return createSuccessResponse(result, 'API is healthy');
    } catch (error) {
      return createErrorResponse(
        'API health check failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}

// Create default client instance
export const apiClient = new ModernMenApiClient();

// React Hook for using the API client
export function useApiClient() {
  return apiClient;
}

// Export individual clients for direct use
export { AppointmentApiClient, CustomerApiClient };
