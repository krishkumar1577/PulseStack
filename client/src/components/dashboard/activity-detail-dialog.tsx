"use client"

import type { JSX } from "react"
import React, { useState } from "react"
import type { Activity, ActivityComment } from "@/types/activity"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Clock, 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  FileText, 
  Check, 
  CircleDot,
  Pencil,
  Calendar,
  Tags,
  Users,
  X,
  Flag,
  Send,
  Smile
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"

interface ActivityDetailDialogProps {
  activity: Activity | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (activityId: number) => void
  onActivityUpdate?: (activityId: number, updates: Partial<Activity>) => void
  onCommentAdd?: (activityId: number, comment: Omit<ActivityComment, "id" | "timestamp" | "author">) => void
  activities?: Activity[]
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
  onActivityUpdate,
  onCommentAdd,
  activities = []
}: ActivityDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedActivity, setEditedActivity] = useState<Partial<Activity>>({})
  const [newComment, setNewComment] = useState("")

  if (!activity) return null

  const icons: Record<Activity['type'], JSX.Element> = {
    task: <GitCommit className="h-4 w-4" />,
    project: <GitPullRequest className="h-4 w-4" />,
    file: <FileText className="h-4 w-4" />,
  }

  const relatedActivities = findRelatedActivities(activity, activities)

  const handleUpdate = () => {
    if (onActivityUpdate && Object.keys(editedActivity).length > 0) {
      onActivityUpdate(activity.id, editedActivity)
      setIsEditing(false)
      setEditedActivity({})
    }
  }

  const handleAddComment = () => {
    if (onCommentAdd && newComment.trim()) {
      onCommentAdd(activity.id, {
        content: newComment.trim(),
        reactions: []
      })
      setNewComment("")
    }
  }

  const priorityColors = {
    low: "text-blue-500",
    medium: "text-yellow-500",
    high: "text-red-500"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between mb-2 mt-2.5">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-secondary p-2">
                {icons[activity.type]}
              </div>
              <Badge variant="outline" className="text-xs">
                <GitBranch className="mr-1 h-3 w-3" />
                {activity.category}
              </Badge>
            </div>
            {!isEditing ? (
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => {
                  setIsEditing(false)
                  setEditedActivity({})
                }}>
                  <X className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleUpdate}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={editedActivity.title ?? activity.title}
                onChange={(e) => setEditedActivity({ ...editedActivity, title: e.target.value })}
                className="font-semibold"
              />
              <Textarea
                value={editedActivity.description ?? activity.description}
                onChange={(e) => setEditedActivity({ ...editedActivity, description: e.target.value })}
                className="resize-none"
                rows={3}
              />
            </div>
          ) : (
            <>
              <DialogTitle>{activity.title}</DialogTitle>
              <DialogDescription>{activity.description}</DialogDescription>
            </>
          )}
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

          {/* Details Section */}
          <div className="border-b pb-4">
            <h4 className="text-sm font-medium mb-2">Details</h4>
            <div className="space-y-3">
              {/* Project */}
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={editedActivity.project ?? activity.project}
                    onChange={(e) => setEditedActivity({ ...editedActivity, project: e.target.value })}
                    className="h-8"
                  />
                ) : (
                  <span className="text-sm">{activity.project}</span>
                )}
              </div>

              {/* Priority */}
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Select
                    value={editedActivity.priority ?? activity.priority ?? "medium"}
                    onValueChange={(value) => setEditedActivity({ ...editedActivity, priority: value as Activity["priority"] })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className={`text-sm capitalize ${activity.priority ? priorityColors[activity.priority] : ""}`}>
                    {activity.priority ?? "Medium"} Priority
                  </span>
                )}
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedActivity.dueDate ?? activity.dueDate ?? ""}
                    onChange={(e) => setEditedActivity({ ...editedActivity, dueDate: e.target.value })}
                    className="h-8"
                  />
                ) : (
                  <span className="text-sm">
                    {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : "No due date"}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2">
                <Tags className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={editedActivity.tags?.join(", ") ?? activity.tags?.join(", ") ?? ""}
                    onChange={(e) => setEditedActivity({ 
                      ...editedActivity, 
                      tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                    })}
                    placeholder="Enter tags separated by commas"
                    className="h-8"
                  />
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {activity.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    )) ?? <span className="text-sm text-muted-foreground">No tags</span>}
                  </div>
                )}
              </div>

              {/* Assignees */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex -space-x-2">
                  {activity.assignees?.map((assignee) => (
                    <Avatar key={assignee.name} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={assignee.avatar} />
                      <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                    </Avatar>
                  )) ?? <span className="text-sm text-muted-foreground">No assignees</span>}
                </div>
              </div>
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

          {/* Comments Section */}
          <div className="border-b pb-4">
            <h4 className="text-sm font-medium mb-2">Comments</h4>
            <div className="space-y-4">
              {activity.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comment.author.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    {comment.reactions && comment.reactions.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {comment.reactions.map((reaction, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs px-2 py-0 h-6"
                          >
                            {reaction.emoji} {reaction.count}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-2 items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.author.avatar} />
                  <AvatarFallback>{activity.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={!newComment.trim()}
                    onClick={handleAddComment}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
