import React, { createContext, useContext, useState } from "react"
import type { Activity } from "@/types/activity"

interface ActivityContextType {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id">) => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

const initialActivities: Activity[] = [
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
]

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)

  const addActivity = (activity: Omit<Activity, "id">) => {
    setActivities(prev => [
      {
        ...activity,
        id: prev.length ? prev[0].id + 1 : 1,
      },
      ...prev,
    ])
  }

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivityContext() {
  const ctx = useContext(ActivityContext)
  if (!ctx) throw new Error("useActivityContext must be used within ActivityProvider")
  return ctx
}
