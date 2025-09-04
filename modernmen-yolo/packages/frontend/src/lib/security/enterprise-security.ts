// Enterprise Security & Compliance Management System
// Advanced authentication, authorization, audit trails, and regulatory compliance

export interface SecurityProfile {
  id: string
  userId: string
  role: 'admin' | 'manager' | 'staff' | 'customer'
  permissions: string[]
  mfa: {
    enabled: boolean
    method: 'app' | 'sms' | 'email' | 'hardware'
    backupCodes: string[]
    lastUsed: Date
  }
  session: {
    maxConcurrent: number
    timeout: number // minutes
    requireReauth: boolean
  }
  access: {
    ipWhitelist: string[]
    deviceRestrictions: string[]
    locationRestrictions: string[]
    timeRestrictions: {
      allowedHours: [number, number] // [start, end] in 24h format
      allowedDays: number[] // 0-6, Sunday = 0
    }
  }
  audit: {
    logLevel: 'basic' | 'detailed' | 'full'
    retentionDays: number
    alertOnSuspicious: boolean
  }
}

export interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  action: string
  resource: string
  resourceId: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  ipAddress: string
  userAgent: string
  location: {
    country: string
    region: string
    city: string
  }
  success: boolean
  errorMessage?: string
  changes?: {
    before: any
    after: any
  }
  metadata: Record<string, any>
}

export interface SecurityIncident {
  id: string
  type: 'brute_force' | 'suspicious_login' | 'data_breach' | 'unauthorized_access' | 'policy_violation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'resolved' | 'false_positive'
  detectedAt: Date
  resolvedAt?: Date
  userId?: string
  ipAddress: string
  location: {
    country: string
    region: string
    city: string
  }
  description: string
  evidence: string[]
  actions: Array<{
    timestamp: Date
    action: string
    userId: string
    notes: string
  }>
  impact: {
    affectedUsers: number
    dataCompromised: string[]
    financialImpact: number
  }
}

export interface ComplianceReport {
  id: string
  standard: 'GDPR' | 'CCPA' | 'HIPAA' | 'PCI_DSS' | 'SOX' | 'ISO27001'
  period: {
    start: Date
    end: Date
  }
  status: 'compliant' | 'non_compliant' | 'partial' | 'under_review'
  score: number // 0-100
  findings: Array<{
    category: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    evidence: string
    remediation: string
    dueDate: Date
  }>
  controls: Array<{
    controlId: string
    name: string
    status: 'implemented' | 'partial' | 'not_implemented'
    evidence: string
    lastTested: Date
  }>
  recommendations: Array<{
    priority: 'low' | 'medium' | 'high' | 'critical'
    recommendation: string
    timeline: string
    cost: number
    expectedImpact: string
  }>
}

export interface DataEncryption {
  algorithm: 'AES-256' | 'RSA-2048' | 'ChaCha20'
  keyRotation: {
    enabled: boolean
    frequency: number // days
    lastRotation: Date
    nextRotation: Date
  }
  encryptedFields: string[]
  backupEncryption: boolean
  transitEncryption: boolean
  keyManagement: {
    provider: 'local' | 'aws_kms' | 'azure_keyvault' | 'gcp_kms'
    keyId: string
    lastAccess: Date
  }
}

class EnterpriseSecurity {
  private readonly API_BASE = '/api/security'

  // Security Profile Management
  async getSecurityProfile(userId: string): Promise<SecurityProfile> {
    try {
      const response = await fetch(`${this.API_BASE}/profiles/${userId}`)
      if (!response.ok) throw new Error('Failed to get security profile')

      const profile = await response.json()
      return {
        ...profile,
        mfa: {
          ...profile.mfa,
          lastUsed: new Date(profile.mfa.lastUsed)
        }
      }
    } catch (error) {
      console.error('Failed to get security profile:', error)
      throw error
    }
  }

  async updateSecurityProfile(
    userId: string,
    updates: Partial<SecurityProfile>
  ): Promise<SecurityProfile> {
    try {
      const response = await fetch(`${this.API_BASE}/profiles/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to update security profile')
      const profile = await response.json()

      return {
        ...profile,
        mfa: {
          ...profile.mfa,
          lastUsed: new Date(profile.mfa.lastUsed)
        }
      }
    } catch (error) {
      console.error('Failed to update security profile:', error)
      throw error
    }
  }

  // Multi-Factor Authentication
  async setupMFA(
    userId: string,
    method: 'app' | 'sms' | 'email' | 'hardware'
  ): Promise<{
    secret?: string
    qrCode?: string
    backupCodes: string[]
    verificationCode?: string
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/mfa/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          method
        })
      })

      if (!response.ok) throw new Error('Failed to setup MFA')
      return await response.json()
    } catch (error) {
      console.error('Failed to setup MFA:', error)
      throw error
    }
  }

  async verifyMFA(
    userId: string,
    code: string,
    method: string
  ): Promise<{
    success: boolean
    backupCodes?: string[]
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/mfa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          code,
          method
        })
      })

      if (!response.ok) throw new Error('Failed to verify MFA')
      return await response.json()
    } catch (error) {
      console.error('Failed to verify MFA:', error)
      throw error
    }
  }

  // Audit Logging
  async getAuditLogs(
    filters: {
      userId?: string
      action?: string
      resource?: string
      startDate?: Date
      endDate?: Date
      ipAddress?: string
      success?: boolean
    },
    pagination: {
      page: number
      limit: number
    }
  ): Promise<{
    logs: AuditLog[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const params = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof Date) {
            params.append(key, value.toISOString())
          } else {
            params.append(key, value.toString())
          }
        }
      })

      params.append('page', pagination.page.toString())
      params.append('limit', pagination.limit.toString())

      const response = await fetch(`${this.API_BASE}/audit?${params}`)
      if (!response.ok) throw new Error('Failed to get audit logs')

      const result = await response.json()
      return {
        ...result,
        logs: result.logs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }))
      }
    } catch (error) {
      console.error('Failed to get audit logs:', error)
      throw error
    }
  }

  // Security Incident Management
  async reportSecurityIncident(
    incident: Omit<SecurityIncident, 'id' | 'detectedAt' | 'status'>
  ): Promise<SecurityIncident> {
    try {
      const response = await fetch(`${this.API_BASE}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident)
      })

      if (!response.ok) throw new Error('Failed to report security incident')
      const reportedIncident = await response.json()

      return {
        ...reportedIncident,
        detectedAt: new Date(reportedIncident.detectedAt),
        resolvedAt: reportedIncident.resolvedAt ? new Date(reportedIncident.resolvedAt) : undefined,
        actions: reportedIncident.actions.map((action: any) => ({
          ...action,
          timestamp: new Date(action.timestamp)
        }))
      }
    } catch (error) {
      console.error('Failed to report security incident:', error)
      throw error
    }
  }

  async getSecurityIncidents(
    status?: string,
    severity?: string
  ): Promise<SecurityIncident[]> {
    try {
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      if (severity) params.append('severity', severity)

      const response = await fetch(`${this.API_BASE}/incidents?${params}`)
      if (!response.ok) throw new Error('Failed to get security incidents')

      const incidents = await response.json()
      return incidents.map((incident: any) => ({
        ...incident,
        detectedAt: new Date(incident.detectedAt),
        resolvedAt: incident.resolvedAt ? new Date(incident.resolvedAt) : undefined,
        actions: incident.actions.map((action: any) => ({
          ...action,
          timestamp: new Date(action.timestamp)
        }))
      }))
    } catch (error) {
      console.error('Failed to get security incidents:', error)
      throw error
    }
  }

  // Compliance Management
  async generateComplianceReport(
    standard: 'GDPR' | 'CCPA' | 'HIPAA' | 'PCI_DSS' | 'SOX' | 'ISO27001',
    period: { start: Date; end: Date }
  ): Promise<ComplianceReport> {
    try {
      const response = await fetch(`${this.API_BASE}/compliance/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standard,
          period
        })
      })

      if (!response.ok) throw new Error('Failed to generate compliance report')
      const report = await response.json()

      return {
        ...report,
        period: {
          start: new Date(report.period.start),
          end: new Date(report.period.end)
        },
        findings: report.findings.map((finding: any) => ({
          ...finding,
          dueDate: new Date(finding.dueDate)
        })),
        controls: report.controls.map((control: any) => ({
          ...control,
          lastTested: new Date(control.lastTested)
        }))
      }
    } catch (error) {
      console.error('Failed to generate compliance report:', error)
      throw error
    }
  }

  // Data Encryption Management
  async getEncryptionStatus(): Promise<DataEncryption> {
    try {
      const response = await fetch(`${this.API_BASE}/encryption/status`)
      if (!response.ok) throw new Error('Failed to get encryption status')

      const status = await response.json()
      return {
        ...status,
        keyRotation: {
          ...status.keyRotation,
          lastRotation: new Date(status.keyRotation.lastRotation),
          nextRotation: new Date(status.keyRotation.nextRotation)
        },
        keyManagement: {
          ...status.keyManagement,
          lastAccess: new Date(status.keyManagement.lastAccess)
        }
      }
    } catch (error) {
      console.error('Failed to get encryption status:', error)
      throw error
    }
  }

  async rotateEncryptionKeys(): Promise<{
    success: boolean
    newKeyId: string
    rotatedAt: Date
    affectedRecords: number
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/encryption/rotate-keys`, {
        method: 'POST'
      })

      if (!response.ok) throw new Error('Failed to rotate encryption keys')
      const result = await response.json()

      return {
        ...result,
        rotatedAt: new Date(result.rotatedAt)
      }
    } catch (error) {
      console.error('Failed to rotate encryption keys:', error)
      throw error
    }
  }

  // Threat Detection
  async getThreatIntelligence(): Promise<{
    threats: Array<{
      type: string
      severity: 'low' | 'medium' | 'high' | 'critical'
      description: string
      indicators: string[]
      firstSeen: Date
      lastSeen: Date
      affectedUsers: number
      status: 'active' | 'mitigated' | 'monitoring'
    }>
    recommendations: Array<{
      priority: 'low' | 'medium' | 'high' | 'critical'
      action: string
      timeline: string
      expectedImpact: string
    }>
    metrics: {
      threatsDetected: number
      threatsBlocked: number
      falsePositives: number
      responseTime: number
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/threat-intelligence`)
      if (!response.ok) throw new Error('Failed to get threat intelligence')

      const intelligence = await response.json()
      return {
        ...intelligence,
        threats: intelligence.threats.map((threat: any) => ({
          ...threat,
          firstSeen: new Date(threat.firstSeen),
          lastSeen: new Date(threat.lastSeen)
        }))
      }
    } catch (error) {
      console.error('Failed to get threat intelligence:', error)
      throw error
    }
  }

  // Access Control
  async createAccessPolicy(
    policy: {
      name: string
      description: string
      conditions: Array<{
        field: string
        operator: string
        value: any
      }>
      permissions: string[]
      resources: string[]
      users: string[]
      groups: string[]
      ipRanges: string[]
      timeRestrictions: {
        days: number[]
        hours: [number, number]
      }
    }
  ): Promise<{
    policyId: string
    status: 'active' | 'draft'
    createdAt: Date
    lastModified: Date
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/access-policies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy)
      })

      if (!response.ok) throw new Error('Failed to create access policy')
      const result = await response.json()

      return {
        ...result,
        createdAt: new Date(result.createdAt),
        lastModified: new Date(result.lastModified)
      }
    } catch (error) {
      console.error('Failed to create access policy:', error)
      throw error
    }
  }

  // Security Monitoring
  async getSecurityDashboard(): Promise<{
    overview: {
      activeThreats: number
      blockedAttacks: number
      complianceScore: number
      systemHealth: 'healthy' | 'warning' | 'critical'
    }
    alerts: Array<{
      id: string
      type: string
      severity: 'low' | 'medium' | 'high' | 'critical'
      message: string
      timestamp: Date
      acknowledged: boolean
    }>
    metrics: {
      authenticationSuccess: number
      authenticationFailures: number
      suspiciousActivities: number
      dataAccess: number
    }
    trends: {
      threatsOverTime: Array<{date: string, count: number}>
      accessPatterns: Array<{hour: number, accesses: number}>
      complianceTrend: Array<{date: string, score: number}>
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/dashboard`)
      if (!response.ok) throw new Error('Failed to get security dashboard')

      const dashboard = await response.json()
      return {
        ...dashboard,
        alerts: dashboard.alerts.map((alert: any) => ({
          ...alert,
          timestamp: new Date(alert.timestamp)
        }))
      }
    } catch (error) {
      console.error('Failed to get security dashboard:', error)
      throw error
    }
  }
}

export const enterpriseSecurity = new EnterpriseSecurity()

// React Hook for Enterprise Security
export function useEnterpriseSecurity() {
  return {
    getSecurityProfile: enterpriseSecurity.getSecurityProfile.bind(enterpriseSecurity),
    updateSecurityProfile: enterpriseSecurity.updateSecurityProfile.bind(enterpriseSecurity),
    setupMFA: enterpriseSecurity.setupMFA.bind(enterpriseSecurity),
    verifyMFA: enterpriseSecurity.verifyMFA.bind(enterpriseSecurity),
    getAuditLogs: enterpriseSecurity.getAuditLogs.bind(enterpriseSecurity),
    reportSecurityIncident: enterpriseSecurity.reportSecurityIncident.bind(enterpriseSecurity),
    getSecurityIncidents: enterpriseSecurity.getSecurityIncidents.bind(enterpriseSecurity),
    generateComplianceReport: enterpriseSecurity.generateComplianceReport.bind(enterpriseSecurity),
    getEncryptionStatus: enterpriseSecurity.getEncryptionStatus.bind(enterpriseSecurity),
    rotateEncryptionKeys: enterpriseSecurity.rotateEncryptionKeys.bind(enterpriseSecurity),
    getThreatIntelligence: enterpriseSecurity.getThreatIntelligence.bind(enterpriseSecurity),
    createAccessPolicy: enterpriseSecurity.createAccessPolicy.bind(enterpriseSecurity),
    getSecurityDashboard: enterpriseSecurity.getSecurityDashboard.bind(enterpriseSecurity)
  }
}
