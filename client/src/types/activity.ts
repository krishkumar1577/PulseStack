export interface ActivityComment {
  id: number
  content: string
  timestamp: string
  author: {
    name: string
    avatar: string
  }
  reactions?: ActivityReaction[]
}

export interface ActivityReaction {
  emoji: string
  count: number
  users: string[] // Array of usernames who reacted
}

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
  comments?: ActivityComment[]
  priority?: "low" | "medium" | "high"
  dueDate?: string
  tags?: string[]
  assignees?: {
    name: string
    avatar: string
  }[]
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
