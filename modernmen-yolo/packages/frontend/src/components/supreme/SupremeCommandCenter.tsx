'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Activity,
  Zap,
  Crown,
  Shield,
  Brain,
  Network,
  Command,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Server,
  Globe,
  Sparkles
} from 'lucide-react'

import { useGlobalOrchestrator } from '@/lib/meta/global-orchestrator'
import { useMetaOrchestrator } from '@/lib/meta/orchestrator'
import { useBusinessIntelligence } from '@/lib/meta/business-intelligence-orchestrator'
import { useSystemIntegration } from '@/lib/meta/system-integration-orchestrator'

export function SupremeCommandCenter() {
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [activeCommands, setActiveCommands] = useState<any[]>([])
  const [systemAlerts, setSystemAlerts] = useState<any[]>([])
  const [supremeMode, setSupremeMode] = useState(false)

  const {
    getGlobalSystemStatus,
    getActiveDirectives,
    getSupremeCommands,
    activateSupremeMode,
    issueGlobalCommand
  } = useGlobalOrchestrator()

  const { getSystemMetrics } = useMetaOrchestrator()
  const { getMetrics, getInsights } = useBusinessIntelligence()
  const { getSystemHealth } = useSystemIntegration()

  const loadSystemStatus = useCallback(async () => {
    try {
      const globalStatus = getGlobalSystemStatus()
      const systemMetrics = getSystemMetrics()
      const health = getSystemHealth()
      const commands = getSupremeCommands()

      setSystemStatus({
        ...globalStatus,
        metrics: systemMetrics,
        health,
        commands
      })

      setActiveCommands(commands.filter((cmd: any) => cmd.status === 'executing' || cmd.status === 'approved'))
      setSystemAlerts(health.alerts || [])
    } catch (error) {
      console.error('Failed to load system status:', error)
    }
  }, [getGlobalSystemStatus, getSystemMetrics, getSystemHealth, getSupremeCommands])

  useEffect(() => {
    loadSystemStatus()
    const interval = setInterval(loadSystemStatus, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [loadSystemStatus])

  const handleActivateSupremeMode = async () => {
    try {
      await activateSupremeMode()
      setSupremeMode(true)
    } catch (error) {
      console.error('Failed to activate supreme mode:', error)
    }
  }

  const handleIssueCommand = async (command: string, orchestrator: string) => {
    try {
      await issueGlobalCommand({
        type: 'system',
        priority: 'high',
        command,
        parameters: {},
        issuedBy: 'supreme_command_center',
        requiresApproval: false,
        orchestrator
      })
    } catch (error) {
      console.error('Failed to issue command:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Supreme Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Crown className="h-12 w-12 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            SUPREME COMMAND CENTER
          </h1>
          <Crown className="h-12 w-12 text-yellow-500" />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Badge variant={supremeMode ? "default" : "secondary"} className="px-4 py-2 text-lg">
            {supremeMode ? (
              <>
                <Zap className="h-5 w-5 mr-2" />
                SUPREME MODE ACTIVE
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 mr-2" />
                SUPREME MODE STANDBY
              </>
            )}
          </Badge>

          {!supremeMode && (
            <Button
              onClick={handleActivateSupremeMode}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              ACTIVATE SUPREME MODE
            </Button>
          )}
        </div>
      </div>

      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStatus?.systemStatus === 'active' ? (
                <span className="text-green-500">ACTIVE</span>
              ) : (
                <span className="text-yellow-500">STANDBY</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All orchestrators operational
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus?.globalMetrics?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {systemStatus?.globalMetrics?.activeSessions || 0} active sessions
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Load</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus?.globalMetrics?.systemLoad || 0}%</div>
            <Progress value={systemStatus?.globalMetrics?.systemLoad || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Intelligence</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">
              AI systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Supreme Control Panel */}
      <Tabs defaultValue="orchestrators" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="orchestrators">Orchestrators</TabsTrigger>
          <TabsTrigger value="commands">Supreme Commands</TabsTrigger>
          <TabsTrigger value="directives">Directives</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
        </TabsList>

        {/* Orchestrators Tab */}
        <TabsContent value="orchestrators" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(systemStatus?.orchestrators || {}).map(([name, active]) => (
              <Card key={name} className={active ? "border-green-500/20" : "border-red-500/20"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    {name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {active ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={active ? "text-green-500" : "text-red-500"}>
                      {active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIssueCommand('health_check', name)}
                      className="w-full"
                    >
                      Health Check
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIssueCommand('optimize', name)}
                      className="w-full"
                    >
                      Optimize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Supreme Commands Tab */}
        <TabsContent value="commands" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Command className="h-5 w-5" />
                Supreme Command Execution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button
                  onClick={() => handleIssueCommand('system_health_check', 'meta')}
                  className="h-20"
                >
                  <Shield className="h-6 w-6 mr-2" />
                  System Health Check
                </Button>

                <Button
                  onClick={() => handleIssueCommand('global_optimization', 'business_intelligence')}
                  className="h-20"
                >
                  <TrendingUp className="h-6 w-6 mr-2" />
                  Global Optimization
                </Button>

                <Button
                  onClick={() => handleIssueCommand('emergency_protocol', 'system_integration')}
                  variant="destructive"
                  className="h-20"
                >
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  Emergency Protocol
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Commands */}
          <Card>
            <CardHeader>
              <CardTitle>Active Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeCommands.length === 0 ? (
                  <p className="text-muted-foreground">No active commands</p>
                ) : (
                  activeCommands.map((cmd: any) => (
                    <div key={cmd.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{cmd.command}</p>
                        <p className="text-sm text-muted-foreground">
                          Orchestrator: {cmd.orchestrator} | Priority: {cmd.priority}
                        </p>
                      </div>
                      <Badge variant={cmd.status === 'executing' ? 'default' : 'secondary'}>
                        {cmd.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Directives Tab */}
        <TabsContent value="directives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supreme Directives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getActiveDirectives().map((directive: any) => (
                  <div key={directive.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{directive.title}</h3>
                      <Badge variant="outline">{directive.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{directive.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Progress value={directive.progress} className="h-2" />
                      </div>
                      <span className="text-sm font-medium">{directive.progress}%</span>
                    </div>
                    <div className="flex gap-2">
                      {directive.objectives.map((objective: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {objective}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {systemAlerts.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">All Systems Normal</h3>
                    <p className="text-muted-foreground">
                      No active alerts or issues detected
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              systemAlerts.map((alert: any) => (
                <Alert key={alert.id} className={
                  alert.severity === 'critical' ? 'border-red-500' :
                  alert.severity === 'high' ? 'border-orange-500' :
                  alert.severity === 'medium' ? 'border-yellow-500' :
                  'border-blue-500'
                }>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.component} • {alert.timestamp}
                        </p>
                      </div>
                      <Badge variant={
                        alert.severity === 'critical' ? 'destructive' :
                        alert.severity === 'high' ? 'default' : 'secondary'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))
            )}
          </div>
        </TabsContent>

        {/* Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Business Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getMetrics().slice(0, 3).map((metric: any) => (
                    <div key={metric.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{metric.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {metric.changePercent >= 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'}>
                          {metric.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getInsights().slice(0, 3).map((insight: any) => (
                    <div key={insight.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant="outline">{insight.confidence}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <Badge variant={
                        insight.type === 'opportunity' ? 'default' :
                        insight.type === 'risk' ? 'destructive' : 'secondary'
                      }>
                        {insight.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Supreme Status Footer */}
      <Card className="border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Globe className="h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-bold">Supreme System Status</h3>
              <Globe className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-muted-foreground">
              The ultimate orchestration system is {supremeMode ? 'ACTIVE' : 'STANDBY'} and operational
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {Object.values(systemStatus?.orchestrators || {}).filter(Boolean).length}/6 Orchestrators
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-blue-500" />
                {activeCommands.length} Active Commands
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                {systemAlerts.length} Alerts
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
