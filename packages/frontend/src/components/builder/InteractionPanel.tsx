// 🎯 Interaction Panel - Make Components Interactive and Amazing
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Plus,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Play,
  MousePointer,
  Eye,
  Hand
} from 'lucide-react'
import { BuilderInteraction, BuilderAction, BuilderCondition } from '../../lib/builder-engine'
import { cn } from '../../lib/utils'

interface InteractionPanelProps {
  componentId: string
  onClose: () => void
  className?: string
}

interface InteractionType {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  events: string[]
}

interface ActionType {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  config: ActionConfig
}

interface ActionConfig {
  target?: boolean
  value?: boolean
  delay?: boolean
  duration?: boolean
  easing?: boolean
}

export function InteractionPanel({ componentId, onClose, className }: InteractionPanelProps) {
  const [interactions, setInteractions] = useState<BuilderInteraction[]>([])
  const [selectedInteraction, setSelectedInteraction] = useState<string | null>(null)
  const [showAddInteraction, setShowAddInteraction] = useState(false)

  // 🎯 Available Interaction Types
  const interactionTypes: InteractionType[] = [
    {
      id: 'click',
      name: 'Click',
      icon: <MousePointer className="w-4 h-4" />,
      description: 'Trigger when user clicks the component',
      events: ['click', 'dblclick']
    },
    {
      id: 'hover',
      name: 'Hover',
      icon: <Eye className="w-4 h-4" />,
      description: 'Trigger when user hovers over the component',
      events: ['mouseenter', 'mouseleave']
    },
    {
      id: 'scroll',
      name: 'Scroll',
      icon: <Hand className="w-4 h-4" />,
      description: 'Trigger based on scroll position',
      events: ['scroll']
    },
    {
      id: 'custom',
      name: 'Custom',
      icon: <Zap className="w-4 h-4" />,
      description: 'Custom event triggers',
      events: ['custom']
    }
  ]

  // 🎯 Available Action Types
  const actionTypes: ActionType[] = [
    {
      id: 'navigate',
      name: 'Navigate',
      icon: <MousePointer className="w-4 h-4" />,
      description: 'Navigate to a URL or page',
      config: { target: true, value: true }
    },
    {
      id: 'show-hide',
      name: 'Show/Hide',
      icon: <Eye className="w-4 h-4" />,
      description: 'Show or hide another component',
      config: { target: true, value: true }
    },
    {
      id: 'animate',
      name: 'Animate',
      icon: <Play className="w-4 h-4" />,
      description: 'Apply animation to component',
      config: { target: true, value: true, duration: true, easing: true }
    },
    {
      id: 'set-value',
      name: 'Set Value',
      icon: <Zap className="w-4 h-4" />,
      description: 'Set a value on another component',
      config: { target: true, value: true }
    },
    {
      id: 'trigger-event',
      name: 'Trigger Event',
      icon: <Zap className="w-4 h-4" />,
      description: 'Trigger a custom event',
      config: { target: true, value: true, delay: true }
    }
  ]

  // 🎯 Add new interaction
  const addInteraction = (typeId: string) => {
    const type = interactionTypes.find(t => t.id === typeId)
    if (!type) return

    const newInteraction: BuilderInteraction = {
      id: `interaction_${Date.now()}`,
      event: type.events[0],
      actions: []
    }

    setInteractions(prev => [...prev, newInteraction])
    setSelectedInteraction(newInteraction.id)
    setShowAddInteraction(false)
  }

  // 🎯 Remove interaction
  const removeInteraction = (interactionId: string) => {
    setInteractions(prev => prev.filter(i => i.id !== interactionId))
    if (selectedInteraction === interactionId) {
      setSelectedInteraction(null)
    }
  }

  // 🎯 Add action to interaction
  const addAction = (interactionId: string, actionTypeId: string) => {
    const actionType = actionTypes.find(a => a.id === actionTypeId)
    if (!actionType) return

    const newAction: BuilderAction = {
      type: actionTypeId,
      target: '',
      value: '',
      delay: 0,
      duration: 300,
      easing: 'ease-in-out'
    }

    setInteractions(prev =>
      prev.map(interaction =>
        interaction.id === interactionId
          ? { ...interaction, actions: [...interaction.actions, newAction] }
          : interaction
      )
    )
  }

  // 🎯 Update action
  const updateAction = (interactionId: string, actionIndex: number, updates: Partial<BuilderAction>) => {
    setInteractions(prev =>
      prev.map(interaction =>
        interaction.id === interactionId
          ? {
              ...interaction,
              actions: interaction.actions.map((action, index) =>
                index === actionIndex ? { ...action, ...updates } : action
              )
            }
          : interaction
      )
    )
  }

  // 🎯 Remove action
  const removeAction = (interactionId: string, actionIndex: number) => {
    setInteractions(prev =>
      prev.map(interaction =>
        interaction.id === interactionId
          ? {
              ...interaction,
              actions: interaction.actions.filter((_, index) => index !== actionIndex)
            }
          : interaction
      )
    )
  }

  const selectedInteractionData = interactions.find(i => i.id === selectedInteraction)

  return (
    <motion.div
      className={cn("w-80 bg-white border-l border-gray-200 flex flex-col", className)}
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      {/* 🎯 Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Interactions</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 🎯 Interactions List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Add Interaction Button */}
          <button
            onClick={() => setShowAddInteraction(!showAddInteraction)}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Interaction
          </button>

          {/* Add Interaction Menu */}
          <AnimatePresence>
            {showAddInteraction && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 space-y-2"
              >
                {interactionTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => addInteraction(type.id)}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-colors text-left"
                  >
                    {type.icon}
                    <div>
                      <div className="font-medium text-gray-900">{type.name}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Existing Interactions */}
          <div className="mt-4 space-y-3">
            {interactions.map((interaction) => (
              <InteractionItem
                key={interaction.id}
                interaction={interaction}
                isSelected={selectedInteraction === interaction.id}
                onSelect={() => setSelectedInteraction(interaction.id)}
                onRemove={() => removeInteraction(interaction.id)}
                actionTypes={actionTypes}
                onAddAction={(actionTypeId) => addAction(interaction.id, actionTypeId)}
                onUpdateAction={(actionIndex, updates) => updateAction(interaction.id, actionIndex, updates)}
                onRemoveAction={(actionIndex) => removeAction(interaction.id, actionIndex)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 🎯 Interaction Details Panel */}
      <AnimatePresence>
        {selectedInteractionData && (
          <motion.div
            className="border-t border-gray-200 p-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <InteractionDetails
              interaction={selectedInteractionData}
              onUpdate={(updates) => {
                setInteractions(prev =>
                  prev.map(i =>
                    i.id === selectedInteractionData.id
                      ? { ...i, ...updates }
                      : i
                  )
                )
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// 🎯 Individual Interaction Item
interface InteractionItemProps {
  interaction: BuilderInteraction
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  actionTypes: ActionType[]
  onAddAction: (actionTypeId: string) => void
  onUpdateAction: (actionIndex: number, updates: Partial<BuilderAction>) => void
  onRemoveAction: (actionIndex: number) => void
}

function InteractionItem({
  interaction,
  isSelected,
  onSelect,
  onRemove,
  actionTypes,
  onAddAction,
  onUpdateAction,
  onRemoveAction
}: InteractionItemProps) {
  const [expanded, setExpanded] = useState(isSelected)
  const [showAddAction, setShowAddAction] = useState(false)

  React.useEffect(() => {
    setExpanded(isSelected)
  }, [isSelected])

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden",
      isSelected ? "border-purple-300 bg-purple-50" : "border-gray-200"
    )}>
      {/* Header */}
      <button
        onClick={() => {
          onSelect()
          setExpanded(!expanded)
        }}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-gray-900 capitalize">{interaction.event}</span>
          <span className="text-sm text-gray-500">
            ({interaction.actions.length} action{interaction.actions.length !== 1 ? 's' : ''})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Actions */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200"
          >
            <div className="p-3 space-y-2">
              {interaction.actions.map((action, index) => (
                <ActionItem
                  key={index}
                  action={action}
                  actionTypes={actionTypes}
                  onUpdate={(updates) => onUpdateAction(index, updates)}
                  onRemove={() => onRemoveAction(index)}
                />
              ))}

              {/* Add Action Button */}
              <button
                onClick={() => setShowAddAction(!showAddAction)}
                className="w-full flex items-center justify-center gap-2 p-2 border border-dashed border-gray-300 rounded text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors text-sm"
              >
                <Plus className="w-3 h-3" />
                Add Action
              </button>

              {/* Add Action Menu */}
              <AnimatePresence>
                {showAddAction && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-1"
                  >
                    {actionTypes.map((actionType) => (
                      <button
                        key={actionType.id}
                        onClick={() => {
                          onAddAction(actionType.id)
                          setShowAddAction(false)
                        }}
                        className="w-full flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-colors text-left text-sm"
                      >
                        {actionType.icon}
                        <span className="font-medium">{actionType.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 🎯 Action Item Component
interface ActionItemProps {
  action: BuilderAction
  actionTypes: ActionType[]
  onUpdate: (updates: Partial<BuilderAction>) => void
  onRemove: () => void
}

function ActionItem({ action, actionTypes, onUpdate, onRemove }: ActionItemProps) {
  const actionType = actionTypes.find(at => at.id === action.type)

  return (
    <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded">
      {actionType?.icon}
      <span className="flex-1 text-sm font-medium">{actionType?.name}</span>
      <button
        onClick={onRemove}
        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

// 🎯 Interaction Details Component
interface InteractionDetailsProps {
  interaction: BuilderInteraction
  onUpdate: (updates: Partial<BuilderInteraction>) => void
}

function InteractionDetails({ interaction, onUpdate }: InteractionDetailsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Type
        </label>
        <select
          value={interaction.event}
          onChange={(e) => onUpdate({ event: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="click">Click</option>
          <option value="dblclick">Double Click</option>
          <option value="mouseenter">Mouse Enter</option>
          <option value="mouseleave">Mouse Leave</option>
          <option value="scroll">Scroll</option>
        </select>
      </div>

      {/* Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Conditions (Optional)
        </label>
        <div className="text-sm text-gray-500">
          Add conditions to control when this interaction triggers
        </div>
      </div>
    </div>
  )
}
