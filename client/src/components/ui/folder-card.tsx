import { FileText, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

export interface FolderCardProps {
  count: number
  title: string
  icon?: React.ReactNode
  onClick?: () => void
  onMenuClick?: (e: React.MouseEvent) => void
}

export function FolderCard({ count, title, icon, onClick, onMenuClick }: FolderCardProps) {
  return (
    <div
      className="bg-card rounded-lg p-4 flex flex-col h-[104px] hover:border-primary/20 hover:border transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
          {icon || <FileText className="h-4 w-4 text-muted-foreground" />}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onMenuClick}>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onMenuClick}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-auto">
        <div className="text-foreground font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{count} Files</div>
      </div>
    </div>
  )
}
