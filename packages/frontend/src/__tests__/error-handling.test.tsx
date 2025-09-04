import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAuth } from '@/hooks/useAuth'
import { useAppointments } from '@/hooks/useAppointments'
import { useOptimizedState } from '@/hooks/useOptimizedState'
import { useFormState } from '@/hooks/useOptimizedState'
import { APIErrorFactory } from '@/lib/enhanced-api-errors'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock toast notifications
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}))

describe('Error Handling Patterns', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication Error Handling', () => {
    const mockUseSession = require('next-auth/react').useSession
    const mockSignIn = require('next-auth/react').signIn
    const mockToast = require('sonner').toast

    it('handles login network errors gracefully', async () => {
      mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })
      mockSignIn.mockRejectedValue(new Error('Network error'))

      // Mock component that uses useAuth
      const TestComponent = () => {
        const { login, error } = useAuth()
        const [email, setEmail] = React.useState('')
        const [password, setPassword] = React.useState('')

        const handleLogin = async () => {
          await login(email, password)
        }

        return (
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button onClick={handleLogin}>Login</button>
            {error && <div data-testid="error">{error}</div>}
          </div>
        )
      }

      render(<TestComponent />)

      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const loginButton = screen.getByText('Login')

      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.click(loginButton)

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Login failed. Please try again.')
      })
    })

    it('handles invalid credentials properly', async () => {
      mockSignIn.mockResolvedValue({ error: 'CredentialsSignin', ok: false })

      const TestComponent = () => {
        const { login, error } = useAuth()
        const [email, setEmail] = React.useState('test@example.com')
        const [password, setPassword] = React.useState('wrongpassword')

        React.useEffect(() => {
          login(email, password)
        }, [])

        return <div>{error && <div data-testid="error">{error}</div>}</div>
      }

      render(<TestComponent />)

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Sign in failed: CredentialsSignin')
      })
    })
  })

  describe('Appointment Error Handling', () => {
    const mockToast = require('sonner').toast

    it('handles appointment creation failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'))

      const TestComponent = () => {
        const { createAppointment, error } = useAppointments()

        const handleCreate = async () => {
          try {
            await createAppointment({
              customer: 'customer-id',
              service: 'service-id',
              date: '2024-01-01',
              stylist: 'stylist-id'
            })
          } catch (err) {
            // Error should be handled internally
          }
        }

        return (
          <div>
            <button onClick={handleCreate}>Create Appointment</button>
            {error && <div data-testid="error">{error}</div>}
          </div>
        )
      }

      render(<TestComponent />)

      const button = screen.getByText('Create Appointment')
      await userEvent.click(button)

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Failed to create appointment')
      })
    })

    it('handles appointment not found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Appointment not found' })
      })

      const TestComponent = () => {
        const { getAppointment, error } = useAppointments()

        React.useEffect(() => {
          getAppointment('non-existent-id')
        }, [])

        return <div>{error && <div data-testid="error">{error}</div>}</div>
      }

      render(<TestComponent />)

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Failed to fetch appointment')
      })
    })
  })

  describe('Form Validation Error Handling', () => {
    it('validates required fields', () => {
      const validationSchema = (values: any) => {
        const errors: any = {}
        if (!values.email) errors.email = 'Email is required'
        if (!values.password) errors.password = 'Password is required'
        if (values.password && values.password.length < 6) {
          errors.password = 'Password must be at least 6 characters'
        }
        return errors
      }

      const TestComponent = () => {
        const { values, errors, setValue, validate } = useFormState(
          { email: '', password: '' },
          validationSchema
        )

        return (
          <form>
            <input
              type="email"
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              data-testid="email-input"
            />
            {errors.email && <div data-testid="email-error">{errors.email}</div>}

            <input
              type="password"
              value={values.password}
              onChange={(e) => setValue('password', e.target.value)}
              data-testid="password-input"
            />
            {errors.password && <div data-testid="password-error">{errors.password}</div>}

            <button
              type="button"
              onClick={validate}
              data-testid="validate-button"
            >
              Validate
            </button>
          </form>
        )
      }

      render(<TestComponent />)

      const validateButton = screen.getByTestId('validate-button')
      fireEvent.click(validateButton)

      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required')
      expect(screen.getByTestId('password-error')).toHaveTextContent('Password is required')

      // Test field-level validation
      const passwordInput = screen.getByTestId('password-input')
      fireEvent.change(passwordInput, { target: { value: '123' } })
      fireEvent.click(validateButton)

      expect(screen.getByTestId('password-error')).toHaveTextContent('Password must be at least 6 characters')
    })
  })

  describe('API Error Handling', () => {
    it('handles unauthorized access', () => {
      const error = APIErrorFactory.unauthorized()
      expect(error.statusCode).toBe(401)
      expect(error.message).toBe('Unauthorized access')
    })

    it('handles forbidden access', () => {
      const error = APIErrorFactory.forbidden('Insufficient permissions')
      expect(error.statusCode).toBe(403)
      expect(error.message).toBe('Insufficient permissions')
    })

    it('handles not found errors', () => {
      const error = APIErrorFactory.notFound('User', '123')
      expect(error.statusCode).toBe(404)
      expect(error.message).toBe('User with ID 123 not found')
    })

    it('handles validation errors', () => {
      const validationErrors = [
        { field: 'email', message: 'Invalid email format' },
        { field: 'password', message: 'Password too weak' }
      ]
      const error = APIErrorFactory.validationFailed(validationErrors)
      expect(error.statusCode).toBe(400)
      expect(error.details).toEqual(validationErrors)
    })

    it('handles internal server errors', () => {
      const error = APIErrorFactory.internalError('Database connection failed')
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Database connection failed')
    })
  })

  describe('Network Error Recovery', () => {
    it('handles network timeouts gracefully', async () => {
      mockFetch.mockImplementationOnce(() =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network timeout')), 100)
        )
      )

      const TestComponent = () => {
        const { data, loading, error, refetch } = useOptimizedState(
          async () => {
            const response = await fetch('/api/test')
            return response.json()
          },
          { cacheKey: 'test' }
        )

        return (
          <div>
            {loading && <div data-testid="loading">Loading...</div>}
            {error && <div data-testid="error">{error.message}</div>}
            <button onClick={refetch} data-testid="retry">Retry</button>
          </div>
        )
      }

      render(<TestComponent />)

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network timeout')
      })

      // Test retry functionality
      const retryButton = screen.getByTestId('retry')
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      await userEvent.click(retryButton)

      await waitFor(() => {
        expect(screen.queryByTestId('error')).not.toBeInTheDocument()
      })
    })
  })

  describe('Optimistic Updates Error Recovery', () => {
    it('rolls back optimistic updates on failure', async () => {
      const initialData = { count: 0 }
      let resolvePromise: (value: any) => void

      mockFetch.mockImplementationOnce(() =>
        new Promise((resolve) => {
          resolvePromise = resolve
        })
      )

      const TestComponent = () => {
        const { data, optimisticUpdate, rollback } = useOptimizedState(
          async () => initialData,
          { enableOptimisticUpdates: true }
        )

        const handleIncrement = async () => {
          // Optimistic update
          optimisticUpdate((prev: any) => ({ count: (prev?.count || 0) + 1 }))

          try {
            // Simulate API call that fails
            await fetch('/api/increment')
          } catch {
            rollback()
          }
        }

        return (
          <div>
            <div data-testid="count">{data?.count || 0}</div>
            <button onClick={handleIncrement} data-testid="increment">Increment</button>
          </div>
        )
      }

      render(<TestComponent />)

      const incrementButton = screen.getByTestId('increment')
      const countDisplay = screen.getByTestId('count')

      // Initial state
      expect(countDisplay).toHaveTextContent('0')

      // Click increment (optimistic update)
      await userEvent.click(incrementButton)
      expect(countDisplay).toHaveTextContent('1')

      // Simulate API failure and rollback
      resolvePromise?.(Promise.reject(new Error('API Error')))

      await waitFor(() => {
        expect(countDisplay).toHaveTextContent('0')
      })
    })
  })

  describe('Loading State Management', () => {
    it('shows loading states during async operations', async () => {
      let resolvePromise: (value: any) => void

      mockFetch.mockImplementationOnce(() =>
        new Promise((resolve) => {
          resolvePromise = resolve
        })
      )

      const TestComponent = () => {
        const { data, loading } = useOptimizedState(
          async () => {
            const response = await fetch('/api/data')
            return response.json()
          }
        )

        return (
          <div>
            {loading && <div data-testid="loading">Loading...</div>}
            {data && <div data-testid="data">{JSON.stringify(data)}</div>}
          </div>
        )
      }

      render(<TestComponent />)

      expect(screen.getByTestId('loading')).toBeInTheDocument()

      // Resolve the promise
      resolvePromise?.({
        ok: true,
        json: async () => ({ message: 'Success' })
      })

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
        expect(screen.getByTestId('data')).toHaveTextContent('{"message":"Success"}')
      })
    })
  })
})
