import React from 'react'
import { APIDocumentation } from '@/components/documentation/APIDocumentation'
import { apiDocExtractor } from '@/lib/api-documentation-extractor'
import { sampleAPIDocumentation } from '@/lib/sample-api-docs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, InfoIcon } from 'lucide-react'

export default async function APIDocumentationPage() {
  let sections = []
  let error = null
  let usingSampleData = false

  try {
    // Extract API documentation from the codebase
    sections = await apiDocExtractor.extractAPIDocumentation()
    
    // If no sections found, use sample data for demonstration
    if (sections.length === 0) {
      sections = sampleAPIDocumentation
      usingSampleData = true
    }
  } catch (err) {
    console.error('Failed to extract API documentation:', err)
    error = err instanceof Error ? err.message : 'Unknown error occurred'
    
    // Fallback to sample data
    sections = sampleAPIDocumentation
    usingSampleData = true
    error = null // Clear error since we have fallback data
  }

  // Configuration for API documentation
  const apiConfig = {
    authentication: {
      enabled: true,
      types: ['bearer'] as const,
      testCredentials: {
        bearer: process.env.NEXT_PUBLIC_TEST_JWT_TOKEN
      }
    },
    interactiveTesting: true,
    sdkGeneration: {
      languages: ['typescript', 'javascript', 'python', 'curl', 'php'] as const,
      includeAuth: true,
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      packageName: 'modern-men-api',
      version: '1.0.0'
    }
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              API Documentation Error
            </CardTitle>
            <CardDescription>
              Failed to load API documentation from the codebase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Error details: {error}
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <strong>Possible solutions:</strong>
              </p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                <li>Ensure API route files exist in src/app/api/</li>
                <li>Check that route files follow Next.js App Router conventions</li>
                <li>Verify file permissions and accessibility</li>
                <li>Check server logs for detailed error information</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>
              No API endpoints found in the codebase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The API documentation extractor could not find any API routes to document.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <strong>Expected structure:</strong>
              </p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                <li>API routes should be in src/app/api/ directory</li>
                <li>Each route should have a route.ts or route.js file</li>
                <li>Routes should export HTTP method functions (GET, POST, etc.)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Sample Data Notice */}
      {usingSampleData && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <InfoIcon className="w-5 h-5" />
              Sample API Documentation
            </CardTitle>
            <CardDescription className="text-blue-700">
              This documentation is using sample data for demonstration purposes. 
              In a production environment, this would be automatically generated from your actual API routes.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">API Documentation</h1>
            <p className="text-muted-foreground mt-2">
              Interactive API reference for the Modern Men Hair Salon management system
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {sections.reduce((total, section) => total + section.endpoints.length, 0)} endpoints
            </Badge>
            <Badge variant="outline">
              {sections.length} sections
            </Badge>
            {usingSampleData && (
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                Sample Data
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* API Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="default">JWT Bearer Token</Badge>
              <p className="text-sm text-muted-foreground">
                Most endpoints require authentication using JWT tokens
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interactive Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="default">Enabled</Badge>
              <p className="text-sm text-muted-foreground">
                Test endpoints directly from the documentation
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Code Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {apiConfig.sdkGeneration.languages.map(lang => (
                  <Badge key={lang} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Generate client code in multiple languages
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Documentation Component */}
      <APIDocumentation
        sections={sections}
        authentication={apiConfig.authentication}
        interactiveTesting={apiConfig.interactiveTesting}
        sdkGeneration={apiConfig.sdkGeneration}
        onEndpointTest={(endpoint, result) => {
          console.log('Endpoint test result:', { endpoint: endpoint.operationId, result })
        }}
      />
    </div>
  )
}