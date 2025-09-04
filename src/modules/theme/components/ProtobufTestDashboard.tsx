/**
 * YOLO Protobuf + GTM Test Dashboard
 * 
 * Comprehensive testing and growth monitoring dashboard for
 * protobuf serialization, GTM tracking, and performance analytics.
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  protobufTestRunner, 
  protobufPerformanceTester, 
  protobufGrowthAnalytics,
  ProtobufTestDataGenerator 
} from '@/lib/protobuf-testing-framework';

interface TestResults {
  performance?: any;
  gtm?: any;
  stress?: any;
  growth?: any;
  error?: string;
  timestamp?: string;
}

export default function ProtobufTestDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResults>({});
  const [currentTest, setCurrentTest] = useState<string>('');
  const [liveMetrics, setLiveMetrics] = useState<any>({});
  const [testHistory, setTestHistory] = useState<TestResults[]>([]);

  // Run full test suite
  const runFullTestSuite = async () => {
    setIsRunning(true);
    setCurrentTest('Full Test Suite');
    
    try {
      toast.info('🚀 Starting comprehensive protobuf + GTM test suite...');
      
      const results = await protobufTestRunner.runFullTestSuite();
      setTestResults(results);
      setTestHistory(prev => [results, ...prev.slice(0, 9)]); // Keep last 10 tests
      
      toast.success('✅ Test suite completed successfully!');
      
    } catch (error) {
      console.error('Test suite failed:', error);
      toast.error('❌ Test suite failed. Check console for details.');
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  // Run individual performance tests
  const runPerformanceTests = async () => {
    setIsRunning(true);
    setCurrentTest('Performance Tests');
    
    try {
      const testData = ProtobufTestDataGenerator.generatePerformanceTestData();
      const results: any = {};
      
      for (const data of testData) {
        const dataKey = Object.keys(data)[0];
        results[dataKey] = await protobufPerformanceTester.runSerializationTests(data[dataKey], 25);
      }
      
      setTestResults({ performance: results });
      toast.success('✅ Performance tests completed!');
      
    } catch (error) {
      toast.error('❌ Performance tests failed');
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  // Run GTM tracking tests
  const runGTMTests = async () => {
    setIsRunning(true);
    setCurrentTest('GTM Tracking Tests');
    
    try {
      const gtmEvents = ['appointment_creation', 'customer_registration', 'booking_funnel', 'performance_metrics'];
      const results = await protobufPerformanceTester.runGTMTrackingTests(gtmEvents, 10);
      
      setTestResults({ gtm: results });
      toast.success('✅ GTM tracking tests completed!');
      
    } catch (error) {
      toast.error('❌ GTM tests failed');
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  // Run stress tests
  const runStressTests = async () => {
    setIsRunning(true);
    setCurrentTest('Stress Tests');
    
    try {
      const results: any = {};
      results.small = await protobufPerformanceTester.runStressTest('small', 5000);
      results.medium = await protobufPerformanceTester.runStressTest('medium', 8000);
      results.large = await protobufPerformanceTester.runStressTest('large', 10000);
      
      setTestResults({ stress: results });
      toast.success('✅ Stress tests completed!');
      
    } catch (error) {
      toast.error('❌ Stress tests failed');
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  // Simulate live growth tracking
  const startLiveTracking = () => {
    const interval = setInterval(async () => {
      const appointmentData = ProtobufTestDataGenerator.generateAppointmentData(1)[0];
      await protobufGrowthAnalytics.trackProtobufGrowth(appointmentData);
      
      const metrics = protobufGrowthAnalytics.getGrowthMetrics();
      setLiveMetrics(metrics);
    }, 2000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    const cleanup = startLiveTracking();
    return cleanup;
  }, []);

  const getPerformanceSummary = () => {
    if (!testResults.performance) return null;
    
    const summaries = Object.values(testResults.performance).map((result: any) => ({
      compressionRatio: result.compression?.ratio || 0,
      improvement: result.compression?.improvement || 0,
      avgTime: result.protobuf?.avgTime || 0,
    }));
    
    return {
      avgCompressionRatio: summaries.reduce((sum, s) => sum + s.compressionRatio, 0) / summaries.length,
      avgImprovement: summaries.reduce((sum, s) => sum + s.improvement, 0) / summaries.length,
      avgTime: summaries.reduce((sum, s) => sum + s.avgTime, 0) / summaries.length,
    };
  };

  const getGTMSummary = () => {
    if (!testResults.gtm) return null;
    
    return {
      successRate: testResults.gtm.successRate || 0,
      avgTime: testResults.gtm.avgTime || 0,
      totalOperations: testResults.gtm.iterations * Object.keys(testResults.gtm.events || {}).length,
    };
  };

  const getStressSummary = () => {
    if (!testResults.stress) return null;
    
    const summaries = Object.values(testResults.stress).map((result: any) => ({
      throughput: result.throughput || 0,
      errors: result.errors || 0,
      operations: result.operations || 0,
    }));
    
    return {
      avgThroughput: summaries.reduce((sum, s) => sum + s.throughput, 0) / summaries.length,
      totalErrors: summaries.reduce((sum, s) => sum + s.errors, 0),
      totalOperations: summaries.reduce((sum, s) => sum + s.operations, 0),
    };
  };

  const performanceSummary = getPerformanceSummary();
  const gtmSummary = getGTMSummary();
  const stressSummary = getStressSummary();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Protobuf + GTM Test Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive testing and growth monitoring for Modern Men Salon
          </p>
        </div>
        <Badge variant={isRunning ? "destructive" : "secondary"}>
          {isRunning ? `Running: ${currentTest}` : 'Ready'}
        </Badge>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>
            Run comprehensive tests for protobuf serialization, GTM tracking, and performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={runFullTestSuite} 
              disabled={isRunning}
              className="w-full"
            >
              🚀 Full Suite
            </Button>
            <Button 
              onClick={runPerformanceTests} 
              disabled={isRunning}
              variant="outline"
              className="w-full"
            >
              ⚡ Performance
            </Button>
            <Button 
              onClick={runGTMTests} 
              disabled={isRunning}
              variant="outline"
              className="w-full"
            >
              📊 GTM Tests
            </Button>
            <Button 
              onClick={runStressTests} 
              disabled={isRunning}
              variant="outline"
              className="w-full"
            >
              💪 Stress Tests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Live Growth Metrics</CardTitle>
          <CardDescription>
            Real-time tracking of protobuf performance and business metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {liveMetrics.performance?.serialization_time?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Serializations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {liveMetrics.business?.appointments_created?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Appointments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${liveMetrics.business?.revenue?.reduce((sum: number, m: any) => sum + m.value, 0) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {liveMetrics.analytics?.gtm_events_sent?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">GTM Events</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="gtm">GTM Analytics</TabsTrigger>
          <TabsTrigger value="stress">Stress Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Performance Summary */}
            {performanceSummary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Compression Ratio:</span>
                    <span className="font-semibold">{performanceSummary.avgCompressionRatio.toFixed(1)}%</span>
                  </div>
                  <Progress value={performanceSummary.avgCompressionRatio} className="w-full" />
                  <div className="flex justify-between">
                    <span>Size Improvement:</span>
                    <span className="font-semibold text-green-600">{performanceSummary.avgImprovement.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Time:</span>
                    <span className="font-semibold">{performanceSummary.avgTime.toFixed(2)}ms</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* GTM Summary */}
            {gtmSummary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">GTM Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-semibold">{gtmSummary.successRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={gtmSummary.successRate} className="w-full" />
                  <div className="flex justify-between">
                    <span>Avg Response:</span>
                    <span className="font-semibold">{gtmSummary.avgTime.toFixed(2)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operations:</span>
                    <span className="font-semibold">{gtmSummary.totalOperations}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stress Summary */}
            {stressSummary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Stress Test Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Avg Throughput:</span>
                    <span className="font-semibold">{stressSummary.avgThroughput.toFixed(1)} ops/sec</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Errors:</span>
                    <span className="font-semibold text-red-600">{stressSummary.totalErrors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operations:</span>
                    <span className="font-semibold">{stressSummary.totalOperations}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Error Display */}
          {testResults.error && (
            <Alert>
              <AlertDescription className="text-red-600">
                ❌ Test Error: {testResults.error}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {testResults.performance && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(testResults.performance).map(([key, result]: [string, any]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-sm capitalize">{key} Data Test</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>JSON Size: {result.json?.avgSize?.toFixed(0)} bytes</div>
                      <div>Protobuf Size: {result.protobuf?.avgSize?.toFixed(0)} bytes</div>
                      <div>JSON Time: {result.json?.avgTime?.toFixed(2)}ms</div>
                      <div>Protobuf Time: {result.protobuf?.avgTime?.toFixed(2)}ms</div>
                    </div>
                    <Progress 
                      value={result.compression?.ratio || 0} 
                      className="w-full" 
                    />
                    <div className="text-center text-sm">
                      Compression: {result.compression?.ratio?.toFixed(1)}% 
                      (Improvement: {result.compression?.improvement?.toFixed(1)}%)
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="gtm" className="space-y-4">
          {testResults.gtm && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>GTM Tracking Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{testResults.gtm.successRate?.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{testResults.gtm.avgTime?.toFixed(2)}ms</div>
                      <div className="text-sm text-muted-foreground">Avg Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{testResults.gtm.iterations}</div>
                      <div className="text-sm text-muted-foreground">Iterations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Object.keys(testResults.gtm.events || {}).length}</div>
                      <div className="text-sm text-muted-foreground">Event Types</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {testResults.gtm.events && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(testResults.gtm.events).map(([event, data]: [string, any]) => (
                    <Card key={event}>
                      <CardHeader>
                        <CardTitle className="text-sm capitalize">{event.replace('_', ' ')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <div>Count: {data.count}</div>
                          <div>Avg Time: {data.avgTime?.toFixed(2)}ms</div>
                          <div>Total Time: {data.totalTime?.toFixed(2)}ms</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stress" className="space-y-4">
          {testResults.stress && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(testResults.stress).map(([size, result]: [string, any]) => (
                <Card key={size}>
                  <CardHeader>
                    <CardTitle className="text-sm capitalize">{size} Data Stress Test</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Operations: {result.operations}</div>
                      <div>Errors: {result.errors}</div>
                      <div>Throughput: {result.throughput?.toFixed(1)} ops/sec</div>
                      <div>Avg Response: {result.avgResponseTime?.toFixed(2)}ms</div>
                    </div>
                    <Progress 
                      value={(result.operations / (result.operations + result.errors)) * 100} 
                      className="w-full" 
                    />
                    <div className="text-center text-sm">
                      Success Rate: {((result.operations / (result.operations + result.errors)) * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Test History */}
      {testHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test History</CardTitle>
            <CardDescription>Recent test runs and their timestamps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testHistory.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">
                      Test Run #{testHistory.length - index}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {test.timestamp ? new Date(test.timestamp).toLocaleString() : 'Unknown time'}
                    </div>
                  </div>
                  <Badge variant={test.error ? "destructive" : "secondary"}>
                    {test.error ? 'Failed' : 'Success'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
