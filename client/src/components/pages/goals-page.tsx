"use client"

import { useState } from "react"
import { Activity, CheckCircle2, Circle, Clock, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function GoalsPage() {
  const [activeTab, setActiveTab] = useState("goals")

  return (
    <div className="flex-1 overflow-auto px-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Goals & Habits</h2>
        <div className="flex items-center gap-2">
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add New Goal
          </Button>
        </div>
      </div>

      <Tabs defaultValue="goals" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GoalCard
              title="Complete PulseStack UI"
              category="Project"
              deadline="April 20, 2025"
              progress={75}
              description="Finish implementing all UI components and pages for the PulseStack dashboard"
            />
            <GoalCard
              title="Learn AI Integration"
              category="Learning"
              deadline="May 15, 2025"
              progress={45}
              description="Complete course on integrating AI models with web applications"
            />
            <GoalCard
              title="Contribute to Open Source"
              category="Community"
              deadline="June 30, 2025"
              progress={20}
              description="Make 5 meaningful contributions to open source projects"
            />
            <GoalCard
              title="Build Portfolio Website"
              category="Career"
              deadline="April 30, 2025"
              progress={60}
              description="Design and develop personal portfolio website showcasing projects"
            />
            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary/70 transition-colors cursor-pointer">
              <Plus className="h-8 w-8 mb-2" />
              <p className="font-medium">Add New Goal</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="habits" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <HabitCard
              title="Daily Coding"
              streak={12}
              target="Every day"
              completedToday={true}
              description="Write code for at least 1 hour every day"
            />
            <HabitCard
              title="Read Technical Articles"
              streak={8}
              target="Weekdays"
              completedToday={true}
              description="Read at least one technical article each weekday"
            />
            <HabitCard
              title="Exercise"
              streak={5}
              target="3 times per week"
              completedToday={false}
              description="30 minutes of physical activity"
            />
            <HabitCard
              title="Project Planning"
              streak={3}
              target="Every Sunday"
              completedToday={false}
              description="Plan tasks and goals for the upcoming week"
            />
            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary/70 transition-colors cursor-pointer">
              <Plus className="h-8 w-8 mb-2" />
              <p className="font-medium">Add New Habit</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>Track your goals and habits progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Goals Completion</h4>
                <span className="text-sm text-muted-foreground">50%</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Habit Consistency</h4>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Weekly Target</h4>
                <span className="text-sm text-muted-foreground">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface GoalCardProps {
  title: string
  category: string
  deadline: string
  progress: number
  description: string
}

function GoalCard({ title, category, deadline, progress, description }: GoalCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-secondary/50">
            {category}
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg mt-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{progress}% Complete</span>
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {deadline}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Update Progress
        </Button>
      </CardFooter>
    </Card>
  )
}

interface HabitCardProps {
  title: string
  streak: number
  target: string
  completedToday: boolean
  description: string
}

function HabitCard({ title, streak, target, completedToday, description }: HabitCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {completedToday ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground mr-2" />
            )}
            <span className="text-sm text-muted-foreground">{target}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg mt-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{streak} day streak</span>
        </div>
        <div className="grid grid-cols-7 gap-1 mt-4">
          {Array.from({ length: 7 }).map((_, i) => {
            const isCompleted = Math.random() > 0.3
            return (
              <div
                key={i}
                className={`h-8 rounded-md flex items-center justify-center ${
                  isCompleted ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={completedToday ? "outline" : "default"}
          className={`w-full ${completedToday ? "" : "bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"}`}
        >
          {completedToday ? "Completed Today" : "Mark Complete"}
        </Button>
      </CardFooter>
    </Card>
  )
}
