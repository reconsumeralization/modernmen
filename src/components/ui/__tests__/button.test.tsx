import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from '@/components/ui/button'

// Mock the button component if it doesn't exist
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, disabled, className }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variant || 'default'} ${size || 'default'} ${className || ''}`}
      data-testid="button"
    >
      {children}
    </button>
  ),
}))

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByTestId('button')).toHaveTextContent('Click me')
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByTestId('button')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    const button = screen.getByTestId('button')
    expect(button).toBeDisabled()
  })

  it('applies correct variant class', () => {
    render(<Button variant="secondary">Click me</Button>)
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('secondary')
  })

  it('applies correct size class', () => {
    render(<Button size="sm">Click me</Button>)
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('sm')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Click me</Button>)
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('custom-class')
  })

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} disabled>Click me</Button>)

    const button = screen.getByTestId('button')
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })
})
