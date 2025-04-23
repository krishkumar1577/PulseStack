"use client"

import type React from "react"

import { useState } from "react"
import { Brain, Calendar, CheckCircle2, Clock, FileText, Send, Sparkles, Target, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function AIPlannerPage() {
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("planner")

  return (
    <div className="flex-1 overflow-auto px-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">AI Planner</h2>
        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Plan
        </Button>
      </div>

      <Tabs defaultValue="planner" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="planner">Smart Planner</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="planner" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Today's Optimized Schedule</CardTitle>
                  <CardDescription>
                    AI-generated schedule based on your tasks, goals, and productivity patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ScheduleItem
                      time="09:00 - 10:30"
                      title="Deep Work: PulseStack UI Development"
                      description="Focus on completing the dashboard components"
                      tags={["High Priority", "Coding"]}
                      completed={false}
                    />
                    <ScheduleItem
                      time="10:30 - 11:00"
                      title="Break"
                      description="Short walk and stretching"
                      tags={["Wellness"]}
                      completed={true}
                    />
                    <ScheduleItem
                      time="11:00 - 12:30"
                      title="Integration Work"
                      description="Implement API connection and data fetching"
                      tags={["Medium Priority", "Backend"]}
                      completed={false}
                    />
                    <ScheduleItem
                      time="12:30 - 13:30"
                      title="Lunch Break"
                      description="Meal and short rest"
                      tags={["Wellness"]}
                      completed={false}
                    />
                    <ScheduleItem
                      time="13:30 - 15:00"
                      title="AI Planner Feature"
                      description="Work on the AI suggestion algorithm"
                      tags={["High Priority", "AI"]}
                      completed={false}
                    />
                    <ScheduleItem
                      time="15:00 - 16:30"
                      title="Documentation"
                      description="Update project documentation and README"
                      tags={["Low Priority", "Documentation"]}
                      completed={false}
                    />
                    <ScheduleItem
                      time="16:30 - 17:00"
                      title="Daily Review"
                      description="Review progress and plan for tomorrow"
                      tags={["Planning"]}
                      completed={false}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Full Calendar
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Focus Metrics</CardTitle>
                  <CardDescription>Your productivity insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Focus Score</span>
                        <span className="text-sm text-muted-foreground">85/100</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Task Completion</span>
                        <span className="text-sm text-muted-foreground">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Deep Work Hours</span>
                        <span className="text-sm text-muted-foreground">4.5/8</span>
                      </div>
                      <Progress value={56} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>Personalized productivity tips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <RecommendationItem
                      icon={<Timer className="h-4 w-4 text-orange-500" />}
                      title="Optimal Focus Time"
                      description="Your most productive hours are between 9 AM and 11 AM. Schedule important tasks during this time."
                    />
                    <RecommendationItem
                      icon={<Target className="h-4 w-4 text-orange-500" />}
                      title="Task Prioritization"
                      description="Consider breaking down the 'AI Planner Feature' task into smaller subtasks for better progress tracking."
                    />
                    <RecommendationItem
                      icon={<Brain className="h-4 w-4 text-orange-500" />}
                      title="Learning Suggestion"
                      description="Based on your goals, allocate 30 minutes today to continue your AI integration course."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Productivity Patterns</CardTitle>
                <CardDescription>Your productivity trends over time</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-2" />
                  <p>Productivity chart visualization</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Focus Distribution</CardTitle>
                <CardDescription>How you spend your focused time</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-2" />
                  <p>Focus distribution chart</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Completion</CardTitle>
                <CardDescription>Your task completion rate</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-2" />
                  <p>Task completion chart</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assistant" className="mt-6">
          <Card className="h-[calc(100vh-320px)] flex flex-col">
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Ask questions about productivity, get help with planning, or request task suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-4">
                <ChatMessage
                  type="assistant"
                  content="Hello! I'm your PulseStack AI assistant. How can I help you today with your productivity and planning?"
                />
                <ChatMessage
                  type="user"
                  content="Can you suggest how to organize my tasks for the PulseStack project?"
                />
                <ChatMessage
                  type="assistant"
                  content="Based on your current goals and activity, I recommend organizing your PulseStack tasks into these categories:

1. **UI Development** - Focus on completing the dashboard components first
2. **Backend Integration** - Prioritize the API connection
3. **AI Features** - Work on the planner algorithm after the core UI is stable
4. **Documentation** - Schedule this for when you need a mental break from coding

Would you like me to create a detailed task breakdown for any of these categories?"
                />
                <ChatMessage type="user" content="Yes, please create a breakdown for the UI Development tasks" />
                <ChatMessage
                  type="assistant"
                  content="Here's a detailed breakdown for the UI Development tasks:

**UI Development Tasks:**

1. **Dashboard Layout** - Complete the responsive grid system
   - Estimated time: 2 hours
   - Priority: High

2. **Task Cards Component** - Implement the task card design with progress indicators
   - Estimated time: 3 hours
   - Priority: High

3. **Activity Feed** - Create the activity timeline component
   - Estimated time: 2.5 hours
   - Priority: Medium

4. **AI Planner Interface** - Design the schedule view and recommendation cards
   - Estimated time: 4 hours
   - Priority: Medium

5. **Settings & Profile Pages** - Implement user preference controls
   - Estimated time: 3 hours
   - Priority: Low

Would you like me to add these tasks to your planner with suggested time slots?"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ScheduleItemProps {
  time: string
  title: string
  description: string
  tags: string[]
  completed: boolean
}

function ScheduleItem({ time, title, description, tags, completed }: ScheduleItemProps) {
  return (
    <div className={`p-4 rounded-lg border ${completed ? "bg-secondary/30 border-primary/20" : "bg-secondary/10"}`}>
      <div className="flex items-start gap-4">
        <div className="min-w-[100px] text-sm text-muted-foreground">{time}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {completed ? (
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
            ) : (
              <Clock className="h-5 w-5 text-muted-foreground" />
            )}
            <h4 className="font-medium">{title}</h4>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface RecommendationItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

function RecommendationItem({ icon, title, description }: RecommendationItemProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2">{icon}</div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}

interface ChatMessageProps {
  type: "user" | "assistant"
  content: string
}

function ChatMessage({ type, content }: ChatMessageProps) {
  return (
    <div className={`flex ${type === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          type === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
        }`}
      >
        {type === "assistant" && (
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
              <Brain className="h-3 w-3 text-orange-500" />
            </div>
            <span className="text-xs font-medium">PulseStack AI</span>
          </div>
        )}
        <div className="text-sm whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  )
}
