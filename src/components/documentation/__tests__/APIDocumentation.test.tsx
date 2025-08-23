import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { APIDocumentation } from '../APIDocumentation'
import { APIDocumentationSection } from '@/types/api-documentation'

// Mock the child components to avoid complex dependencies in tests
jest.mock('../APITester', () => ({
    APITester: ({ onClose }: { onClose: () => void }) => (
        <div data-testid="api-tester">
            <button onClick={onClose}>Close Tester</button>
        </div>
    )
}))

jest.mock('../CodeGenerator', () => ({
    CodeGenerator: ({ onClose }: { onClose: () => void }) => (
        <div data-testid="code-generator">
            <button onClick={onClose}>Close Generator</button>
        </div>
    )
}))

const mockSections: APIDocumentationSection[] = [
    {
        id: 'users',
        title: 'Users',
        description: 'User management endpoints',
        endpoints: [
            {
                path: '/api/users',
                method: 'GET',
                summary: 'Get users',
                description: 'Retrieve a list of users',
                operationId: 'getUsers',
                tags: ['Users'],
                parameters: {
                    path: [],
                    query: [
                        {
                            name: 'limit',
                            type: 'integer',
                            required: false,
                            description: 'Number of users to return',
                            example: 20
                        }
                    ],
                    header: [],
                    cookie: []
                },
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: [
                            {
                                mediaType: 'application/json',
                                examples: [
                                    {
                                        name: 'Success',
                                        value: { users: [], total: 0 }
                                    }
                                ],
                                schema: undefined
                            }
                        ],
                        examples: []
                    }
                },
                security: [
                    {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                ]
            }
        ],
        schemas: {},
        examples: [],
        authentication: []
    }
]

describe('APIDocumentation', () => {
    it('renders API documentation with sections', () => {
        render(<APIDocumentation sections={mockSections} />)

        expect(screen.getByText('API Documentation')).toBeInTheDocument()
        expect(screen.getByText('Users')).toBeInTheDocument()
        expect(screen.getByText('User management endpoints')).toBeInTheDocument()
    })

    it('displays authentication information when enabled', () => {
        const authentication = {
            enabled: true,
            types: ['bearer'] as const
        }

        render(
            <APIDocumentation
                sections={mockSections}
                authentication={authentication}
            />
        )

        expect(screen.getByText('Authentication')).toBeInTheDocument()
        expect(screen.getByText('Required')).toBeInTheDocument()
    })

    it('shows endpoint details', () => {
        render(<APIDocumentation sections={mockSections} />)

        expect(screen.getByText('GET')).toBeInTheDocument()
        expect(screen.getByText('/api/users')).toBeInTheDocument()
        expect(screen.getByText('Get users')).toBeInTheDocument()
    })

    it('displays download OpenAPI spec button', () => {
        render(<APIDocumentation sections={mockSections} />)

        expect(screen.getByText('Download OpenAPI Spec')).toBeInTheDocument()
    })

    it('shows endpoint count badge', () => {
        render(<APIDocumentation sections={mockSections} />)

        expect(screen.getByText('1 endpoint')).toBeInTheDocument()
    })

    it('renders without sections', () => {
        render(<APIDocumentation sections={[]} />)

        expect(screen.getByText('API Documentation')).toBeInTheDocument()
    })

    it('handles SDK generation config', () => {
        const sdkConfig = {
            languages: ['typescript', 'javascript'] as const,
            includeAuth: true,
            baseUrl: 'https://api.example.com'
        }

        render(
            <APIDocumentation
                sections={mockSections}
                sdkGeneration={sdkConfig}
            />
        )

        expect(screen.getByText('Generate SDK')).toBeInTheDocument()
    })
})
