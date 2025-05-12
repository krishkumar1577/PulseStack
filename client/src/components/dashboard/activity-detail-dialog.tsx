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
import { Clock, GitBranch, GitCommit, GitPullRequest, FileText, Check, CircleDot } from "lucide-react"
import type { Activity } from "@/types/activity"
import { Button } from "@/components/ui/button"

interface ActivityDetailDialogProps {
  activity: Activity | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (activityId: number) => void
  activities?: Activity[] // Add this to access all activities
}

// Helper function to calculate similarity score between two activities
function calculateActivitySimilarity(a: Activity, b: Activity): number {
  let score = 0;
  
  // Same project
  if (a.project === b.project) score += 3;
  
  // Same category
  if (a.category === b.category) score += 2;
  
  // Same type
  if (a.type === b.type) score += 1;
  
  // Time proximity (for activities with relative time)
  const timeA = a.time.match(/(\d+)\s+(hours?|days?) ago/);
  const timeB = b.time.match(/(\d+)\s+(hours?|days?) ago/);
  
  if (timeA && timeB) {
    const [, amountA, unitA] = timeA;
    const [, amountB, unitB] = timeB;
    
    const hoursA = unitA.startsWith('hour') ? parseInt(amountA) : parseInt(amountA) * 24;
    const hoursB = unitB.startsWith('hour') ? parseInt(amountB) : parseInt(amountB) * 24;
    
    // If activities are within 24 hours of each other
    if (Math.abs(hoursA - hoursB) <= 24) score += 1;
  }
  
  return score;
}

// Function to find related activities
function findRelatedActivities(currentActivity: Activity, allActivities: Activity[]): Activity[] {
  const relatedActivities = allActivities
    .filter(activity => activity.id !== currentActivity.id)
    .map(activity => ({
      activity,
      score: calculateActivitySimilarity(currentActivity, activity)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Get top 3 related activities
    .map(item => item.activity);

  return relatedActivities;
}

export function ActivityDetailDialog({ 
  activity, 
  open, 
  onOpenChange,
  onStatusChange,
  activities = [] // Default to empty array if not provided
}: ActivityDetailDialogProps) {
  if (!activity) return null

  const icons: Record<Activity['type'], JSX.Element> = {
    task: <GitCommit className="h-4 w-4" />,
    project: <GitPullRequest className="h-4 w-4" />,
    file: <FileText className="h-4 w-4" />,
  }

  const relatedActivities = findRelatedActivities(activity, activities);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
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
        
        <div className="space-y-6 flex-1 overflow-y-auto px-6 -mx-6">
          {/* Status */}
          <div className="border-b pb-4">
            <h4 className="text-sm font-medium mb-2">Status</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activity.status === "completed" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <CircleDot className="h-4 w-4 text-orange-500" />
                )}
                <span className="text-sm capitalize">{activity.status}</span>
                {activity.completedAt && (
                  <span className="text-sm text-muted-foreground">
                    (Completed on {new Date(activity.completedAt).toLocaleDateString()})
                  </span>
                )}
              </div>
              {onStatusChange && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange(activity.id)}
                >
                  {activity.status === "completed" ? "Mark In Progress" : "Mark Complete"}
                </Button>
              )}
            </div>
          </div>

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
              {activity.history ? (
                activity.history.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">{item.action}</span>
                    <span className="text-xs text-muted-foreground">
                      ({new Date(item.timestamp).toLocaleString()})
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Created {activity.time}</span>
                </div>
              )}
            </div>
          </div>

          {/* Related Activities */}
          <div>
            <h4 className="text-sm font-medium mb-2">Related Activities</h4>
            <div className="space-y-2">
              {relatedActivities.length > 0 ? (
                relatedActivities.map((relatedActivity) => (
                  <div
                    key={relatedActivity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="rounded-full bg-secondary p-1.5">
                      {icons[relatedActivity.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">
                          {relatedActivity.title}
                        </span>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {relatedActivity.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {relatedActivity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            relatedActivity.status === "completed" 
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                          }`}
                        >
                          {relatedActivity.status === "completed" ? (
                            <Check className="mr-1 h-3 w-3" />
                          ) : (
                            <CircleDot className="mr-1 h-3 w-3" />
                          )}
                          {relatedActivity.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {relatedActivity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No related activities found</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t flex-shrink-0 px-6 -mx-6">
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
