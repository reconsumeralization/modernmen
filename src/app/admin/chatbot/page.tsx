import { Metadata } from 'next'
import { ChatBotAnalytics } from '@/components/ai/ChatBotAnalytics'

export const metadata: Metadata = {
  title: 'ChatBot Management | Modern Men Salon',
  description: 'Manage and monitor your AI chatbot performance and settings',
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bot,
  Settings,
  MessageSquare,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react'

export default function ChatBotManagementPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ChatBot Management</h1>
          <p className="text-gray-600">Monitor performance and manage your AI assistant</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Bot className="w-4 h-4 mr-2" />
            Test ChatBot
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ChatBot Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.7%</div>
            <p className="text-xs text-muted-foreground">Successful interactions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <ChatBotAnalytics />
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>Monitor ongoing and recent chatbot interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, user: 'John D.', status: 'active', lastMessage: 'Thanks for the booking!', time: '2 min ago' },
                  { id: 2, user: 'Sarah M.', status: 'waiting', lastMessage: 'What services do you offer?', time: '5 min ago' },
                  { id: 3, user: 'Mike R.', status: 'completed', lastMessage: 'Appointment confirmed for tomorrow', time: '1 hour ago' },
                  { id: 4, user: 'Lisa K.', status: 'active', lastMessage: 'Do you accept walk-ins?', time: '8 min ago' },
                  { id: 5, user: 'David P.', status: 'completed', lastMessage: 'Perfect, see you then!', time: '2 hours ago' }
                ].map((conversation) => (
                  <div key={conversation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{conversation.user}</h4>
                        <p className="text-sm text-gray-600">{conversation.lastMessage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={conversation.status === 'active' ? 'default' : conversation.status === 'waiting' ? 'secondary' : 'outline'}
                      >
                        {conversation.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{conversation.time}</span>
                      {conversation.status === 'active' && (
                        <Button size="sm" variant="outline">
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ChatBot Configuration</CardTitle>
              <CardDescription>Customize your chatbot behavior and responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response Delay
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="instant">Instant (0-1s)</option>
                      <option value="natural">Natural (1-3s)</option>
                      <option value="slow">Slow (3-5s)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Confirmation
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        Send email confirmation
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        Send SMS reminder
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Add to calendar
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Operating Hours Awareness
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="business">Business Hours Only</option>
                      <option value="extended">Extended Hours</option>
                      <option value="247">24/7 Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fallback Behavior
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="transfer">Transfer to human</option>
                      <option value="schedule">Schedule callback</option>
                      <option value="email">Collect email for response</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Responses</CardTitle>
              <CardDescription>Manage canned responses for common queries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { trigger: 'pricing', response: 'Our services start from $35 for haircuts...' },
                  { trigger: 'hours', response: 'We\'re open Monday-Friday 9AM-8PM...' },
                  { trigger: 'location', response: 'Find us at 123 Style Street, Downtown...' },
                  { trigger: 'booking', response: 'I can help you book an appointment right now...' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium">/{item.trigger}</div>
                      <div className="text-sm text-gray-600">{item.response}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Delete</Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  Add Quick Response
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Data</CardTitle>
              <CardDescription>Improve chatbot responses with conversation data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">1,247</div>
                  <div className="text-sm text-blue-800">Conversations</div>
                  <div className="text-xs text-blue-600 mt-1">Training data available</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">94.7%</div>
                  <div className="text-sm text-green-800">Accuracy</div>
                  <div className="text-xs text-green-600 mt-1">Current performance</div>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">23</div>
                  <div className="text-sm text-yellow-800">Improvements</div>
                  <div className="text-xs text-yellow-600 mt-1">Suggested updates</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Suggested Improvements</h4>
                {[
                  { type: 'response', suggestion: 'Add response for "bridal hair" queries', priority: 'high' },
                  { type: 'intent', suggestion: 'Improve recognition of "reschedule" vs "cancel"', priority: 'medium' },
                  { type: 'service', suggestion: 'Add information about hair color services', priority: 'low' },
                  { type: 'hours', suggestion: 'Include holiday schedule information', priority: 'medium' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.priority === 'high' ? 'bg-red-500' :
                        item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <div className="font-medium">{item.suggestion}</div>
                        <div className="text-sm text-gray-600 capitalize">{item.type} improvement</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={
                        item.priority === 'high' ? 'destructive' :
                        item.priority === 'medium' ? 'secondary' : 'outline'
                      }>
                        {item.priority}
                      </Badge>
                      <Button size="sm">Implement</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
