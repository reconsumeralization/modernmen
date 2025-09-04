'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { GrpcLoadTester, LoadTestResult, ComparativeLoadTestResult } from '@/lib/protobuf-testing-framework';
import { toast } from 'sonner';

export default function GrpcLoadTestDashboard() {
  const [loadTester] = useState(() => new GrpcLoadTester());
  const [activeTests, setActiveTests] = useState<Map<string, boolean>>(new Map());
  const [testResults, setTestResults] = useState<LoadTestResult[]>([]);
  const [comparativeResults, setComparativeResults] = useState<ComparativeLoadTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    protoPath: './protos/service.proto',
    simulationClass: 'GrpcSimulation',
    jmxPath: './test-plans/grpc-test-plan.jmx',
    users: 10,
    rampUp: 30,
    duration: 60,
    host: 'localhost',
    port: 9090,
    protocol: 'http' as 'http' | 'https',
    includeStreaming: false
  });

  useEffect(() => {
    // Load existing test results
    const history = loadTester.getLoadTestHistory();
    setTestResults(history);
  }, [loadTester]);

  const runGatlingTest = async () => {
    setIsLoading(true);
    const testId = `gatling_${Date.now()}`;
    setActiveTests(prev => new Map(prev).set(testId, true));

    try {
      const result = await loadTester.runGatlingTest(
        config.protoPath,
        config.simulationClass,
        {
          users: config.users,
          rampUp: config.rampUp,
          duration: config.duration,
          protocol: config.protocol,
          host: config.host,
          port: config.port,
          includeStreaming: config.includeStreaming
        }
      );

      setTestResults(prev => [...prev, result]);
      toast.success(`Gatling test completed! Throughput: ${result.metrics.throughput?.toFixed(1)} req/sec`);
    } catch (error) {
      toast.error(`Gatling test failed: ${error.message}`);
    } finally {
      setActiveTests(prev => {
        const newMap = new Map(prev);
        newMap.delete(testId);
        return newMap;
      });
      setIsLoading(false);
    }
  };

  const runJMeterTest = async () => {
    setIsLoading(true);
    const testId = `jmeter_${Date.now()}`;
    setActiveTests(prev => new Map(prev).set(testId, true));

    try {
      const result = await loadTester.runJMeterTest(config.jmxPath, {
        threads: config.users,
        rampUp: config.rampUp,
        duration: config.duration,
        protocol: config.protocol,
        host: config.host,
        port: config.port,
        includeStreaming: config.includeStreaming
      });

      setTestResults(prev => [...prev, result]);
      toast.success(`JMeter test completed! Throughput: ${result.metrics.throughput?.toFixed(1)} req/sec`);
    } catch (error) {
      toast.error(`JMeter test failed: ${error.message}`);
    } finally {
      setActiveTests(prev => {
        const newMap = new Map(prev);
        newMap.delete(testId);
        return newMap;
      });
      setIsLoading(false);
    }
  };

  const runComparativeTest = async () => {
    setIsLoading(true);
    try {
      const result = await loadTester.runComparativeLoadTest(config.protoPath, {
        testDuration: config.duration,
        userScenarios: [
          { users: 10, duration: 30 },
          { users: 25, duration: 30 },
          { users: 50, duration: 30 },
          { users: 100, duration: 30 }
        ]
      });

      setComparativeResults(result);
      toast.success(`Comparative test completed! Recommended engine: ${result.summary.recommendedEngine}`);
    } catch (error) {
      toast.error(`Comparative test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = () => {
    const report = loadTester.generateLoadTestReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grpc-load-test-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Load test report downloaded!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'running': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getEngineIcon = (engine: string) => {
    return engine === 'gatling' ? '🚀' : '🔧';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">gRPC Load Testing Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive load testing with Gatling and JMeter for gRPC services
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {testResults.length} Tests Run
        </Badge>
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="testing">Load Testing</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>
                Configure your gRPC load testing parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="protoPath">Proto File Path</Label>
                  <Input
                    id="protoPath"
                    value={config.protoPath}
                    onChange={(e) => setConfig(prev => ({ ...prev, protoPath: e.target.value }))}
                    placeholder="./protos/service.proto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="simulationClass">Gatling Simulation Class</Label>
                  <Input
                    id="simulationClass"
                    value={config.simulationClass}
                    onChange={(e) => setConfig(prev => ({ ...prev, simulationClass: e.target.value }))}
                    placeholder="GrpcSimulation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jmxPath">JMeter Test Plan Path</Label>
                  <Input
                    id="jmxPath"
                    value={config.jmxPath}
                    onChange={(e) => setConfig(prev => ({ ...prev, jmxPath: e.target.value }))}
                    placeholder="./test-plans/grpc-test-plan.jmx"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="host">gRPC Host</Label>
                  <Input
                    id="host"
                    value={config.host}
                    onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
                    placeholder="localhost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">gRPC Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={config.port}
                    onChange={(e) => setConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 9090 }))}
                    placeholder="9090"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="users">Concurrent Users</Label>
                  <Input
                    id="users"
                    type="number"
                    value={config.users}
                    onChange={(e) => setConfig(prev => ({ ...prev, users: parseInt(e.target.value) || 10 }))}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rampUp">Ramp-up Time (seconds)</Label>
                  <Input
                    id="rampUp"
                    type="number"
                    value={config.rampUp}
                    onChange={(e) => setConfig(prev => ({ ...prev, rampUp: parseInt(e.target.value) || 30 }))}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Test Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={config.duration}
                    onChange={(e) => setConfig(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    placeholder="60"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="protocol"
                    checked={config.protocol === 'https'}
                    onCheckedChange={(checked) => setConfig(prev => ({ 
                      ...prev, 
                      protocol: checked ? 'https' : 'http' 
                    }))}
                  />
                  <Label htmlFor="protocol">Use HTTPS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="streaming"
                    checked={config.includeStreaming}
                    onCheckedChange={(checked) => setConfig(prev => ({ 
                      ...prev, 
                      includeStreaming: checked 
                    }))}
                  />
                  <Label htmlFor="streaming">Include Streaming</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Gatling</span>
                </CardTitle>
                <CardDescription>
                  High-performance load testing with Scala-based simulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={runGatlingTest} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Running...' : 'Run Gatling Test'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🔧</span>
                  <span>JMeter</span>
                </CardTitle>
                <CardDescription>
                  Apache JMeter with gRPC plugin support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={runJMeterTest} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Running...' : 'Run JMeter Test'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>⚖️</span>
                  <span>Comparison</span>
                </CardTitle>
                <CardDescription>
                  Compare Gatling vs JMeter performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={runComparativeTest} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Running...' : 'Run Comparative Test'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {Array.from(activeTests.entries()).map(([testId, isActive]) => (
            <Alert key={testId}>
              <AlertDescription>
                Test {testId} is currently running...
                <Progress value={50} className="mt-2" />
              </AlertDescription>
            </Alert>
          ))}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Test Results</h3>
            <Button onClick={generateReport} variant="outline">
              Download Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testResults.map((result, index) => (
              <Card key={result.testId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span>{getEngineIcon(result.engine)}</span>
                      <span>{result.engine.toUpperCase()}</span>
                    </span>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {new Date(result.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Throughput:</span>
                    <span className="font-mono">
                      {result.metrics.throughput?.toFixed(1) || 'N/A'} req/sec
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span className="font-mono">
                      {result.metrics.responseTime?.mean?.toFixed(1) || 'N/A'}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate:</span>
                    <span className="font-mono">
                      {result.metrics.errorRate?.toFixed(2) || 'N/A'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-mono">{result.duration}s</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {testResults.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No test results available. Run a test to see results here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {comparativeResults ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparative Analysis Summary</CardTitle>
                  <CardDescription>
                    Gatling vs JMeter Performance Comparison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {comparativeResults.summary.averageThroughputDifference?.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Throughput Difference</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {comparativeResults.summary.averageResponseTimeDifference?.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Response Time Difference</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {comparativeResults.summary.recommendedEngine?.toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">Recommended Engine</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {comparativeResults.summary.confidence?.toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">Confidence Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test Scenarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comparativeResults.scenarios.map((scenario, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">
                          Scenario {index + 1}: {scenario.scenario.users} users for {scenario.scenario.duration}s
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Gatling</div>
                            <div>Throughput: {scenario.gatling.throughput.toFixed(1)} req/sec</div>
                            <div>Response: {scenario.gatling.responseTime.toFixed(1)}ms</div>
                            <div>Errors: {scenario.gatling.errorRate.toFixed(2)}%</div>
                          </div>
                          <div>
                            <div className="font-medium">JMeter</div>
                            <div>Throughput: {scenario.jmeter.throughput.toFixed(1)} req/sec</div>
                            <div>Response: {scenario.jmeter.responseTime.toFixed(1)}ms</div>
                            <div>Errors: {scenario.jmeter.errorRate.toFixed(2)}%</div>
                          </div>
                          <div>
                            <div className="font-medium">Difference</div>
                            <div>Throughput: {scenario.comparison.throughputDifference.toFixed(1)}%</div>
                            <div>Response: {scenario.comparison.responseTimeDifference.toFixed(1)}%</div>
                            <div>Errors: {scenario.comparison.errorRateDifference.toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {comparativeResults.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  No comparative results available. Run a comparative test to see analysis here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}


