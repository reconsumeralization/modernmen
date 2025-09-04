/**
 * YOLO Protobuf Transport Protocols for Modern Men Salon
 * 
 * This module demonstrates the different transport protocols
 * that protobuf data can use when traveling over the network.
 */

import { apiClient } from './protobuf-client';

// Transport Protocol Types
export enum TransportProtocol {
  HTTP_JSON = 'http_json',      // Protobuf serialized, sent as JSON
  HTTP_BINARY = 'http_binary',  // Protobuf binary over HTTP
  GRPC = 'grpc',               // HTTP/2 with protobuf
  WEBSOCKET = 'websocket',     // WebSocket with protobuf
  TCP = 'tcp',                 // Raw TCP with protobuf
  UDP = 'udp'                  // UDP with protobuf (rare)
}

// Transport Configuration
export interface TransportConfig {
  protocol: TransportProtocol;
  endpoint: string;
  timeout?: number;
  headers?: Record<string, string>;
  compression?: boolean;
}

// HTTP Transport with Protobuf
export class HTTPProtobufTransport {
  private config: TransportConfig;

  constructor(config: TransportConfig) {
    this.config = config;
  }

  // Send protobuf as binary over HTTP
  async sendBinary(data: Uint8Array): Promise<Uint8Array> {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-protobuf',
        'Accept': 'application/x-protobuf',
        'Content-Length': data.length.toString(),
        ...this.config.headers,
      },
      body: data,
      signal: this.config.timeout ? AbortSignal.timeout(this.config.timeout) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return new Uint8Array(await response.arrayBuffer());
  }

  // Send protobuf as JSON (fallback)
  async sendJSON(data: any): Promise<any> {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...this.config.headers,
      },
      body: JSON.stringify(data),
      signal: this.config.timeout ? AbortSignal.timeout(this.config.timeout) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

// WebSocket Transport with Protobuf
export class WebSocketProtobufTransport {
  private ws: WebSocket | null = null;
  private config: TransportConfig;

  constructor(config: TransportConfig) {
    this.config = config;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.config.endpoint);
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket connected for protobuf transport');
        resolve();
      };
      
      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        reject(error);
      };
    });
  }

  send(data: Uint8Array): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }
    
    // Send binary protobuf data
    this.ws.send(data);
  }

  onMessage(callback: (data: Uint8Array) => void): void {
    if (!this.ws) return;
    
    this.ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        callback(new Uint8Array(event.data));
      } else if (event.data instanceof Blob) {
        event.data.arrayBuffer().then(buffer => {
          callback(new Uint8Array(buffer));
        });
      }
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// gRPC-like Transport (simplified)
export class GRPCProtobufTransport {
  private config: TransportConfig;

  constructor(config: TransportConfig) {
    this.config = config;
  }

  // Simulate gRPC call with HTTP/2-like behavior
  async call(service: string, method: string, data: Uint8Array): Promise<Uint8Array> {
    const response = await fetch(`${this.config.endpoint}/${service}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/grpc+proto',
        'Accept': 'application/grpc+proto',
        'grpc-timeout': this.config.timeout ? `${this.config.timeout}ms` : '30s',
        ...this.config.headers,
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(`gRPC ${response.status}: ${response.statusText}`);
    }

    return new Uint8Array(await response.arrayBuffer());
  }
}

// Transport Factory
export class ProtobufTransportFactory {
  static create(config: TransportConfig) {
    switch (config.protocol) {
      case TransportProtocol.HTTP_BINARY:
        return new HTTPProtobufTransport(config);
      case TransportProtocol.WEBSOCKET:
        return new WebSocketProtobufTransport(config);
      case TransportProtocol.GRPC:
        return new GRPCProtobufTransport(config);
      default:
        throw new Error(`Unsupported transport protocol: ${config.protocol}`);
    }
  }
}

// Enhanced API Client with Transport Options
export class ModernMenProtobufClient {
  private httpTransport: HTTPProtobufTransport;
  private wsTransport: WebSocketProtobufTransport;
  private grpcTransport: GRPCProtobufTransport;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.httpTransport = new HTTPProtobufTransport({
      protocol: TransportProtocol.HTTP_BINARY,
      endpoint: `${baseUrl}/api/protobuf`,
    });

    this.wsTransport = new WebSocketProtobufTransport({
      protocol: TransportProtocol.WEBSOCKET,
      endpoint: `${baseUrl.replace('http', 'ws')}/ws/protobuf`,
    });

    this.grpcTransport = new GRPCProtobufTransport({
      protocol: TransportProtocol.GRPC,
      endpoint: `${baseUrl}/grpc`,
    });
  }

  // Create appointment using different transport protocols
  async createAppointmentHTTP(data: any): Promise<any> {
    // Serialize to protobuf binary
    const serialized = this.serializeToProtobuf(data);
    
    // Send over HTTP
    const response = await this.httpTransport.sendBinary(serialized);
    
    // Deserialize response
    return this.deserializeFromProtobuf(response);
  }

  async createAppointmentWebSocket(data: any): Promise<any> {
    // Connect WebSocket
    await this.wsTransport.connect();
    
    // Serialize and send
    const serialized = this.serializeToProtobuf(data);
    this.wsTransport.send(serialized);
    
    // Wait for response
    return new Promise((resolve) => {
      this.wsTransport.onMessage((response) => {
        const deserialized = this.deserializeFromProtobuf(response);
        resolve(deserialized);
      });
    });
  }

  async createAppointmentGRPC(data: any): Promise<any> {
    // Serialize to protobuf
    const serialized = this.serializeToProtobuf(data);
    
    // Send via gRPC
    const response = await this.grpcTransport.call('AppointmentService', 'CreateAppointment', serialized);
    
    // Deserialize response
    return this.deserializeFromProtobuf(response);
  }

  // Mock serialization/deserialization (in real app, use actual protobuf library)
  private serializeToProtobuf(data: any): Uint8Array {
    // This would use protobufjs or similar
    const jsonString = JSON.stringify(data);
    return new TextEncoder().encode(jsonString);
  }

  private deserializeFromProtobuf(data: Uint8Array): any {
    // This would use protobufjs or similar
    const jsonString = new TextDecoder().decode(data);
    return JSON.parse(jsonString);
  }
}

// Usage Examples
export const protobufClient = new ModernMenProtobufClient();

// Example: Send appointment data via different protocols
export async function demonstrateTransportProtocols() {
  const appointmentData = {
    customer_id: "cust_123",
    stylist_id: "stylist_456",
    service_id: "service_789",
    date_time: "2024-12-19T14:00:00Z",
    notes: "Fade style preferred"
  };

  console.log('🚀 Demonstrating Protobuf Transport Protocols...\n');

  try {
    // HTTP Transport
    console.log('📡 HTTP Transport:');
    const httpResult = await protobufClient.createAppointmentHTTP(appointmentData);
    console.log('✅ HTTP Result:', httpResult);

    // WebSocket Transport
    console.log('\n📡 WebSocket Transport:');
    const wsResult = await protobufClient.createAppointmentWebSocket(appointmentData);
    console.log('✅ WebSocket Result:', wsResult);

    // gRPC Transport
    console.log('\n📡 gRPC Transport:');
    const grpcResult = await protobufClient.createAppointmentGRPC(appointmentData);
    console.log('✅ gRPC Result:', grpcResult);

  } catch (error) {
    console.error('❌ Transport error:', error);
  }
}
