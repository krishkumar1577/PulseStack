"use client"

import type { JSX } from "react"
import React, { useState } from "react"
import { Clock, BarChart2, GitBranch, GitCommit, GitPullRequest, FileText, Zap, Check, CircleDot, Search } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { Activity } from "@/types/activity"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { NewActivityDialog } from "../dashboard/new-activity-dialog"
import { ActivityDetailDialog } from "../dashboard/activity-detail-dialog"
import { toast } from "sonner"

interface ActivityTrendData {
  date: string
  total: number
  completed: number
}

interface ProjectStats {
  name: string
  description: string
  category: string
  progress: number
  activityCount: number
  completionRate: number
  recentActivities: number
}

const calculateActivityTrends = (activities: Activity[]): ActivityTrendData[] => {
  const now = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    return date
  }).reverse()

  return days.map(date => {
    const dayStr = date.toISOString().split('T')[0]
    const dayActivities = activities.filter(activity => {
      if (activity.completedAt && activity.status === "completed") {
        return activity.completedAt.startsWith(dayStr)
      }
      // For activities without completedAt, use the relative time
      const timeMatch = activity.time.match(/(\d+)\s+(hours?|days?) ago/)
      if (!timeMatch) return false
      
      const [, amount, unit] = timeMatch
      const activityDate = new Date(now)
      if (unit.startsWith('hour')) {
        activityDate.setHours(activityDate.getHours() - parseInt(amount))
      } else {
        activityDate.setDate(activityDate.getDate() - parseInt(amount))
      }
      return activityDate.toISOString().startsWith(dayStr)
    })

    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      total: dayActivities.length,
      completed: dayActivities.filter(a => a.status === "completed").length
    }
  })
}

const calculateProjectStats = (activities: Activity[]): ProjectStats[] => {
  // Group activities by project
  const projectGroups = activities.reduce((acc, activity) => {
    if (!acc[activity.project]) {
      acc[activity.project] = [];
    }
    acc[activity.project].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  // Calculate stats for each project
  const projectStats = Object.entries(projectGroups).map(([name, projectActivities]) => {
    const totalActivities = projectActivities.length;
    const completedActivities = projectActivities.filter(a => a.status === "completed").length;
    const recentActivities = projectActivities.filter(a => 
      a.time.includes("hours ago") || 
      a.time.includes("Just now") ||
      (a.time.includes("days ago") && parseInt(a.time) <= 3)
    ).length;

    // Get the most recent activity for project description and category
    const latestActivity = projectActivities.sort((a, b) => {
      if (a.time.includes("Just now")) return -1;
      if (b.time.includes("Just now")) return 1;
      return 0;
    })[0];

    return {
      name,
      description: latestActivity.description,
      category: latestActivity.category,
      progress: Math.round((completedActivities / totalActivities) * 100),
      activityCount: totalActivities,
      completionRate: completedActivities / totalActivities,
      recentActivities
    };
  });

  // Sort projects by a combined score of completion rate, recent activity, and total activities
  return projectStats.sort((a, b) => {
    const scoreA = a.completionRate * 0.4 + (a.recentActivities / a.activityCount) * 0.4 + (a.activityCount / Math.max(...projectStats.map(p => p.activityCount))) * 0.2;
    const scoreB = b.completionRate * 0.4 + (b.recentActivities / b.activityCount) * 0.4 + (b.activityCount / Math.max(...projectStats.map(p => p.activityCount))) * 0.2;
    return scoreB - scoreA;
  });
};

interface ActivityTrendsProps {
  activities: Activity[]
}

function ActivityTrends({ activities }: ActivityTrendsProps) {
  const data = calculateActivityTrends(activities)

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toFixed(0)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#ec4899"
            fill="url(#totalGradient)"
            strokeWidth={2}
            name="Total Activities"
          />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#8b5cf6"
            fill="url(#completedGradient)"
            strokeWidth={2}
            name="Completed"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ActivityPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [isNewActivityDialogOpen, setIsNewActivityDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const INITIAL_ACTIVITY_LIMIT = 5
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      type: "task",
      project: "PulseStack",
      title: "Add dashboard layout components",
      description: "Implemented responsive layout with sidebar navigation",
      time: "2 hours ago",
      category: "Development",
      status: "completed",
      completedAt: "2025-05-11T10:00:00Z",
      author: {
        name: "krish",
        avatar: "/placeholder-user.jpg",
      },
    },
    {
      id: 2,
      type: "file",
      project: "PulseStack",
      title: "Updated design mockups",
      description: "Added new screens for mobile view",
      time: "Yesterday, 4:30 PM",
      category: "Design",
      status: "completed",
      completedAt: "2025-05-10T16:30:00Z",
      author: {
        name: "krish",
        avatar: "/placeholder-user.jpg",
      },
    },
    {
      id: 3,
      type: "project",
      project: "PulseStack",
      title: "Created new project milestone",
      description: "Added Q2 goals and timeline",
      time: "2 days ago",
      category: "Planning",
      status: "in-progress",
      author: {
        name: "krish",
        avatar: "/placeholder-user.jpg",
      },
    },
    {
      id: 4,
      type: "task",
      project: "PulseStack",
      title: "Create AI planner component",
      description: "Added UI for AI-powered productivity suggestions",
      time: "3 days ago",
      category: "Development",
      status: "in-progress",
      author: {
        name: "krish",
        avatar: "/placeholder-user.jpg",
      },
    },
  ])

  const handleNewActivity = (data: {
    type: "task" | "project" | "file"
    project: string
    title: string
    description: string
    category: string
  }) => {
    const newActivity: Activity = {
      id: activities.length + 1,
      ...data,
      time: "Just now",
      status: "in-progress",
      history: [
        {
          id: 1,
          action: "Activity created",
          timestamp: new Date().toISOString(),
          user: {
            name: "krish",
            avatar: "/placeholder-user.jpg",
          }
        }
      ],
      author: {
        name: "krish",
        avatar: "/placeholder-user.jpg",
      },
    }
    setActivities([newActivity, ...activities])
    toast.success("New activity added successfully!")
  }

  const toggleActivityCompletion = (activityId: number) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        const isCompleting = activity.status !== "completed";
        const newStatus = isCompleting ? "completed" : "in-progress";
        
        // Create an action message
        const actionMsg = isCompleting ? "completed" : "marked in-progress";
        toast.success(`Activity ${actionMsg} successfully!`);
        
        return {
          ...activity,
          status: newStatus,
          completedAt: isCompleting ? new Date().toISOString() : undefined,
          history: [
            ...(activity.history || []),
            {
              id: (activity.history?.length || 0) + 1,
              action: `Status changed to ${newStatus}`,
              timestamp: new Date().toISOString(),
              user: activity.author
            }
          ]
        };
      }
      return activity;
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const calculateStats = () => {
    const totalActivities = activities.length;
    
    const completedTasks = activities.filter(
      activity => activity.type === "task" && activity.status === "completed"
    ).length;
    
    const completedTasksThisWeek = activities.filter(activity => 
      activity.type === "task" && 
      activity.status === "completed" &&
      activity.completedAt && 
      new Date(activity.completedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    // Get unique active projects (not completed)
    const activeProjects = new Set(
      activities
        .filter(activity => activity.status !== "completed")
        .map(activity => activity.project)
    ).size;

    // Count projects updated today
    const projectsUpdatedToday = new Set(
      activities
        .filter(activity => 
          activity.time.includes("hours ago") || 
          activity.time.includes("Just now"))
        .map(activity => activity.project)
    ).size;

    const activitiesLastWeek = activities.filter(
      activity => activity.time.includes("days ago") && 
      parseInt(activity.time) <= 7
    ).length;

    return {
      totalActivities,
      totalActivitiesChange: activitiesLastWeek,
      completedTasks,
      completedTasksThisWeek,
      activeProjects,
      projectsUpdatedToday
    };
  };

  const stats = calculateStats();

  const filteredActivities = activities.filter((activity) => {
    const query = searchQuery.toLowerCase().trim()
    
    // Enhanced search patterns
    const projectSearch = query.match(/^(?:project:|in:)(.+)/)
    const titleSearch = query.match(/^(?:title:|t:)(.+)/)
    const categorySearch = query.match(/^(?:category:|cat:)(.+)/)
    
    // Project-specific search
    if (projectSearch) {
      return activity.project.toLowerCase().includes(projectSearch[1])
    }
    
    // Title-specific search
    if (titleSearch) {
      return activity.title.toLowerCase().includes(titleSearch[1])
    }
    
    // Category-specific search
    if (categorySearch) {
      return activity.category.toLowerCase().includes(categorySearch[1])
    }

    // Regular search across all fields
    const matchesSearch =
      activity.title.toLowerCase().includes(query) ||
      activity.description.toLowerCase().includes(query) ||
      activity.project.toLowerCase().includes(query) ||
      activity.category.toLowerCase().includes(query)

    const matchesTab = activeTab === "all" || activity.type === activeTab.slice(0, -1)

    return matchesSearch && matchesTab
  }).slice(0, isExpanded ? undefined : INITIAL_ACTIVITY_LIMIT)

  const limitedActivities = isExpanded ? filteredActivities : filteredActivities.slice(0, INITIAL_ACTIVITY_LIMIT)

  // Search placeholder with hints
  const searchPlaceholder = "Search by text or use project:, title:, category: filters..."

  // Calculate project statistics
  const topProjects = calculateProjectStats(activities);

  return (
    <div className="flex-1 overflow-auto px-6 pb-6">
      <div className="flex items-center justify-between mb-6 pt-2">
        <h2 className="text-2xl font-bold">Activity</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10 pr-10 w-[400px] bg-cardborder"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white"
            onClick={() => setIsNewActivityDialogOpen(true)}
          >
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
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <p className="text-xs text-muted-foreground">+{stats.totalActivitiesChange} from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">{stats.completedTasksThisWeek} this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">{stats.projectsUpdatedToday} updated today</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            {isExpanded 
              ? `Showing all ${filteredActivities.length} activities` 
              : `Showing ${Math.min(INITIAL_ACTIVITY_LIMIT, filteredActivities.length)} of ${filteredActivities.length} activities`
            }
          </CardDescription>
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
            {filteredActivities.slice(0, isExpanded ? undefined : INITIAL_ACTIVITY_LIMIT).map((activity) => (
              <ActivityItem 
                key={activity.id} 
                {...activity} 
                onClick={() => {
                  setSelectedActivity(activity)
                  setIsDetailDialogOpen(true)
                }}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            {isExpanded ? "Show Less" : `View All Activities (${filteredActivities.length})`}
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
              {topProjects.slice(0, 3).map((project) => (
                <ProjectItem
                  key={project.name}
                  name={project.name}
                  description={project.description}
                  category={project.category}
                  progress={project.progress}
                />
              ))}
              {topProjects.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  <p>No projects found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Trends</CardTitle>
            <CardDescription>Your activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTrends activities={activities} />
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

      <NewActivityDialog
        open={isNewActivityDialogOpen}
        onOpenChange={setIsNewActivityDialogOpen}
        onSubmit={handleNewActivity}
      />

      <ActivityDetailDialog
        activity={selectedActivity}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        onStatusChange={toggleActivityCompletion}
      />
    </div>
  )
}

interface ActivityItemProps extends Activity {
  onClick?: () => void
}

function ActivityItem({ type, project, title, description, time, category, status, author, onClick }: ActivityItemProps) {
  const icons: Record<Activity['type'], JSX.Element> = {
    task: <GitCommit className="h-4 w-4" />,
    project: <GitPullRequest className="h-4 w-4" />,
    file: <FileText className="h-4 w-4" />,
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "in-progress":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const StatusIcon = status === "completed" ? Check : CircleDot;

  return (
    <div 
      className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 cursor-pointer transition-colors hover:bg-secondary/70"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <div className="rounded-full bg-secondary p-2">{icons[type]}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{project}</span>
          <div className="flex gap-2">
            <Badge variant="outline" className={`text-xs ${getStatusColor(status)}`}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <GitBranch className="mr-1 h-3 w-3" />
              {category}
            </Badge>
          </div>
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
