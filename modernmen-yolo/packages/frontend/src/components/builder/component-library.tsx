import React, { useState } from "react";
import { Search, Filter, Grid, List, Star, Zap, Clock, Users } from "lucide-react";

// Component Library Component
export function ComponentLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedComplexity, setSelectedComplexity] = useState("")
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Mock component data based on the system architecture
  const components = [
    {
      id: "booking-wizard",
      name: "Booking Wizard",
      category: "booking",
      complexity: "advanced",
      description: "Multi-step booking flow with service selection, stylist choice, and payment",
      tags: ["booking", "wizard", "payment", "stripe"],
      isPremium: true,
      rating: 4.9,
      usage: 156,
      preview: "🧙‍♂️ Wizard Component"
    },
    {
      id: "appointment-card",
      name: "Appointment Card",
      category: "data",
      complexity: "simple",
      description: "Display appointment details with actions",
      tags: ["appointment", "card", "actions"],
      isPremium: false,
      rating: 4.7,
      usage: 89,
      preview: "📅 Card Component"
    },
    {
      id: "staff-scheduler",
      name: "Staff Scheduler",
      category: "management",
      complexity: "advanced",
      description: "Staff scheduling with availability and shift management",
      tags: ["staff", "schedule", "calendar"],
      isPremium: true,
      rating: 4.8,
      usage: 45,
      preview: "👥 Scheduler Component"
    },
    {
      id: "service-selector",
      name: "Service Selector",
      category: "form",
      complexity: "intermediate",
      description: "Interactive service selection with pricing",
      tags: ["services", "pricing", "selection"],
      isPremium: false,
      rating: 4.6,
      usage: 234,
      preview: "✂️ Selector Component"
    },
    {
      id: "customer-portal",
      name: "Customer Portal",
      category: "layout",
      complexity: "advanced",
      description: "Complete customer dashboard with booking history",
      tags: ["portal", "dashboard", "customer"],
      isPremium: true,
      rating: 4.9,
      usage: 67,
      preview: "🏠 Portal Component"
    },
    {
      id: "notification-center",
      name: "Notification Center",
      category: "feedback",
      complexity: "intermediate",
      description: "Real-time notifications with actions",
      tags: ["notifications", "realtime", "actions"],
      isPremium: false,
      rating: 4.5,
      usage: 123,
      preview: "🔔 Notification Component"
    }
  ]

  const categories = [
    { value: "", label: "All Categories" },
    { value: "booking", label: "Booking" },
    { value: "management", label: "Management" },
    { value: "layout", label: "Layout" },
    { value: "form", label: "Form" },
    { value: "data", label: "Data Display" },
    { value: "feedback", label: "Feedback" }
  ]

  const complexityLevels = [
    { value: "", label: "All Levels" },
    { value: "simple", label: "Simple" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
  ]

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = !selectedCategory || component.category === selectedCategory
    const matchesComplexity = !selectedComplexity || component.complexity === selectedComplexity
    const matchesPremium = !showPremiumOnly || component.isPremium

    return matchesSearch && matchesCategory && matchesComplexity && matchesPremium
  })

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple": return "bg-green-100 text-green-800 border-green-200"
      case "intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "advanced": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="w-full h-full bg-background">
      {/* Header with Search and Filters */}
      <div className="border-b p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Component Library</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-background border border-input rounded-md px-3 py-2 pr-8 min-w-[140px]"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Complexity Filter */}
          <div className="relative">
            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="appearance-none bg-background border border-input rounded-md px-3 py-2 pr-8 min-w-[140px]"
            >
              {complexityLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <Zap className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Premium Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPremiumOnly}
              onChange={(e) => setShowPremiumOnly(e.target.checked)}
              className="rounded border-input"
            />
            <span className="text-sm">Premium Only</span>
          </label>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Component Grid/List */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComponents.map((component) => (
                <div
                  key={component.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
                >
                  {/* Component Preview */}
                  <div className="h-24 bg-muted rounded-md mb-3 flex items-center justify-center text-2xl">
                    {component.preview}
                  </div>

                  {/* Component Header */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{component.name}</h3>
                    {component.isPremium && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        PRO
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {component.description}
                  </p>

                  {/* Complexity Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getComplexityColor(component.complexity)}`}>
                      {component.complexity}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{component.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{component.usage}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {component.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {component.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{component.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-primary text-primary-foreground text-sm py-2 px-3 rounded-md hover:bg-primary/90 transition-colors">
                    Use Component
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredComponents.map((component) => (
                <div
                  key={component.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow bg-card"
                >
                  <div className="flex items-center gap-4">
                    {/* Preview */}
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-lg flex-shrink-0">
                      {component.preview}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm">{component.name}</h3>
                        {component.isPremium && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                            PRO
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full border ${getComplexityColor(component.complexity)}`}>
                          {component.complexity}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {component.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{component.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{component.usage} uses</span>
                        </div>
                        <div className="flex gap-1">
                          {component.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="bg-muted px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <button className="bg-primary text-primary-foreground text-sm py-2 px-4 rounded-md hover:bg-primary/90 transition-colors flex-shrink-0">
                      Use Component
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredComponents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium mb-2">No components found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("")
                  setSelectedComplexity("")
                  setShowPremiumOnly(false)
                }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}