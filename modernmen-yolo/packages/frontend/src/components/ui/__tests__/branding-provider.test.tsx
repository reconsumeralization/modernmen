import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrandingProvider } from '../branding-provider'
import { VideoBrandingManager } from '../../../lib/video-branding'

// Mock the video branding manager
jest.mock('../../../lib/video-branding', () => ({
  VideoBrandingManager: {
    getInstance: jest.fn(() => ({
      applyBrandingToDocument: jest.fn(),
      enableLazyLoading: jest.fn(),
      preloadCriticalVideos: jest.fn(),
      lazyLoadObserver: {
        disconnect: jest.fn()
      }
    }))
  }
}))

describe('BrandingProvider', () => {
  const mockManager = VideoBrandingManager.getInstance as jest.MockedFunction<typeof VideoBrandingManager.getInstance>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders children correctly', () => {
    const { getByText } = render(
      <BrandingProvider>
        <div>Test Child</div>
      </BrandingProvider>
    )

    expect(getByText('Test Child')).toBeInTheDocument()
  })

  test('applies branding on mount', () => {
    const mockInstance = {
      applyBrandingToDocument: jest.fn(),
      enableLazyLoading: jest.fn(),
      preloadCriticalVideos: jest.fn(),
      lazyLoadObserver: {
        disconnect: jest.fn()
      }
    }

    mockManager.mockReturnValue(mockInstance as any)

    render(
      <BrandingProvider>
        <div>Test</div>
      </BrandingProvider>
    )

    expect(mockInstance.applyBrandingToDocument).toHaveBeenCalled()
    expect(mockInstance.enableLazyLoading).toHaveBeenCalled()
    expect(mockInstance.preloadCriticalVideos).toHaveBeenCalled()
  })

  test('cleans up on unmount', () => {
    const mockInstance = {
      applyBrandingToDocument: jest.fn(),
      enableLazyLoading: jest.fn(),
      preloadCriticalVideos: jest.fn(),
      lazyLoadObserver: {
        disconnect: jest.fn()
      }
    }

    mockManager.mockReturnValue(mockInstance as any)

    const { unmount } = render(
      <BrandingProvider>
        <div>Test</div>
      </BrandingProvider>
    )

    unmount()

    expect(mockInstance.lazyLoadObserver.disconnect).toHaveBeenCalled()
  })

  test('handles missing lazy load observer gracefully', () => {
    const mockInstance = {
      applyBrandingToDocument: jest.fn(),
      enableLazyLoading: jest.fn(),
      preloadCriticalVideos: jest.fn(),
      lazyLoadObserver: null
    }

    mockManager.mockReturnValue(mockInstance as any)

    const { unmount } = render(
      <BrandingProvider>
        <div>Test</div>
      </BrandingProvider>
    )

    // Should not throw error when unmounting without observer
    expect(() => unmount()).not.toThrow()
  })
})
