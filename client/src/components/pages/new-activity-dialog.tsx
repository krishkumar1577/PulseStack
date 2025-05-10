"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface NewActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    type: "task" | "project" | "file"
    project: string
    title: string
    description: string
    category: string
  }) => void
}

type ActivityFormData = {
  type: "task" | "project" | "file"
  project: string
  title: string
  description: string
  category: string
}

export function NewActivityDialog({ open, onOpenChange, onSubmit }: NewActivityDialogProps) {
  const [formData, setFormData] = useState<ActivityFormData>({
    type: "task",
    project: "",
    title: "",
    description: "",
    category: "Development",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.project || !formData.title || !formData.description) {
      toast.error("Please fill in all required fields")
      return
    }
    onSubmit(formData)
    onOpenChange(false)
    setFormData({
      type: "task",
      project: "",
      title: "",
      description: "",
      category: "Development",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Track New Activity</DialogTitle>
          <DialogDescription>
            Add details about your new activity. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="type">Activity Type</label>
              <Select
                value={formData.type}
                onValueChange={(value: "task" | "project" | "file") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="project">Project Name</label>
              <Input
                id="project"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter activity title"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter activity description"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Activity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
