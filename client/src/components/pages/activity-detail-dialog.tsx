"use client"

import type { JSX } from "react"
import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, GitBranch, GitCommit, GitPullRequest, FileText } from "lucide-react"
import type { Activity } from "@/types/activity"

interface ActivityDetailDialogProps {
  activity: Activity | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActivityDetailDialog({ activity, open, onOpenChange }: ActivityDetailDialogProps) {
  if (!activity) return null

  const icons: Record<Activity['type'], JSX.Element> = {
    task: <GitCommit className="h-4 w-4" />,
    project: <GitPullRequest className="h-4 w-4" />,
    file: <FileText className="h-4 w-4" />,
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-secondary p-2">
              {icons[activity.type]}
            </div>
            <Badge variant="outline" className="text-xs">
              <GitBranch className="mr-1 h-3 w-3" />
              {activity.category}
            </Badge>
          </div>
          <DialogTitle>{activity.title}</DialogTitle>
          <DialogDescription>{activity.description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Association */}
          <div className="border-b pb-4">
            <h4 className="text-sm font-medium mb-2">Project</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm">{activity.project}</span>
            </div>
          </div>

          {/* Activity History */}
          <div className="border-b pb-4">
            <h4 className="text-sm font-medium mb-2">History</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Created {activity.time}</span>
              </div>
              {/* Add more history items here */}
            </div>
          </div>

          {/* Related Activities */}
          <div>
            <h4 className="text-sm font-medium mb-2">Related Activities</h4>
            <div className="space-y-2">
              {/* Add related activities here */}
              <p className="text-sm text-muted-foreground">No related activities found</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={activity.author.avatar} alt={activity.author.name} />
              <AvatarFallback>{activity.author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{activity.author.name}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {activity.time}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
