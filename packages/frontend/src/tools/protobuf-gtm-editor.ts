import * as protobuf from 'protobufjs'
import type { Tool } from '@/types/tool'

interface ProtobufGTMEditorOptions {
  enableProtobufParsing?: boolean
  enableGTMEditing?: boolean
  enableDataLayer?: boolean
  enableCustomEvents?: boolean
}

interface ProtobufMessage {
  name: string
  fields: Array<{
    name: string
    type: string
    number: number
    repeated?: boolean
    optional?: boolean
  }>
}

interface GTMEvent {
  event: string
  event_category?: string
  event_action?: string
  event_label?: string
  value?: number
  custom_parameters?: Record<string, any>
}

interface DataLayerItem {
  event: string
  [key: string]: any
}

export class ProtobufGTMEditor implements Tool {
  name = 'protobuf-gtm-editor'
  description = 'Combined protobuf.js parser and Google Tag Manager editor with data layer management'
  version = '1.0.0'

  private options: ProtobufGTMEditorOptions
  private dataLayer: DataLayerItem[] = []
  private protobufRoot: protobuf.Root | null = null

  constructor(options: ProtobufGTMEditorOptions = {}) {
    this.options = {
      enableProtobufParsing: true,
      enableGTMEditing: true,
      enableDataLayer: true,
      enableCustomEvents: true,
      ...options
    }
  }

  /**
   * Parse protobuf schema and create message definitions
   */
  async parseProtobufSchema(schema: string): Promise<ProtobufMessage[]> {
    if (!this.options.enableProtobufParsing) {
      throw new Error('Protobuf parsing is disabled')
    }

    try {
      this.protobufRoot = protobuf.parse(schema)
      const messages: ProtobufMessage[] = []

      // Extract message definitions
      this.protobufRoot.nestedArray.forEach((nested) => {
        if (nested instanceof protobuf.Type) {
          const message: ProtobufMessage = {
            name: nested.name,
            fields: []
          }

          Object.values(nested.fields).forEach((field) => {
            message.fields.push({
              name: field.name,
              type: field.type,
              number: field.id,
              repeated: field.repeated,
              optional: field.optional
            })
          })

          messages.push(message)
        }
      })

      return messages
    } catch (error) {
      throw new Error(`Failed to parse protobuf schema: ${error}`)
    }
  }

  /**
   * Encode data using protobuf schema
   */
  async encodeProtobufMessage(messageName: string, data: any): Promise<Uint8Array> {
    if (!this.protobufRoot) {
      throw new Error('No protobuf schema loaded. Call parseProtobufSchema first.')
    }

    try {
      const MessageType = this.protobufRoot.lookupType(messageName)
      const message = MessageType.create(data)
      return MessageType.encode(message).finish()
    } catch (error) {
      throw new Error(`Failed to encode protobuf message: ${error}`)
    }
  }

  /**
   * Decode protobuf data
   */
  async decodeProtobufMessage(messageName: string, buffer: Uint8Array): Promise<any> {
    if (!this.protobufRoot) {
      throw new Error('No protobuf schema loaded. Call parseProtobufSchema first.')
    }

    try {
      const MessageType = this.protobufRoot.lookupType(messageName)
      const message = MessageType.decode(buffer)
      return MessageType.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
      })
    } catch (error) {
      throw new Error(`Failed to decode protobuf message: ${error}`)
    }
  }

  /**
   * Create GTM event
   */
  createGTMEvent(event: GTMEvent): void {
    if (!this.options.enableGTMEditing) {
      throw new Error('GTM editing is disabled')
    }

    const dataLayerItem: DataLayerItem = {
      event: event.event,
      ...event.custom_parameters
    }

    if (event.event_category) dataLayerItem.event_category = event.event_category
    if (event.event_action) dataLayerItem.event_action = event.action
    if (event.event_label) dataLayerItem.event_label = event.event_label
    if (event.value !== undefined) dataLayerItem.value = event.value

    this.pushToDataLayer(dataLayerItem)
  }

  /**
   * Push item to data layer
   */
  pushToDataLayer(item: DataLayerItem): void {
    if (!this.options.enableDataLayer) {
      throw new Error('Data layer is disabled')
    }

    this.dataLayer.push(item)
    
    // Push to window.dataLayer if available (browser environment)
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(item)
    }
  }

  /**
   * Get current data layer
   */
  getDataLayer(): DataLayerItem[] {
    return [...this.dataLayer]
  }

  /**
   * Clear data layer
   */
  clearDataLayer(): void {
    this.dataLayer = []
  }

  /**
   * Create custom GTM event with protobuf data
   */
  async createProtobufGTMEvent(
    eventName: string,
    messageName: string,
    data: any,
    additionalParams: Record<string, any> = {}
  ): Promise<void> {
    if (!this.options.enableCustomEvents) {
      throw new Error('Custom events are disabled')
    }

    try {
      // Encode protobuf data
      const encodedData = await this.encodeProtobufMessage(messageName, data)
      
      // Create GTM event with protobuf data
      const gtmEvent: GTMEvent = {
        event: eventName,
        custom_parameters: {
          protobuf_message: messageName,
          protobuf_data: Array.from(encodedData),
          protobuf_data_base64: btoa(String.fromCharCode(...encodedData)),
          ...additionalParams
        }
      }

      this.createGTMEvent(gtmEvent)
    } catch (error) {
      throw new Error(`Failed to create protobuf GTM event: ${error}`)
    }
  }

  /**
   * Generate GTM trigger configuration
   */
  generateGTMTrigger(eventName: string, conditions: Record<string, any> = {}): any {
    return {
      name: `${eventName}_trigger`,
      type: 'customEvent',
      customEventFilter: [
        {
          type: 'equals',
          parameter: 'event',
          matchType: 'exact',
          value: eventName
        },
        ...Object.entries(conditions).map(([key, value]) => ({
          type: 'equals',
          parameter: key,
          matchType: 'exact',
          value: value
        }))
      ]
    }
  }

  /**
   * Generate GTM tag configuration
   */
  generateGTMTag(
    tagName: string,
    tagType: string,
    triggerName: string,
    parameters: Record<string, any> = {}
  ): any {
    return {
      name: tagName,
      type: tagType,
      triggerIds: [triggerName],
      parameters: parameters
    }
  }

  /**
   * Export GTM configuration
   */
  exportGTMConfig(): any {
    return {
      version: '1.0.0',
      dataLayer: this.dataLayer,
      triggers: this.generateAllTriggers(),
      tags: this.generateAllTags()
    }
  }

  private generateAllTriggers(): any[] {
    // Generate triggers for all events in data layer
    const eventNames = [...new Set(this.dataLayer.map(item => item.event))]
    return eventNames.map(eventName => this.generateGTMTrigger(eventName))
  }

  private generateAllTags(): any[] {
    // Generate basic tags for all events
    const eventNames = [...new Set(this.dataLayer.map(item => item.event))]
    return eventNames.map(eventName => 
      this.generateGTMTag(
        `${eventName}_tag`,
        'gaawe',
        `${eventName}_trigger`,
        { eventName: eventName }
      )
    )
  }

  /**
   * Validate protobuf schema
   */
  validateProtobufSchema(schema: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    try {
      protobuf.parse(schema)
    } catch (error) {
      errors.push(error.message)
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Get protobuf message schema as JSON
   */
  getProtobufSchemaJSON(): any {
    if (!this.protobufRoot) {
      throw new Error('No protobuf schema loaded')
    }

    return this.protobufRoot.toJSON()
  }
}

// Global data layer declaration for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
  }
}

// Export utility functions
export const protobufGTMUtils = {
  /**
   * Convert protobuf message to GTM-friendly format
   */
  protobufToGTM: (message: any): Record<string, any> => {
    const gtmData: Record<string, any> = {}
    
    Object.entries(message).forEach(([key, value]) => {
      if (value instanceof Uint8Array) {
        gtmData[key] = Array.from(value)
        gtmData[`${key}_base64`] = btoa(String.fromCharCode(...value))
      } else {
        gtmData[key] = value
      }
    })
    
    return gtmData
  },

  /**
   * Create GTM event from protobuf message
   */
  createEventFromProtobuf: (
    eventName: string,
    message: any,
    additionalData: Record<string, any> = {}
  ): GTMEvent => {
    return {
      event: eventName,
      custom_parameters: {
        ...protobufGTMUtils.protobufToGTM(message),
        ...additionalData
      }
    }
  }
}

export default ProtobufGTMEditor
