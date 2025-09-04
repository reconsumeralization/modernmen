"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface StylePanelProps {
  selectedElement?: any
  onStyleChange?: (styles: any) => void
}

export const StylePanel: React.FC<StylePanelProps> = ({
  selectedElement,
  onStyleChange
}) => {
  if (!selectedElement) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Style Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select an element to edit its styles</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Style Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="background">Background Color</Label>
          <Input
            id="background"
            type="color"
            value={selectedElement.styles?.backgroundColor || '#ffffff'}
            onChange={(e) => onStyleChange?.({ backgroundColor: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="text-color">Text Color</Label>
          <Input
            id="text-color"
            type="color"
            value={selectedElement.styles?.color || '#000000'}
            onChange={(e) => onStyleChange?.({ color: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="font-size">Font Size</Label>
          <Select
            value={selectedElement.styles?.fontSize || '16px'}
            onValueChange={(value) => onStyleChange?.({ fontSize: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="14px">14px</SelectItem>
              <SelectItem value="16px">16px</SelectItem>
              <SelectItem value="18px">18px</SelectItem>
              <SelectItem value="20px">20px</SelectItem>
              <SelectItem value="24px">24px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="padding">Padding</Label>
          <Input
            id="padding"
            value={selectedElement.styles?.padding || '8px'}
            onChange={(e) => onStyleChange?.({ padding: e.target.value })}
          />
        </div>

        <Button
          onClick={() => onStyleChange?.({})}
          variant="outline"
          className="w-full"
        >
          Reset Styles
        </Button>
      </CardContent>
    </Card>
  )
}
