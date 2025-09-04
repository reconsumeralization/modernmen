'use client'

import React, { useState, useCallback, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  Plus,
  Save,
  Download,
  Upload,
  Settings,
  Database,
  Code,
  Play,
  Eye,
  Trash2,
  Copy,
  Edit3,
  Check,
  X,
  Type,
  Hash,
  Calendar,
  ToggleLeft,
  FileText,
  Image,
  Link,
  List,
  Grid,
  Zap,
  Shield,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

// =============================================================================
// COLLECTION BUILDER TYPES
// =============================================================================

interface CollectionField {
  id: string
  name: string
  type: FieldType
  label: string
  required: boolean
  unique?: boolean
  defaultValue?: any
  validation?: FieldValidation
  admin?: FieldAdmin
  relationTo?: string
  hasMany?: boolean
  arrayFields?: CollectionField[]
  groupFields?: CollectionField[]
}

interface FieldValidation {
  min?: number
  max?: number
  pattern?: string
  customMessage?: string
}

interface FieldAdmin {
  position?: 'sidebar' | 'main'
  readOnly?: boolean
  hidden?: boolean
  description?: string
  placeholder?: string
}

interface CollectionConfig {
  name: string
  slug: string
  description: string
  icon?: string
  group?: string
  fields: CollectionField[]
  timestamps: boolean
  admin: {
    useAsTitle?: string
    defaultColumns?: string[]
  }
  access: {
    create: string
    read: string
    update: string
    delete: string
  }
  hooks?: {
    beforeCreate?: string
    afterCreate?: string
    beforeUpdate?: string
    afterUpdate?: string
    beforeDelete?: string
    afterDelete?: string
  }
}

type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'date'
  | 'checkbox'
  | 'select'
  | 'relationship'
  | 'array'
  | 'group'
  | 'upload'
  | 'richText'
  | 'json'
  | 'radio'

// =============================================================================
// DRAG AND DROP FIELD COMPONENTS
// =============================================================================

const FIELD_TYPES: { type: FieldType; label: string; icon: any; color: string }[] = [
  { type: 'text', label: 'Text', icon: Type, color: 'bg-blue-100 text-blue-800' },
  { type: 'textarea', label: 'Textarea', icon: FileText, color: 'bg-green-100 text-green-800' },
  { type: 'number', label: 'Number', icon: Hash, color: 'bg-purple-100 text-purple-800' },
  { type: 'email', label: 'Email', icon: '@', color: 'bg-yellow-100 text-yellow-800' },
  { type: 'date', label: 'Date', icon: Calendar, color: 'bg-red-100 text-red-800' },
  { type: 'checkbox', label: 'Checkbox', icon: ToggleLeft, color: 'bg-gray-100 text-gray-800' },
  { type: 'select', label: 'Select', icon: List, color: 'bg-indigo-100 text-indigo-800' },
  { type: 'relationship', label: 'Relationship', icon: Link, color: 'bg-pink-100 text-pink-800' },
  { type: 'array', label: 'Array', icon: Grid, color: 'bg-orange-100 text-orange-800' },
  { type: 'upload', label: 'Upload', icon: Image, color: 'bg-teal-100 text-teal-800' },
]

interface DraggableFieldProps {
  field: { type: FieldType; label: string; icon: any; color?: string }
  onAdd: (type: FieldType) => void
}

function DraggableField({ field, onAdd }: DraggableFieldProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'field',
    item: { type: field.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const IconComponent = field.icon

  return (
    <div
      ref={drag as any}
      className={`p-3 border rounded-lg cursor-move hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${field.color || ''}`}
      onClick={() => onAdd(field.type)}
    >
      <div className="flex items-center gap-2">
        <IconComponent className="w-4 h-4" />
        <span className="text-sm font-medium">{field.label}</span>
      </div>
    </div>
  )
}

interface FieldItemProps {
  field: CollectionField
  onUpdate: (fieldId: string, updates: Partial<CollectionField>) => void
  onDelete: (fieldId: string) => void
  onMove: (fieldId: string, direction: 'up' | 'down') => void
  isFirst: boolean
  isLast: boolean
}

function FieldItem({ field, onUpdate, onDelete, onMove, isFirst, isLast }: FieldItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(field)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'field-item',
    item: { id: field.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'field-item',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  const handleSave = () => {
    onUpdate(field.id, editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(field)
    setIsEditing(false)
  }

  const fieldTypeConfig = FIELD_TYPES.find(ft => ft.type === field.type)

  return (
    <div
      ref={drag as any}
      className={`border rounded-lg p-4 bg-card transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${isOver ? 'border-primary bg-primary/5' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${fieldTypeConfig?.color || 'bg-gray-100'}`}>
            {fieldTypeConfig && <fieldTypeConfig.icon className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="font-medium">{field.name || 'Unnamed Field'}</h4>
            <p className="text-sm text-muted-foreground">{field.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isFirst && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMove(field.id, 'up')}
            >
              ↑
            </Button>
          )}
          {!isLast && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMove(field.id, 'down')}
            >
              ↓
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(field.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="space-y-3 pt-3 border-t">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Field Name</Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="field_name"
              />
            </div>
            <div>
              <Label htmlFor="label">Display Label</Label>
              <Input
                id="label"
                value={editData.label}
                onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                placeholder="Field Label"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={editData.required}
                onCheckedChange={(checked) =>
                  setEditData({ ...editData, required: checked === true })
                }
              />
              Required
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={editData.unique}
                onCheckedChange={(checked) =>
                  setEditData({ ...editData, unique: checked === true })
                }
              />
              Unique
            </label>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// MAIN COLLECTION BUILDER COMPONENT
// =============================================================================

interface CollectionBuilderProps {
  onCollectionCreated?: (collection: CollectionConfig) => void
  existingCollections?: CollectionConfig[]
}

export function CollectionBuilder({ onCollectionCreated, existingCollections = [] }: CollectionBuilderProps) {
  const { toast } = useToast()
  const [collection, setCollection] = useState<Partial<CollectionConfig>>({
    name: '',
    slug: '',
    description: '',
    fields: [],
    timestamps: true,
    admin: {
      useAsTitle: '',
      defaultColumns: []
    },
    access: {
      create: 'authenticated',
      read: 'authenticated',
      update: 'authenticated',
      delete: 'adminOnly'
    }
  })

  const [selectedTab, setSelectedTab] = useState('fields')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const addField = useCallback((type: FieldType) => {
    const newField: CollectionField = {
      id: `field_${Date.now()}`,
      name: `field_${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
    }

    setCollection(prev => ({
      ...prev,
      fields: [...(prev.fields || []), newField]
    }))
  }, [])

  const updateField = useCallback((fieldId: string, updates: Partial<CollectionField>) => {
    setCollection(prev => ({
      ...prev,
      fields: prev.fields?.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }))
  }, [])

  const deleteField = useCallback((fieldId: string) => {
    setCollection(prev => ({
      ...prev,
      fields: prev.fields?.filter(field => field.id !== fieldId)
    }))
  }, [])

  const moveField = useCallback((fieldId: string, direction: 'up' | 'down') => {
    setCollection(prev => {
      const fields = [...(prev.fields || [])]
      const index = fields.findIndex(field => field.id === fieldId)

      if (direction === 'up' && index > 0) {
        [fields[index], fields[index - 1]] = [fields[index - 1], fields[index]]
      } else if (direction === 'down' && index < fields.length - 1) {
        [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]]
      }

      return { ...prev, fields }
    })
  }, [])

  const generateCollectionCode = useCallback(async () => {
    if (!collection.name || !collection.slug) {
      toast({
        title: "Validation Error",
        description: "Please provide collection name and slug",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)

    try {
      // Generate Payload CMS collection configuration
      const payloadCode = generatePayloadCollection(collection as CollectionConfig)

      // Generate TypeScript types
      const typesCode = generateTypeScriptTypes(collection as CollectionConfig)

      // Generate API routes
      const routesCode = generateAPIRoutes(collection as CollectionConfig)

      // Generate validation schemas
      const validationCode = generateValidationSchemas(collection as CollectionConfig)

      // Generate database migration
      const migrationCode = generateDatabaseMigration(collection as CollectionConfig)

      setGeneratedCode(`// =============================================================================
// ${collection.name?.toUpperCase()} COLLECTION - AUTO-GENERATED
// =============================================================================

// PAYLOAD CMS COLLECTION
${payloadCode}

// TYPESCRIPT TYPES
${typesCode}

// API ROUTES
${routesCode}

// VALIDATION SCHEMAS
${validationCode}

// DATABASE MIGRATION
${migrationCode}`)

      // Call the callback if provided
      if (onCollectionCreated) {
        onCollectionCreated(collection as CollectionConfig)
      }

    } catch (error) {
      console.error('Error generating collection:', error)
      toast({
        title: "Generation Error",
        description: "Error generating collection code. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }, [collection, onCollectionCreated])

  const generatePayloadCollection = (config: CollectionConfig): string => {
    const fieldsCode = config.fields.map(field => {
      let fieldCode = `{
  name: '${field.name}',
  type: '${field.type}',
  ${field.required ? 'required: true,' : ''}
  ${field.unique ? 'unique: true,' : ''}
  ${field.label !== field.name ? `label: '${field.label}',` : ''}
  admin: {
    ${field.admin?.description ? `description: '${field.admin.description}',` : ''}
    ${field.admin?.position ? `position: '${field.admin.position}',` : ''}
    ${field.admin?.readOnly ? 'readOnly: true,' : ''}
    ${field.admin?.hidden ? 'hidden: true,' : ''}
  },`

      if (field.type === 'relationship') {
        fieldCode += `
  relationTo: '${field.relationTo}',`
        if (field.hasMany) fieldCode += `
  hasMany: true,`
      }

      fieldCode += `
},`

      return fieldCode
    }).join('\n')

    return `import { CollectionConfig } from 'payload/types'

export const ${config.name}: CollectionConfig = {
  slug: '${config.slug}',
  admin: {
    useAsTitle: '${config.admin.useAsTitle || config.fields[0]?.name || 'name'}',
    defaultColumns: ${JSON.stringify(config.admin.defaultColumns || [config.fields[0]?.name || 'name'])},
  },
  fields: [
${fieldsCode}
  ],
  timestamps: ${config.timestamps},
}`
  }

  const generateTypeScriptTypes = (config: CollectionConfig): string => {
    const interfaceFields = config.fields.map(field => {
      let typeString = 'any'

      switch (field.type) {
        case 'text':
        case 'textarea':
        case 'email':
          typeString = 'string'
          break
        case 'number':
          typeString = 'number'
          break
        case 'date':
          typeString = 'Date'
          break
        case 'checkbox':
          typeString = 'boolean'
          break
        case 'relationship':
          typeString = field.hasMany ? 'string[]' : 'string'
          break
      }

      const optional = field.required ? '' : '?'
      return `  ${field.name}${optional}: ${typeString}`
    }).join('\n')

    return `export interface ${config.name} {
${interfaceFields}
  createdAt: Date
  updatedAt: Date
}

export interface Create${config.name}Input {
${config.fields.map(field => `  ${field.name}${field.required ? '' : '?'}: ${getFieldType(field)}`).join('\n')}
}

export interface Update${config.name}Input {
${config.fields.map(field => `  ${field.name}?: ${getFieldType(field)}`).join('\n')}
}`
  }

  const generateAPIRoutes = (config: CollectionConfig): string => {
    return `// API Routes for ${config.name}
// GET /api/${config.slug}
// POST /api/${config.slug}
// PUT /api/${config.slug}/[id]
// DELETE /api/${config.slug}/[id]

// Implementation would use the generated service class`
  }

  const generateValidationSchemas = (config: CollectionConfig): string => {
    return `// Zod validation schemas for ${config.name}
// Implementation would generate Zod schemas based on field types`
  }

  const generateDatabaseMigration = (config: CollectionConfig): string => {
    return `-- Database migration for ${config.name} collection
-- This would create the necessary database tables and indexes`
  }

  const getFieldType = (field: CollectionField): string => {
    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'email':
        return 'string'
      case 'number':
        return 'number'
      case 'date':
        return 'Date'
      case 'checkbox':
        return 'boolean'
      default:
        return 'any'
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-full bg-background">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Database className="w-6 h-6" />
              <div>
                <h1 className="text-2xl font-bold">Collection Builder</h1>
                <p className="text-muted-foreground">
                  Build collections with drag-and-drop and auto-generate APIs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={generateCollectionCode}
                disabled={isGenerating || !collection.name || !collection.slug}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 mr-2" />
                    Generate Collection
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100%-80px)]">
          {/* Left Sidebar - Field Types */}
          <div className="w-80 border-r bg-muted/20 p-4">
            <h3 className="font-semibold mb-4">Field Types</h3>
            <div className="grid grid-cols-2 gap-2">
              {FIELD_TYPES.map(fieldType => (
                <DraggableField
                  key={fieldType.type}
                  field={fieldType}
                  onAdd={addField}
                />
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="fields">Fields</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="generated">Generated Code</TabsTrigger>
              </TabsList>

              <TabsContent value="fields" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <List className="w-5 h-5" />
                      Collection Fields
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(collection.fields || []).map((field, index) => (
                        <FieldItem
                          key={field.id}
                          field={field}
                          onUpdate={updateField}
                          onDelete={deleteField}
                          onMove={moveField}
                          isFirst={index === 0}
                          isLast={index === (collection.fields || []).length - 1}
                        />
                      ))}

                      {(collection.fields || []).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Drag field types here to start building your collection</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Collection Name</Label>
                        <Input
                          id="name"
                          value={collection.name || ''}
                          onChange={(e) => setCollection(prev => ({
                            ...prev,
                            name: e.target.value,
                            slug: e.target.value.toLowerCase().replace(/\s+/g, '_')
                          }))}
                          placeholder="My Collection"
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">Collection Slug</Label>
                        <Input
                          id="slug"
                          value={collection.slug || ''}
                          onChange={(e) => setCollection(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="my_collection"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={collection.description || ''}
                        onChange={(e) => setCollection(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your collection..."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Access Control</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Create</Label>
                        <Select
                          value={collection.access?.create || 'authenticated'}
                          onValueChange={(value) => setCollection(prev => ({
                            ...prev,
                            access: { ...prev.access!, create: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="authenticated">Authenticated</SelectItem>
                            <SelectItem value="adminOnly">Admin Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Read</Label>
                        <Select
                          value={collection.access?.read || 'authenticated'}
                          onValueChange={(value) => setCollection(prev => ({
                            ...prev,
                            access: { ...prev.access!, read: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="authenticated">Authenticated</SelectItem>
                            <SelectItem value="adminOnly">Admin Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Collection Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">{collection.name || 'Unnamed Collection'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {collection.description || 'No description provided'}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Fields ({(collection.fields || []).length})</h4>
                        <div className="space-y-2">
                          {(collection.fields || []).map(field => (
                            <div key={field.id} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div>
                                <span className="font-medium">{field.name}</span>
                                <span className="text-sm text-muted-foreground ml-2">({field.type})</span>
                                {field.required && <Badge variant="secondary" className="ml-2">Required</Badge>}
                              </div>
                              <span className="text-sm text-muted-foreground">{field.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="generated" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Generated Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedCode ? (
                      <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
                        <code>{generatedCode}</code>
                      </pre>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Generate your collection to see the code here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
