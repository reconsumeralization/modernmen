import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeprecationWarning, DeprecationWarnings } from '../DeprecationWarning';
import { DeprecationWarning as DeprecationWarningType } from '@/types/version-control';

// Mock date-fns
jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(() => '2 days ago'),
  format: jest.fn(() => '2024-01-01')
}));

const mockWarning: DeprecationWarningType = {
  contentId: 'old-api',
  deprecatedVersion: { major: 1, minor: 0, patch: 0 },
  removalVersion: { major: 3, minor: 0, patch: 0 },
  reason: 'This API version is deprecated and will be removed in v3.0.0',
  replacement: {
    contentId: 'new-api',
    title: 'New API Documentation',
    url: '/documentation/developer/api'
  },
  migrationInstructions: 'Please migrate to the new API endpoints. See the migration guide for details.',
  severity: 'warning',
  autoRedirect: false
};

const mockErrorWarning: DeprecationWarningType = {
  contentId: 'critical-api',
  deprecatedVersion: { major: 1, minor: 0, patch: 0 },
  reason: 'Critical security vulnerability found',
  migrationInstructions: 'Immediate migration required',
  severity: 'error',
  autoRedirect: false
};

const mockAutoRedirectWarning: DeprecationWarningType = {
  contentId: 'auto-redirect',
  deprecatedVersion: { major: 1, minor: 0, patch: 0 },
  reason: 'Content has moved',
  replacement: {
    contentId: 'new-location',
    title: 'New Location',
    url: '/new-location'
  },
  migrationInstructions: 'Content will redirect automatically',
  severity: 'info',
  autoRedirect: true,
  redirectDelay: 5
};

describe('DeprecationWarning', () => {
  const mockOnDismiss = jest.fn();
  const mockOnRedirect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders warning correctly', () => {
    render(
      <DeprecationWarning
        warning={mockWarning}
        onDismiss={mockOnDismiss}
        onRedirect={mockOnRedirect}
      />
    );

    expect(screen.getByText('Content Deprecated')).toBeInTheDocument();
    expect(screen.getByText('WARNING')).toBeInTheDocument();
    expect(screen.getByText(mockWarning.reason)).toBeInTheDocument();
  });

  it('displays removal version when provided', () => {
    render(
      <DeprecationWarning
        warning={mockWarning}
        onDismiss={mockOnDismiss}
        onRedirect={mockOnRedirect}
      />
    );

    expect(screen.getByText('Will be removed in version 3.0.0')).toBeInTheDocument();
  });

  it('shows replacement content when available', () => {
    render(
      <DeprecationWarning
        warning={mockWarning}
        onDismiss={mockOnDismiss}
        onRedirect={mockOnRedirect}
      />
    );

    expect(screen.getByText('Recommended Alternative')).toBeInTheDocument();
    expect(screen.getByText('New API Documentation')).toBeInTheDocument();
    expect(screen.getByText('View Alternative')).toBeInTheDocument();
  });

  it('displays migration instructions', () => {
    render(
      <DeprecationWarning
        warning={mockWarning}
        onDismiss={mockOnDismiss}
        onRedirect={mockOnRedirect}
      />
    );

    expect(screen.getByText('Migration Instructions:')).toBeInTheDocument();
    expect(screen.getByText(mockWarning.migrationInstructions!)).toBeInTheDocument();
  });

  it('handles dismiss functionality', () => {
    render(
      <DeprecationWarning
        warning={mockWarning}
        onDismiss={mockOnDismiss}
        onRedirect={mockOnRedirect}
      />
    );

    const dismissButton = screen.getByTestId('dismiss-button');
    fireEvent.click(dismissButton);

    expect(mockOnDismiss).toHaveBeenCalled();
  });

  it('handles redirect functionality', () => {
    render(
      <DeprecationWarning
        warning={mockWarning}
        onDismiss={mockOnDismiss}
        onRedirect={mockOnRedirect}
      />
    );

    const redirectButton = screen.getByText('View Alternative');
    fireEvent.click(redirectButton);

    expect(mockOnRedirect).toHaveBeenCalled();
  });

  it('shows correct severity styling for error', () => {
    render(
      <DeprecationWarning
        warning={mockErrorWarning}
        onDismiss={mockOnDismiss}
        onRedirect={mockOnRedirect}
      />
    );

    expect(screen.getByText('ERROR')).toBeInTheDocument();
  });

  it('handles auto-redirect with countdown', async () => {
    const { act } = require('@testing-library/react');
    
    render(
      <DeprecationWarning
        warning={mockAutoRedirectWarning}
        onDismiss={mockOnDismiss}
        onRedirect={mockOnRedirect}
      />
    );

    expect(screen.getByText('Auto-redirecting in 5s')).toBeInTheDocument();

    // Fast-forward time
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Auto-redirecting in 4s')).toBeInTheDocument();
    });

    // Fast-forward to completion
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    
    await waitFor(() => {
      expect(mockOnRedirect).toHaveBeenCalled();
    });
  });

  it('hides dismiss button when showDismiss is false', () => {
    render(
      <DeprecationWarning
        warning={mockWarning}
        onDismiss={mockOnDismiss}
        onRedirect={mockOnRedirect}
        showDismiss={false}
      />
    );

    // Look for X icon specifically
    const xIcons = screen.queryAllByTestId('dismiss-button');
    expect(xIcons).toHaveLength(0);
  });

  it('does not render when dismissed', () => {
    render(
      <DeprecationWarning
        warning={mockWarning}
        onDismiss={mockOnDismiss}
        onRedirect={mockOnRedirect}
      />
    );

    const dismissButton = screen.getByTestId('dismiss-button');
    fireEvent.click(dismissButton);

    // Component should be dismissed internally
    expect(screen.queryByText('Content Deprecated')).not.toBeInTheDocument();
  });
});

describe('DeprecationWarnings', () => {
  const mockWarnings: DeprecationWarningType[] = [
    mockErrorWarning,
    mockWarning,
    {
      ...mockWarning,
      contentId: 'info-warning',
      severity: 'info'
    }
  ];

  const mockOnWarningDismiss = jest.fn();
  const mockOnWarningRedirect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders multiple warnings', () => {
    render(
      <DeprecationWarnings
        warnings={mockWarnings}
        onWarningDismiss={mockOnWarningDismiss}
        onWarningRedirect={mockOnWarningRedirect}
      />
    );

    expect(screen.getAllByText('Content Deprecated')).toHaveLength(3);
  });

  it('sorts warnings by severity', () => {
    render(
      <DeprecationWarnings
        warnings={mockWarnings}
        onWarningDismiss={mockOnWarningDismiss}
        onWarningRedirect={mockOnWarningRedirect}
      />
    );

    const severityBadges = screen.getAllByText(/ERROR|WARNING|INFO/);
    expect(severityBadges[0]).toHaveTextContent('ERROR');
    expect(severityBadges[1]).toHaveTextContent('WARNING');
    expect(severityBadges[2]).toHaveTextContent('INFO');
  });

  it('limits visible warnings based on maxVisible', () => {
    render(
      <DeprecationWarnings
        warnings={mockWarnings}
        onWarningDismiss={mockOnWarningDismiss}
        onWarningRedirect={mockOnWarningRedirect}
        maxVisible={2}
      />
    );

    expect(screen.getAllByText('Content Deprecated')).toHaveLength(2);
    expect(screen.getByText('1 more deprecation warnings available')).toBeInTheDocument();
  });

  it('handles warning dismissal', () => {
    render(
      <DeprecationWarnings
        warnings={mockWarnings}
        onWarningDismiss={mockOnWarningDismiss}
        onWarningRedirect={mockOnWarningRedirect}
      />
    );

    const dismissButtons = screen.getAllByTestId('dismiss-button');
    const firstDismissButton = dismissButtons[0];
    fireEvent.click(firstDismissButton);

    expect(mockOnWarningDismiss).toHaveBeenCalledWith('critical-api');
  });

  it('handles warning redirect', () => {
    render(
      <DeprecationWarnings
        warnings={mockWarnings}
        onWarningDismiss={mockOnWarningDismiss}
        onWarningRedirect={mockOnWarningRedirect}
      />
    );

    const redirectButtons = screen.getAllByText('View Alternative');
    fireEvent.click(redirectButtons[0]);

    expect(mockOnWarningRedirect).toHaveBeenCalledWith('old-api');
  });

  it('renders nothing when no warnings', () => {
    const { container } = render(
      <DeprecationWarnings
        warnings={[]}
        onWarningDismiss={mockOnWarningDismiss}
        onWarningRedirect={mockOnWarningRedirect}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('filters out dismissed warnings', () => {
    const { rerender } = render(
      <DeprecationWarnings
        warnings={mockWarnings}
        onWarningDismiss={mockOnWarningDismiss}
        onWarningRedirect={mockOnWarningRedirect}
      />
    );

    // Dismiss first warning
    const dismissButtons = screen.getAllByTestId('dismiss-button');
    fireEvent.click(dismissButtons[0]);

    rerender(
      <DeprecationWarnings
        warnings={mockWarnings}
        onWarningDismiss={mockOnWarningDismiss}
        onWarningRedirect={mockOnWarningRedirect}
      />
    );

    expect(screen.getAllByText('Content Deprecated')).toHaveLength(2);
  });
});