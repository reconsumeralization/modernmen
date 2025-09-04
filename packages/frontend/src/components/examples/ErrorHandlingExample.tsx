'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ErrorBoundary,
  safeGet,
  safeMap,
  safeProp,
  SafeArray,
  ValidationSchemas,
  validateWithMonitoring,
  useErrorMonitoring,
  APIErrorFactory,
  errorMonitor
} from '@/lib/error-handling'
import { cn } from '@/lib/utils'

export function ErrorHandlingExample() {
  const [arrayIndex, setArrayIndex] = useState('')
  const [objectPath, setObjectPath] = useState('')
  const [validationData, setValidationData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [results, setResults] = useState<any[]>([])

  const { addBreadcrumb, captureError } = useErrorMonitoring()

  // Sample data for testing
  const sampleArray = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']
  const sampleObject = {
    user: {
      profile: {
        name: 'John Doe',
        email: 'john@example.com',
        preferences: {
          theme: 'dark',
          notifications: true
        }
      },
      settings: {
        language: 'en',
        timezone: 'UTC'
      }
    },
    metadata: {
      version: '1.0.0',
      created: new Date().toISOString()
    }
  }

  const addResult = (title: string, result: any, success: boolean = true) => {
    setResults(prev => [{
      id: Date.now(),
      title,
      result: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result),
      success,
      timestamp: new Date().toISOString()
    }, ...prev.slice(0, 9)]) // Keep last 10 results
  }

  // Test safe array access
  const testSafeArrayAccess = () => {
    addBreadcrumb('Testing safe array access', 'user_action', { index: arrayIndex })

    const index = parseInt(arrayIndex) || 0
    const result = safeGet(sampleArray, index, 'Not found')

    addResult(
      `Array Access [${index}]`,
      result,
      result !== 'Not found'
    )
  }

  // Test safe object access
  const testSafeObjectAccess = () => {
    addBreadcrumb('Testing safe object access', 'user_action', { path: objectPath })

    const result = safeProp(sampleObject, objectPath.split('.'), 'Not found')

    addResult(
      `Object Access "${objectPath}"`,
      result,
      result !== 'Not found'
    )
  }

  // Test SafeArray class
  const testSafeArray = () => {
    addBreadcrumb('Testing SafeArray class', 'user_action')

    const safeArr = new SafeArray(sampleArray, 'TestSafeArray')

    const operations = [
      { name: 'get(0)', result: safeArr.get(0) },
      { name: 'get(10)', result: safeArr.get(10) }, // Out of bounds
      { name: 'length', result: safeArr.length },
      { name: 'isEmpty', result: safeArr.isEmpty }
    ]

    operations.forEach(op => {
      addResult(`SafeArray.${op.name}`, op.result, op.result !== null)
    })
  }

  // Test array mapping with safety
  const testSafeMap = () => {
    addBreadcrumb('Testing safe array mapping', 'user_action')

    const result = safeMap(sampleArray, (item, index) => ({
      index,
      item,
      length: item.length
    }))

    addResult('Safe Array Map', result, result.length > 0)
  }

  // Test form validation
  const testFormValidation = async () => {
    addBreadcrumb('Testing form validation', 'user_action', validationData)

    const result = await validateWithMonitoring(
      ValidationSchemas.userRegistration,
      validationData,
      'ExampleForm'
    )

    addResult(
      'Form Validation',
      result.success ? 'Valid' : result.errors,
      result.success
    )
  }

  // Test error simulation
  const testErrorSimulation = async () => {
    addBreadcrumb('Testing error simulation', 'user_action')

    try {
      // Simulate an array bounds error
      throw APIErrorFactory.indexOutOfBounds(10, 5, 'TestArray')
    } catch (error) {
      await captureError(error, {
        component: 'ErrorHandlingExample',
        action: 'testErrorSimulation'
      })

      addResult('Error Simulation', 'Error captured successfully', true)
    }
  }

  // Clear results
  const clearResults = () => {
    setResults([])
    addBreadcrumb('Cleared results', 'user_action')
  }

  // Get error statistics
  const getErrorStats = () => {
    const stats = errorMonitor.getErrorStats()
    addResult('Error Statistics', stats, true)
  }

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚨 Error Handling System Demo
              <Badge variant="secondary">Interactive Examples</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Safe Array Access */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Safe Array Access</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="array-index">Array Index (0-4)</Label>
                  <Input
                    id="array-index"
                    type="number"
                    placeholder="Enter index"
                    value={arrayIndex}
                    onChange={(e) => setArrayIndex(e.target.value)}
                  />
                </div>
                <Button onClick={testSafeArrayAccess}>Test Array Access</Button>
                <Button onClick={testSafeArray} variant="outline">Test SafeArray Class</Button>
                <Button onClick={testSafeMap} variant="outline">Test Safe Map</Button>
              </div>
              <p className="text-sm text-gray-600">
                Sample array: [{sampleArray.map(item => `"${item}"`).join(', ')}]
              </p>
            </div>

            {/* Safe Object Access */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Safe Object Access</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="object-path">Object Path</Label>
                  <Input
                    id="object-path"
                    placeholder="e.g., user.profile.name"
                    value={objectPath}
                    onChange={(e) => setObjectPath(e.target.value)}
                  />
                </div>
                <Button onClick={testSafeObjectAccess}>Test Object Access</Button>
              </div>
              <p className="text-sm text-gray-600">
                Try: user.profile.name, user.settings.language, metadata.version
              </p>
            </div>

            {/* Form Validation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Form Validation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={validationData.email}
                    onChange={(e) => setValidationData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={validationData.password}
                    onChange={(e) => setValidationData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={validationData.name}
                    onChange={(e) => setValidationData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={testFormValidation}>Test Form Validation</Button>
            </div>

            {/* Error Simulation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Error Simulation</h3>
              <div className="flex gap-4">
                <Button onClick={testErrorSimulation} variant="destructive">
                  Simulate Error
                </Button>
                <Button onClick={getErrorStats} variant="outline">
                  Get Error Stats
                </Button>
                <Button onClick={clearResults} variant="outline">
                  Clear Results
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Results</h3>
                <Badge variant="secondary">{results.length} tests</Badge>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No results yet. Run some tests above!</p>
                ) : (
                  results.map((result) => (
                    <Card key={result.id} className={cn(
                      "transition-colors",
                      result.success ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"
                    )}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{result.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={result.success ? "default" : "destructive"}>
                              {result.success ? '✅ Success' : '❌ Failed'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                          {result.result}
                        </pre>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  )
}

export default ErrorHandlingExample
