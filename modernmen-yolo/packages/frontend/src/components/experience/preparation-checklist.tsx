// =============================================================================
// PREPARATION CHECKLIST COMPONENT
// =============================================================================

"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Clock,
  User,

  AlertTriangle,
  Package,
  Shield,
  ChevronDown,
  ChevronUp,
  Timer,
  Camera,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  PREPARATION_PROCEDURES,
  getPreparationProcedure,
  generatePreparationChecklist,
  PreparationChecklistItem
} from "@/data/preparation-procedures"

interface PreparationChecklistProps {
  serviceCategory: string
  serviceName: string
  customerName: string
  onChecklistComplete: (completedItems: string[]) => void
  onPhotoCapture?: () => void
  className?: string
}

export function PreparationChecklist({
  serviceCategory,
  serviceName,
  customerName,
  onChecklistComplete,
  onPhotoCapture,
  className
}: PreparationChecklistProps) {
  const [checklist, setChecklist] = useState<PreparationChecklistItem[]>([])
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['customer']))
  const [activeTab, setActiveTab] = useState<'checklist' | 'procedures' | 'supplies'>('checklist')

  // Load preparation procedure based on service
  useEffect(() => {
    const procedure = getPreparationProcedure(serviceCategory, serviceName)
    if (procedure) {
      const generatedChecklist = generatePreparationChecklist(procedure)
      setChecklist(generatedChecklist)
    }
  }, [serviceCategory, serviceName])

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateChecklistItem = (itemId: string, completed: boolean) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed } : item
      )
    )
  }

  // Calculate completion statistics
  const stats = React.useMemo(() => {
    const total = checklist.length
    const completed = checklist.filter(item => item.completed).length
    const required = checklist.filter(item => item.required).length
    const requiredCompleted = checklist.filter(item => item.required && item.completed).length

    return {
      total,
      completed,
      required,
      requiredCompleted,
      completionPercentage: total > 0 ? (completed / total) * 100 : 0,
      requiredCompletionPercentage: required > 0 ? (requiredCompleted / required) * 100 : 0
    }
  }, [checklist])

  // Notify parent of completion status
  useEffect(() => {
    const completedItems = checklist.filter(item => item.completed).map(item => item.id)
    onChecklistComplete(completedItems)
  }, [checklist, onChecklistComplete])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'customer': return User
      case 'barber': return Object.assign(({ className }: { className?: string }) => (
        <div className={cn("w-5 h-5 bg-red-600 rounded-full flex items-center justify-center", className)}>
          <span className="text-white text-xs font-bold">M</span>
        </div>
      ), { displayName: 'BarberIcon' })
      case 'supplies': return Package
      case 'safety': return Shield
      default: return CheckCircle
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'customer': return 'bg-blue-500'
      case 'barber': return 'bg-purple-500'
      case 'supplies': return 'bg-green-500'
      case 'safety': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const groupedChecklist = React.useMemo(() => {
    const groups: Record<string, PreparationChecklistItem[]> = {
      customer: [],
      barber: [],
      supplies: [],
      safety: []
    }

    checklist.forEach(item => {
      if (groups[item.category]) {
        groups[item.category].push(item)
      }
    })

    return groups
  }, [checklist])

  const procedure = getPreparationProcedure(serviceCategory, serviceName)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Progress */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Preparation Checklist</CardTitle>
              <p className="text-sm text-muted-foreground">
                Service: {serviceName} • Customer: {customerName}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={stats.requiredCompletionPercentage === 100 ? "default" : "secondary"}>
                  {stats.completed}/{stats.total} Complete
                </Badge>
                {stats.requiredCompletionPercentage < 100 && (
                  <Badge variant="outline" className="text-orange-600">
                    {stats.requiredCompleted}/{stats.required} Required
                  </Badge>
                )}
              </div>
              <Progress
                value={stats.completionPercentage}
                className="w-32 h-2"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="checklist" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Checklist ({stats.completed}/{stats.total})
              </TabsTrigger>
              <TabsTrigger value="procedures" className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Procedures
              </TabsTrigger>
              <TabsTrigger value="supplies" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Supplies
              </TabsTrigger>
            </TabsList>

            {/* Checklist Tab */}
            <TabsContent value="checklist" className="space-y-4 mt-4">
              {Object.entries(groupedChecklist).map(([category, items]) => (
                <Card key={category} className="border-l-4 border-l-current">
                  <CardHeader
                    className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleSection(category)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-full", getCategoryColor(category))}>
                          {React.createElement(getCategoryIcon(category), {
                            className: "h-4 w-4 text-white"
                          })}
                        </div>
                        <div>
                          <h3 className="font-semibold capitalize">{category}</h3>
                          <p className="text-sm text-muted-foreground">
                            {items.filter(i => i.completed).length}/{items.length} completed
                          </p>
                        </div>
                      </div>
                      {expandedSections.has(category) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {expandedSections.has(category) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className={cn(
                                  "flex items-start gap-3 p-3 rounded-lg border transition-all",
                                  item.completed
                                    ? "bg-green-50 border-green-200"
                                    : "bg-muted/30 border-border hover:bg-muted/50"
                                )}
                              >
                                <Checkbox
                                  id={item.id}
                                  checked={item.completed}
                                  onCheckedChange={(checked) =>
                                    updateChecklistItem(item.id, checked as boolean)
                                  }
                                  className="mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <label
                                    htmlFor={item.id}
                                    className={cn(
                                      "font-medium text-sm cursor-pointer",
                                      item.completed && "line-through text-muted-foreground"
                                    )}
                                  >
                                    {item.title}
                                  </label>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {item.description}
                                  </p>
                                  {item.required && (
                                    <Badge variant="outline" className="text-xs mt-1">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))}
            </TabsContent>

            {/* Procedures Tab */}
            <TabsContent value="procedures" className="space-y-4 mt-4">
              {procedure ? (
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Preparation Time: {procedure.preparationTime} minutes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Customer Instructions</h4>
                        <ul className="text-sm space-y-1">
                          {procedure.customerInstructions.map((instruction, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Barber Checklist</h4>
                        <ul className="text-sm space-y-1">
                          {procedure.barberChecklist.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-orange-600">Safety Considerations</h4>
                        <ul className="text-sm space-y-1">
                          {procedure.safetyConsiderations.map((consideration, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                              <span>{consideration}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Aftercare Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        {procedure.aftercareInstructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No detailed procedures available for this service.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Supplies Tab */}
            <TabsContent value="supplies" className="space-y-4 mt-4">
              {procedure ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Required Supplies & Equipment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {procedure.requiredSupplies.map((supply, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">{supply}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No supply information available for this service.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-3">
        {onPhotoCapture && (
          <Button variant="outline" onClick={onPhotoCapture} className="flex-1">
            <Camera className="h-4 w-4 mr-2" />
            Capture Before Photo
          </Button>
        )}
        <Button
          variant={stats.requiredCompletionPercentage === 100 ? "default" : "secondary"}
          className="flex-1"
          disabled={stats.requiredCompletionPercentage < 100}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {stats.requiredCompletionPercentage === 100 ? "Preparation Complete" : "Complete Required Items"}
        </Button>
      </div>
    </div>
  )
}
