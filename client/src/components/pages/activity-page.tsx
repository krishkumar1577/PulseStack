"use client"

import { useState } from "react"
import { Clock, BarChart2, GitBranch, GitCommit, GitPullRequest, Search, FileText, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function ActivityPage() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="flex-1 overflow-auto px-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Activity</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search activity..." className="pl-9 w-64 bg-card border-border" />
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white">
            <Zap className="mr-2 h-4 w-4" />
            Track New Activity
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">+32 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 updated today</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your activity across all projects</CardDescription>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ActivityItem
              type="task"
              project="PulseStack"
              title="Add dashboard layout components"
              description="Implemented responsive layout with sidebar navigation"
              time="2 hours ago"
              category="Development"
              author={{
                name: "Sajibur",
                avatar: "/placeholder-user.jpg",
              }}
            />
            <ActivityItem
              type="file"
              project="PulseStack"
              title="Updated design mockups"
              description="Added new screens for mobile view"
              time="Yesterday, 4:30 PM"
              category="Design"
              author={{
                name: "Sajibur",
                avatar: "/placeholder-user.jpg",
              }}
            />
            <ActivityItem
              type="project"
              project="PulseStack"
              title="Created new project milestone"
              description="Added Q2 goals and timeline"
              time="2 days ago"
              category="Planning"
              author={{
                name: "Sajibur",
                avatar: "/placeholder-user.jpg",
              }}
            />
            <ActivityItem
              type="task"
              project="PulseStack"
              title="Create AI planner component"
              description="Added UI for AI-powered productivity suggestions"
              time="3 days ago"
              category="Development"
              author={{
                name: "Sajibur",
                avatar: "/placeholder-user.jpg",
              }}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <BarChart2 className="mr-2 h-4 w-4" />
            View All Activity
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Projects</CardTitle>
            <CardDescription>Your most active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProjectItem
                name="PulseStack"
                description="AI-enhanced productivity dashboard"
                category="Development"
                progress={75}
              />
              <ProjectItem
                name="Analytics Dashboard"
                description="Data visualization tool"
                category="Design"
                progress={45}
              />
              <ProjectItem
                name="Portfolio Website"
                description="Personal portfolio site"
                category="Web Development"
                progress={90}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Trends</CardTitle>
            <CardDescription>Your activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart2 className="h-10 w-10 mx-auto mb-2" />
                <p>Activity trend visualization</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-secondary" />
                <div className="h-3 w-3 rounded-sm bg-orange-900/30" />
                <div className="h-3 w-3 rounded-sm bg-orange-700/50" />
                <div className="h-3 w-3 rounded-sm bg-orange-500/70" />
                <div className="h-3 w-3 rounded-sm bg-orange-400" />
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  type: "task" | "project" | "file"
  project: string
  title: string
  description: string
  time: string
  category: string
  author: {
    name: string
    avatar: string
  }
}

function ActivityItem({ type, project, title, description, time, category, author }: ActivityItemProps) {
  const icons = {
    task: <GitCommit className="h-4 w-4" />,
    project: <GitPullRequest className="h-4 w-4" />,
    file: <FileText className="h-4 w-4" />,
  }

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
      <div className="rounded-full bg-secondary p-2">{icons[type]}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{project}</span>
          <Badge variant="outline" className="text-xs">
            <GitBranch className="mr-1 h-3 w-3" />
            {category}
          </Badge>
        </div>
        <h4 className="text-base font-medium mt-1">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{author.name}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {time}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProjectItemProps {
  name: string
  description: string
  category: string
  progress: number
}

function ProjectItem({ name, description, category, progress }: ProjectItemProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "development":
        return "bg-purple-500"
      case "design":
        return "bg-blue-500"
      case "web development":
        return "bg-green-500"
      case "marketing":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="p-4 rounded-lg bg-secondary/50">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-medium">{name}</h4>
        <Badge className={`${getCategoryColor(category)} text-white`}>{category}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-violet-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
