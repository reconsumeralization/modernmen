import React from 'react'
import { ProtobufGTMEditorComponent } from '@/components/tools/ProtobufGTMEditor'

export default function ProtobufGTMPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Protobuf + GTM Editor</h1>
        <p className="text-gray-600">
          A powerful tool that combines protobuf.js functionality with Google Tag Manager editing capabilities.
          Parse protobuf schemas, encode/decode messages, and create GTM events with ease.
        </p>
      </div>

      <ProtobufGTMEditorComponent />

      <div className="mt-12 space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Protobuf Features</h3>
              <ul className="text-sm space-y-1">
                <li>• Parse and validate protobuf schemas</li>
                <li>• Encode/decode protobuf messages</li>
                <li>• Extract message definitions</li>
                <li>• Schema validation with error reporting</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">GTM Features</h3>
              <ul className="text-sm space-y-1">
                <li>• Create custom GTM events</li>
                <li>• Manage data layer</li>
                <li>• Generate GTM triggers and tags</li>
                <li>• Export GTM configurations</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">
                Encode protobuf data and send it to Google Analytics via GTM for advanced tracking.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Data Processing</h3>
              <p className="text-sm text-gray-600">
                Process protobuf messages and create structured events for data analysis.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Integration</h3>
              <p className="text-sm text-gray-600">
                Bridge between protobuf-based APIs and GTM for seamless data flow.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <ol className="text-sm space-y-2">
            <li>1. <strong>Load a protobuf schema</strong> - Paste your .proto file content or use the sample</li>
            <li>2. <strong>Parse the schema</strong> - Click "Parse Schema" to extract message definitions</li>
            <li>3. <strong>Encode messages</strong> - Select a message type and provide JSON data</li>
            <li>4. <strong>Create GTM events</strong> - Automatically generate GTM events with encoded data</li>
            <li>5. <strong>Export configuration</strong> - Get ready-to-use GTM triggers and tags</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
