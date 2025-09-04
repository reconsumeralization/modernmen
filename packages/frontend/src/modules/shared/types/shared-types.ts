// Shared Module Types
// Type definitions for shared UI components and utilities

export interface SharedComponentProps {
  className?: string
  children?: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
}

export interface DemoCardProps extends SharedComponentProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  collapsible?: boolean
  defaultExpanded?: boolean
}

export interface DemoLayoutProps extends SharedComponentProps {
  header?: React.ReactNode
  sidebar?: React.ReactNode
  footer?: React.ReactNode
  fullWidth?: boolean
  stickyHeader?: boolean
}

export interface SharedButtonProps extends SharedComponentProps {
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export interface SharedUtils {
  formatDate: (date: Date | string, format?: string) => string
  formatCurrency: (amount: number, currency?: string) => string
  truncateText: (text: string, maxLength: number) => string
  generateId: (prefix?: string) => string
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ) => (...args: Parameters<T>) => void
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ) => (...args: Parameters<T>) => void
}
