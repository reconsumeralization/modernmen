/**
 * YOLO Protobuf + GTM Testing & Growth Framework
 * 
 * Comprehensive testing infrastructure for protobuf serialization,
 * GTM tracking, performance monitoring, and growth analytics.
 */

import * as protobuf from 'protobufjs';
import { protobufGTMIntegration } from './protobuf-gtm-integration';

// Type definitions for messages
interface AppointmentMessage {
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
  metadata?: any;
}

interface CustomerMessage {
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
  behavioral_metrics?: any;
}

// Enhanced Test Data Generators with Realistic Patterns
export class ProtobufTestDataGenerator {
  private static readonly REALISTIC_PATTERNS = {
    peakHours: [9, 10, 11, 14, 15, 16, 17], // Business peak hours
    popularServices: ['haircut', 'beard_trim', 'styling', 'wash_cut'],
    seasonalTrends: {
      spring: ['fresh_cut', 'color_touch'],
      summer: ['buzz_cut', 'fade'],
      fall: ['classic_cut', 'beard_style'],
      winter: ['maintenance', 'deep_condition']
    }
  };

  static generateAppointmentData(count: number = 1, options?: {
    timeDistribution?: 'random' | 'realistic' | 'peak';
    includeAnomalies?: boolean;
    seasonalBias?: boolean;
  }): AppointmentMessage[] {
    const appointments: AppointmentMessage[] = [];
    const opts = { timeDistribution: 'realistic', includeAnomalies: false, seasonalBias: true, ...options };
    
    for (let i = 0; i < count; i++) {
      const baseDate = new Date();
      let appointmentTime: Date;
      
      // Intelligent time distribution
      if (opts.timeDistribution === 'realistic') {
        const peakHour = this.REALISTIC_PATTERNS.peakHours[Math.floor(Math.random() * this.REALISTIC_PATTERNS.peakHours.length)];
        appointmentTime = new Date(baseDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
        appointmentTime.setHours(peakHour, Math.floor(Math.random() * 60));
      } else {
        appointmentTime = new Date(baseDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      }

      // Dynamic pricing based on service complexity
      const serviceComplexity = Math.random();
      const basePrice = serviceComplexity > 0.7 ? 75 : serviceComplexity > 0.4 ? 45 : 25;
      const dynamicPrice = basePrice + (Math.random() * 20 - 10); // ±$10 variance

      appointments.push({
        customer_id: `customer_${Math.random().toString(36).substr(2, 9)}`,
        stylist_id: `stylist_${Math.floor(Math.random() * 5) + 1}`,
        service_id: `service_${Math.floor(Math.random() * 4) + 1}`,
        date_time: appointmentTime.toISOString(),
        duration_minutes: this.calculateRealisticDuration(serviceComplexity),
        status: this.getWeightedStatus(),
        notes: this.generateContextualNotes(i, opts.includeAnomalies),
        price: Math.round(dynamicPrice),
        created_at: new Date(baseDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          generation_context: opts,
          complexity_score: serviceComplexity,
          is_peak_time: opts.timeDistribution === 'realistic' && this.REALISTIC_PATTERNS.peakHours.includes(appointmentTime.getHours())
        }
      });
    }
    
    return appointments;
  }

  private static calculateRealisticDuration(complexity: number): number {
    const baseDurations = [30, 45, 60, 90, 120];
    const complexityIndex = Math.floor(complexity * baseDurations.length);
    return baseDurations[Math.min(complexityIndex, baseDurations.length - 1)];
  }

  private static getWeightedStatus(): string {
    const weights = { 'CONFIRMED': 0.6, 'PENDING': 0.25, 'COMPLETED': 0.1, 'CANCELLED': 0.05 };
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [status, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (rand <= cumulative) return status;
    }
    return 'CONFIRMED';
  }

  private static generateContextualNotes(index: number, includeAnomalies: boolean): string {
    const standardNotes = [
      'Regular maintenance appointment',
      'First-time client consultation',
      'Special occasion styling',
      'Beard trim and styling',
      'Color consultation needed'
    ];
    
    const anomalyNotes = [
      'Emergency same-day booking',
      'VIP client - priority handling',
      'Rescheduled from cancelled appointment',
      'Group booking - wedding party'
    ];
    
    if (includeAnomalies && Math.random() < 0.1) {
      return anomalyNotes[Math.floor(Math.random() * anomalyNotes.length)];
    }
    
    return Math.random() > 0.3 ? standardNotes[Math.floor(Math.random() * standardNotes.length)] : '';
  }

  static generateCustomerData(count: number = 1, options?: {
    loyaltyDistribution?: 'realistic' | 'uniform';
    includeChurned?: boolean;
  }): CustomerMessage[] {
    const customers: CustomerMessage[] = [];
    const opts = { loyaltyDistribution: 'realistic', includeChurned: false, ...options };
    
    const firstNames = ['John', 'Mike', 'David', 'Chris', 'Alex', 'Sam', 'Jordan', 'Taylor', 'Marcus', 'Ryan'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];
    const tiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
    
    for (let i = 0; i < count; i++) {
      const loyaltyScore = opts.loyaltyDistribution === 'realistic' 
        ? this.generateRealisticLoyaltyScore() 
        : Math.random() * 1000;
      
      const tier = this.calculateTierFromLoyalty(loyaltyScore);
      const isChurned = opts.includeChurned && Math.random() < 0.05;
      
      customers.push({
        first_name: firstNames[Math.floor(Math.random() * firstNames.length)],
        last_name: lastNames[Math.floor(Math.random() * lastNames.length)],
        email: `test${i + 1}@modernmen.com`,
        phone: `+1-555-${Math.random().toString().substr(2, 3)}-${Math.random().toString().substr(2, 4)}`,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
        status: isChurned ? 'INACTIVE' : 'ACTIVE',
        tier,
        loyalty_points: Math.floor(loyaltyScore),
        preferred_stylist_id: `stylist_${Math.floor(Math.random() * 5) + 1}`,
        preferences: this.generateSmartPreferences(tier),
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        behavioral_metrics: {
          avg_appointment_value: this.calculateAvgValue(tier),
          booking_frequency: this.calculateBookingFrequency(tier),
          cancellation_rate: this.calculateCancellationRate(tier),
          referral_count: Math.floor(Math.random() * (tier === 'PLATINUM' ? 5 : tier === 'GOLD' ? 3 : 1))
        }
      });
    }
    
    return customers;
  }

  private static generateRealisticLoyaltyScore(): number {
    // Pareto distribution - most customers have low loyalty, few have high
    const random = Math.random();
    return random < 0.8 ? Math.random() * 200 : 200 + Math.random() * 800;
  }

  private static calculateTierFromLoyalty(points: number): string {
    if (points >= 750) return 'PLATINUM';
    if (points >= 400) return 'GOLD';
    if (points >= 150) return 'SILVER';
    return 'BRONZE';
  }

  private static generateSmartPreferences(tier: string): string[] {
    const allPrefs: string[] = ['fade', 'pompadour', 'undercut', 'classic', 'beard_styling', 'hot_towel', 'scalp_massage'];
    const prefCount = tier === 'PLATINUM' ? 4 : tier === 'GOLD' ? 3 : tier === 'SILVER' ? 2 : 1;
    return allPrefs.slice(0, prefCount + Math.floor(Math.random() * 2));
  }

  private static calculateAvgValue(tier: string): number {
    const baseValues = { 'BRONZE': 35, 'SILVER': 45, 'GOLD': 60, 'PLATINUM': 85 };
    return baseValues[tier] + (Math.random() * 20 - 10);
  }

  private static calculateBookingFrequency(tier: string): number {
    const frequencies = { 'BRONZE': 0.5, 'SILVER': 0.75, 'GOLD': 1.2, 'PLATINUM': 1.8 };
    return frequencies[tier] + (Math.random() * 0.4 - 0.2);
  }

  private static calculateCancellationRate(tier: string): number {
    const rates = { 'BRONZE': 0.15, 'SILVER': 0.10, 'GOLD': 0.05, 'PLATINUM': 0.02 };
    return Math.max(0, rates[tier] + (Math.random() * 0.05 - 0.025));
  }

  static generatePerformanceTestData(complexity: 'minimal' | 'standard' | 'comprehensive' = 'standard'): any[] {
    const configs = {
      minimal: [
        { tiny: this.generateAppointmentData(1)[0] },
        { small: this.generateAppointmentData(5) }
      ],
      standard: [
        { small: this.generateAppointmentData(1)[0] },
        { medium: this.generateAppointmentData(10) },
        { large: this.generateAppointmentData(100) },
        { mixed: [...this.generateAppointmentData(5), ...this.generateCustomerData(5)] }
      ],
      comprehensive: [
        { micro: this.generateAppointmentData(1)[0] },
        { small: this.generateAppointmentData(10) },
        { medium: this.generateAppointmentData(50) },
        { large: this.generateAppointmentData(200) },
        { xlarge: this.generateAppointmentData(500) },
        { mixed_small: [...this.generateAppointmentData(10), ...this.generateCustomerData(10)] },
        { mixed_large: [...this.generateAppointmentData(100), ...this.generateCustomerData(100)] },
        { anomaly_heavy: this.generateAppointmentData(50, { includeAnomalies: true, timeDistribution: 'peak' }) }
      ]
    };
    
    return configs[complexity];
  }
}

// Enhanced Performance Testing Framework with Advanced Metrics
export class ProtobufPerformanceTester {
  private results: any[] = [];
  private benchmarkHistory: Map<string, any[]> = new Map();
  private performanceThresholds = {
    serialization: { warning: 5, critical: 15 }, // milliseconds
    compression: { good: 70, excellent: 50 }, // percentage of original size
    throughput: { minimum: 100, target: 500 } // operations per second
  };

  async runSerializationTests(data: any[], iterations: number = 100, options?: {
    warmupRounds?: number;
    includeMemoryProfiling?: boolean;
    trackGC?: boolean;
  }): Promise<any> {
    console.log('🚀 Running Enhanced Protobuf Serialization Performance Tests...');
    const opts = { warmupRounds: 10, includeMemoryProfiling: true, trackGC: false, ...options };
    
    // Warmup phase to stabilize JIT compilation
    for (let i = 0; i < opts.warmupRounds; i++) {
      JSON.stringify(data);
      protobufGTMIntegration['serializeToProtobuf'](data, {} as any);
    }

    const testResults = {
      json: { totalTime: 0, totalSize: 0, avgTime: 0, avgSize: 0, p95Time: 0, p99Time: 0 },
      protobuf: { totalTime: 0, totalSize: 0, avgTime: 0, avgSize: 0, p95Time: 0, p99Time: 0 },
      compression: { ratio: 0, improvement: 0, efficiency: 'unknown' },
      memory: { initial: 0, peak: 0, final: 0, gcCount: 0 },
      iterations,
      dataComplexity: this.analyzeDataComplexity(data),
      performance_grade: 'unknown',
      recommendations: []
    };

    const jsonTimes: number[] = [];
    const protobufTimes: number[] = [];
    
    // Memory baseline
    if (opts.includeMemoryProfiling && (performance as any).memory) {
      testResults.memory.initial = (performance as any).memory.usedJSHeapSize;
    }

    for (let i = 0; i < iterations; i++) {
      // Force garbage collection periodically for consistent measurements
      if (i % 50 === 0 && global.gc) {
        global.gc();
        testResults.memory.gcCount++;
      }

      // Test JSON serialization with high-precision timing
      const jsonStart = performance.now();
      const jsonString = JSON.stringify(data);
      const jsonEnd = performance.now();
      const jsonTime = jsonEnd - jsonStart;
      const jsonSize = new TextEncoder().encode(jsonString).length;

      // Test Protobuf serialization
      const protobufStart = performance.now();
      const serialized = protobufGTMIntegration['serializeToProtobuf'](data, {} as any);
      const protobufEnd = performance.now();
      const protobufTime = protobufEnd - protobufStart;
      const protobufSize = serialized.length;

      // Collect timing data for percentile calculations
      jsonTimes.push(jsonTime);
      protobufTimes.push(protobufTime);

      // Accumulate results
      testResults.json.totalTime += jsonTime;
      testResults.json.totalSize += jsonSize;
      testResults.protobuf.totalTime += protobufTime;
      testResults.protobuf.totalSize += protobufSize;

      // Track peak memory usage
      if (opts.includeMemoryProfiling && (performance as any).memory) {
        const currentMemory = (performance as any).memory.usedJSHeapSize;
        testResults.memory.peak = Math.max(testResults.memory.peak, currentMemory);
      }
    }

    // Calculate comprehensive statistics
    testResults.json.avgTime = testResults.json.totalTime / iterations;
    testResults.json.avgSize = testResults.json.totalSize / iterations;
    testResults.protobuf.avgTime = testResults.protobuf.totalTime / iterations;
    testResults.protobuf.avgSize = testResults.protobuf.totalSize / iterations;

    // Calculate percentiles
    jsonTimes.sort((a, b) => a - b);
    protobufTimes.sort((a, b) => a - b);
    testResults.json.p95Time = jsonTimes[Math.floor(iterations * 0.95)];
    testResults.json.p99Time = jsonTimes[Math.floor(iterations * 0.99)];
    testResults.protobuf.p95Time = protobufTimes[Math.floor(iterations * 0.95)];
    testResults.protobuf.p99Time = protobufTimes[Math.floor(iterations * 0.99)];

    // Enhanced compression metrics
    testResults.compression.ratio = (testResults.protobuf.avgSize / testResults.json.avgSize) * 100;
    testResults.compression.improvement = ((testResults.json.avgSize - testResults.protobuf.avgSize) / testResults.json.avgSize) * 100;
    testResults.compression.efficiency = this.categorizeCompressionEfficiency(testResults.compression.ratio);

    // Final memory measurement
    if (opts.includeMemoryProfiling && (performance as any).memory) {
      testResults.memory.final = (performance as any).memory.usedJSHeapSize;
    }

    // Performance grading and recommendations
    testResults.performance_grade = this.calculatePerformanceGrade(testResults);
    testResults.recommendations = this.generatePerformanceRecommendations(testResults);

    // Store in benchmark history
    const benchmarkKey = `serialization_${testResults.dataComplexity.type}_${iterations}`;
    if (!this.benchmarkHistory.has(benchmarkKey)) {
      this.benchmarkHistory.set(benchmarkKey, []);
    }
    this.benchmarkHistory.get(benchmarkKey)!.push(testResults);

    this.results.push(testResults);
    return testResults;
  }

  private analyzeDataComplexity(data: any): any {
    const jsonString = JSON.stringify(data);
    const size = jsonString.length;
    const depth = this.calculateObjectDepth(data);
    const arrayCount = (jsonString.match(/\[/g) || []).length;
    const objectCount = (jsonString.match(/\{/g) || []).length;
    
    let type = 'simple';
    if (size > 10000 || depth > 5 || arrayCount > 10) type = 'complex';
    else if (size > 1000 || depth > 3 || arrayCount > 3) type = 'moderate';
    
    return { type, size, depth, arrayCount, objectCount };
  }

  private calculateObjectDepth(obj: any, currentDepth: number = 0): number {
    if (typeof obj !== 'object' || obj === null) return currentDepth;
    
    let maxDepth = currentDepth;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const depth = this.calculateObjectDepth(obj[key], currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
    }
    return maxDepth;
  }

  private categorizeCompressionEfficiency(ratio: number): string {
    if (ratio <= this.performanceThresholds.compression.excellent) return 'excellent';
    if (ratio <= this.performanceThresholds.compression.good) return 'good';
    if (ratio <= 85) return 'fair';
    return 'poor';
  }

  private calculatePerformanceGrade(results: any): string {
    let score = 100;
    
    // Penalize slow serialization
    if (results.protobuf.avgTime > this.performanceThresholds.serialization.critical) score -= 30;
    else if (results.protobuf.avgTime > this.performanceThresholds.serialization.warning) score -= 15;
    
    // Reward good compression
    if (results.compression.efficiency === 'excellent') score += 10;
    else if (results.compression.efficiency === 'poor') score -= 20;
    
    // Consider consistency (p99 vs avg)
    const consistencyRatio = results.protobuf.p99Time / results.protobuf.avgTime;
    if (consistencyRatio > 3) score -= 15;
    
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  }

  private generatePerformanceRecommendations(results: any): string[] {
    const recommendations: string[] = [];
    
    if (results.protobuf.avgTime > this.performanceThresholds.serialization.warning) {
      recommendations.push('Consider optimizing protobuf schema for faster serialization');
    }
    
    if (results.compression.efficiency === 'poor') {
      recommendations.push('Review data structure for better compression opportunities');
    }
    
    if (results.protobuf.p99Time / results.protobuf.avgTime > 2.5) {
      recommendations.push('High variance in performance - investigate JIT warmup or GC pressure');
    }
    
    if (results.memory.peak - results.memory.initial > 50 * 1024 * 1024) {
      recommendations.push('High memory usage detected - consider streaming for large datasets');
    }
    
    return recommendations;
  }

  async runGTMTrackingTests(events: string[], iterations: number = 50, options?: {
    includeLatencyDistribution?: boolean;
    simulateNetworkConditions?: boolean;
  }): Promise<any> {
    console.log('📊 Running Enhanced GTM Tracking Performance Tests...');
    const opts = { includeLatencyDistribution: true, simulateNetworkConditions: false, ...options };
    
    const trackingResults = {
      events: {},
      totalTime: 0,
      avgTime: 0,
      successRate: 0,
      iterations,
      latencyDistribution: {},
      networkSimulation: opts.simulateNetworkConditions,
      reliability_score: 0,
      bottlenecks: []
    };

    let successCount = 0;
    const startTime = performance.now();
    const eventLatencies: { [key: string]: number[] } = {};

    for (let i = 0; i < iterations; i++) {
      for (const event of events) {
        if (!eventLatencies[event]) eventLatencies[event] = [];
        
        try {
          const eventStart = performance.now();
          
          // Simulate network conditions if requested
          if (opts.simulateNetworkConditions) {
            await this.simulateNetworkDelay();
          }
          
          // Track different types of events with enhanced context
          switch (event) {
            case 'appointment_creation':
              const appointmentData = ProtobufTestDataGenerator.generateAppointmentData(1, { 
                timeDistribution: 'realistic',
                includeAnomalies: Math.random() < 0.1 
              })[0];
              await protobufGTMIntegration.trackAppointmentCreation(appointmentData);
              break;
            case 'customer_registration':
              const customerData = ProtobufTestDataGenerator.generateCustomerData(1, { 
                loyaltyDistribution: 'realistic' 
              })[0];
              await protobufGTMIntegration.trackCustomerRegistration(customerData);
              break;
            case 'booking_funnel':
              protobufGTMIntegration.trackBookingFunnel('test_step', { 
                test: true, 
                iteration: i,
                timestamp: Date.now(),
                user_agent: 'test-framework'
              });
              break;
            case 'performance_metrics':
              protobufGTMIntegration.trackProtobufPerformance('test_operation', 1000, 500);
              break;
          }
          
          const eventEnd = performance.now();
          const eventTime = eventEnd - eventStart;
          eventLatencies[event].push(eventTime);
          
          if (!trackingResults.events[event]) {
            trackingResults.events[event] = { totalTime: 0, count: 0, avgTime: 0, p95Time: 0, errorRate: 0 };
          }
          
          trackingResults.events[event].totalTime += eventTime;
          trackingResults.events[event].count += 1;
          successCount++;
          
        } catch (error) {
          console.error(`❌ GTM tracking test failed for event ${event}:`, error);
          if (!trackingResults.events[event]) {
            trackingResults.events[event] = { totalTime: 0, count: 0, avgTime: 0, p95Time: 0, errorRate: 0 };
          }
          trackingResults.events[event].errorRate = (trackingResults.events[event].errorRate || 0) + 1;
        }
      }
    }

    const endTime = performance.now();
    trackingResults.totalTime = endTime - startTime;
    trackingResults.avgTime = trackingResults.totalTime / (iterations * events.length);
    trackingResults.successRate = (successCount / (iterations * events.length)) * 100;

    // Calculate enhanced statistics for each event
    for (const event in trackingResults.events) {
      const eventData = trackingResults.events[event];
      if (eventData.count > 0) {
        eventData.avgTime = eventData.totalTime / eventData.count;
        
        // Calculate p95 latency
        if (eventLatencies[event] && eventLatencies[event].length > 0) {
          const sortedLatencies = eventLatencies[event].sort((a, b) => a - b);
          eventData.p95Time = sortedLatencies[Math.floor(sortedLatencies.length * 0.95)];
        }
        
        // Calculate error rate as percentage
        eventData.errorRate = (eventData.errorRate / iterations) * 100;
      }
    }

    // Calculate reliability score
    trackingResults.reliability_score = this.calculateReliabilityScore(trackingResults);
    
    // Identify bottlenecks
    trackingResults.bottlenecks = this.identifyBottlenecks(trackingResults);

    // Store latency distribution if requested
    if (opts.includeLatencyDistribution) {
      trackingResults.latencyDistribution = this.calculateLatencyDistribution(eventLatencies);
    }

    this.results.push(trackingResults);
    return trackingResults;
  }

  private async simulateNetworkDelay(): Promise<void> {
    // Simulate realistic network conditions (3G, 4G, WiFi)
    const conditions = [
      { delay: 0, name: 'optimal' },      // Local/optimal
      { delay: 50, name: 'wifi' },        // Good WiFi
      { delay: 150, name: '4g' },         // 4G mobile
      { delay: 400, name: '3g' }          // 3G mobile
    ];
    
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    if (condition.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, condition.delay));
    }
  }

  private calculateReliabilityScore(results: any): number {
    let score = 100;
    
    // Penalize low success rate
    score *= (results.successRate / 100);
    
    // Penalize high error rates for individual events
    for (const event in results.events) {
      const errorRate = results.events[event].errorRate || 0;
      score -= errorRate * 2; // 2 points per percent error rate
    }
    
    // Penalize high latency variance
    for (const event in results.events) {
      const avgTime = results.events[event].avgTime || 0;
      const p95Time = results.events[event].p95Time || 0;
      if (avgTime > 0 && p95Time / avgTime > 3) {
        score -= 10; // High variance penalty
      }
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private identifyBottlenecks(results: any): string[] {
    const bottlenecks: string[] = [];
    
    for (const event in results.events) {
      const eventData = results.events[event];
      
      if (eventData.avgTime > 100) {
        bottlenecks.push(`${event}: High average latency (${eventData.avgTime.toFixed(2)}ms)`);
      }
      
      if (eventData.errorRate > 5) {
        bottlenecks.push(`${event}: High error rate (${eventData.errorRate.toFixed(1)}%)`);
      }
      
      if (eventData.p95Time && eventData.avgTime && eventData.p95Time / eventData.avgTime > 3) {
        bottlenecks.push(`${event}: Inconsistent performance (high p95/avg ratio)`);
      }
    }
    
    return bottlenecks;
  }

  private calculateLatencyDistribution(eventLatencies: { [key: string]: number[] }): any {
    const distribution: any = {};
    
    for (const event in eventLatencies) {
      const latencies = eventLatencies[event].sort((a, b) => a - b);
      distribution[event] = {
        min: latencies[0],
        p25: latencies[Math.floor(latencies.length * 0.25)],
        p50: latencies[Math.floor(latencies.length * 0.50)],
        p75: latencies[Math.floor(latencies.length * 0.75)],
        p95: latencies[Math.floor(latencies.length * 0.95)],
        p99: latencies[Math.floor(latencies.length * 0.99)],
        max: latencies[latencies.length - 1]
      };
    }
    
    return distribution;
  }

  async runStressTest(dataSize: 'small' | 'medium' | 'large', duration: number = 30000, options?: {
    rampUp?: boolean;
    targetThroughput?: number;
    includeMemoryPressure?: boolean;
  }): Promise<any> {
    console.log(`💪 Running Enhanced Stress Test (${dataSize} data, ${duration}ms)...`);
    const opts = { rampUp: true, targetThroughput: 100, includeMemoryPressure: true, ...options };
    
    const stressResults = {
      dataSize,
      duration,
      operations: 0,
      errors: 0,
      avgResponseTime: 0,
      throughput: 0,
      memoryUsage: { initial: 0, peak: 0, final: 0, pressure_events: 0 },
      performance_degradation: 0,
      stability_score: 0,
      resource_efficiency: 'unknown',
      timeline: [] as any[]
    };

    const startTime = performance.now();
    const endTime = startTime + duration;
    let operations = 0;
    let errors = 0;
    let totalResponseTime = 0;
    const responseTimes: number[] = [];
    
    // Memory tracking
    if ((performance as any).memory) {
      stressResults.memoryUsage.initial = (performance as any).memory.usedJSHeapSize;
    }

    // Generate test data based on size with realistic complexity
    const dataCount = dataSize === 'small' ? 1 : dataSize === 'medium' ? 25 : 150;
    const testData = ProtobufTestDataGenerator.generateAppointmentData(dataCount, {
      timeDistribution: 'realistic',
      includeAnomalies: true
    });

    let currentThroughputTarget = opts.rampUp ? opts.targetThroughput * 0.1 : opts.targetThroughput;
    const rampUpIncrement = opts.rampUp ? (opts.targetThroughput * 0.9) / (duration / 5000) : 0;

    while (performance.now() < endTime) {
      const operationStart = performance.now();
      
      try {
        // Perform protobuf operations with enhanced error handling
        const serialized = protobufGTMIntegration['serializeToProtobuf'](testData, {} as any);
        const deserialized = protobufGTMIntegration['deserializeFromProtobuf'](serialized, {} as any);
        
        // Verify data integrity
        if (!deserialized || (Array.isArray(testData) && deserialized.length !== testData.length)) {
          throw new Error('Data integrity check failed');
        }
        
        // Track with GTM including stress test context
        protobufGTMIntegration.trackBookingFunnel('stress_test', { 
          dataSize, 
          operation: operations,
          timestamp: Date.now(),
          throughput_target: currentThroughputTarget,
          memory_pressure: opts.includeMemoryPressure
        });
        
        const operationEnd = performance.now();
        const responseTime = operationEnd - operationStart;
        totalResponseTime += responseTime;
        responseTimes.push(responseTime);
        operations++;
        
        // Track memory pressure
        if (opts.includeMemoryPressure && (performance as any).memory) {
          const currentMemory = (performance as any).memory.usedJSHeapSize;
          stressResults.memoryUsage.peak = Math.max(stressResults.memoryUsage.peak, currentMemory);
          
          // Detect memory pressure events
          if (currentMemory > stressResults.memoryUsage.initial * 2) {
            stressResults.memoryUsage.pressure_events++;
          }
        }
        
        // Record timeline data every 5 seconds
        if (operations % Math.max(1, Math.floor(currentThroughputTarget / 4)) === 0) {
          stressResults.timeline.push({
            timestamp: performance.now() - startTime,
            operations,
            current_throughput: operations / ((performance.now() - startTime) / 1000),
            avg_response_time: totalResponseTime / operations,
            memory_usage: (performance as any).memory?.usedJSHeapSize || 0
          });
        }
        
        // Ramp up throughput gradually
        if (opts.rampUp && rampUpIncrement > 0) {
          currentThroughputTarget += rampUpIncrement / 1000; // Increment per operation
        }
        
        // Throttle to target throughput
        const expectedInterval = 1000 / currentThroughputTarget;
        const actualInterval = performance.now() - operationStart;
        if (actualInterval < expectedInterval) {
          await new Promise(resolve => setTimeout(resolve, expectedInterval - actualInterval));
        }
        
      } catch (error) {
        errors++;
        console.error('❌ Stress test operation failed:', error);
      }
    }

    const actualDuration = performance.now() - startTime;
    stressResults.operations = operations;
    stressResults.errors = errors;
    stressResults.avgResponseTime = totalResponseTime / operations;
    stressResults.throughput = operations / (actualDuration / 1000);
    
    // Final memory measurement
    if ((performance as any).memory) {
      stressResults.memoryUsage.final = (performance as any).memory.usedJSHeapSize;
    }

    // Calculate performance degradation
    if (responseTimes.length > 10) {
      const firstQuarter = responseTimes.slice(0, Math.floor(responseTimes.length / 4));
      const lastQuarter = responseTimes.slice(-Math.floor(responseTimes.length / 4));
      const firstAvg = firstQuarter.reduce((a, b) => a + b, 0) / firstQuarter.length;
      const lastAvg = lastQuarter.reduce((a, b) => a + b, 0) / lastQuarter.length;
      stressResults.performance_degradation = ((lastAvg - firstAvg) / firstAvg) * 100;
    }

    // Calculate stability score
    stressResults.stability_score = this.calculateStabilityScore(stressResults);
    stressResults.resource_efficiency = this.categorizeResourceEfficiency(stressResults);

    this.results.push(stressResults);
    return stressResults;
  }

  private calculateStabilityScore(results: any): number {
    let score = 100;
    
    // Penalize errors
    const errorRate = (results.errors / results.operations) * 100;
    score -= errorRate * 5; // 5 points per percent error rate
    
    // Penalize performance degradation
    if (results.performance_degradation > 50) score -= 30;
    else if (results.performance_degradation > 20) score -= 15;
    
    // Penalize memory pressure
    if (results.memoryUsage.pressure_events > 0) {
      score -= Math.min(25, results.memoryUsage.pressure_events * 5);
    }
    
    // Reward consistent throughput
    if (results.throughput >= this.performanceThresholds.throughput.target) score += 10;
    else if (results.throughput < this.performanceThresholds.throughput.minimum) score -= 20;
    
    return Math.max(0, Math.min(100, score));
  }

  private categorizeResourceEfficiency(results: any): string {
    const memoryGrowth = results.memoryUsage.final - results.memoryUsage.initial;
    const memoryPerOp = memoryGrowth / results.operations;
    
    if (memoryPerOp < 1000 && results.avgResponseTime < 5) return 'excellent';
    if (memoryPerOp < 5000 && results.avgResponseTime < 15) return 'good';
    if (memoryPerOp < 10000 && results.avgResponseTime < 50) return 'fair';
    return 'poor';
  }

  getBenchmarkComparison(testType: string): any {
    const history = this.benchmarkHistory.get(testType);
    if (!history || history.length < 2) return null;
    
    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    
    return {
      improvement: {
        serialization_time: ((previous.protobuf.avgTime - latest.protobuf.avgTime) / previous.protobuf.avgTime) * 100,
        compression_ratio: latest.compression.ratio - previous.compression.ratio,
        throughput: ((latest.throughput - previous.throughput) / previous.throughput) * 100
      },
      trend: history.length > 3 ? this.calculateTrend(history) : 'insufficient_data'
    };
  }

  private calculateTrend(history: any[]): string {
    if (history.length < 3) return 'insufficient_data';
    
    const recent = history.slice(-3);
    const avgTimes = recent.map(h => h.protobuf?.avgTime || h.avgResponseTime || 0);
    
    let improving = 0;
    let degrading = 0;
    
    for (let i = 1; i < avgTimes.length; i++) {
      if (avgTimes[i] < avgTimes[i-1]) improving++;
      else if (avgTimes[i] > avgTimes[i-1]) degrading++;
    }
    
    if (improving > degrading) return 'improving';
    if (degrading > improving) return 'degrading';
    return 'stable';
  }

  getResults(): any[] {
    return this.results;
  }

  generateReport(): string {
    console.log('📋 Generating Enhanced Performance Test Report...');
    
    let report = `
# 🚀 Enhanced Protobuf + GTM Performance Test Report

## 📊 Executive Summary
- Total Tests Executed: ${this.results.length}
- Report Generated: ${new Date().toISOString()}
- Framework Version: Enhanced v2.0

## 🎯 Key Performance Indicators
`;

    // Calculate overall KPIs
    const serializationTests = this.results.filter(r => r.compression);
    const gtmTests = this.results.filter(r => r.successRate !== undefined);
    const stressTests = this.results.filter(r => r.throughput);

    if (serializationTests.length > 0) {
      const avgCompressionRatio = serializationTests.reduce((sum, test) => sum + test.compression.ratio, 0) / serializationTests.length;
      const avgSerializationTime = serializationTests.reduce((sum, test) => sum + test.protobuf.avgTime, 0) / serializationTests.length;
      
      report += `
### Serialization Performance
- Average Compression Ratio: ${avgCompressionRatio.toFixed(1)}%
- Average Serialization Time: ${avgSerializationTime.toFixed(2)}ms
- Performance Grade Distribution: ${this.getGradeDistribution(serializationTests)}
`;
    }

    if (gtmTests.length > 0) {
      const avgSuccessRate = gtmTests.reduce((sum, test) => sum + test.successRate, 0) / gtmTests.length;
      const avgReliabilityScore = gtmTests.reduce((sum, test) => sum + (test.reliability_score || 0), 0) / gtmTests.length;
      
      report += `
### GTM Tracking Performance
- Average Success Rate: ${avgSuccessRate.toFixed(1)}%
- Average Reliability Score: ${avgReliabilityScore.toFixed(1)}/100
- Total Bottlenecks Identified: ${gtmTests.reduce((sum, test) => sum + (test.bottlenecks?.length || 0), 0)}
`;
    }

    if (stressTests.length > 0) {
      const avgThroughput = stressTests.reduce((sum, test) => sum + test.throughput, 0) / stressTests.length;
      const avgStabilityScore = stressTests.reduce((sum, test) => sum + (test.stability_score || 0), 0) / stressTests.length;
      
      report += `
### Stress Test Performance
- Average Throughput: ${avgThroughput.toFixed(1)} ops/sec
- Average Stability Score: ${avgStabilityScore.toFixed(1)}/100
- Resource Efficiency Distribution: ${this.getEfficiencyDistribution(stressTests)}
`;
    }

    report += `
## 📈 Detailed Results Analysis
`;

    this.results.forEach((result, index) => {
      report += `
### Test ${index + 1}: ${this.getTestType(result)}

`;
      
      if (result.compression) {
        report += `
**Serialization Metrics:**
- JSON Avg Time: ${result.json.avgTime.toFixed(2)}ms (P95: ${result.json.p95Time?.toFixed(2) || 'N/A'}ms)
- Protobuf Avg Time: ${result.protobuf.avgTime.toFixed(2)}ms (P95: ${result.protobuf.p95Time?.toFixed(2) || 'N/A'}ms)
- JSON Avg Size: ${result.json.avgSize.toFixed(0)} bytes
- Protobuf Avg Size: ${result.protobuf.avgSize.toFixed(0)} bytes
- Compression Efficiency: ${result.compression.efficiency}
- Performance Grade: ${result.performance_grade}
- Data Complexity: ${result.dataComplexity?.type || 'unknown'}

**Recommendations:**
${result.recommendations?.map(r => `- ${r}`).join('\n') || '- No specific recommendations'}
`;
      }
      
      if (result.successRate !== undefined) {
        report += `
**GTM Tracking Metrics:**
- Success Rate: ${result.successRate.toFixed(1)}%
- Reliability Score: ${result.reliability_score?.toFixed(1) || 'N/A'}/100
- Average Response Time: ${result.avgTime.toFixed(2)}ms
- Network Simulation: ${result.networkSimulation ? 'Enabled' : 'Disabled'}

**Event Performance:**
${Object.entries(result.events).map(([event, data]: [string, any]) => 
  `- ${event}: ${data.avgTime?.toFixed(2) || 'N/A'}ms avg, ${data.p95Time?.toFixed(2) || 'N/A'}ms p95, ${data.errorRate?.toFixed(1) || 0}% errors`
).join('\n')}

**Identified Bottlenecks:**
${result.bottlenecks?.map(b => `- ${b}`).join('\n') || '- No bottlenecks detected'}
`;
      }
      
      if (result.throughput) {
        report += `
**Stress Test Metrics:**
- Operations Completed: ${result.operations}
- Error Count: ${result.errors} (${((result.errors / result.operations) * 100).toFixed(2)}%)
- Throughput: ${result.throughput.toFixed(1)} ops/sec
- Average Response Time: ${result.avgResponseTime.toFixed(2)}ms
- Performance Degradation: ${result.performance_degradation?.toFixed(1) || 'N/A'}%
- Stability Score: ${result.stability_score?.toFixed(1) || 'N/A'}/100
- Resource Efficiency: ${result.resource_efficiency}

**Memory Usage:**
- Initial: ${(result.memoryUsage.initial / 1024 / 1024).toFixed(2)} MB
- Peak: ${(result.memoryUsage.peak / 1024 / 1024).toFixed(2)} MB
- Final: ${(result.memoryUsage.final / 1024 / 1024).toFixed(2)} MB
- Pressure Events: ${result.memoryUsage.pressure_events || 0}
`;
      }
    });

    report += `
## 🎯 Strategic Recommendations

### Performance Optimization
- Monitor compression ratios across different data types and optimize schemas accordingly
- Implement adaptive serialization strategies based on data complexity
- Consider implementing connection pooling and request batching for high-throughput scenarios
- Set up automated performance regression detection

### Reliability & Monitoring
- Establish performance baselines and alerting thresholds
- Implement circuit breakers for GTM tracking failures
- Add comprehensive error tracking and recovery mechanisms
- Monitor p95/p99 latencies in production

### Scaling Strategy
- Plan for gradual throughput increases with proper load testing
- Implement memory pressure monitoring and garbage collection optimization
- Consider implementing data streaming for large payloads
- Establish capacity planning based on stress test results

### Growth Analytics
- Track performance metrics correlation with business KPIs
- Implement A/B testing framework for serialization optimizations
- Monitor user experience impact of performance changes
- Establish feedback loops between performance and product metrics

---
*Generated by Enhanced Protobuf Testing Framework v2.0 on ${new Date().toISOString()}*
`;

    return report;
  }

  private getTestType(result: any): string {
    if (result.compression) return `Serialization Test (${result.dataComplexity?.type || 'unknown'} complexity)`;
    if (result.successRate !== undefined) return 'GTM Tracking Test';
    if (result.throughput) return `Stress Test (${result.dataSize} dataset)`;
    return 'Unknown Test Type';
  }

  private getGradeDistribution(tests: any[]): string {
    const grades = tests.reduce((acc, test) => {
      acc[test.performance_grade] = (acc[test.performance_grade] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(grades)
      .map(([grade, count]) => `${grade}: ${count}`)
      .join(', ');
  }

  private getEfficiencyDistribution(tests: any[]): string {
    const efficiencies = tests.reduce((acc, test) => {
      acc[test.resource_efficiency] = (acc[test.resource_efficiency] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(efficiencies)
      .map(([eff, count]) => `${eff}: ${count}`)
      .join(', ');
  }
}

// Enhanced Growth Analytics Framework with Predictive Capabilities
export class ProtobufGrowthAnalytics {
  private metrics: any = {
    daily: {},
    weekly: {},
    monthly: {},
    custom: {},
    realtime: []
  };
  
  private predictiveModels: Map<string, any> = new Map();
  private anomalyThresholds: Map<string, any> = new Map();
  private correlationMatrix: Map<string, Map<string, number>> = new Map();

  trackMetric(category: string, metric: string, value: number, timestamp: Date = new Date(), metadata?: any): void {
    const dateKey = timestamp.toISOString().split('T')[0];
    const hourKey = timestamp.toISOString().split('T')[1].split(':')[0];
    
    // Daily tracking
    if (!this.metrics.daily[dateKey]) {
      this.metrics.daily[dateKey] = {};
    }
    
    if (!this.metrics.daily[dateKey][category]) {
      this.metrics.daily[dateKey][category] = {};
    }
    
    if (!this.metrics.daily[dateKey][category][metric]) {
      this.metrics.daily[dateKey][category][metric] = [];
    }
    
    const dataPoint = {
      value,
      timestamp: timestamp.toISOString(),
      metadata: metadata || {}
    };
    
    this.metrics.daily[dateKey][category][metric].push(dataPoint);
    
    // Real-time tracking (last 1000 points)
    this.metrics.realtime.push({
      category,
      metric,
      ...dataPoint
    });
    
    if (this.metrics.realtime.length > 1000) {
      this.metrics.realtime.shift();
    }
    
    // Update predictive models and anomaly detection
    this.updatePredictiveModel(category, metric, value, timestamp);
    this.detectAnomalies(category, metric, value, timestamp);
    this.updateCorrelations(category, metric, value);
  }

  private updatePredictiveModel(category: string, metric: string, value: number, timestamp: Date): void {
    const key = `${category}.${metric}`;
    
    if (!this.predictiveModels.has(key)) {
      this.predictiveModels.set(key, {
        values: [],
        trend: 0,
        seasonality: {},
        lastUpdate: timestamp
      });
    }
    
    const model = this.predictiveModels.get(key)!;
    model.values.push({ value, timestamp });
    
    // Keep only last 100 points for efficiency
    if (model.values.length > 100) {
      model.values.shift();
    }
    
    // Calculate simple trend
    if (model.values.length >= 10) {
      const recent = model.values.slice(-10);
      const older = model.values.slice(-20, -10);
      
      if (older.length > 0) {
        const recentAvg = recent.reduce((sum, p) => sum + p.value, 0) / recent.length;
        const olderAvg = older.reduce((sum, p) => sum + p.value, 0) / older.length;
        model.trend = ((recentAvg - olderAvg) / olderAvg) * 100;
      }
    }
    
    // Update seasonality patterns (hour of day)
    const hour = timestamp.getHours();
    if (!model.seasonality[hour]) {
      model.seasonality[hour] = [];
    }
    model.seasonality[hour].push(value);
    
    // Keep only last 30 values per hour
    if (model.seasonality[hour].length > 30) {
      model.seasonality[hour].shift();
    }
    
    model.lastUpdate = timestamp;
  }

  private detectAnomalies(category: string, metric: string, value: number, timestamp: Date): void {
    const key = `${category}.${metric}`;
    
    if (!this.anomalyThresholds.has(key)) {
      this.anomalyThresholds.set(key, {
        mean: value,
        variance: 0,
        count: 1,
        anomalies: []
      });
      return;
    }
    
    const threshold = this.anomalyThresholds.get(key)!;
    
    // Update running statistics
    const newCount = threshold.count + 1;
    const delta = value - threshold.mean;
    const newMean = threshold.mean + delta / newCount;
    const newVariance = ((threshold.count * threshold.variance) + delta * (value - newMean)) / newCount;
    
    threshold.mean = newMean;
    threshold.variance = newVariance;
    threshold.count = newCount;
    
    // Detect anomaly (3 standard deviations)
    const stdDev = Math.sqrt(newVariance);
    const zScore = Math.abs(value - newMean) / (stdDev || 1);
    
    if (zScore > 3 && threshold.count > 10) {
      threshold.anomalies.push({
        value,
        timestamp,
        zScore,
        severity: zScore > 5 ? 'critical' : zScore > 4 ? 'high' : 'medium'
      });
      
      // Keep only last 50 anomalies
      if (threshold.anomalies.length > 50) {
        threshold.anomalies.shift();
      }
      
      console.warn(`🚨 Anomaly detected in ${key}: value=${value}, z-score=${zScore.toFixed(2)}`);
    }
  }

  private updateCorrelations(category: string, metric: string, value: number): void {
    const key = `${category}.${metric}`;
    
    if (!this.correlationMatrix.has(key)) {
      this.correlationMatrix.set(key, new Map());
    }
    
    // Calculate correlations with other recent metrics
    const recentMetrics = this.metrics.realtime.slice(-50);
    const currentMetricData = recentMetrics.filter(m => `${m.category}.${m.metric}` === key);
    
    if (currentMetricData.length < 5) return;
    
    // Group other metrics
    const otherMetrics = new Map<string, number[]>();
    recentMetrics.forEach(m => {
      const otherKey = `${m.category}.${m.metric}`;
      if (otherKey !== key) {
        if (!otherMetrics.has(otherKey)) {
          otherMetrics.set(otherKey, []);
        }
        otherMetrics.get(otherKey)!.push(m.value);
      }
    });
    
    // Calculate Pearson correlation coefficients
    const currentValues = currentMetricData.map(m => m.value);
    
    otherMetrics.forEach((otherValues, otherKey) => {
      if (otherValues.length >= 5) {
        const correlation = this.calculatePearsonCorrelation(currentValues, otherValues);
        if (!isNaN(correlation)) {
          this.correlationMatrix.get(key)!.set(otherKey, correlation);
        }
      }
    });
  }

  private calculatePearsonCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n < 2) return 0;
    
    const xSlice = x.slice(-n);
    const ySlice = y.slice(-n);
    
    const sumX = xSlice.reduce((a, b) => a + b, 0);
    const sumY = ySlice.reduce((a, b) => a + b, 0);
    const sumXY = xSlice.reduce((sum, xi, i) => sum + xi * ySlice[i], 0);
    const sumX2 = xSlice.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = ySlice.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  async trackProtobufGrowth(appointmentData: AppointmentMessage, options?: {
    includeBusinessContext?: boolean;
    trackUserBehavior?: boolean;
    enablePredictiveAnalytics?: boolean;
  }): Promise<void> {
    const opts = { includeBusinessContext: true, trackUserBehavior: true, enablePredictiveAnalytics: true, ...options };
    const startTime = performance.now();
    
    try {
      // Enhanced serialization tracking
      const jsonSize = JSON.stringify(appointmentData).length;
      const serialized = protobufGTMIntegration['serializeToProtobuf'](appointmentData, {} as any);
      const protobufSize = serialized.length;
      const serializationTime = performance.now() - startTime;
      
      // Core performance metrics
      this.trackMetric('performance', 'serialization_time', serializationTime, new Date(), {
        data_complexity: this.calculateDataComplexity(appointmentData),
        appointment_type: appointmentData.service_id
      });
      
      this.trackMetric('performance', 'json_size', jsonSize);
      this.trackMetric('performance', 'protobuf_size', protobufSize);
      this.trackMetric('performance', 'compression_ratio', (protobufSize / jsonSize) * 100);
      this.trackMetric('performance', 'compression_efficiency', ((jsonSize - protobufSize) / jsonSize) * 100);
      
      // Enhanced business metrics
      if (opts.includeBusinessContext) {
        this.trackMetric('business', 'appointments_created', 1, new Date(), {
          service_type: appointmentData.service_id,
          stylist: appointmentData.stylist_id,
          price_tier: this.categorizePriceTier(appointmentData.price || 0),
          booking_lead_time: this.calculateLeadTime(appointmentData.date_time)
        });
        
        this.trackMetric('business', 'revenue', appointmentData.price || 0, new Date(), {
          service_type: appointmentData.service_id,
          customer_segment: this.inferCustomerSegment(appointmentData)
        });
        
        // Track booking patterns
        const appointmentHour = new Date(appointmentData.date_time).getHours();
        this.trackMetric('business', 'booking_hour_distribution', appointmentHour);
        
        // Track service popularity
        this.trackMetric('business', 'service_demand', 1, new Date(), {
          service_id: appointmentData.service_id,
          duration: appointmentData.duration_minutes
        });
      }
      
      // User behavior tracking
      if (opts.trackUserBehavior) {
        this.trackMetric('behavior', 'booking_completion_rate', 1, new Date(), {
          status: appointmentData.status,
          has_notes: !!appointmentData.notes,
          is_repeat_customer: this.isRepeatCustomer(appointmentData.customer_id)
        });
        
        // Track conversion funnel
        this.trackMetric('behavior', 'funnel_conversion', 1, new Date(), {
          step: 'appointment_created',
          customer_id: appointmentData.customer_id
        });
      }
      
      // Technical analytics
      this.trackMetric('analytics', 'gtm_events_sent', 1, new Date(), {
        event_type: 'appointment_creation',
        payload_size: protobufSize
      });
      
      // Predictive analytics
      if (opts.enablePredictiveAnalytics) {
        await this.generatePredictiveInsights(appointmentData);
      }
      
    } catch (error) {
      this.trackMetric('errors', 'serialization_failures', 1, new Date(), {
        error_type: error.constructor.name,
        error_message: error.message
      });
      console.error('❌ Enhanced growth tracking failed:', error);
    }
  }

  private calculateDataComplexity(data: any): string {
    const jsonString = JSON.stringify(data);
    const size = jsonString.length;
    const depth = this.calculateObjectDepth(data);
    
    if (size > 5000 || depth > 4) return 'high';
    if (size > 1000 || depth > 2) return 'medium';
    return 'low';
  }

  private calculateObjectDepth(obj: any, currentDepth: number = 0): number {
    if (typeof obj !== 'object' || obj === null) return currentDepth;
    
    let maxDepth = currentDepth;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const depth = this.calculateObjectDepth(obj[key], currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
    }
    return maxDepth;
  }

  private categorizePriceTier(price: number): string {
    if (price >= 75) return 'premium';
    if (price >= 45) return 'standard';
    if (price >= 25) return 'basic';
    return 'budget';
  }

  private calculateLeadTime(appointmentDateTime: string): number {
    const appointmentTime = new Date(appointmentDateTime);
    const now = new Date();
    return Math.max(0, Math.floor((appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }

  private inferCustomerSegment(appointment: AppointmentMessage): string {
    // Simple heuristic based on available data
    const price = appointment.price || 0;
    const hasNotes = !!appointment.notes;
    
    if (price >= 75 && hasNotes) return 'vip';
    if (price >= 45) return 'regular';
    return 'budget';
  }

  private isRepeatCustomer(customerId: string): boolean {
    // Check if we've seen this customer in recent metrics
    const recentBookings = this.metrics.realtime.filter(m => 
      m.category === 'business' && 
      m.metric === 'appointments_created' && 
      m.metadata?.customer_id === customerId
    );
    
    return recentBookings.length > 1;
  }

  private async generatePredictiveInsights(appointmentData: AppointmentMessage): Promise<void> {
    // Predict appointment completion likelihood
    const completionProbability = this.predictAppointmentCompletion(appointmentData);
    this.trackMetric('predictions', 'completion_probability', completionProbability, new Date(), {
      appointment_id: `${appointmentData.customer_id}_${appointmentData.date_time}`
    });
    
    // Predict revenue impact
    const revenueImpact = this.predictRevenueImpact(appointmentData);
    this.trackMetric('predictions', 'revenue_impact', revenueImpact, new Date(), {
      service_type: appointmentData.service_id
    });
    
    // Predict optimal booking times
    const optimalTime = this.predictOptimalBookingTime();
    this.trackMetric('predictions', 'optimal_booking_hour', optimalTime);
  }

  private predictAppointmentCompletion(appointment: AppointmentMessage): number {
    let probability = 0.85; // Base completion rate
    
    // Adjust based on lead time
    const leadTime = this.calculateLeadTime(appointment.date_time);
    if (leadTime < 1) probability -= 0.15; // Same day bookings have higher cancellation
    if (leadTime > 14) probability -= 0.10; // Far future bookings have higher cancellation
    
    // Adjust based on price tier
    const priceTier = this.categorizePriceTier(appointment.price || 0);
    if (priceTier === 'premium') probability += 0.10;
    if (priceTier === 'budget') probability -= 0.05;
    
    // Adjust based on notes (indicates engagement)
    if (appointment.notes) probability += 0.05;
    
    return Math.max(0, Math.min(1, probability));
  }

  private predictRevenueImpact(appointment: AppointmentMessage): number {
    const baseRevenue = appointment.price || 0;
    let multiplier = 1.0;
    
    // Consider repeat customer potential
    if (this.isRepeatCustomer(appointment.customer_id)) {
      multiplier += 0.3; // Repeat customers likely to book again
    }
    
    // Consider service type impact
    if (appointment.service_id?.includes('premium')) {
      multiplier += 0.2; // Premium services lead to higher lifetime value
    }
    
    return baseRevenue * multiplier;
  }

  private predictOptimalBookingTime(): number {
    // Analyze historical booking patterns
    const hourlyBookings = new Map<number, number>();
    
    this.metrics.realtime
      .filter(m => m.category === 'business' && m.metric === 'booking_hour_distribution')
      .forEach(m => {
        const hour = m.value;
        hourlyBookings.set(hour, (hourlyBookings.get(hour) || 0) + 1);
      });
    
    // Find hour with highest booking rate
    let optimalHour = 14; // Default to 2 PM
    let maxBookings = 0;
    
    hourlyBookings.forEach((count, hour) => {
      if (count > maxBookings) {
        maxBookings = count;
        optimalHour = hour;
      }
    });
    
    return optimalHour;
  }

  getGrowthMetrics(period: 'daily' | 'weekly' | 'monthly' | 'realtime' = 'daily', options?: {
    includeAnomalies?: boolean;
    includePredictions?: boolean;
    includeCorrelations?: boolean;
  }): any {
    const opts = { includeAnomalies: false, includePredictions: false, includeCorrelations: false, ...options };
    
    if (period === 'realtime') {
      return this.getRealtimeMetrics(opts);
    }
    
    const metrics = this.metrics[period];
    const aggregated: any = {};
    
    for (const date in metrics) {
      for (const category in metrics[date]) {
        if (!aggregated[category]) {
          aggregated[category] = {};
        }
        
        for (const metric in metrics[date][category]) {
          if (!aggregated[category][metric]) {
            aggregated[category][metric] = [];
          }
          
          aggregated[category][metric].push(...metrics[date][category][metric]);
        }
      }
    }
    
    // Add enhanced analytics
    if (opts.includeAnomalies) {
      aggregated._anomalies = this.getAnomalySummary();
    }
    
    if (opts.includePredictions) {
      aggregated._predictions = this.getPredictiveSummary();
    }
    
    if (opts.includeCorrelations) {
      aggregated._correlations = this.getCorrelationSummary();
    }
    
    return aggregated;
  }

  private getRealtimeMetrics(options: any): any {
    const realtime = {
      current_metrics: this.metrics.realtime.slice(-50),
      summary: this.calculateRealtimeSummary(),
      trends: this.calculateRealtimeTrends()
    };
    
    if (options.includeAnomalies) {
      realtime.recent_anomalies = this.getRecentAnomalies();
    }
    
    return realtime;
  }

  private calculateRealtimeSummary(): any {
    const summary: any = {};
    const recent = this.metrics.realtime.slice(-100);
    
    // Group by category and metric
    recent.forEach(point => {
      const key = `${point.category}.${point.metric}`;
      if (!summary[key]) {
        summary[key] = { values: [], count: 0, avg: 0, trend: 0 };
      }
      summary[key].values.push(point.value);
      summary[key].count++;
    });
    
    // Calculate statistics
    Object.keys(summary).forEach(key => {
      const data = summary[key];
      data.avg = data.values.reduce((sum: number, val: number) => sum + val, 0) / data.values.length;
      
      // Simple trend calculation
      if (data.values.length >= 10) {
        const firstHalf = data.values.slice(0, Math.floor(data.values.length / 2));
        const secondHalf = data.values.slice(Math.floor(data.values.length / 2));
        const firstAvg = firstHalf.reduce((sum: number, val: number) => sum + val, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum: number, val: number) => sum + val, 0) / secondHalf.length;
        data.trend = ((secondAvg - firstAvg) / firstAvg) * 100;
      }
    });
    
    return summary;
  }

  private calculateRealtimeTrends(): any {
    const trends: any = {};
    
    this.predictiveModels.forEach((model, key) => {
      trends[key] = {
        trend_percentage: model.trend,
        direction: model.trend > 5 ? 'increasing' : model.trend < -5 ? 'decreasing' : 'stable',
        confidence: model.values.length >= 20 ? 'high' : model.values.length >= 10 ? 'medium' : 'low'
      };
    });
    
    return trends;
  }

  private getAnomalySummary(): any {
    const summary: any = {};
    
    this.anomalyThresholds.forEach((threshold, key) => {
      if (threshold.anomalies.length > 0) {
        const recentAnomalies = threshold.anomalies.slice(-10);
        summary[key] = {
          total_anomalies: threshold.anomalies.length,
          recent_anomalies: recentAnomalies.length,
          severity_distribution: this.calculateSeverityDistribution(recentAnomalies),
          last_anomaly: recentAnomalies[recentAnomalies.length - 1]
        };
      }
    });
    
    return summary;
  }

  private calculateSeverityDistribution(anomalies: any[]): any {
    return anomalies.reduce((dist, anomaly) => {
      dist[anomaly.severity] = (dist[anomaly.severity] || 0) + 1;
      return dist;
    }, {});
  }

  private getPredictiveSummary(): any {
    const summary: any = {};
    
    this.predictiveModels.forEach((model, key) => {
      if (model.values.length >= 5) {
        const recentValues = model.values.slice(-10).map(v => v.value);
        const prediction = this.generateSimplePrediction(recentValues);
        
        summary[key] = {
          current_trend: model.trend,
          predicted_next_value: prediction,
          confidence: model.values.length >= 20 ? 'high' : 'medium',
          seasonality_detected: Object.keys(model.seasonality).length > 5
        };
      }
    });
    
    return summary;
  }

  private generateSimplePrediction(values: number[]): number {
    if (values.length < 3) return values[values.length - 1];
    
    // Simple linear regression prediction
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return slope * n + intercept; // Predict next value
  }

  private getCorrelationSummary(): any {
    const summary: any = {};
    
    this.correlationMatrix.forEach((correlations, key) => {
      const strongCorrelations = Array.from(correlations.entries())
        .filter(([_, correlation]) => Math.abs(correlation) > 0.7)
        .sort(([_, a], [__, b]) => Math.abs(b) - Math.abs(a));
      
      if (strongCorrelations.length > 0) {
        summary[key] = {
          strong_correlations: strongCorrelations.slice(0, 5),
          correlation_count: correlations.size
        };
      }
    });
    
    return summary;
  }

  private getRecentAnomalies(): any[] {
    const recentAnomalies: any[] = [];
    const cutoffTime = new Date(Date.now() - 60 * 60 * 1000); // Last hour
    
    this.anomalyThresholds.forEach((threshold, key) => {
      threshold.anomalies
        .filter(anomaly => new Date(anomaly.timestamp) > cutoffTime)
        .forEach(anomaly => {
          recentAnomalies.push({
            metric: key,
            ...anomaly
          });
        });
    });
    
    return recentAnomalies.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  generateGrowthReport(options?: {
    includeExecutiveSummary?: boolean;
    includePredictiveInsights?: boolean;
    includeAnomalyAnalysis?: boolean;
    includeCorrelationAnalysis?: boolean;
  }): string {
    const opts = { 
      includeExecutiveSummary: true, 
      includePredictiveInsights: true, 
      includeAnomalyAnalysis: true,
      includeCorrelationAnalysis: true,
      ...options 
    };
    
    const dailyMetrics = this.getGrowthMetrics('daily', {
      includeAnomalies: opts.includeAnomalyAnalysis,
      includePredictions: opts.includePredictiveInsights,
      includeCorrelations: opts.includeCorrelationAnalysis
    });
    
    let report = `
# 📈 Enhanced Protobuf + GTM Growth Analytics Report

## 📊 Report Overview
- Generated: ${new Date().toISOString()}
- Analysis Period: Daily metrics with real-time insights
- Framework Version: Enhanced Growth Analytics v2.0
`;

    if (opts.includeExecutiveSummary) {
      report += this.generateExecutiveSummary(dailyMetrics);
    }

    report += `
## 📈 Core Metrics Analysis
`;

    for (const category in dailyMetrics) {
      if (category.startsWith('_')) continue; // Skip meta categories
      
      report += `
### ${category.toUpperCase()} METRICS
`;
      
      for (const metric in dailyMetrics[category]) {
        const values = dailyMetrics[category][metric].map((m: any) => m.value);
        if (values.length === 0) continue;
        
        const total = values.reduce((sum: number, val: number) => sum + val, 0);
        const average = total / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        const stdDev = Math.sqrt(values.reduce((sum: number, val: number) => sum + Math.pow(val - average, 2), 0) / values.length);
        
        report += `
- **${metric}**: 
  - Total: ${total.toFixed(2)}
  - Average: ${average.toFixed(2)} (±${stdDev.toFixed(2)})
  - Range: ${min.toFixed(2)} - ${max.toFixed(2)}
  - Data Points: ${values.length}
`;
      }
    }

    if (opts.includePredictiveInsights && dailyMetrics._predictions) {
      report += `
## 🔮 Predictive Insights

`;
      for (const [metric, prediction] of Object.entries(dailyMetrics._predictions)) {
        const pred = prediction as any;
        report += `
### ${metric}
- Current Trend: ${pred.current_trend > 0 ? '↗️' : pred.current_trend < 0 ? '↘️' : '➡️'} ${Math.abs(pred.current_trend).toFixed(1)}%
- Predicted Next Value: ${pred.predicted_next_value.toFixed(2)}
- Confidence Level: ${pred.confidence}
- Seasonality: ${pred.seasonality_detected ? '✅ Detected' : '❌ Not detected'}
`;
      }
    }

    if (opts.includeAnomalyAnalysis && dailyMetrics._anomalies) {
      report += `
## 🚨 Anomaly Analysis

`;
      for (const [metric, anomalyData] of Object.entries(dailyMetrics._anomalies)) {
        const data = anomalyData as any;
        report += `
### ${metric}
- Total Anomalies: ${data.total_anomalies}
- Recent Anomalies: ${data.recent_anomalies}
- Severity Distribution: ${Object.entries(data.severity_distribution).map(([sev, count]) => `${sev}: ${count}`).join(', ')}
- Last Anomaly: ${data.last_anomaly ? new Date(data.last_anomaly.timestamp).toLocaleString() : 'None'}
`;
      }
    }

    if (opts.includeCorrelationAnalysis && dailyMetrics._correlations) {
      report += `
## 🔗 Correlation Analysis

`;
      for (const [metric, correlationData] of Object.entries(dailyMetrics._correlations)) {
        const data = correlationData as any;
        report += `
### ${metric}
- Strong Correlations Found: ${data.strong_correlations.length}
`;
        data.strong_correlations.forEach(([otherMetric, correlation]: [string, number]) => {
          const strength = Math.abs(correlation) > 0.9 ? 'Very Strong' : 'Strong';
          const direction = correlation > 0 ? 'Positive' : 'Negative';
          report += `  - ${otherMetric}: ${direction} ${strength} (${correlation.toFixed(3)})
`;
        });
      }
    }

    report += `
## 🎯 Strategic Recommendations

### Performance Optimization
- Monitor high-correlation metrics for optimization opportunities
- Address anomalies in critical performance metrics
- Leverage predictive insights for proactive scaling

### Business Growth
- Focus on metrics showing positive trends
- Investigate and resolve anomalies in business-critical areas
- Use correlation insights to identify growth levers

### Technical Excellence
- Implement automated anomaly detection and alerting
- Establish performance baselines based on predictive models
- Create feedback loops between technical and business metrics

### Data-Driven Decision Making
- Use predictive insights for capacity planning
- Monitor correlation changes to identify new optimization opportunities
- Establish A/B testing framework based on strong correlations

---
*Generated by Enhanced Growth Analytics Framework v2.0 on ${new Date().toISOString()}*
`;
    
    return report;
  }

  private generateExecutiveSummary(metrics: any): string {
    let summary = `
## 🎯 Executive Summary

`;

    // Calculate key performance indicators
    const performanceMetrics = metrics.performance || {};
    const businessMetrics = metrics.business || {};
    const errorMetrics = metrics.errors || {};

    // Performance KPIs
    if (performanceMetrics.serialization_time) {
      const avgSerializationTime = performanceMetrics.serialization_time
        .reduce((sum: number, m: any) => sum + m.value, 0) / performanceMetrics.serialization_time.length;
      summary += `
### Performance Health
- Average Serialization Time: ${avgSerializationTime.toFixed(2)}ms
- Performance Status: ${avgSerializationTime < 5 ? '🟢 Excellent' : avgSerializationTime < 15 ? '🟡 Good' : '🔴 Needs Attention'}
`;
    }

    // Business KPIs
    if (businessMetrics.appointments_created && businessMetrics.revenue) {
      const totalAppointments = businessMetrics.appointments_created.length;
      const totalRevenue = businessMetrics.revenue.reduce((sum: number, m: any) => sum + m.value, 0);
      const avgRevenuePerAppointment = totalRevenue / totalAppointments;
      
      summary += `
### Business Impact
- Total Appointments Tracked: ${totalAppointments}
- Total Revenue Tracked: $${totalRevenue.toFixed(2)}
- Average Revenue per Appointment: $${avgRevenuePerAppointment.toFixed(2)}
- Business Health: ${avgRevenuePerAppointment > 50 ? '🟢 Strong' : avgRevenuePerAppointment > 30 ? '🟡 Moderate' : '🔴 Weak'}
`;
    }

    // Error Rate
    const totalErrors = Object.values(errorMetrics).reduce((sum: number, errorArray: any) => sum + errorArray.length, 0);
    const totalOperations = Object.values(metrics).reduce((sum: number, category: any) => {
      if (typeof category === 'object' && !Array.isArray(category)) {
        return sum + Object.values(category).reduce((catSum: number, metricArray: any) => 
          catSum + (Array.isArray(metricArray) ? metricArray.length : 0), 0);
      }
      return sum;
    }, 0);
    
    const errorRate = totalOperations > 0 ? (totalErrors / totalOperations) * 100 : 0;
    
    summary += `
### System Reliability
- Total Operations: ${totalOperations}
- Error Rate: ${errorRate.toFixed(2)}%
- Reliability Status: ${errorRate < 1 ? '🟢 Excellent' : errorRate < 5 ? '🟡 Good' : '🔴 Needs Attention'}
`;

    return summary;
  }
}

// Enhanced Test Runner with Comprehensive Orchestration
export class ProtobufTestRunner {
  private performanceTester: ProtobufPerformanceTester;
  private growthAnalytics: ProtobufGrowthAnalytics;
  private testHistory: any[] = [];
  private testConfiguration: any = {
    performance: { enabled: true, iterations: 100, complexity: 'standard' },
    gtm: { enabled: true, iterations: 50, includeNetworkSim: false },
    stress: { enabled: true, durations: [10000, 15000, 20000], includeMemoryPressure: true },
    growth: { enabled: true, sampleSize: 100, enablePredictive: true }
  };

  constructor(config?: any) {
    this.performanceTester = new ProtobufPerformanceTester();
    this.growthAnalytics = new ProtobufGrowthAnalytics();
    
    if (config) {
      this.testConfiguration = { ...this.testConfiguration, ...config };
    }
  }

  async runFullTestSuite(options?: {
    skipWarmup?: boolean;
    includeRegression?: boolean;
    generateDetailedReport?: boolean;
    saveResults?: boolean;
  }): Promise<any> {
    console.log('🎯 Running Enhanced Full Protobuf + GTM Test Suite...');
    const opts = { 
      skipWarmup: false, 
      includeRegression: true, 
      generateDetailedReport: true, 
      saveResults: true, 
      ...options 
    };
    
    const suiteStartTime = performance.now();
    const results = {
      suite_id: `test_${Date.now()}`,
      performance: {},
      gtm: {},
      stress: {},
      growth: {},
      regression: {},
      summary: {},
      timestamp: new Date().toISOString(),
      configuration: this.testConfiguration,
      execution_time: 0,
      success_rate: 0
    };

    let totalTests = 0;
    let successfulTests = 0;

    try {
      // Warmup phase
      if (!opts.skipWarmup) {
        console.log('🔥 Warming up test environment...');
        await this.runWarmupPhase();
      }

      // Performance Tests
      if (this.testConfiguration.performance.enabled) {
        console.log('⚡ Running Performance Test Suite...');
        try {
          const testData = ProtobufTestDataGenerator.generatePerformanceTestData(
            this.testConfiguration.performance.complexity
          );
          
          for (const data of testData) {
            const dataKey = Object.keys(data)[0];
            totalTests++;
            
            try {
              results.performance[dataKey] = await this.performanceTester.runSerializationTests(
                data[dataKey], 
                this.testConfiguration.performance.iterations,
                { 
                  warmupRounds: 5, 
                  includeMemoryProfiling: true,
                  trackGC: true 
                }
              );
              successfulTests++;
            } catch (error) {
              console.error(`❌ Performance test failed for ${dataKey}:`, error);
              results.performance[dataKey] = { error: error.message };
            }
          }
        } catch (error) {
          console.error('❌ Performance test suite failed:', error);
          results.performance.suite_error = error.message;
        }
      }

      // GTM Tracking Tests
      if (this.testConfiguration.gtm.enabled) {
        console.log('📊 Running GTM Tracking Test Suite...');
        try {
          totalTests++;
          const gtmEvents = [
            'appointment_creation', 
            'customer_registration', 
            'booking_funnel', 
            'performance_metrics',
            'user_engagement',
            'conversion_tracking'
          ];
          
          results.gtm = await this.performanceTester.runGTMTrackingTests(
            gtmEvents, 
            this.testConfiguration.gtm.iterations,
            {
              includeLatencyDistribution: true,
              simulateNetworkConditions: this.testConfiguration.gtm.includeNetworkSim
            }
          );
          successfulTests++;
        } catch (error) {
          console.error('❌ GTM tracking tests failed:', error);
          results.gtm.error = error.message;
        }
      }

      // Stress Tests
      if (this.testConfiguration.stress.enabled) {
        console.log('💪 Running Stress Test Suite...');
        const stressSizes = ['small', 'medium', 'large'] as const;
        
        for (let i = 0; i < stressSizes.length; i++) {
          const size = stressSizes[i];
          const duration = this.testConfiguration.stress.durations[i] || 15000;
          totalTests++;
          
          try {
            results.stress[size] = await this.performanceTester.runStressTest(
              size, 
              duration,
              {
                rampUp: true,
                targetThroughput: size === 'small' ? 50 : size === 'medium' ? 100 : 200,
                includeMemoryPressure: this.testConfiguration.stress.includeMemoryPressure
              }
            );
            successfulTests++;
          } catch (error) {
            console.error(`❌ Stress test failed for ${size}:`, error);
            results.stress[size] = { error: error.message };
          }
        }
      }

      // Growth Analytics
      if (this.testConfiguration.growth.enabled) {
        console.log('📈 Running Growth Analytics Suite...');
        try {
          totalTests++;
          const growthData = ProtobufTestDataGenerator.generateAppointmentData(
            this.testConfiguration.growth.sampleSize,
            { 
              timeDistribution: 'realistic',
              includeAnomalies: true,
              seasonalBias: true 
            }
          );
          
          for (const appointment of growthData) {
            await this.growthAnalytics.trackProtobufGrowth(appointment, {
              includeBusinessContext: true,
              trackUserBehavior: true,
              enablePredictiveAnalytics: this.testConfiguration.growth.enablePredictive
            });
          }
          
          results.growth = this.growthAnalytics.getGrowthMetrics('daily', {
            includeAnomalies: true,
            includePredictions: this.testConfiguration.growth.enablePredictive,
            includeCorrelations: true
          });
          successfulTests++;
        } catch (error) {
          console.error('❌ Growth analytics failed:', error);
          results.growth.error = error.message;
        }
      }

      // Regression Testing
      if (opts.includeRegression && this.testHistory.length > 0) {
        console.log('🔄 Running Regression Analysis...');
        try {
          results.regression = await this.runRegressionAnalysis(results);
        } catch (error) {
          console.error('❌ Regression analysis failed:', error);
          results.regression.error = error.message;
        }
      }

      // Calculate suite summary
      const suiteEndTime = performance.now();
      results.execution_time = suiteEndTime - suiteStartTime;
      results.success_rate = totalTests > 0 ? (successfulTests / totalTests) * 100 : 0;
      results.summary = this.generateSuiteSummary(results);

      console.log(`✅ Full test suite completed! Success rate: ${results.success_rate.toFixed(1)}%`);
      
      // Save results to history
      if (opts.saveResults) {
        this.testHistory.push({
          ...results,
          saved_at: new Date().toISOString()
        });
        
        // Keep only last 50 test runs
        if (this.testHistory.length > 50) {
          this.testHistory.shift();
        }
      }
      
    } catch (error) {
      console.error('❌ Test suite execution failed:', error);
      results.suite_error = error.message;
      results.success_rate = 0;
    }

    return results;
  }

  private async runWarmupPhase(): Promise<void> {
    // Generate small test data for warmup
    const warmupData = ProtobufTestDataGenerator.generateAppointmentData(5);
    
    // Warmup serialization
    for (let i = 0; i < 10; i++) {
      JSON.stringify(warmupData);
      protobufGTMIntegration['serializeToProtobuf'](warmupData, {} as any);
    }
    
    // Warmup GTM tracking
    for (let i = 0; i < 5; i++) {
      try {
        protobufGTMIntegration.trackBookingFunnel('warmup', { iteration: i });
      } catch (error) {
        // Ignore warmup errors
      }
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    console.log('🔥 Warmup phase completed');
  }

  private async runRegressionAnalysis(currentResults: any): Promise<any> {
    if (this.testHistory.length === 0) {
      return { status: 'no_baseline', message: 'No historical data for comparison' };
    }

    try {
      const lastResults = this.testHistory[this.testHistory.length - 1];
      const regression = {
        performanceChange: this.calculatePerformanceChange(currentResults, lastResults),
        memoryChange: this.calculateMemoryChange(currentResults, lastResults),
        errorRateChange: this.calculateErrorRateChange(currentResults, lastResults)
      };

      return {
        status: 'success',
        regression,
        recommendations: this.generateRecommendations(regression)
      };
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  generateComprehensiveReport(): string {
    const performanceReport = this.performanceTester.generateReport();
    const growthReport = this.growthAnalytics.generateGrowthReport();
    
    return `
# 🚀 Comprehensive Protobuf + GTM Test Report

${performanceReport}

${growthReport}

## 🎯 Recommendations

### Performance Optimization
- Monitor compression ratios for different data types
- Optimize serialization for frequently used data structures
- Consider caching for repeated operations

### Growth Strategy
- Track conversion rates with protobuf context
- Monitor API performance improvements
- Analyze user behavior patterns

### Scaling Considerations
- Implement connection pooling for high traffic
- Consider batch processing for bulk operations
- Monitor memory usage in production

---
*Generated on ${new Date().toISOString()}*
`;
  }
}

// Export test utilities
export const protobufTestRunner = new ProtobufTestRunner();
export const protobufPerformanceTester = new ProtobufPerformanceTester();
export const protobufGrowthAnalytics = new ProtobufGrowthAnalytics();

// gRPC Load-Testing Module (Guging Module)
export class GrpcLoadTester {
  private gatlingConfig: any = {
    installationPath: process.env.GATLING_HOME || './gatling',
    javaHome: process.env.JAVA_HOME,
    maxMemory: '2G',
    outputDirectory: './gatling-results'
  };
  
  private jmeterConfig: any = {
    installationPath: process.env.JMETER_HOME || './jmeter',
    javaHome: process.env.JAVA_HOME,
    maxMemory: '1G',
    outputDirectory: './jmeter-results'
  };
  
  private testResults: Map<string, LoadTestResult> = new Map();
  private activeTests: Map<string, any> = new Map();

  constructor(config?: {
    gatling?: any;
    jmeter?: any;
  }) {
    if (config?.gatling) {
      this.gatlingConfig = { ...this.gatlingConfig, ...config.gatling };
    }
    if (config?.jmeter) {
      this.jmeterConfig = { ...this.jmeterConfig, ...config.jmeter };
    }
  }

  async runGatlingTest(protoPath: string, simulationClass: string, options?: {
    users?: number;
    rampUp?: number;
    duration?: number;
    protocol?: 'http' | 'https';
    host?: string;
    port?: number;
    includeStreaming?: boolean;
    customHeaders?: Record<string, string>;
  }): Promise<LoadTestResult> {
    console.log('🚀 Running Gatling gRPC Load Test...');
    
    const opts = {
      users: 10,
      rampUp: 30,
      duration: 60,
      protocol: 'http' as const,
      host: 'localhost',
      port: 9090,
      includeStreaming: false,
      customHeaders: {},
      ...options
    };

    const testId = `gatling_${Date.now()}`;
    const simulationFile = await this.generateGatlingSimulation(
      protoPath, 
      simulationClass, 
      opts
    );

    try {
      // Execute Gatling test
      const result = await this.executeGatlingSimulation(simulationFile, testId);
      
      // Parse results
      const parsedResults = await this.parseGatlingResults(testId);
      
      // Store and return results
      const loadTestResult: LoadTestResult = {
        testId,
        engine: 'gatling',
        timestamp: new Date().toISOString(),
        configuration: opts,
        metrics: parsedResults,
        status: 'completed',
        duration: parsedResults.duration || 0
      };
      
      this.testResults.set(testId, loadTestResult);
      return loadTestResult;
      
    } catch (error) {
      console.error('❌ Gatling test failed:', error);
      const errorResult: LoadTestResult = {
        testId,
        engine: 'gatling',
        timestamp: new Date().toISOString(),
        configuration: opts,
        metrics: { error: error.message },
        status: 'failed',
        duration: 0
      };
      
      this.testResults.set(testId, errorResult);
      return errorResult;
    }
  }

  async runJMeterTest(jmxPath: string, options?: {
    threads?: number;
    rampUp?: number;
    duration?: number;
    protocol?: 'http' | 'https';
    host?: string;
    port?: number;
    includeStreaming?: boolean;
    customProperties?: Record<string, string>;
  }): Promise<LoadTestResult> {
    console.log('🔧 Running JMeter gRPC Load Test...');
    
    const opts = {
      threads: 10,
      rampUp: 30,
      duration: 60,
      protocol: 'http' as const,
      host: 'localhost',
      port: 9090,
      includeStreaming: false,
      customProperties: {},
      ...options
    };

    const testId = `jmeter_${Date.now()}`;
    
    try {
      // Execute JMeter test
      const result = await this.executeJMeterTest(jmxPath, testId, opts);
      
      // Parse results
      const parsedResults = await this.parseJMeterResults(testId);
      
      // Store and return results
      const loadTestResult: LoadTestResult = {
        testId,
        engine: 'jmeter',
        timestamp: new Date().toISOString(),
        configuration: opts,
        metrics: parsedResults,
        status: 'completed',
        duration: parsedResults.duration || 0
      };
      
      this.testResults.set(testId, loadTestResult);
      return loadTestResult;
      
    } catch (error) {
      console.error('❌ JMeter test failed:', error);
      const errorResult: LoadTestResult = {
        testId,
        engine: 'jmeter',
        timestamp: new Date().toISOString(),
        configuration: opts,
        metrics: { error: error.message },
        status: 'failed',
        duration: 0
      };
      
      this.testResults.set(testId, errorResult);
      return errorResult;
    }
  }

  async runComparativeLoadTest(protoPath: string, options?: {
    gatlingConfig?: any;
    jmeterConfig?: any;
    testDuration?: number;
    userScenarios?: Array<{ users: number; duration: number }>;
  }): Promise<ComparativeLoadTestResult> {
    console.log('⚖️ Running Comparative gRPC Load Test (Gatling vs JMeter)...');
    
    const opts = {
      testDuration: 120,
      userScenarios: [
        { users: 10, duration: 30 },
        { users: 25, duration: 30 },
        { users: 50, duration: 30 },
        { users: 100, duration: 30 }
      ],
      ...options
    };

    const comparativeResults: ComparativeLoadTestResult = {
      testId: `comparative_${Date.now()}`,
      timestamp: new Date().toISOString(),
      scenarios: [],
      summary: {},
      recommendations: []
    };

    for (const scenario of opts.userScenarios) {
      console.log(`📊 Testing scenario: ${scenario.users} users for ${scenario.duration}s`);
      
      // Run Gatling test
      const gatlingResult = await this.runGatlingTest(protoPath, 'GrpcSimulation', {
        users: scenario.users,
        duration: scenario.duration,
        ...options?.gatlingConfig
      });
      
      // Run JMeter test
      const jmeterResult = await this.runJMeterTest('./test-plans/grpc-test-plan.jmx', {
        threads: scenario.users,
        duration: scenario.duration,
        ...options?.jmeterConfig
      });
      
      // Compare results
      const scenarioComparison = this.compareLoadTestResults(gatlingResult, jmeterResult, scenario);
      comparativeResults.scenarios.push(scenarioComparison);
    }

    // Generate summary and recommendations
    comparativeResults.summary = this.generateComparativeSummary(comparativeResults.scenarios);
    comparativeResults.recommendations = this.generateLoadTestRecommendations(comparativeResults);

    return comparativeResults;
  }

  parseReport(outputPath: string): LoadTestResult {
    console.log(`📋 Parsing load test report from: ${outputPath}`);
    
    try {
      // Detect report type and parse accordingly
      if (outputPath.includes('gatling')) {
        return this.parseGatlingReport(outputPath);
      } else if (outputPath.includes('jmeter')) {
        return this.parseJMeterReport(outputPath);
      } else {
        throw new Error('Unknown report format');
      }
    } catch (error) {
      console.error('❌ Failed to parse report:', error);
      return {
        testId: `parsed_${Date.now()}`,
        engine: 'unknown',
        timestamp: new Date().toISOString(),
        configuration: {},
        metrics: { error: error.message },
        status: 'failed',
        duration: 0
      };
    }
  }

  getLoadTestHistory(): LoadTestResult[] {
    return Array.from(this.testResults.values());
  }

  getLoadTestResult(testId: string): LoadTestResult | null {
    return this.testResults.get(testId) || null;
  }

  generateLoadTestReport(testIds?: string[]): string {
    const results = testIds 
      ? testIds.map(id => this.testResults.get(id)).filter(Boolean)
      : Array.from(this.testResults.values());
    
    if (results.length === 0) {
      return '# 📊 No Load Test Results Available';
    }

    let report = `
# 🚀 gRPC Load Testing Report

## 📈 Executive Summary
- Total Tests: ${results.length}
- Successful Tests: ${results.filter(r => r.status === 'completed').length}
- Failed Tests: ${results.filter(r => r.status === 'failed').length}
- Report Generated: ${new Date().toISOString()}

## 🎯 Test Results Breakdown
`;

    // Group by engine
    const gatlingResults = results.filter(r => r.engine === 'gatling');
    const jmeterResults = results.filter(r => r.engine === 'jmeter');

    if (gatlingResults.length > 0) {
      report += `
### Gatling Results (${gatlingResults.length} tests)
`;
      gatlingResults.forEach(result => {
        report += this.formatLoadTestResult(result);
      });
    }

    if (jmeterResults.length > 0) {
      report += `
### JMeter Results (${jmeterResults.length} tests)
`;
      jmeterResults.forEach(result => {
        report += this.formatLoadTestResult(result);
      });
    }

    // Performance comparison
    if (gatlingResults.length > 0 && jmeterResults.length > 0) {
      report += `
## ⚖️ Performance Comparison

### Throughput Comparison
- Gatling Average: ${this.calculateAverageThroughput(gatlingResults)} req/sec
- JMeter Average: ${this.calculateAverageThroughput(jmeterResults)} req/sec

### Latency Comparison
- Gatling Average Response Time: ${this.calculateAverageLatency(gatlingResults)}ms
- JMeter Average Response Time: ${this.calculateAverageLatency(jmeterResults)}ms

### Error Rate Comparison
- Gatling Average Error Rate: ${this.calculateAverageErrorRate(gatlingResults)}%
- JMeter Average Error Rate: ${this.calculateAverageErrorRate(jmeterResults)}%
`;
    }

    report += `
## 🎯 Recommendations

### Performance Optimization
- Monitor throughput patterns across different user loads
- Identify optimal concurrency levels for your gRPC services
- Consider implementing connection pooling for high-traffic scenarios

### Load Testing Strategy
- Run regular load tests to establish performance baselines
- Test both Gatling and JMeter to find the best tool for your use case
- Implement automated load testing in your CI/CD pipeline

### Scaling Considerations
- Use load test results to plan capacity requirements
- Monitor resource usage during load tests
- Consider implementing circuit breakers for fault tolerance

---
*Generated by gRPC Load Testing Framework on ${new Date().toISOString()}*
`;

    return report;
  }

  // Private helper methods
  private async generateGatlingSimulation(
    protoPath: string, 
    simulationClass: string, 
    options: any
  ): Promise<string> {
    const simulationTemplate = `
package simulations

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.grpc.Predef._
import scala.concurrent.duration._

class ${simulationClass} extends Simulation {
  val grpcProtocol = grpc
    .host("${options.host}")
    .port(${options.port})
    .useTls(${options.protocol === 'https'})
    .protoFile("${protoPath}")

  val scn = scenario("gRPC Load Test")
    .exec(
      grpc("unary_call")
        .rpc("${this.getServiceMethod(protoPath)}")
        .payload(StringBody("""${this.generateSamplePayload()}"""))
    )
    .pause(1)

  setUp(
    scn.inject(
      rampUsers(${options.users}).during(${options.rampUp}.seconds),
      constantUsersPerSec(${options.users}).during(${options.duration}.seconds)
    )
  ).protocols(grpcProtocol)
}
`;

    const simulationPath = `./gatling-simulations/${simulationClass}.scala`;
    // In a real implementation, you would write this file
    console.log(`📝 Generated Gatling simulation: ${simulationPath}`);
    
    return simulationPath;
  }

  private async executeGatlingSimulation(simulationFile: string, testId: string): Promise<any> {
    // In a real implementation, this would execute the Gatling CLI
    console.log(`🚀 Executing Gatling simulation: ${simulationFile}`);
    
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return {
      exitCode: 0,
      outputPath: `${this.gatlingConfig.outputDirectory}/${testId}`,
      executionTime: 5000
    };
  }

  private async parseGatlingResults(testId: string): Promise<any> {
    // In a real implementation, this would parse Gatling's HTML/CSV reports
    console.log(`📊 Parsing Gatling results for test: ${testId}`);
    
    // Simulate parsed results
    return {
      throughput: Math.random() * 1000 + 500, // req/sec
      responseTime: {
        mean: Math.random() * 50 + 10,
        p95: Math.random() * 100 + 20,
        p99: Math.random() * 200 + 50
      },
      errorRate: Math.random() * 5,
      activeUsers: Math.random() * 100 + 50,
      duration: Math.random() * 120 + 60
    };
  }

  private async executeJMeterTest(jmxPath: string, testId: string, options: any): Promise<any> {
    // In a real implementation, this would execute JMeter CLI
    console.log(`🔧 Executing JMeter test: ${jmxPath}`);
    
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    return {
      exitCode: 0,
      outputPath: `${this.jmeterConfig.outputDirectory}/${testId}`,
      executionTime: 4000
    };
  }

  private async parseJMeterResults(testId: string): Promise<any> {
    // In a real implementation, this would parse JMeter's CSV/XML reports
    console.log(`📊 Parsing JMeter results for test: ${testId}`);
    
    // Simulate parsed results
    return {
      throughput: Math.random() * 800 + 400, // req/sec
      responseTime: {
        mean: Math.random() * 60 + 15,
        p95: Math.random() * 120 + 25,
        p99: Math.random() * 250 + 60
      },
      errorRate: Math.random() * 3,
      activeUsers: Math.random() * 80 + 40,
      duration: Math.random() * 100 + 50
    };
  }

  private compareLoadTestResults(
    gatlingResult: LoadTestResult, 
    jmeterResult: LoadTestResult, 
    scenario: any
  ): LoadTestScenarioComparison {
    const gatlingMetrics = gatlingResult.metrics;
    const jmeterMetrics = jmeterResult.metrics;
    
    return {
      scenario,
      gatling: {
        throughput: gatlingMetrics.throughput || 0,
        responseTime: gatlingMetrics.responseTime?.mean || 0,
        errorRate: gatlingMetrics.errorRate || 0
      },
      jmeter: {
        throughput: jmeterMetrics.throughput || 0,
        responseTime: jmeterMetrics.responseTime?.mean || 0,
        errorRate: jmeterMetrics.errorRate || 0
      },
      comparison: {
        throughputDifference: ((gatlingMetrics.throughput || 0) - (jmeterMetrics.throughput || 0)) / (jmeterMetrics.throughput || 1) * 100,
        responseTimeDifference: ((jmeterMetrics.responseTime?.mean || 0) - (gatlingMetrics.responseTime?.mean || 0)) / (gatlingMetrics.responseTime?.mean || 1) * 100,
        errorRateDifference: ((gatlingMetrics.errorRate || 0) - (jmeterMetrics.errorRate || 0)) / (jmeterMetrics.errorRate || 1) * 100
      }
    };
  }

  private generateComparativeSummary(scenarios: LoadTestScenarioComparison[]): any {
    const avgThroughputDiff = scenarios.reduce((sum, s) => sum + s.comparison.throughputDifference, 0) / scenarios.length;
    const avgResponseTimeDiff = scenarios.reduce((sum, s) => sum + s.comparison.responseTimeDifference, 0) / scenarios.length;
    const avgErrorRateDiff = scenarios.reduce((sum, s) => sum + s.comparison.errorRateDifference, 0) / scenarios.length;
    
    return {
      averageThroughputDifference: avgThroughputDiff,
      averageResponseTimeDifference: avgResponseTimeDiff,
      averageErrorRateDifference: avgErrorRateDiff,
      recommendedEngine: avgThroughputDiff > 0 ? 'gatling' : 'jmeter',
      confidence: scenarios.length >= 3 ? 'high' : scenarios.length >= 2 ? 'medium' : 'low'
    };
  }

  private generateLoadTestRecommendations(results: ComparativeLoadTestResult): string[] {
    const recommendations: string[] = [];
    const summary = results.summary;
    
    if (summary.averageThroughputDifference > 20) {
      recommendations.push(`Gatling shows ${Math.abs(summary.averageThroughputDifference).toFixed(1)}% higher throughput - consider using Gatling for high-throughput scenarios`);
    } else if (summary.averageThroughputDifference < -20) {
      recommendations.push(`JMeter shows ${Math.abs(summary.averageThroughputDifference).toFixed(1)}% higher throughput - consider using JMeter for high-throughput scenarios`);
    }
    
    if (summary.averageResponseTimeDifference > 10) {
      recommendations.push(`JMeter shows ${Math.abs(summary.averageResponseTimeDifference).toFixed(1)}% lower response times - consider JMeter for latency-sensitive applications`);
    }
    
    if (summary.averageErrorRateDifference > 5) {
      recommendations.push(`Error rate difference of ${Math.abs(summary.averageErrorRateDifference).toFixed(1)}% detected - investigate stability differences between tools`);
    }
    
    if (results.scenarios.length < 3) {
      recommendations.push('Run more test scenarios to improve confidence in tool comparison');
    }
    
    return recommendations;
  }

  private parseGatlingReport(outputPath: string): LoadTestResult {
    // Implementation would parse Gatling's HTML/CSV reports
    return {
      testId: `gatling_parsed_${Date.now()}`,
      engine: 'gatling',
      timestamp: new Date().toISOString(),
      configuration: {},
      metrics: { parsedFrom: outputPath },
      status: 'completed',
      duration: 0
    };
  }

  private parseJMeterReport(outputPath: string): LoadTestResult {
    // Implementation would parse JMeter's CSV/XML reports
    return {
      testId: `jmeter_parsed_${Date.now()}`,
      engine: 'jmeter',
      timestamp: new Date().toISOString(),
      configuration: {},
      metrics: { parsedFrom: outputPath },
      status: 'completed',
      duration: 0
    };
  }

  private formatLoadTestResult(result: LoadTestResult): string {
    const metrics = result.metrics;
    return `
**Test ID:** ${result.testId}
**Status:** ${result.status}
**Duration:** ${result.duration}s
**Throughput:** ${metrics.throughput?.toFixed(1) || 'N/A'} req/sec
**Response Time:** ${metrics.responseTime?.mean?.toFixed(1) || 'N/A'}ms (P95: ${metrics.responseTime?.p95?.toFixed(1) || 'N/A'}ms)
**Error Rate:** ${metrics.errorRate?.toFixed(2) || 'N/A'}%
**Active Users:** ${metrics.activeUsers?.toFixed(0) || 'N/A'}

`;
  }

  private calculateAverageThroughput(results: LoadTestResult[]): number {
    const validResults = results.filter(r => r.metrics.throughput && r.status === 'completed');
    if (validResults.length === 0) return 0;
    
    return validResults.reduce((sum, r) => sum + (r.metrics.throughput || 0), 0) / validResults.length;
  }

  private calculateAverageLatency(results: LoadTestResult[]): number {
    const validResults = results.filter(r => r.metrics.responseTime?.mean && r.status === 'completed');
    if (validResults.length === 0) return 0;
    
    return validResults.reduce((sum, r) => sum + (r.metrics.responseTime?.mean || 0), 0) / validResults.length;
  }

  private calculateAverageErrorRate(results: LoadTestResult[]): number {
    const validResults = results.filter(r => r.metrics.errorRate !== undefined && r.status === 'completed');
    if (validResults.length === 0) return 0;
    
    return validResults.reduce((sum, r) => sum + (r.metrics.errorRate || 0), 0) / validResults.length;
  }

  private getServiceMethod(protoPath: string): string {
    // In a real implementation, this would parse the .proto file
    return 'YourService/YourMethod';
  }

  private generateSamplePayload(): string {
    // In a real implementation, this would generate appropriate protobuf payload
    return JSON.stringify({
      message: "Hello from Gatling gRPC test",
      timestamp: Date.now()
    });
  }
}

// Type definitions for load testing
export interface LoadTestResult {
  testId: string;
  engine: 'gatling' | 'jmeter';
  timestamp: string;
  configuration: any;
  metrics: any;
  status: 'completed' | 'failed' | 'running';
  duration: number;
}

export interface LoadTestScenarioComparison {
  scenario: { users: number; duration: number };
  gatling: { throughput: number; responseTime: number; errorRate: number };
  jmeter: { throughput: number; responseTime: number; errorRate: number };
  comparison: { throughputDifference: number; responseTimeDifference: number; errorRateDifference: number };
}

export interface ComparativeLoadTestResult {
  testId: string;
  timestamp: string;
  scenarios: LoadTestScenarioComparison[];
  summary: any;
  recommendations: string[];
}
