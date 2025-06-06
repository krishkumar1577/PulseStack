"use client"

import type React from "react"
import {
  MoreVertical,
  Plus,
  CalendarIcon,
  Clock,
  FileText,
  MessageSquare,
  Users,
  BarChart2,
  Brain,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { NewActivityDialog } from "@/components/dashboard/new-activity-dialog"
import { useActivityContext } from "@/contexts/activity-context"
import { useEventContext } from "@/contexts/event-context"

interface DashboardContentProps {
  setSelectedView?: (view: string) => void
}

export function DashboardContent({ setSelectedView }: DashboardContentProps) {
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [boardView, setBoardView] = useState(false)
  const { activities, addActivity } = useActivityContext()
  const { events } = useEventContext()

  // Group activities by status for the kanban columns
  const taskColumns = [
    {
      title: "Not Started",
      accentColor: undefined,
      tasks: activities.filter(a => a.type === "task" && (!a.status || a.status === "pending")),
    },
    {
      title: "In Progress",
      accentColor: "#9333ea",
      tasks: activities.filter(a => a.type === "task" && a.status === "in-progress"),
    },
    {
      title: "Under Review",
      accentColor: "#8b5cf6",
      tasks: [], // You can add logic for this if you have such a status
    },
    {
      title: "Completed",
      accentColor: "#22c55e",
      tasks: activities.filter(a => a.type === "task" && a.status === "completed"),
    },
  ]

  // Placeholder: handle new task submission (should update task board data in real app)
  const handleNewTask = (data: any) => {
    addActivity({
      ...data,
      time: "Just now",
      status: "in-progress",
      author: {
        name: "krish",
        avatar: "/placeholder-user.jpg",
      },
    })
  }

  // Helper: Get upcoming events (today or future, sorted)
  const getUpcomingEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return events
      .filter(event => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate >= today
      })
      .sort((a, b) => {
        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
        if (dateCompare !== 0) return dateCompare
        // If same date, compare by time
        const timeA = new Date(`1970/01/01 ${a.time}`).getTime()
        const timeB = new Date(`1970/01/01 ${b.time}`).getTime()
        return timeA - timeB
      })
      .slice(0, 3)
  }

  return (
    <div className="flex-1 overflow-auto px-6 pb-6">
      {/* Quick Access Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <QuickAccessWidget
          icon={<BarChart2 className="h-5 w-5 text-purple-500" />}
          title="Activity"
          description="Track your progress and activity"
          linkText="View Activity"
          linkHref="/activity"
          viewName="activity"
          setSelectedView={setSelectedView}
        />
        <QuickAccessWidget
          icon={<Target className="h-5 w-5 text-purple-500" />}
          title="Goals & Habits"
          description="Monitor your goals and daily habits"
          linkText="View Goals"
          linkHref="/goals"
          viewName="goals"
          setSelectedView={setSelectedView}
        />
        <QuickAccessWidget
          icon={<Brain className="h-5 w-5 text-purple-500" />}
          title="AI Planner"
          description="Get AI-powered productivity suggestions"
          linkText="Open Planner"
          linkHref="/ai-planner"
          viewName="ai-planner"
          setSelectedView={setSelectedView}
        />
        <QuickAccessWidget
          icon={<CalendarIcon className="h-5 w-5 text-purple-500" />}
          title="Calendar"
          description="Manage your schedule and events"
          linkText="View Calendar"
          linkHref="/calendar"
          viewName="calendar"
          setSelectedView={setSelectedView}
        />
      </div>

      {/* Folders Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Folders</h2>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <FolderCard count={54} title="My Portfolio" />
          <FolderCard count={87} title="Client Projects" />
          <FolderCard count={145} title="Website Resources" />
          <FolderCard count={102} title="Creative Assets" />
          <FolderCard count={36} title="Product Designs" />
          <div className="bg-card rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-secondary/70 transition-colors h-[104px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Plus className="h-5 w-5" />
              <span>Add New</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setBoardView(v => !v)}>
              <FileText className="h-4 w-4 mr-2" />
              Board View
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"
              onClick={() => setIsNewTaskDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>
        {boardView ? (
          // Kanban (Board) View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {taskColumns.map(col => (
              <TaskColumn
                key={col.title}
                title={col.title}
                count={col.tasks.length}
                accentColor={col.accentColor}
                tasks={col.tasks.map(task => ({
                  title: task.title,
                  type: task.category || task.type,
                  priority: (task.priority as "low" | "medium" | "high") ?? "medium",
                  progress: task.status === "completed" ? 100 : 0,
                  dueDate: task.dueDate ?? "",
                  assignees: Array.isArray(task.assignees)
                    ? task.assignees.length
                    : (typeof task.assignees === "number" ? task.assignees : 1),
                  comments: Array.isArray(task.comments)
                    ? task.comments.length
                    : (typeof task.comments === "number" ? task.comments : 0),
                  accentColor: col.accentColor,
                }))}
              />
            ))}
          </div>
        ) : (
          // Simple Card View (all tasks, not grouped)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activities.filter(a => a.type === "task").map((task, idx) => (
              <Task key={task.id || idx} {...{
                title: task.title,
                type: task.category || task.type,
                priority: (task.priority as "low" | "medium" | "high") ?? "medium",
                progress: task.status === "completed" ? 100 : 0,
                dueDate: task.dueDate ?? "",
                assignees: Array.isArray(task.assignees)
                  ? task.assignees.length
                  : (typeof task.assignees === "number" ? task.assignees : 1),
                comments: Array.isArray(task.comments)
                  ? task.comments.length
                  : (typeof task.comments === "number" ? task.comments : 0),
              }} />
            ))}
          </div>
        )}
        <NewActivityDialog
          open={isNewTaskDialogOpen}
          onOpenChange={setIsNewTaskDialogOpen}
          onSubmit={handleNewTask}
        />
      </div>

      {/* Upcoming Events */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <Button 
            variant="outline" 
            size="sm"
            className="hover:bg-primary/10 transition-colors"
            onClick={() => {
              if (setSelectedView) {
                setSelectedView("calendar")
              }
            }}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getUpcomingEvents().length === 0 ? (
            <div className="text-muted-foreground col-span-3 text-center py-8">No upcoming events</div>
          ) : (
            getUpcomingEvents().map(event => (
              <EventCard
                key={event.id}
                title={event.title}
                date={`${event.date instanceof Date ? event.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : event.date} ${event.time}`}
                description={event.description || ''}
                participants={event.participants?.length || 0}
                setSelectedView={setSelectedView}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

interface QuickAccessWidgetProps {
  icon: React.ReactNode
  title: string
  description: string
  linkText: string
  linkHref: string
  viewName?: string
  setSelectedView?: (view: string) => void
}

function QuickAccessWidget({ 
  icon, 
  title, 
  description, 
  linkText, 
  linkHref, 
  viewName, 
  setSelectedView 
}: QuickAccessWidgetProps) {
  
  const handleClick = () => {
    if (setSelectedView && viewName) {
      setSelectedView(viewName);
    }
  };
  
  return (
    <Card className="hover:border-primary/20 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary hover:bg-primary/10 transition-colors"
          onClick={handleClick}
        >
          {linkText}
        </Button>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-base mb-1">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

interface FolderCardProps {
  count: number
  title: string
  icon?: React.ReactNode
}

function FolderCard({ count, title, icon }: FolderCardProps) {
  return (
    <div className="bg-card rounded-lg p-4 flex flex-col h-[104px] hover:border-primary/20 hover:border transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
          {icon || <FileText className="h-4 w-4 text-muted-foreground" />}
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-auto">
        <div className="text-foreground font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{count} Files</div>
      </div>
    </div>
  )
}

interface TaskColumnProps {
  title: string
  count: number
  accentColor?: string
  tasks: TaskProps[]
}

function TaskColumn({ title, count, accentColor = "#888888", tasks }: TaskColumnProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {accentColor && <div className="h-3 w-3 rounded-full" style={{ backgroundColor: accentColor }}></div>}
          <span className="text-foreground font-medium">{title}</span>
          <span className="text-sm text-muted-foreground ml-1">{count}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <Task key={index} {...task} accentColor={accentColor} />
        ))}
      </div>
    </div>
  )
}

interface TaskProps {
  title: string
  type: string
  priority: "low" | "medium" | "high"
  progress: number
  dueDate: string
  assignees: number
  comments: number
  accentColor?: string
}

function Task({ title, type, priority, progress, dueDate, assignees, comments, accentColor = "#888888" }: TaskProps) {
  const priorityColors = {
    low: "#22c55e",
    medium: "#f59e0b",
    high: "#ef4444",
  }

  return (
    <div className="bg-card rounded-lg p-3 flex flex-col gap-2 hover:border-primary/20 hover:border transition-colors cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: priorityColors[priority] }}></div>
            <span className="text-xs text-muted-foreground capitalize">{priority}</span>
          </div>
          <h3 className="text-foreground font-medium mt-1 text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground">{type}</p>
        </div>
      </div>

      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{dueDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {Array.from({ length: Math.min(assignees, 3) }).map((_, i) => (
            <Avatar key={i} className="h-5 w-5 border border-card">
              <AvatarFallback className="bg-secondary text-muted-foreground text-xs">
                {String.fromCharCode(65 + i)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{assignees}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface EventCardProps {
  title: string
  date: string
  description: string
  participants: number
  setSelectedView?: (view: string) => void
}

function EventCard({ title, date, description, participants, setSelectedView }: EventCardProps) {
  const handleClick = () => {
    if (setSelectedView) {
      setSelectedView("calendar");
    }
  };

  return (
    <div 
      className="bg-card rounded-lg p-4 hover:border-primary/20 hover:border transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 mt-1">
          <CalendarIcon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-primary mt-1">{date}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{participants} participants</span>
          </div>
        </div>
      </div>
    </div>
  )
}
