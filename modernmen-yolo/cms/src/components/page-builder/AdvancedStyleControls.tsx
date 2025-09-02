'use client'

import React, { useState } from 'react'

interface AdvancedStyleControlsProps {
  block: any
  viewMode: 'desktop' | 'tablet' | 'mobile'
  onUpdateBlock: (updates: any) => void
}

export const AdvancedStyleControls: React.FC<AdvancedStyleControlsProps> = ({
  block,
  viewMode,
  onUpdateBlock
}) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'typography' | 'colors' | 'effects' | 'borders'>('layout')

  const currentStyles = block.styles || {}
  const currentResponsive = currentStyles.responsive || {}
  const currentViewStyles = currentResponsive[viewMode] || {}

  const updateResponsiveStyle = (property: string, value: any) => {
    const updatedStyles = {
      ...currentStyles,
      responsive: {
        ...currentResponsive,
        [viewMode]: {
          ...currentViewStyles,
          [property]: value
        }
      }
    }
    onUpdateBlock({ styles: updatedStyles })
  }

  const updateNestedStyle = (category: string, property: string, value: any) => {
    const currentCategory = currentViewStyles[category] || {}
    updateResponsiveStyle(category, {
      ...currentCategory,
      [property]: value
    })
  }

  const tabs = [
    { id: 'layout', label: '📐 Layout', icon: '📐' },
    { id: 'typography', label: '📝 Typography', icon: '📝' },
    { id: 'colors', label: '🎨 Colors', icon: '🎨' },
    { id: 'effects', label: '✨ Effects', icon: '✨' },
    { id: 'borders', label: '⬜ Borders', icon: '⬜' }
  ]

  return (
    <div className="advanced-style-controls">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs">{tab.label.split(' ')[1]}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Layout Controls */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          {/* Display & Position */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Display & Position</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Display</label>
                <select
                  value={currentViewStyles.layout?.display || 'block'}
                  onChange={(e) => updateNestedStyle('layout', 'display', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="block">Block</option>
                  <option value="inline-block">Inline Block</option>
                  <option value="flex">Flex</option>
                  <option value="grid">Grid</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1">Position</label>
                <select
                  value={currentViewStyles.layout?.position || 'static'}
                  onChange={(e) => updateNestedStyle('layout', 'position', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="static">Static</option>
                  <option value="relative">Relative</option>
                  <option value="absolute">Absolute</option>
                  <option value="fixed">Fixed</option>
                  <option value="sticky">Sticky</option>
                </select>
              </div>
            </div>
          </div>

          {/* Flexbox Controls */}
          {currentViewStyles.layout?.display === 'flex' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">Flexbox</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Direction</label>
                  <select
                    value={currentViewStyles.layout?.flexDirection || 'row'}
                    onChange={(e) => updateNestedStyle('layout', 'flexDirection', e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="row">Row</option>
                    <option value="column">Column</option>
                    <option value="row-reverse">Row Reverse</option>
                    <option value="column-reverse">Column Reverse</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Justify</label>
                  <select
                    value={currentViewStyles.layout?.justifyContent || 'flex-start'}
                    onChange={(e) => updateNestedStyle('layout', 'justifyContent', e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-around">Space Around</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Align Items</label>
                  <select
                    value={currentViewStyles.layout?.alignItems || 'stretch'}
                    onChange={(e) => updateNestedStyle('layout', 'alignItems', e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="stretch">Stretch</option>
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="baseline">Baseline</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Wrap</label>
                  <select
                    value={currentViewStyles.layout?.flexWrap || 'nowrap'}
                    onChange={(e) => updateNestedStyle('layout', 'flexWrap', e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="nowrap">No Wrap</option>
                    <option value="wrap">Wrap</option>
                    <option value="wrap-reverse">Wrap Reverse</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Dimensions */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Dimensions</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Width</label>
                <div className="flex">
                  <input
                    type="text"
                    value={currentViewStyles.dimensions?.width || ''}
                    onChange={(e) => updateNestedStyle('dimensions', 'width', e.target.value)}
                    placeholder="auto"
                    className="flex-1 p-2 text-sm border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={currentViewStyles.dimensions?.widthUnit || 'px'}
                    onChange={(e) => updateNestedStyle('dimensions', 'widthUnit', e.target.value)}
                    className="w-16 p-2 text-sm border-l-0 border border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="px">px</option>
                    <option value="%">%</option>
                    <option value="rem">rem</option>
                    <option value="em">em</option>
                    <option value="vw">vw</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1">Height</label>
                <div className="flex">
                  <input
                    type="text"
                    value={currentViewStyles.dimensions?.height || ''}
                    onChange={(e) => updateNestedStyle('dimensions', 'height', e.target.value)}
                    placeholder="auto"
                    className="flex-1 p-2 text-sm border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={currentViewStyles.dimensions?.heightUnit || 'px'}
                    onChange={(e) => updateNestedStyle('dimensions', 'heightUnit', e.target.value)}
                    className="w-16 p-2 text-sm border-l-0 border border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="px">px</option>
                    <option value="%">%</option>
                    <option value="rem">rem</option>
                    <option value="em">em</option>
                    <option value="vh">vh</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Typography Controls */}
      {activeTab === 'typography' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Font Properties</h4>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Font Family</label>
              <select
                value={currentViewStyles.typography?.fontFamily || 'system'}
                onChange={(e) => updateNestedStyle('typography', 'fontFamily', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="system">System Default</option>
                <option value="serif">Serif</option>
                <option value="sans">Sans Serif</option>
                <option value="mono">Monospace</option>
                <option value="inter">Inter</option>
                <option value="poppins">Poppins</option>
                <option value="roboto">Roboto</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Font Size</label>
                <select
                  value={currentViewStyles.typography?.fontSize || 'base'}
                  onChange={(e) => updateNestedStyle('typography', 'fontSize', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="xs">Extra Small</option>
                  <option value="sm">Small</option>
                  <option value="base">Base</option>
                  <option value="lg">Large</option>
                  <option value="xl">Extra Large</option>
                  <option value="2xl">2X Large</option>
                  <option value="3xl">3X Large</option>
                  <option value="4xl">4X Large</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1">Font Weight</label>
                <select
                  value={currentViewStyles.typography?.fontWeight || 'normal'}
                  onChange={(e) => updateNestedStyle('typography', 'fontWeight', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="thin">Thin (100)</option>
                  <option value="light">Light (300)</option>
                  <option value="normal">Normal (400)</option>
                  <option value="medium">Medium (500)</option>
                  <option value="semibold">Semibold (600)</option>
                  <option value="bold">Bold (700)</option>
                  <option value="black">Black (900)</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Line Height</label>
                <select
                  value={currentViewStyles.typography?.lineHeight || 'normal'}
                  onChange={(e) => updateNestedStyle('typography', 'lineHeight', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tight">Tight (1.25)</option>
                  <option value="normal">Normal (1.5)</option>
                  <option value="relaxed">Relaxed (1.625)</option>
                  <option value="loose">Loose (2)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1">Letter Spacing</label>
                <select
                  value={currentViewStyles.typography?.letterSpacing || 'normal'}
                  onChange={(e) => updateNestedStyle('typography', 'letterSpacing', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tighter">Tighter (-0.05em)</option>
                  <option value="tight">Tight (-0.025em)</option>
                  <option value="normal">Normal (0)</option>
                  <option value="wide">Wide (0.025em)</option>
                  <option value="wider">Wider (0.05em)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Colors Controls */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Text Colors</h4>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Text Color</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={currentViewStyles.colors?.text || '#000000'}
                  onChange={(e) => updateNestedStyle('colors', 'text', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={currentViewStyles.colors?.text || '#000000'}
                  onChange={(e) => updateNestedStyle('colors', 'text', e.target.value)}
                  placeholder="#000000"
                  className="flex-1 p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Background</h4>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Background Type</label>
              <select
                value={currentViewStyles.background?.type || 'solid'}
                onChange={(e) => updateNestedStyle('background', 'type', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image</option>
              </select>
            </div>
            
            {currentViewStyles.background?.type === 'solid' && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Background Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={currentViewStyles.background?.color || '#ffffff'}
                    onChange={(e) => updateNestedStyle('background', 'color', e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentViewStyles.background?.color || '#ffffff'}
                    onChange={(e) => updateNestedStyle('background', 'color', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
            
            {currentViewStyles.background?.type === 'gradient' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Gradient Direction</label>
                  <select
                    value={currentViewStyles.background?.gradientDirection || 'to-r'}
                    onChange={(e) => updateNestedStyle('background', 'gradientDirection', e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="to-r">Left to Right</option>
                    <option value="to-l">Right to Left</option>
                    <option value="to-t">Bottom to Top</option>
                    <option value="to-b">Top to Bottom</option>
                    <option value="to-br">Top-Left to Bottom-Right</option>
                    <option value="to-bl">Top-Right to Bottom-Left</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">From Color</label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={currentViewStyles.background?.gradientFrom || '#3b82f6'}
                        onChange={(e) => updateNestedStyle('background', 'gradientFrom', e.target.value)}
                        className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={currentViewStyles.background?.gradientFrom || '#3b82f6'}
                        onChange={(e) => updateNestedStyle('background', 'gradientFrom', e.target.value)}
                        className="flex-1 p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To Color</label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={currentViewStyles.background?.gradientTo || '#8b5cf6'}
                        onChange={(e) => updateNestedStyle('background', 'gradientTo', e.target.value)}
                        className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={currentViewStyles.background?.gradientTo || '#8b5cf6'}
                        onChange={(e) => updateNestedStyle('background', 'gradientTo', e.target.value)}
                        className="flex-1 p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Effects Controls */}
      {activeTab === 'effects' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Shadow & Glow</h4>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Box Shadow</label>
              <select
                value={currentViewStyles.effects?.shadow || 'none'}
                onChange={(e) => updateNestedStyle('effects', 'shadow', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
                <option value="2xl">2X Large</option>
                <option value="inner">Inner</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Transforms</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Scale</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={currentViewStyles.effects?.scale || 1}
                  onChange={(e) => updateNestedStyle('effects', 'scale', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 text-center mt-1">
                  {currentViewStyles.effects?.scale || 1}
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rotate (deg)</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={currentViewStyles.effects?.rotate || 0}
                  onChange={(e) => updateNestedStyle('effects', 'rotate', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 text-center mt-1">
                  {currentViewStyles.effects?.rotate || 0}°
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Opacity & Blend</h4>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={currentViewStyles.effects?.opacity || 1}
                onChange={(e) => updateNestedStyle('effects', 'opacity', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-400 text-center mt-1">
                {Math.round((currentViewStyles.effects?.opacity || 1) * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Borders Controls */}
      {activeTab === 'borders' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Border Style</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Border Width</label>
                <select
                  value={currentViewStyles.borders?.width || '0'}
                  onChange={(e) => updateNestedStyle('borders', 'width', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">None</option>
                  <option value="1">1px</option>
                  <option value="2">2px</option>
                  <option value="4">4px</option>
                  <option value="8">8px</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1">Border Style</label>
                <select
                  value={currentViewStyles.borders?.style || 'solid'}
                  onChange={(e) => updateNestedStyle('borders', 'style', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Border Color</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={currentViewStyles.borders?.color || '#d1d5db'}
                  onChange={(e) => updateNestedStyle('borders', 'color', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={currentViewStyles.borders?.color || '#d1d5db'}
                  onChange={(e) => updateNestedStyle('borders', 'color', e.target.value)}
                  placeholder="#d1d5db"
                  className="flex-1 p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Border Radius</h4>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Corner Radius</label>
              <select
                value={currentViewStyles.borders?.radius || '0'}
                onChange={(e) => updateNestedStyle('borders', 'radius', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">None</option>
                <option value="sm">Small (2px)</option>
                <option value="md">Medium (6px)</option>
                <option value="lg">Large (8px)</option>
                <option value="xl">Extra Large (12px)</option>
                <option value="2xl">2X Large (16px)</option>
                <option value="full">Full (9999px)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedStyleControls