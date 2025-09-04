import { Button } from '@/components/ui/button'
import { Menu, Heart, Star } from 'lucide-react'

export default function ButtonTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Button Component Variants Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Primary Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Primary Button</h3>
            <Button variant="primary" className="w-full">
              Book Appointment
            </Button>
          </div>

          {/* Dark Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Dark Button</h3>
            <Button variant="dark" className="w-full">
              View Services
            </Button>
          </div>

          {/* Default Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Default Button</h3>
            <Button variant="default" className="w-full">
              Contact Us
            </Button>
          </div>

          {/* Icon Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Icon Button</h3>
            <div className="flex gap-2">
              <Button variant="icon">
                <Menu className="h-4 w-4" />
              </Button>
              <Button variant="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="icon">
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Favicon Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Favicon Button</h3>
            <div className="flex gap-2">
              <Button variant="favicon">
                <Menu className="h-3 w-3" />
              </Button>
              <Button variant="favicon">
                <Heart className="h-3 w-3" />
              </Button>
              <Button variant="favicon">
                <Star className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Button Sizes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Button Sizes</h3>
            <div className="flex flex-col gap-2">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="default">Default</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" size="xl">Extra Large</Button>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Usage Examples</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`import { Button } from '@/components/ui/button'

export default function MyComponent() {
  return (
    <div>
      <Button variant="primary">Book Appointment</Button>
      <Button variant="dark">View Services</Button>
      <Button variant="icon">
        <MenuIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}`}
          </pre>
        </div>

        {/* Type Definition */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Type Definition</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`export type ButtonVariant = "primary" | "dark" | "icon" | "favicon" | "default"`}
          </pre>
        </div>
      </div>
    </div>
  )
}
