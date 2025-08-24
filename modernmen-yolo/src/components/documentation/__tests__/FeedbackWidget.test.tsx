import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeedbackWidget } from '../FeedbackWidget';
import { UserFeedback } from '@/types/analytics';

describe('FeedbackWidget', () => {
  const mockOnFeedback = jest.fn();
  const defaultProps = {
    contentId: 'test-content',
    contentType: 'guide' as const,
    onFeedback: mockOnFeedback,
    userRole: 'developer' as const
  };

  beforeEach(() => {
    mockOnFeedback.mockClear();
  });

  it('renders the feedback widget', () => {
    render(<FeedbackWidget {...defaultProps} />);
    
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('shows rating stars when showRating is true', () => {
    render(<FeedbackWidget {...defaultProps} showRating={true} />);
    
    expect(screen.getByText('Rate this content:')).toBeInTheDocument();
    // Should have 5 star buttons
    const stars = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg')?.classList.contains('lucide-star')
    );
    expect(stars).toHaveLength(5);
  });

  it('handles helpful button clicks', async () => {
    render(<FeedbackWidget {...defaultProps} showComments={false} />);
    
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(mockOnFeedback).toHaveBeenCalledWith(
        expect.objectContaining({
          contentId: 'test-content',
          contentType: 'guide',
          helpful: true,
          userRole: 'developer'
        })
      );
    });
  });

  it('handles star rating clicks', () => {
    render(<FeedbackWidget {...defaultProps} showRating={true} />);
    
    const stars = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg')?.classList.contains('lucide-star')
    );
    
    // Click the 4th star
    fireEvent.click(stars[3]);
    
    // Check if the first 4 stars are filled
    for (let i = 0; i < 4; i++) {
      const star = stars[i].querySelector('svg');
      expect(star).toHaveClass('fill-yellow-400');
    }
  });

  it('shows comment form after helpful selection', async () => {
    render(<FeedbackWidget {...defaultProps} showComments={true} />);
    
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(screen.getByText('Add a comment (optional)')).toBeInTheDocument();
    });
  });

  it('submits feedback with comments', async () => {
    render(<FeedbackWidget {...defaultProps} showComments={true} />);
    
    // Click helpful
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);

    // Open comment form
    await waitFor(() => {
      const commentButton = screen.getByText('Add a comment (optional)');
      fireEvent.click(commentButton);
    });

    // Fill in comment
    const commentTextarea = screen.getByPlaceholderText('What did you find helpful or confusing?');
    fireEvent.change(commentTextarea, { target: { value: 'This was very helpful!' } });

    // Submit
    const submitButton = screen.getByText('Submit Feedback');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnFeedback).toHaveBeenCalledWith(
        expect.objectContaining({
          contentId: 'test-content',
          helpful: true,
          comment: 'This was very helpful!',
          userRole: 'developer'
        })
      );
    });
  });

  it('shows success message after submission', async () => {
    render(<FeedbackWidget {...defaultProps} showComments={false} />);
    
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(screen.getByText('Thank you for your feedback!')).toBeInTheDocument();
      expect(screen.getByText('Your input helps us improve our documentation.')).toBeInTheDocument();
    });
  });

  it('generates appropriate tags based on feedback', async () => {
    render(<FeedbackWidget {...defaultProps} showComments={true} />);
    
    // Rate low and add negative comment
    const stars = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg')?.classList.contains('lucide-star')
    );
    fireEvent.click(stars[1]); // 2 stars

    const noButton = screen.getByText('No');
    fireEvent.click(noButton);

    // Open comment form
    await waitFor(() => {
      const commentButton = screen.getByText('Add a comment (optional)');
      fireEvent.click(commentButton);
    });

    // Add comment with keywords
    const commentTextarea = screen.getByPlaceholderText('What did you find helpful or confusing?');
    fireEvent.change(commentTextarea, { target: { value: 'This is confusing and has errors' } });

    const submitButton = screen.getByText('Submit Feedback');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnFeedback).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: expect.arrayContaining(['negative', 'not-helpful', 'clarity-issue', 'accuracy-issue'])
        })
      );
    });
  });

  it('handles submission errors gracefully', async () => {
    const mockOnFeedbackError = jest.fn().mockRejectedValue(new Error('Network error'));
    
    render(<FeedbackWidget {...defaultProps} onFeedback={mockOnFeedbackError} showComments={false} />);
    
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);

    // Should not show success message on error
    await waitFor(() => {
      expect(screen.queryByText('Thank you for your feedback!')).not.toBeInTheDocument();
    });
  });
});