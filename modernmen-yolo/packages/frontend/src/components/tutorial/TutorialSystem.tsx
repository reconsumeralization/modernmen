"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  Circle,
  BookOpen,
  Users,
  Scissors,
  Calendar,
  CreditCard,
  Star,
  Clock,
  Award,
  Target,
  Zap,
  ChevronRight,
  ChevronLeft,
  X,
  RotateCcw,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// Tutorial data structure
interface TutorialStep {
  id: string
  title: string
  description: string
  content: string
  type: 'video' | 'interactive' | 'text'
  duration: number // in minutes
  completed: boolean
  required: boolean
}

interface Tutorial {
  id: string
  title: string
  description: string
  category: 'staff' | 'customer'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  steps: TutorialStep[]
  prerequisites: string[]
  skills: string[]
}

// Mock tutorial data
const staffTutorials: Tutorial[] = [
  {
    id: 'staff-onboarding',
    title: 'Staff Onboarding & Training',
    description: 'Complete guide for new team members to get started',
    category: 'staff',
    difficulty: 'beginner',
    estimatedTime: 45,
    prerequisites: [],
    skills: ['Customer Service', 'POS System', 'Safety Protocols'],
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Modern Men',
        description: 'Introduction to our salon and team culture',
        content: 'Welcome to Modern Men! We\'re excited to have you join our team. This comprehensive onboarding program will help you become a valuable member of our salon family.',
        type: 'text',
        duration: 5,
        completed: false,
        required: true,
      },
      {
        id: 'salon-tour',
        title: 'Salon Tour & Equipment',
        description: 'Learn about our workspace and tools',
        content: 'Take a virtual tour of our salon and learn about the equipment you\'ll be using daily.',
        type: 'video',
        duration: 10,
        completed: false,
        required: true,
      },
      {
        id: 'customer-service',
        title: 'Customer Service Excellence',
        description: 'Master the art of customer interaction',
        content: 'Learn our customer service standards and how to provide exceptional experiences.',
        type: 'interactive',
        duration: 15,
        completed: false,
        required: true,
      },
      {
        id: 'pos-system',
        title: 'POS System Training',
        description: 'Master our booking and payment systems',
        content: 'Complete hands-on training with our point-of-sale and booking systems.',
        type: 'interactive',
        duration: 15,
        completed: false,
        required: true,
      },
    ],
  },
  {
    id: 'advanced-techniques',
    title: 'Advanced Hair Cutting Techniques',
    description: 'Master advanced cutting techniques and styling methods',
    category: 'staff',
    difficulty: 'advanced',
    estimatedTime: 120,
    prerequisites: ['staff-onboarding'],
    skills: ['Advanced Cutting', 'Styling', 'Color Theory'],
    steps: [
      {
        id: 'precision-cutting',
        title: 'Precision Cutting Techniques',
        description: 'Learn advanced cutting methods for precision results',
        content: 'Master the art of precision cutting with various tools and techniques.',
        type: 'video',
        duration: 30,
        completed: false,
        required: true,
      },
      {
        id: 'modern-styles',
        title: 'Modern Men\'s Hairstyles',
        description: 'Stay current with trending men\'s hairstyles',
        content: 'Learn the latest trends and how to execute them professionally.',
        type: 'video',
        duration: 45,
        completed: false,
        required: true,
      },
      {
        id: 'beard-styling',
        title: 'Advanced Beard Styling',
        description: 'Master beard shaping and grooming techniques',
        content: 'Comprehensive training on beard design, shaping, and maintenance.',
        type: 'interactive',
        duration: 45,
        completed: false,
        required: true,
      },
    ],
  },
]

const customerTutorials: Tutorial[] = [
  {
    id: 'booking-basics',
    title: 'How to Book Your Appointment',
    description: 'Learn how to easily book and manage your appointments',
    category: 'customer',
    difficulty: 'beginner',
    estimatedTime: 10,
    prerequisites: [],
    skills: ['Online Booking', 'Appointment Management'],
    steps: [
      {
        id: 'create-account',
        title: 'Creating Your Account',
        description: 'Set up your customer profile for easy booking',
        content: 'Learn how to create your account and set up your profile preferences.',
        type: 'text',
        duration: 3,
        completed: false,
        required: true,
      },
      {
        id: 'service-selection',
        title: 'Choosing Your Service',
        description: 'Explore our range of services and find what\'s right for you',
        content: 'Discover our different service options and how to choose the perfect one.',
        type: 'interactive',
        duration: 4,
        completed: false,
        required: true,
      },
      {
        id: 'booking-process',
        title: 'The Booking Process',
        description: 'Step-by-step guide to booking your appointment',
        content: 'Follow along as we show you how to book your appointment seamlessly.',
        type: 'video',
        duration: 3,
        completed: false,
        required: true,
      },
    ],
  },
  {
    id: 'loyalty-program',
    title: 'Understanding Our Loyalty Program',
    description: 'Maximize your benefits with our rewards system',
    category: 'customer',
    difficulty: 'beginner',
    estimatedTime: 8,
    prerequisites: [],
    skills: ['Loyalty Program', 'Rewards System'],
    steps: [
      {
        id: 'program-overview',
        title: 'Program Overview',
        description: 'Learn how our loyalty program works',
        content: 'Understand the basics of our loyalty program and how to earn points.',
        type: 'text',
        duration: 2,
        completed: false,
        required: true,
      },
      {
        id: 'earning-points',
        title: 'Earning Loyalty Points',
        description: 'Discover all the ways to earn points',
        content: 'Learn about different ways to earn loyalty points with every visit.',
        type: 'interactive',
        duration: 3,
        completed: false,
        required: true,
      },
      {
        id: 'redeeming-rewards',
        title: 'Redeeming Your Rewards',
        description: 'How to use your points for great benefits',
        content: 'See how to redeem your accumulated points for services and perks.',
        type: 'video',
        duration: 3,
        completed: false,
        required: true,
      },
    ],
  },
]

interface TutorialSystemProps {
  userType: 'staff' | 'customer'
  userId: string
  className?: string
}

export function TutorialSystem({ userType, userId, className }: TutorialSystemProps) {
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(new Set())
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const tutorials = userType === 'staff' ? staffTutorials : customerTutorials

  const handleStartTutorial = (tutorial: Tutorial) => {
    setActiveTutorial(tutorial)
    setCurrentStep(0)
    setProgress(0)
  }

  const handleNextStep = () => {
    if (activeTutorial && currentStep < activeTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setProgress(((currentStep + 1) / activeTutorial.steps.length) * 100)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setProgress(((currentStep - 1) / activeTutorial.steps.length) * 100)
    }
  }

  const handleCompleteStep = () => {
    if (activeTutorial) {
      const updatedSteps = [...activeTutorial.steps]
      updatedSteps[currentStep].completed = true
      setActiveTutorial({ ...activeTutorial, steps: updatedSteps })

      if (currentStep === activeTutorial.steps.length - 1) {
        // Tutorial completed
        setCompletedTutorials(prev => new Set([...Array.from(prev), activeTutorial.id]))
        setActiveTutorial(null)
        setProgress(0)
      } else {
        handleNextStep()
      }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />
      case 'interactive': return <Target className="h-4 w-4" />
      case 'text': return <BookOpen className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  if (activeTutorial) {
    const step = activeTutorial.steps[currentStep]
    const isLastStep = currentStep === activeTutorial.steps.length - 1

    return (
      <Dialog open={true} onOpenChange={() => setActiveTutorial(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(step.type)}
                <div>
                  <h2 className="text-xl font-semibold">{step.title}</h2>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTutorial(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Step {currentStep + 1} of {activeTutorial.steps.length}</span>
                <span>{step.duration} min</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Content */}
            <div className="space-y-4">
              {step.type === 'video' && (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Play className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Video content would play here</p>
                  </div>
                </div>
              )}

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{step.content}</p>
              </div>

              {step.type === 'interactive' && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <Target className="h-8 w-8 mx-auto text-primary" />
                      <p className="text-muted-foreground">
                        Interactive exercise would be presented here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                {!isLastStep && (
                  <Button variant="outline" onClick={handleNextStep}>
                    Skip
                    <SkipForward className="h-4 w-4 ml-2" />
                  </Button>
                )}
                <Button onClick={handleCompleteStep}>
                  {isLastStep ? 'Complete Tutorial' : 'Mark Complete'}
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {userType === 'staff' ? 'Staff Training Center' : 'Customer Learning Hub'}
          </h1>
          <p className="text-muted-foreground">
            {userType === 'staff'
              ? 'Enhance your skills and stay updated with our comprehensive training programs'
              : 'Learn how to get the most out of your Modern Men experience'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            {completedTutorials.size} of {tutorials.length} completed
          </span>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span>{Math.round((completedTutorials.size / tutorials.length) * 100)}%</span>
            </div>
            <Progress value={(completedTutorials.size / tutorials.length) * 100} className="h-3" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{completedTutorials.size}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {tutorials.length - completedTutorials.size}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tutorials.reduce((acc, t) => acc + t.estimatedTime, 0)} min
                </div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutorial Categories */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Tutorials</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial) => (
              <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                    </div>
                    {completedTutorials.has(tutorial.id) && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(tutorial.difficulty)}>
                      {tutorial.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {tutorial.estimatedTime} min
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Skills */}
                    <div>
                      <div className="text-sm font-medium mb-2">Skills you'll learn:</div>
                      <div className="flex flex-wrap gap-1">
                        {tutorial.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Prerequisites */}
                    {tutorial.prerequisites.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Prerequisites:</div>
                        <div className="text-xs text-muted-foreground">
                          {tutorial.prerequisites.join(', ')}
                        </div>
                      </div>
                    )}

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {tutorial.steps.filter(s => s.completed).length}/{tutorial.steps.length}
                        </span>
                      </div>
                      <Progress
                        value={(tutorial.steps.filter(s => s.completed).length / tutorial.steps.length) * 100}
                        className="h-2"
                      />
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full"
                      onClick={() => handleStartTutorial(tutorial)}
                      disabled={tutorial.prerequisites.some(prereq => !completedTutorials.has(prereq))}
                    >
                      {completedTutorials.has(tutorial.id) ? (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Review Tutorial
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Tutorial
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {['beginner', 'intermediate', 'advanced'].map((level) => (
          <TabsContent key={level} value={level} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tutorials
                .filter(tutorial => tutorial.difficulty === level)
                .map((tutorial) => (
                  <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full"
                        onClick={() => handleStartTutorial(tutorial)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Tutorial
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
