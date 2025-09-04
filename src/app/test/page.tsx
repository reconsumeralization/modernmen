export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-600">
          If you can see this page, the app is loading correctly!
        </p>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Current timestamp: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
