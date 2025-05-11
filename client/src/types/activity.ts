export interface Activity {
  id: number
  type: "task" | "project" | "file"
  project: string
  title: string
  description: string
  time: string
  category: string
  status?: "completed" | "in-progress" | "pending"
  completedAt?: string
  author: {
    name: string
    avatar: string
  }
  history?: ActivityHistory[]
  relatedActivities?: Activity[]
}

export interface ActivityHistory {
  id: number
  action: string
  timestamp: string
  user: {
    name: string
    avatar: string
  }
}
