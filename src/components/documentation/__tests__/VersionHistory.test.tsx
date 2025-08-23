import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VersionHistory } from '../VersionHistory';
import { DocumentationVersion } from '@/types/version-control';

// Mock date-fns
jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(() => '2 days ago'),
  format: jest.fn(() => '2024-01-01')
}));

const mockVersions: DocumentationVersion[] = [
  {
    id: 'v2.0.0',
    version: { major: 2, minor: 0, patch: 0 },
    releaseDate: new Date('2024-01-15'),
    changes: [
      {
        id: 'breaking-change',
        type: 'changed',
        category: 'api',
        title: 'Updated authentication system',
        description: 'Migrated from API keys to OAuth 2.0',
        impact: 'breaking',
        affectedSections: ['authentication'],
        migrationRequired: true,
        migrationInstructions: 'Update your authentication to use OAuth 2.0',
        relatedIssues: ['#200'],
        relatedPullRequests: ['#67']
      }
    ],
    author: 'John Doe',
    authorEmail: 'john@example.com',
    commitHash: 'abc123',
    pullRequestId: '67',
    migrationGuide: 'See the OAuth 2.0 migration guide',
    deprecated: false,
    breakingChanges: true,
    contentId: 'api-docs'
  },
  {
    id: 'v1.1.0',
    version: { major: 1, minor: 1, patch: 0 },
    releaseDate: new Date('2024-01-01'),
    changes: [
      {
        id: 'new-feature',
        type: 'added',
        category: 'content',
        title: 'Added booking endpoints',
        description: 'New endpoints for appointment booking',
        impact: 'medium',
        affectedSections: ['booking'],
        migrationRequired: false,
        relatedIssues: ['#123'],
        relatedPullRequests: ['#45']
      }
    ],
    author: 'Jane Smith',
    authorEmail: 'jane@example.com',
    deprecated: false,
    breakingChanges: false,
    contentId: 'api-docs'
  }
];

describe('VersionHistory', () => {
  const mockOnVersionSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders version history correctly', () => {
    render(
      <VersionHistory
        contentId="api-docs"
        versions={mockVersions}
        onVersionSelect={mockOnVersionSelect}
      />
    );

    expect(screen.getAllByText('Version History')[0]).toBeInTheDocument();
    expect(screen.getByText('v2.0.0')).toBeInTheDocument();
    expect(screen.getByText('v1.1.0')).toBeInTheDocument();
  });

  it('displays version badges correctly', () => {
    render(
      <VersionHistory
        contentId="api-docs"
        versions={mockVersions}
        onVersionSelect={mockOnVersionSelect}
        currentVersion="v2.0.0"
      />
    );

    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.getByText('Breaking')).toBeInTheDocument();
  });

  it('expands version details when clicked', async () => {
    render(
      <VersionHistory
        contentId="api-docs"
        versions={mockVersions}
        onVersionSelect={mockOnVersionSelect}
      />
    );

    const expandButton = screen.getAllByRole('button')[0];
    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(screen.getByText('Updated authentication system')).toBeInTheDocument();
      expect(screen.getByText('Migration Required')).toBeInTheDocument();
    });
  });

  it('calls onVersionSelect when view button is clicked', () => {
    render(
      <VersionHistory
        contentId="api-docs"
        versions={mockVersions}
        onVersionSelect={mockOnVersionSelect}
      />
    );

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    expect(mockOnVersionSelect).toHaveBeenCalledWith('v2.0.0');
  });

  it('shows migration guide when available', async () => {
    render(
      <VersionHistory
        contentId="api-docs"
        versions={mockVersions}
        onVersionSelect={mockOnVersionSelect}
      />
    );

    const expandButton = screen.getAllByRole('button')[0];
    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(screen.getByText('Migration Guide')).toBeInTheDocument();
      expect(screen.getByText('See the OAuth 2.0 migration guide')).toBeInTheDocument();
    });
  });

  it('displays change types with correct icons', async () => {
    render(
      <VersionHistory
        contentId="api-docs"
        versions={mockVersions}
        onVersionSelect={mockOnVersionSelect}
      />
    );

    // Expand first version (find the chevron button)
    const expandButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg')?.classList.contains('lucide-chevron-right') ||
      button.querySelector('svg')?.classList.contains('lucide-chevron-down')
    );
    fireEvent.click(expandButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Updated authentication system')).toBeInTheDocument();
    });

    // Expand second version
    if (expandButtons.length > 1) {
      fireEvent.click(expandButtons[1]);

      await waitFor(() => {
        expect(screen.getByText('New endpoints for appointment booking')).toBeInTheDocument();
      });
    }
  });

  it('handles diff selection when showDiff is enabled', () => {
    render(
      <VersionHistory
        contentId="api-docs"
        versions={mockVersions}
        onVersionSelect={mockOnVersionSelect}
        showDiff={true}
      />
    );

    expect(screen.getByText('Compare Versions')).toBeInTheDocument();
    
    const fromButtons = screen.getAllByText('From');
    const toButtons = screen.getAllByText('To');
    
    fireEvent.click(fromButtons[0]);
    fireEvent.click(toButtons[1]);

    // Should show the diff tab
    const diffTab = screen.getByText('Compare Versions');
    fireEvent.click(diffTab);
  });

  it('shows author and commit information', () => {
    render(
      <VersionHistory
        contentId="api-docs"
        versions={mockVersions}
        onVersionSelect={mockOnVersionSelect}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('abc123')).toBeInTheDocument();
  });

  it('displays affected sections as badges', async () => {
    render(
      <VersionHistory
        contentId="api-docs"
        versions={mockVersions}
        onVersionSelect={mockOnVersionSelect}
      />
    );

    const expandButton = screen.getAllByRole('button')[0];
    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(screen.getByText('authentication')).toBeInTheDocument();
    });
  });

  it('handles empty versions array', () => {
    render(
      <VersionHistory
        contentId="api-docs"
        versions={[]}
        onVersionSelect={mockOnVersionSelect}
      />
    );

    expect(screen.getAllByText('Version History')[0]).toBeInTheDocument();
    // Should not crash and should show empty state
  });

  it('sorts versions by release date descending', () => {
    const unsortedVersions = [...mockVersions].reverse();
    
    render(
      <VersionHistory
        contentId="api-docs"
        versions={unsortedVersions}
        onVersionSelect={mockOnVersionSelect}
      />
    );

    const versionElements = screen.getAllByText(/^v\d+\.\d+\.\d+$/);
    expect(versionElements[0]).toHaveTextContent('v2.0.0');
    expect(versionElements[1]).toHaveTextContent('v1.1.0');
  });
});