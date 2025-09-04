// IoT Smart Salon Integration System
// Connected devices, environmental control, and automated salon operations

export interface SmartDevice {
  id: string
  name: string
  type: 'chair' | 'station' | 'mirror' | 'light' | 'climate' | 'music' | 'security' | 'sensor'
  category: 'equipment' | 'environment' | 'entertainment' | 'safety'
  location: {
    salonId: string
    area: string
    station?: string
    coordinates?: {
      x: number
      y: number
      z: number
    }
  }
  capabilities: string[]
  status: 'online' | 'offline' | 'maintenance' | 'error'
  lastSeen: Date
  firmware: {
    version: string
    lastUpdate: Date
    autoUpdate: boolean
  }
  sensors: Array<{
    type: string
    value: number
    unit: string
    threshold: {
      min: number
      max: number
      critical: {
        min: number
        max: number
      }
    }
  }>
  controls: Array<{
    name: string
    type: 'switch' | 'slider' | 'button' | 'color' | 'preset'
    value: any
    options?: any[]
    schedule?: {
      enabled: boolean
      rules: Array<{
        time: string
        value: any
        days: number[]
      }>
    }
  }>
}

export interface SalonEnvironment {
  temperature: {
    current: number
    target: number
    tolerance: number
    zones: Array<{
      id: string
      name: string
      temperature: number
      humidity: number
      occupancy: boolean
    }>
  }
  airQuality: {
    co2: number
    voc: number
    pm25: number
    humidity: number
    quality: 'excellent' | 'good' | 'fair' | 'poor'
  }
  lighting: {
    zones: Array<{
      id: string
      name: string
      brightness: number
      color: string
      scene: string
      occupancy: boolean
    }>
    scenes: Array<{
      name: string
      settings: Record<string, any>
      trigger?: 'time' | 'occupancy' | 'mood'
    }>
  }
  sound: {
    zones: Array<{
      id: string
      name: string
      volume: number
      source: string
      playlist?: string[]
    }>
    audio: {
      background: string
      announcements: boolean
      emergency: boolean
    }
  }
  security: {
    cameras: Array<{
      id: string
      name: string
      location: string
      status: 'active' | 'inactive'
      recording: boolean
      motion: boolean
    }>
    access: {
      doors: Array<{
        id: string
        name: string
        locked: boolean
        lastAccess: Date
      }>
      alarms: Array<{
        type: string
        triggered: boolean
        location: string
        timestamp?: Date
      }>
    }
  }
}

export interface ServiceAutomation {
  triggers: Array<{
    id: string
    name: string
    type: 'time' | 'occupancy' | 'service' | 'customer' | 'emergency'
    conditions: Record<string, any>
    actions: Array<{
      device: string
      command: string
      parameters: Record<string, any>
      delay?: number
    }>
  }>
  workflows: Array<{
    id: string
    name: string
    trigger: string
    steps: Array<{
      order: number
      device: string
      action: string
      duration?: number
      conditions?: Record<string, any>
    }>
    status: 'active' | 'inactive'
  }>
  schedules: Array<{
    id: string
    name: string
    type: 'daily' | 'weekly' | 'special'
    rules: Array<{
      time: string
      devices: string[]
      settings: Record<string, any>
      days?: number[]
    }>
  }>
}

export interface CustomerExperience {
  personalization: {
    customerId: string
    preferences: {
      lighting: string
      music: string
      temperature: number
      chair: string
      mirror: string
    }
    history: Array<{
      date: Date
      service: string
      settings: Record<string, any>
      satisfaction: number
    }>
  }
  atmosphere: {
    mood: 'relaxing' | 'energetic' | 'luxury' | 'casual' | 'celebration'
    theme: string
    lighting: Record<string, any>
    music: Record<string, any>
    scent?: string
  }
  comfort: {
    temperature: number
    humidity: number
    seating: string
    amenities: string[]
  }
  privacy: {
    screens: boolean
    curtains: boolean
    soundproofing: boolean
  }
}

export interface OperationalIntelligence {
  efficiency: {
    stationUtilization: Array<{
      stationId: string
      utilization: number
      peakHours: string[]
      idleTime: number
      revenue: number
    }>
    stylistPerformance: Array<{
      stylistId: string
      efficiency: number
      clientSatisfaction: number
      equipmentUsage: Record<string, number>
    }>
  }
  energy: {
    consumption: {
      electricity: number
      water: number
      gas: number
      total: number
    }
    optimization: {
      recommendations: string[]
      potentialSavings: number
      implementation: string[]
    }
  }
  maintenance: {
    schedule: Array<{
      deviceId: string
      type: 'preventive' | 'corrective' | 'upgrade'
      dueDate: Date
      priority: 'low' | 'medium' | 'high'
      estimatedCost: number
    }>
    alerts: Array<{
      deviceId: string
      issue: string
      severity: 'low' | 'medium' | 'high' | 'critical'
      timestamp: Date
    }>
  }
  inventory: {
    supplies: Array<{
      item: string
      current: number
      minimum: number
      autoReorder: boolean
      supplier: string
    }>
    equipment: Array<{
      device: string
      status: 'operational' | 'maintenance' | 'repair' | 'replacement'
      usage: number
      lifespan: number
    }>
  }
}

class SmartSalon {
  private readonly API_BASE = '/api/iot'
  private deviceConnections: Map<string, WebSocket> = new Map()
  private environmentMonitor: NodeJS.Timeout | null = null

  // Device Management
  async registerDevice(device: Omit<SmartDevice, 'id' | 'lastSeen'>): Promise<string> {
    try {
      const response = await fetch(`${this.API_BASE}/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device)
      })

      if (!response.ok) throw new Error('Failed to register device')
      const result = await response.json()
      return result.deviceId
    } catch (error) {
      console.error('Device registration failed:', error)
      throw error
    }
  }

  async updateDeviceStatus(
    deviceId: string,
    status: SmartDevice['status'],
    sensorData?: Record<string, number>
  ): Promise<void> {
    try {
      const update = {
        status,
        lastSeen: new Date(),
        ...(sensorData && { sensorData })
      }

      const response = await fetch(`${this.API_BASE}/devices/${deviceId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      })

      if (!response.ok) throw new Error('Failed to update device status')
    } catch (error) {
      console.error('Device status update failed:', error)
      throw error
    }
  }

  async controlDevice(
    deviceId: string,
    control: string,
    parameters: Record<string, any>
  ): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/devices/${deviceId}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          control,
          parameters
        })
      })

      if (!response.ok) throw new Error('Failed to control device')
      return await response.json()
    } catch (error) {
      console.error('Device control failed:', error)
      throw error
    }
  }

  // Environment Control
  async optimizeEnvironment(
    salonId: string,
    preferences: {
      targetTemperature: number
      targetHumidity: number
      lighting: string
      music: string
      occupancy: number
    }
  ): Promise<SalonEnvironment> {
    try {
      const response = await fetch(`${this.API_BASE}/environment/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          preferences
        })
      })

      if (!response.ok) throw new Error('Failed to optimize environment')
      return await response.json()
    } catch (error) {
      console.error('Environment optimization failed:', error)
      throw error
    }
  }

  async setLightingScene(
    salonId: string,
    scene: string,
    zones?: string[]
  ): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/lighting/scene`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          scene,
          zones
        })
      })

      if (!response.ok) throw new Error('Failed to set lighting scene')
    } catch (error) {
      console.error('Lighting scene setup failed:', error)
      throw error
    }
  }

  async controlAudioSystem(
    salonId: string,
    command: 'play' | 'pause' | 'volume' | 'playlist' | 'announcement',
    parameters: Record<string, any>
  ): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/audio/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          command,
          parameters
        })
      })

      if (!response.ok) throw new Error('Failed to control audio system')
    } catch (error) {
      console.error('Audio control failed:', error)
      throw error
    }
  }

  // Service Automation
  async createAutomationTrigger(
    salonId: string,
    trigger: Omit<ServiceAutomation['triggers'][0], 'id'>
  ): Promise<string> {
    try {
      const response = await fetch(`${this.API_BASE}/automation/triggers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          trigger
        })
      })

      if (!response.ok) throw new Error('Failed to create automation trigger')
      const result = await response.json()
      return result.triggerId
    } catch (error) {
      console.error('Automation trigger creation failed:', error)
      throw error
    }
  }

  async createServiceWorkflow(
    salonId: string,
    workflow: Omit<ServiceAutomation['workflows'][0], 'id'>
  ): Promise<string> {
    try {
      const response = await fetch(`${this.API_BASE}/automation/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          workflow
        })
      })

      if (!response.ok) throw new Error('Failed to create service workflow')
      const result = await response.json()
      return result.workflowId
    } catch (error) {
      console.error('Service workflow creation failed:', error)
      throw error
    }
  }

  // Customer Experience Personalization
  async personalizeExperience(
    customerId: string,
    serviceType: string,
    preferences?: Partial<CustomerExperience['personalization']['preferences']>
  ): Promise<CustomerExperience> {
    try {
      const response = await fetch(`${this.API_BASE}/experience/personalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          serviceType,
          preferences
        })
      })

      if (!response.ok) throw new Error('Failed to personalize experience')
      return await response.json()
    } catch (error) {
      console.error('Experience personalization failed:', error)
      throw error
    }
  }

  async setAtmosphere(
    salonId: string,
    stationId: string,
    atmosphere: CustomerExperience['atmosphere']
  ): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/atmosphere/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          stationId,
          atmosphere
        })
      })

      if (!response.ok) throw new Error('Failed to set atmosphere')
    } catch (error) {
      console.error('Atmosphere setting failed:', error)
      throw error
    }
  }

  // Operational Intelligence
  async getOperationalIntelligence(
    salonId: string,
    period: { start: Date; end: Date }
  ): Promise<OperationalIntelligence> {
    try {
      const params = new URLSearchParams({
        start: period.start.toISOString(),
        end: period.end.toISOString()
      })

      const response = await fetch(`${this.API_BASE}/intelligence/${salonId}?${params}`)
      if (!response.ok) throw new Error('Failed to get operational intelligence')

      return await response.json()
    } catch (error) {
      console.error('Operational intelligence retrieval failed:', error)
      throw error
    }
  }

  async scheduleMaintenance(
    deviceId: string,
    type: 'preventive' | 'corrective' | 'upgrade',
    schedule: {
      dueDate: Date
      priority: 'low' | 'medium' | 'high'
      description: string
      estimatedCost: number
      parts?: string[]
    }
  ): Promise<string> {
    try {
      const response = await fetch(`${this.API_BASE}/maintenance/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          type,
          schedule
        })
      })

      if (!response.ok) throw new Error('Failed to schedule maintenance')
      const result = await response.json()
      return result.maintenanceId
    } catch (error) {
      console.error('Maintenance scheduling failed:', error)
      throw error
    }
  }

  // Real-time Monitoring
  startRealtimeMonitoring(salonId: string): void {
    if (this.environmentMonitor) {
      clearInterval(this.environmentMonitor)
    }

    this.environmentMonitor = setInterval(async () => {
      try {
        await this.monitorEnvironment(salonId)
        await this.checkDeviceHealth(salonId)
        await this.optimizeEnergyUsage(salonId)
      } catch (error) {
        console.error('Real-time monitoring error:', error)
      }
    }, 30000) // Every 30 seconds
  }

  stopRealtimeMonitoring(): void {
    if (this.environmentMonitor) {
      clearInterval(this.environmentMonitor)
      this.environmentMonitor = null
    }
  }

  private async monitorEnvironment(salonId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/environment/monitor/${salonId}`)
      if (!response.ok) throw new Error('Failed to monitor environment')

      const data = await response.json()

      // Auto-adjust environment if needed
      if (data.temperature.current > data.temperature.target + 2) {
        await this.controlDevice('climate_control', 'cool', {
          target: data.temperature.target
        })
      }

      // Emit environment data
      window.dispatchEvent(new CustomEvent('environment_update', {
        detail: data
      }))
    } catch (error) {
      console.error('Environment monitoring failed:', error)
    }
  }

  private async checkDeviceHealth(salonId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/devices/health/${salonId}`)
      if (!response.ok) throw new Error('Failed to check device health')

      const healthData = await response.json()

      // Alert on critical issues
      healthData.alerts.forEach((alert: any) => {
        if (alert.severity === 'critical') {
          window.dispatchEvent(new CustomEvent('device_alert', {
            detail: alert
          }))
        }
      })
    } catch (error) {
      console.error('Device health check failed:', error)
    }
  }

  private async optimizeEnergyUsage(salonId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/energy/optimize/${salonId}`)
      if (!response.ok) throw new Error('Failed to optimize energy usage')

      const optimizations = await response.json()

      // Apply energy optimizations
      optimizations.forEach(async (opt: any) => {
        if (opt.automate) {
          await this.controlDevice(opt.deviceId, opt.action, opt.parameters)
        }
      })
    } catch (error) {
      console.error('Energy optimization failed:', error)
    }
  }

  // Security Integration
  async monitorSecurity(
    salonId: string,
    cameras: boolean = true,
    sensors: boolean = true
  ): Promise<{
    alerts: Array<{
      type: string
      severity: string
      message: string
      location: string
      timestamp: Date
    }>
    status: {
      cameras: 'active' | 'inactive'
      sensors: 'active' | 'inactive'
      alarms: 'armed' | 'disarmed'
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/security/monitor/${salonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cameras, sensors })
      })

      if (!response.ok) throw new Error('Failed to monitor security')
      const result = await response.json()

      return {
        ...result,
        alerts: result.alerts.map((alert: any) => ({
          ...alert,
          timestamp: new Date(alert.timestamp)
        }))
      }
    } catch (error) {
      console.error('Security monitoring failed:', error)
      throw error
    }
  }

  async emergencyProtocol(
    salonId: string,
    type: 'fire' | 'medical' | 'security' | 'evacuation',
    location?: string
  ): Promise<{
    protocol: string
    actions: Array<{
      device: string
      action: string
      priority: string
    }>
    notifications: Array<{
      type: string
      message: string
      recipients: string[]
    }>
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/emergency/${salonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          location
        })
      })

      if (!response.ok) throw new Error('Failed to execute emergency protocol')
      return await response.json()
    } catch (error) {
      console.error('Emergency protocol execution failed:', error)
      throw error
    }
  }

  // Device Connection Management
  connectDevice(deviceId: string, protocol: 'websocket' | 'mqtt' | 'http'): Promise<WebSocket | null> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${this.API_BASE.replace('http', 'ws')}/devices/${deviceId}/connect`

        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
          this.deviceConnections.set(deviceId, ws)
          resolve(ws)
        }

        ws.onerror = (error) => {
          reject(error)
        }

        ws.onclose = () => {
          this.deviceConnections.delete(deviceId)
        }

        // Set timeout
        setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            ws.close()
            reject(new Error('Connection timeout'))
          }
        }, 10000)

      } catch (error) {
        reject(error)
      }
    })
  }

  disconnectDevice(deviceId: string): void {
    const connection = this.deviceConnections.get(deviceId)
    if (connection) {
      connection.close()
      this.deviceConnections.delete(deviceId)
    }
  }

  // Bulk Operations
  async bulkDeviceControl(
    deviceIds: string[],
    command: string,
    parameters: Record<string, any>
  ): Promise<Array<{
    deviceId: string
    success: boolean
    result?: any
    error?: string
  }>> {
    try {
      const response = await fetch(`${this.API_BASE}/devices/bulk-control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceIds,
          command,
          parameters
        })
      })

      if (!response.ok) throw new Error('Failed to execute bulk device control')
      return await response.json()
    } catch (error) {
      console.error('Bulk device control failed:', error)
      throw error
    }
  }

  // Analytics and Reporting
  async generateDeviceReport(
    salonId: string,
    deviceType?: string,
    period: { start: Date; end: Date } = {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    }
  ): Promise<{
    summary: {
      totalDevices: number
      activeDevices: number
      maintenanceRequired: number
      energyConsumption: number
    }
    deviceStats: Array<{
      deviceId: string
      type: string
      uptime: number
      utilization: number
      alerts: number
      energyUsage: number
    }>
    recommendations: Array<{
      priority: 'low' | 'medium' | 'high'
      recommendation: string
      impact: string
      cost: number
    }>
  }> {
    try {
      const params = new URLSearchParams({
        start: period.start.toISOString(),
        end: period.end.toISOString(),
        ...(deviceType && { type: deviceType })
      })

      const response = await fetch(`${this.API_BASE}/reports/devices/${salonId}?${params}`)
      if (!response.ok) throw new Error('Failed to generate device report')

      return await response.json()
    } catch (error) {
      console.error('Device report generation failed:', error)
      throw error
    }
  }
}

export const smartSalon = new SmartSalon()

// React Hook for Smart Salon
export function useSmartSalon() {
  return {
    registerDevice: smartSalon.registerDevice.bind(smartSalon),
    updateDeviceStatus: smartSalon.updateDeviceStatus.bind(smartSalon),
    controlDevice: smartSalon.controlDevice.bind(smartSalon),
    optimizeEnvironment: smartSalon.optimizeEnvironment.bind(smartSalon),
    setLightingScene: smartSalon.setLightingScene.bind(smartSalon),
    controlAudioSystem: smartSalon.controlAudioSystem.bind(smartSalon),
    createAutomationTrigger: smartSalon.createAutomationTrigger.bind(smartSalon),
    createServiceWorkflow: smartSalon.createServiceWorkflow.bind(smartSalon),
    personalizeExperience: smartSalon.personalizeExperience.bind(smartSalon),
    setAtmosphere: smartSalon.setAtmosphere.bind(smartSalon),
    getOperationalIntelligence: smartSalon.getOperationalIntelligence.bind(smartSalon),
    scheduleMaintenance: smartSalon.scheduleMaintenance.bind(smartSalon),
    startRealtimeMonitoring: smartSalon.startRealtimeMonitoring.bind(smartSalon),
    stopRealtimeMonitoring: smartSalon.stopRealtimeMonitoring.bind(smartSalon),
    monitorSecurity: smartSalon.monitorSecurity.bind(smartSalon),
    emergencyProtocol: smartSalon.emergencyProtocol.bind(smartSalon),
    connectDevice: smartSalon.connectDevice.bind(smartSalon),
    disconnectDevice: smartSalon.disconnectDevice.bind(smartSalon),
    bulkDeviceControl: smartSalon.bulkDeviceControl.bind(smartSalon),
    generateDeviceReport: smartSalon.generateDeviceReport.bind(smartSalon)
  }
}
