'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProtobufGTMEditor, protobufGTMUtils } from '@/tools/protobuf-gtm-editor'

interface ProtobufGTMEditorProps {
  className?: string
}

export const ProtobufGTMEditorComponent: React.FC<ProtobufGTMEditorProps> = ({ className }) => {
  const [editor] = useState(() => new ProtobufGTMEditor())
  const [activeTab, setActiveTab] = useState('protobuf')
  const [protobufSchema, setProtobufSchema] = useState('')
  const [parsedMessages, setParsedMessages] = useState<any[]>([])
  const [selectedMessage, setSelectedMessage] = useState('')
  const [messageData, setMessageData] = useState('')
  const [dataLayer, setDataLayer] = useState<any[]>([])
  const [gtmConfig, setGtmConfig] = useState<any>(null)
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: string[] } | null>(null)

  const handleParseSchema = async () => {
    try {
      const messages = await editor.parseProtobufSchema(protobufSchema)
      setParsedMessages(messages)
      setValidationResult({ valid: true, errors: [] })
    } catch (error) {
      setValidationResult({ valid: false, errors: [error.message] })
    }
  }

  const handleValidateSchema = () => {
    const result = editor.validateProtobufSchema(protobufSchema)
    setValidationResult(result)
  }

  const handleEncodeMessage = async () => {
    try {
      const data = JSON.parse(messageData)
      const encoded = await editor.encodeProtobufMessage(selectedMessage, data)
      const base64 = btoa(String.fromCharCode(...encoded))
      
      // Create GTM event with encoded data
      await editor.createProtobufGTMEvent(
        `${selectedMessage}_encoded`,
        selectedMessage,
        data,
        { encoded_base64: base64 }
      )
      
      updateDataLayer()
    } catch (error) {
      console.error('Failed to encode message:', error)
    }
  }

  const handleCreateGTMEvent = () => {
    try {
      const eventData = JSON.parse(messageData)
      editor.createGTMEvent({
        event: 'custom_protobuf_event',
        event_category: 'protobuf',
        event_action: 'encode',
        custom_parameters: eventData
      })
      updateDataLayer()
    } catch (error) {
      console.error('Failed to create GTM event:', error)
    }
  }

  const updateDataLayer = () => {
    setDataLayer(editor.getDataLayer())
  }

  const handleExportGTMConfig = () => {
    const config = editor.exportGTMConfig()
    setGtmConfig(config)
  }

  const handleClearDataLayer = () => {
    editor.clearDataLayer()
    setDataLayer([])
  }

  const sampleProtobufSchema = `
syntax = "proto3";

package example;

message User {
  string id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
  repeated string tags = 5;
}

message Event {
  string event_id = 1;
  string user_id = 2;
  string event_type = 3;
  int64 timestamp = 4;
  map<string, string> properties = 5;
}
`

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Protobuf + GTM Editor</CardTitle>
          <CardDescription>
            Parse protobuf schemas, encode/decode messages, and create Google Tag Manager events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="protobuf">Protobuf</TabsTrigger>
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="gtm">GTM Events</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="protobuf" className="space-y-4">
              <div>
                <Label htmlFor="schema">Protobuf Schema</Label>
                <Textarea
                  id="schema"
                  placeholder="Paste your protobuf schema here..."
                  value={protobufSchema}
                  onChange={(e) => setProtobufSchema(e.target.value)}
                  rows={10}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleValidateSchema}>Validate Schema</Button>
                <Button onClick={handleParseSchema}>Parse Schema</Button>
                <Button 
                  variant="outline" 
                  onClick={() => setProtobufSchema(sampleProtobufSchema)}
                >
                  Load Sample
                </Button>
              </div>

              {validationResult && (
                <div>
                  <Badge variant={validationResult.valid ? "default" : "destructive"}>
                    {validationResult.valid ? "Valid" : "Invalid"}
                  </Badge>
                  {validationResult.errors.length > 0 && (
                    <div className="mt-2 text-sm text-red-600">
                      {validationResult.errors.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {parsedMessages.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Parsed Messages:</h4>
                  <div className="space-y-2">
                    {parsedMessages.map((message) => (
                      <Card key={message.name} className="p-3">
                        <h5 className="font-medium">{message.name}</h5>
                        <div className="text-sm text-gray-600">
                          {message.fields.map((field: any) => (
                            <div key={field.name}>
                              {field.number}. {field.name}: {field.type}
                              {field.repeated && " (repeated)"}
                              {field.optional && " (optional)"}
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="encode" className="space-y-4">
              <div>
                <Label htmlFor="message-select">Select Message Type</Label>
                <Select value={selectedMessage} onValueChange={setSelectedMessage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a message type" />
                  </SelectTrigger>
                  <SelectContent>
                    {parsedMessages.map((message) => (
                      <SelectItem key={message.name} value={message.name}>
                        {message.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message-data">Message Data (JSON)</Label>
                <Textarea
                  id="message-data"
                  placeholder='{"id": "123", "name": "John Doe", "email": "john@example.com"}'
                  value={messageData}
                  onChange={(e) => setMessageData(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleEncodeMessage} disabled={!selectedMessage}>
                  Encode & Create GTM Event
                </Button>
                <Button onClick={handleCreateGTMEvent} variant="outline">
                  Create GTM Event Only
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="gtm" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Data Layer</h4>
                <div className="flex gap-2">
                  <Button onClick={updateDataLayer} variant="outline" size="sm">
                    Refresh
                  </Button>
                  <Button onClick={handleClearDataLayer} variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {dataLayer.map((item, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="secondary">{item.event}</Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          {Object.entries(item)
                            .filter(([key]) => key !== 'event')
                            .map(([key, value]) => (
                              <div key={key}>
                                <strong>{key}:</strong> {JSON.stringify(value)}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {dataLayer.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No events in data layer
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <Button onClick={handleExportGTMConfig}>
                Export GTM Configuration
              </Button>

              {gtmConfig && (
                <div>
                  <h4 className="font-semibold mb-2">GTM Configuration:</h4>
                  <Card className="p-4">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(gtmConfig, null, 2)}
                    </pre>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProtobufGTMEditorComponent
