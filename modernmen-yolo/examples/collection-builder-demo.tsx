'use client'

import React, { useState } from 'react'
import { CollectionBuilder } from '@/components/builder/collection-builder'
import { DeploymentManager, DeploymentResult } from '@/lib/collection-deployer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Rocket,
  Database,
  Code,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Upload,
  Zap
} from 'lucide-react'

// =============================================================================
// COLLECTION BUILDER DEMO
// =============================================================================
// Complete demonstration of the drag-and-drop collection builder system
// that automatically generates APIs, databases, and admin interfaces.

interface DemoStep {
  id: string
  title: string
  description: string
  completed: boolean
  component?: React.ReactNode
}

export function CollectionBuilderDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [collection, setCollection] = useState<any>(null)
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)

  const steps: DemoStep[] = [
    {
      id: 'build',
      title: 'Build Collection',
      description: 'Use drag-and-drop to create your collection schema',
      completed: !!collection,
      component: (
        <div className="h-[600px] border rounded-lg overflow-hidden">
          <CollectionBuilder
            onCollectionCreated={(createdCollection) => {
              setCollection(createdCollection)
              setCurrentStep(1)
            }}
          />
        </div>
      )
    },
    {
      id: 'review',
      title: 'Review & Configure',
      description: 'Review your collection and configure deployment options',
      completed: currentStep > 1,
      component: collection ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Collection Review: {collection.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {collection.name}</p>
                  <p><strong>Slug:</strong> {collection.slug}</p>
                  <p><strong>Description:</strong> {collection.description}</p>
                  <p><strong>Fields:</strong> {collection.fields?.length || 0}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Access Control</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Create:</strong> <Badge variant="outline">{collection.access?.create}</Badge></p>
                  <p><strong>Read:</strong> <Badge variant="outline">{collection.access?.read}</Badge></p>
                  <p><strong>Update:</strong> <Badge variant="outline">{collection.access?.update}</Badge></p>
                  <p><strong>Delete:</strong> <Badge variant="outline">{collection.access?.delete}</Badge></p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Fields</h4>
              <div className="space-y-2">
                {collection.fields?.map((field: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{field.type}</Badge>
                      <div>
                        <span className="font-medium">{field.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">({field.label})</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {field.required && <Badge>Required</Badge>}
                      {field.unique && <Badge variant="outline">Unique</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                This collection will automatically generate:
                • Database table with proper indexes
                • RESTful API endpoints
                • TypeScript types and validation
                • Admin interface with CRUD operations
                • Real-time subscriptions
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please complete the collection building step first.
          </AlertDescription>
        </Alert>
      )
    },
    {
      id: 'deploy',
      title: 'Deploy Collection',
      description: 'Deploy your collection to create the database and APIs',
      completed: !!deploymentResult?.success,
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Deployment Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!deploymentResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Database</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Create PostgreSQL table
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Generate indexes for performance
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Enable Row Level Security
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">API & Admin</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Generate RESTful API endpoints
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Create admin interface
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Enable real-time subscriptions
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleDeploy}
                  disabled={!collection || isDeploying}
                  className="w-full"
                  size="lg"
                >
                  {isDeploying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Deploying Collection...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5 mr-2" />
                      Deploy Collection
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <DeploymentResults result={deploymentResult} />
            )}
          </CardContent>
        </Card>
      )
    },
    {
      id: 'test',
      title: 'Test & Use',
      description: 'Test your deployed collection and see it in action',
      completed: false,
      component: deploymentResult?.success ? (
        <TestCollection collection={collection} deploymentResult={deploymentResult} />
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please deploy your collection first to access testing features.
          </AlertDescription>
        </Alert>
      )
    }
  ]

  async function handleDeploy() {
    if (!collection) return

    setIsDeploying(true)

    try {
      const deploymentManager = new DeploymentManager()
      const results = await deploymentManager.deployCollections([collection], 'development')

      setDeploymentResult(results[0])
      if (results[0].success) {
        setCurrentStep(3)
      }
    } catch (error) {
      console.error('Deployment failed:', error)
      setDeploymentResult({
        success: false,
        errors: [error instanceof Error ? error.message : 'Deployment failed']
      })
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Collection Builder Demo</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Build complete collections with drag-and-drop, then automatically deploy them
          with full API endpoints, database tables, and admin interfaces.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer transition-colors ${
                index <= currentStep && step.completed
                  ? 'bg-primary text-primary-foreground'
                  : index === currentStep
                  ? 'bg-primary/50 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              {step.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${
                index < currentStep ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{steps[currentStep].title}</span>
              <Badge variant={steps[currentStep].completed ? "default" : "secondary"}>
                {steps[currentStep].completed ? "Completed" : "In Progress"}
              </Badge>
            </CardTitle>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
          </CardHeader>
        </Card>

        {steps[currentStep].component}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1 || !steps[currentStep].completed}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// DEPLOYMENT RESULTS COMPONENT
// =============================================================================

interface DeploymentResultsProps {
  result: DeploymentResult
}

function DeploymentResults({ result }: DeploymentResultsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {result.success ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
        <span className="font-semibold">
          {result.success ? 'Deployment Successful!' : 'Deployment Failed'}
        </span>
      </div>

      {result.success ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Database</span>
              </div>
              <p className="text-sm text-green-700">
                Table: {result.databaseTable}
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Code className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">API Endpoints</span>
              </div>
              <p className="text-sm text-blue-700">
                {result.apiEndpoints?.length} endpoints created
              </p>
            </div>
          </div>

          {result.adminUrl && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded">
              <div className="flex items-center gap-2 mb-1">
                <ExternalLink className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-800">Admin Interface</span>
              </div>
              <p className="text-sm text-purple-700">
                Available at: {result.adminUrl}
              </p>
            </div>
          )}

          <Button className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Test Your Collection
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {result.errors?.map((error, index) => (
            <Alert key={index} variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {result.warnings && result.warnings.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-yellow-800">Warnings:</h4>
          {result.warnings.map((warning, index) => (
            <Alert key={index}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// TEST COLLECTION COMPONENT
// =============================================================================

interface TestCollectionProps {
  collection: any
  deploymentResult: DeploymentResult
}

function TestCollection({ collection, deploymentResult }: TestCollectionProps) {
  const [testData, setTestData] = useState<any>({})
  const [testResults, setTestResults] = useState<any>(null)
  const [isTesting, setIsTesting] = useState(false)

  const handleTestAPI = async () => {
    setIsTesting(true)

    try {
      // Simulate API testing
      await new Promise(resolve => setTimeout(resolve, 2000))

      setTestResults({
        create: { success: true, id: 'test-123' },
        read: { success: true, data: { id: 'test-123', ...testData } },
        update: { success: true },
        delete: { success: true }
      })
    } catch (error) {
      setTestResults({
        error: error instanceof Error ? error.message : 'Test failed'
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Test Your Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Data Input */}
          <div>
            <h4 className="font-medium mb-3">Test Data</h4>
            <div className="grid grid-cols-2 gap-4">
              {collection.fields?.slice(0, 4).map((field: any) => (
                <div key={field.name}>
                  <label className="text-sm font-medium mb-1 block">{field.label}</label>
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    className="w-full p-2 border rounded"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={testData[field.name] || ''}
                    onChange={(e) => setTestData({
                      ...testData,
                      [field.name]: e.target.value
                    })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Test Actions */}
          <div className="flex gap-4">
            <Button
              onClick={handleTestAPI}
              disabled={isTesting}
              className="flex-1"
            >
              {isTesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Testing API...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run API Tests
                </>
              )}
            </Button>

            {deploymentResult.adminUrl && (
              <Button variant="outline" asChild>
                <a href={deploymentResult.adminUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Admin
                </a>
              </Button>
            )}
          </div>

          {/* Test Results */}
          {testResults && (
            <div>
              <h4 className="font-medium mb-3">Test Results</h4>
              {testResults.error ? (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{testResults.error}</AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(testResults).map(([operation, result]: [string, any]) => (
                    <div key={operation} className="p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800 capitalize">{operation}</span>
                      </div>
                      <p className="text-sm text-green-700">
                        {result.success ? 'Success' : 'Failed'}
                        {result.id && ` (ID: ${result.id})`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* API Documentation */}
          <div>
            <h4 className="font-medium mb-3">API Endpoints</h4>
            <div className="space-y-2">
              {deploymentResult.apiEndpoints?.map((endpoint, index) => (
                <div key={index} className="p-2 bg-muted rounded text-sm font-mono">
                  <span className="text-blue-600">GET</span> {endpoint}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Code className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-medium mb-1">Use in Frontend</h4>
              <p className="text-sm text-muted-foreground">
                Import the generated service and start using your collection
              </p>
            </div>

            <div className="p-4 border rounded-lg text-center">
              <Database className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-medium mb-1">Manage Data</h4>
              <p className="text-sm text-muted-foreground">
                Use the admin interface to manage your collection data
              </p>
            </div>

            <div className="p-4 border rounded-lg text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h4 className="font-medium mb-1">Add Features</h4>
              <p className="text-sm text-muted-foreground">
                Extend with custom logic, relationships, and business rules
              </p>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your collection is now live! You can start building features that use this collection
              immediately. The generated code includes TypeScript types, validation, and real-time capabilities.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================================================
// EXPORT
// =============================================================================

export default CollectionBuilderDemo
