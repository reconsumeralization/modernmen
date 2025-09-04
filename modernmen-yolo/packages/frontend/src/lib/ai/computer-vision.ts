// Advanced Computer Vision System for Salon Intelligence
// AI-powered visual analysis for service quality, style recognition, and customer insights

export interface HairAnalysis {
  style: {
    type: 'cut' | 'color' | 'treatment' | 'styling'
    confidence: number
    details: {
      length: number
      layers: number
      texture: 'straight' | 'wavy' | 'curly' | 'coily'
      density: 'fine' | 'medium' | 'thick'
      condition: 'damaged' | 'healthy' | 'oily' | 'dry'
    }
  }
  color: {
    baseColor: string
    highlights: string[]
    lowlights: string[]
    toner: string
    coverage: number
    health: number
  }
  face: {
    shape: 'oval' | 'round' | 'square' | 'heart' | 'diamond'
    features: {
      forehead: number
      cheekbones: number
      jawline: number
      neck: number
    }
    symmetry: number
    proportions: Record<string, number>
  }
  recommendations: {
    idealStyles: Array<{
      name: string
      confidence: number
      reasoning: string
      maintenance: string[]
    }>
    colorSuggestions: Array<{
      palette: string[]
      season: string
      reasoning: string
    }>
    treatmentPlan: Array<{
      treatment: string
      frequency: string
      expectedResults: string
    }>
  }
}

export interface ServiceQualityAssessment {
  stylist: {
    technique: number
    precision: number
    consistency: number
    creativity: number
    overallScore: number
  }
  service: {
    beforeAfter: {
      improvement: number
      symmetry: number
      cleanliness: number
      styling: number
    }
    customerSatisfaction: {
      predicted: number
      confidence: number
    }
  }
  qualityMetrics: {
    cutPrecision: number
    colorUniformity: number
    stylingQuality: number
    overallFinish: number
  }
  feedback: {
    strengths: string[]
    improvements: string[]
    suggestions: string[]
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F'
  }
}

export interface StyleRecognition {
  currentStyle: {
    name: string
    category: string
    confidence: number
    similarStyles: string[]
  }
  trendAnalysis: {
    trending: boolean
    popularity: number
    seasonalFit: number
    demographicMatch: string[]
  }
  inspiration: {
    similarCelebrities: Array<{
      name: string
      style: string
      match: number
    }>
    runwayTrends: Array<{
      season: string
      style: string
      relevance: number
    }>
  }
  customization: {
    modifications: Array<{
      change: string
      impact: string
      difficulty: 'easy' | 'medium' | 'hard'
    }>
    personalization: Array<{
      feature: string
      preference: string
      reasoning: string
    }>
  }
}

export interface VirtualTryOn {
  hairModel: {
    baseStyle: string
    color: string
    texture: string
    length: number
  }
  tryOnResults: Array<{
    styleId: string
    styleName: string
    previewImage: string
    confidence: number
    customerFit: number
    maintenance: string
    cost: number
  }>
  faceAnalysis: {
    skinTone: string
    undertone: 'warm' | 'cool' | 'neutral'
    contrast: number
    features: Record<string, any>
  }
  recommendations: {
    bestMatches: string[]
    seasonalSuggestions: string[]
    occasionBased: Record<string, string[]>
  }
}

export interface SalonAnalytics {
  customerFlow: {
    heatmap: Array<{
      area: string
      traffic: number
      dwellTime: number
      conversion: number
    }>
    bottlenecks: Array<{
      location: string
      issue: string
      impact: number
      solution: string
    }>
  }
  serviceEfficiency: {
    stationUtilization: Array<{
      stationId: string
      utilization: number
      idleTime: number
      peakHours: string[]
    }>
    stylistPerformance: Array<{
      stylistId: string
      efficiency: number
      customerSatisfaction: number
      techniqueScore: number
    }>
  }
  qualityControl: {
    standardsCompliance: number
    consistencyScore: number
    improvementAreas: string[]
    bestPractices: string[]
  }
}

class ComputerVisionEngine {
  private readonly API_BASE = '/api/ai/vision'

  // Hair Analysis & Style Recognition
  async analyzeHair(imageData: string | File): Promise<HairAnalysis> {
    try {
      const formData = new FormData()
      if (typeof imageData === 'string') {
        // Convert base64 to blob
        const response = await fetch(imageData)
        const blob = await response.blob()
        formData.append('image', blob)
      } else {
        formData.append('image', imageData)
      }

      const response = await fetch(`${this.API_BASE}/analyze-hair`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to analyze hair')
      const analysis = await response.json()

      return {
        style: analysis.style,
        color: analysis.color,
        face: analysis.face,
        recommendations: {
          idealStyles: analysis.recommendations.idealStyles,
          colorSuggestions: analysis.recommendations.colorSuggestions,
          treatmentPlan: analysis.recommendations.treatmentPlan
        }
      }
    } catch (error) {
      console.error('Hair analysis failed:', error)
      throw error
    }
  }

  // Service Quality Assessment
  async assessServiceQuality(
    beforeImage: string | File,
    afterImage: string | File,
    serviceType: string
  ): Promise<ServiceQualityAssessment> {
    try {
      const formData = new FormData()

      // Handle before image
      if (typeof beforeImage === 'string') {
        const response = await fetch(beforeImage)
        const blob = await response.blob()
        formData.append('beforeImage', blob)
      } else {
        formData.append('beforeImage', beforeImage)
      }

      // Handle after image
      if (typeof afterImage === 'string') {
        const response = await fetch(afterImage)
        const blob = await response.blob()
        formData.append('afterImage', blob)
      } else {
        formData.append('afterImage', afterImage)
      }

      formData.append('serviceType', serviceType)

      const response = await fetch(`${this.API_BASE}/assess-service`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to assess service quality')
      return await response.json()
    } catch (error) {
      console.error('Service quality assessment failed:', error)
      throw error
    }
  }

  // Style Recognition & Trend Analysis
  async recognizeStyle(imageData: string | File): Promise<StyleRecognition> {
    try {
      const formData = new FormData()
      if (typeof imageData === 'string') {
        const response = await fetch(imageData)
        const blob = await response.blob()
        formData.append('image', blob)
      } else {
        formData.append('image', imageData)
      }

      const response = await fetch(`${this.API_BASE}/recognize-style`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to recognize style')
      return await response.json()
    } catch (error) {
      console.error('Style recognition failed:', error)
      throw error
    }
  }

  // Virtual Try-On System
  async virtualTryOn(
    faceImage: string | File,
    stylePreferences: {
      style: string
      color: string
      length: number
    }
  ): Promise<VirtualTryOn> {
    try {
      const formData = new FormData()

      if (typeof faceImage === 'string') {
        const response = await fetch(faceImage)
        const blob = await response.blob()
        formData.append('faceImage', blob)
      } else {
        formData.append('faceImage', faceImage)
      }

      formData.append('preferences', JSON.stringify(stylePreferences))

      const response = await fetch(`${this.API_BASE}/virtual-tryon`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to perform virtual try-on')
      return await response.json()
    } catch (error) {
      console.error('Virtual try-on failed:', error)
      throw error
    }
  }

  // Salon Analytics & Monitoring
  async analyzeSalonOperations(
    cameraFeeds: Array<{
      cameraId: string
      stream: MediaStream | string
      area: string
    }>,
    timeRange: { start: Date; end: Date }
  ): Promise<SalonAnalytics> {
    try {
      const analysisPromises = cameraFeeds.map(async (feed) => {
        const formData = new FormData()

        if (typeof feed.stream === 'string') {
          const response = await fetch(feed.stream)
          const blob = await response.blob()
          formData.append('video', blob)
        } else {
          // Handle MediaStream
          const mediaRecorder = new MediaRecorder(feed.stream)
          const chunks: Blob[] = []

          return new Promise((resolve) => {
            mediaRecorder.ondataavailable = (event) => {
              chunks.push(event.data)
            }

            mediaRecorder.onstop = async () => {
              const blob = new Blob(chunks, { type: 'video/webm' })
              formData.append('video', blob)
              formData.append('area', feed.area)
              formData.append('startTime', timeRange.start.toISOString())
              formData.append('endTime', timeRange.end.toISOString())

              const response = await fetch(`${this.API_BASE}/analyze-salon`, {
                method: 'POST',
                body: formData
              })

              if (response.ok) {
                resolve(await response.json())
              } else {
                resolve(null)
              }
            }

            mediaRecorder.start()
            setTimeout(() => mediaRecorder.stop(), 30000) // 30 second sample
          })
        }
      })

      const results = await Promise.all(analysisPromises)
      const validResults = results.filter(result => result !== null)

      // Aggregate results
      return {
        customerFlow: {
          heatmap: validResults.flatMap(r => r.customerFlow?.heatmap || []),
          bottlenecks: validResults.flatMap(r => r.customerFlow?.bottlenecks || [])
        },
        serviceEfficiency: {
          stationUtilization: validResults.flatMap(r => r.serviceEfficiency?.stationUtilization || []),
          stylistPerformance: validResults.flatMap(r => r.serviceEfficiency?.stylistPerformance || [])
        },
        qualityControl: validResults[0]?.qualityControl || {
          standardsCompliance: 0,
          consistencyScore: 0,
          improvementAreas: [],
          bestPractices: []
        }
      }
    } catch (error) {
      console.error('Salon analysis failed:', error)
      throw error
    }
  }

  // Real-time Quality Monitoring
  async monitorServiceRealtime(
    cameraStream: MediaStream,
    stylistId: string,
    serviceType: string
  ): Promise<{
    qualityScore: number
    feedback: string[]
    suggestions: string[]
    alerts: Array<{
      type: 'warning' | 'critical'
      message: string
      action: string
    }>
  }> {
    try {
      // Set up real-time video analysis
      const mediaRecorder = new MediaRecorder(cameraStream, {
        mimeType: 'video/webm;codecs=vp9'
      })

      const chunks: Blob[] = []

      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = async (event) => {
          chunks.push(event.data)

          // Send chunk for analysis every 5 seconds
          if (chunks.length >= 5) {
            const blob = new Blob(chunks.splice(0), { type: 'video/webm' })
            const formData = new FormData()
            formData.append('videoChunk', blob)
            formData.append('stylistId', stylistId)
            formData.append('serviceType', serviceType)

            try {
              const response = await fetch(`${this.API_BASE}/realtime-monitor`, {
                method: 'POST',
                body: formData
              })

              if (response.ok) {
                const result = await response.json()
                resolve(result)
              }
            } catch (error) {
              console.error('Real-time monitoring failed:', error)
            }
          }
        }

        mediaRecorder.onerror = (error) => {
          reject(error)
        }

        mediaRecorder.start(1000) // Collect data every second

        // Stop after 30 seconds for demo
        setTimeout(() => {
          mediaRecorder.stop()
        }, 30000)
      })
    } catch (error) {
      console.error('Real-time monitoring setup failed:', error)
      throw error
    }
  }

  // Image Enhancement & Processing
  async enhanceImage(
    imageData: string | File,
    enhancements: {
      brightness?: number
      contrast?: number
      saturation?: number
      sharpen?: boolean
      denoise?: boolean
      colorCorrect?: boolean
    }
  ): Promise<{
    enhancedImage: string
    improvements: string[]
    quality: {
      before: number
      after: number
      gains: string[]
    }
  }> {
    try {
      const formData = new FormData()

      if (typeof imageData === 'string') {
        const response = await fetch(imageData)
        const blob = await response.blob()
        formData.append('image', blob)
      } else {
        formData.append('image', imageData)
      }

      formData.append('enhancements', JSON.stringify(enhancements))

      const response = await fetch(`${this.API_BASE}/enhance-image`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to enhance image')
      return await response.json()
    } catch (error) {
      console.error('Image enhancement failed:', error)
      throw error
    }
  }

  // Style Recommendation Engine
  async recommendStyles(
    customerData: {
      faceShape: string
      hairType: string
      lifestyle: string
      occasion: string
      preferences: string[]
    },
    currentTrends: string[]
  ): Promise<{
    recommendations: Array<{
      styleId: string
      styleName: string
      matchScore: number
      reasoning: string[]
      maintenance: string[]
      cost: number
      time: number
    }>
    seasonalTrends: Array<{
      trend: string
      relevance: number
      styles: string[]
    }>
    personalization: {
      uniqueFeatures: string[]
      customizations: string[]
      complementaryServices: string[]
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/recommend-styles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerData,
          currentTrends
        })
      })

      if (!response.ok) throw new Error('Failed to recommend styles')
      return await response.json()
    } catch (error) {
      console.error('Style recommendation failed:', error)
      throw error
    }
  }

  // Beauty Analysis & Consultation
  async beautyConsultation(
    images: Array<{
      type: 'face' | 'hair' | 'skin' | 'body'
      image: string | File
      angle?: string
    }>,
    customerProfile: {
      age: number
      gender: string
      skinType: string
      concerns: string[]
      goals: string[]
      budget: number
      timeCommitment: string
    }
  ): Promise<{
    analysis: {
      skinHealth: number
      hairCondition: number
      overallBeauty: number
      concerns: Array<{
        issue: string
        severity: number
        recommendations: string[]
      }>
    }
    treatmentPlan: Array<{
      phase: string
      treatments: Array<{
        name: string
        frequency: string
        duration: number
        cost: number
        expectedResults: string
      }>
      timeline: string
      budget: number
    }>
    lifestyle: {
      recommendations: string[]
      supplements: string[]
      habits: string[]
      tracking: string[]
    }
    progress: {
      currentScore: number
      targetScore: number
      timeline: string
      milestones: Array<{
        month: number
        expectedImprovement: number
        keyActions: string[]
      }>
    }
  }> {
    try {
      const formData = new FormData()

      images.forEach((img, index) => {
        if (typeof img.image === 'string') {
          // Convert base64 to blob and append
          fetch(img.image).then(response => response.blob()).then(blob => {
            formData.append(`image_${index}`, blob)
            formData.append(`image_${index}_type`, img.type)
            if (img.angle) formData.append(`image_${index}_angle`, img.angle)
          })
        } else {
          formData.append(`image_${index}`, img.image)
          formData.append(`image_${index}_type`, img.type)
          if (img.angle) formData.append(`image_${index}_angle`, img.angle)
        }
      })

      formData.append('customerProfile', JSON.stringify(customerProfile))

      const response = await fetch(`${this.API_BASE}/beauty-consultation`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to perform beauty consultation')
      return await response.json()
    } catch (error) {
      console.error('Beauty consultation failed:', error)
      throw error
    }
  }
}

export const computerVisionEngine = new ComputerVisionEngine()

// React Hook for Computer Vision
export function useComputerVision() {
  return {
    analyzeHair: computerVisionEngine.analyzeHair.bind(computerVisionEngine),
    assessServiceQuality: computerVisionEngine.assessServiceQuality.bind(computerVisionEngine),
    recognizeStyle: computerVisionEngine.recognizeStyle.bind(computerVisionEngine),
    virtualTryOn: computerVisionEngine.virtualTryOn.bind(computerVisionEngine),
    analyzeSalonOperations: computerVisionEngine.analyzeSalonOperations.bind(computerVisionEngine),
    monitorServiceRealtime: computerVisionEngine.monitorServiceRealtime.bind(computerVisionEngine),
    enhanceImage: computerVisionEngine.enhanceImage.bind(computerVisionEngine),
    recommendStyles: computerVisionEngine.recommendStyles.bind(computerVisionEngine),
    beautyConsultation: computerVisionEngine.beautyConsultation.bind(computerVisionEngine)
  }
}
