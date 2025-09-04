import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button variant types for the Modern Men Hair Salon application
 *
 * @example
 * ```tsx
 * <Button variant="primary">Book Appointment</Button>
 * <Button variant="dark">View Services</Button>
 * <Button variant="icon"><MenuIcon /></Button>
 * <Button variant="favicon"><FaviconIcon /></Button>
 * ```
 */
export type ButtonVariant = "primary" | "dark" | "icon" | "favicon" | "default";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        dark: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500",
        icon: "h-10 w-10 p-0 bg-transparent hover:bg-accent hover:text-accent-foreground",
        favicon: "h-8 w-8 p-0 bg-transparent hover:bg-accent hover:text-accent-foreground rounded-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  variant?: ButtonVariant
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }