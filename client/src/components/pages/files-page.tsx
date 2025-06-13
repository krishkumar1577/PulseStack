"use client"

import { useFolderContext } from "@/contexts/folder-context"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical, FileText } from "lucide-react"

export default function FilesPage() {
  const { folders } = useFolderContext()

  return (
    <div className="flex-1 overflow-auto px-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Folders</h2>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {folders.map(folder => (
          <div
            key={folder.id}
            className="bg-card rounded-lg p-4 flex flex-col h-[104px] hover:border-primary/20 hover:border transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                {folder.icon || <FileText className="h-4 w-4 text-muted-foreground" />}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-auto">
              <div className="text-foreground font-medium text-sm">{folder.name}</div>
              <div className="text-xs text-muted-foreground">{folder.fileCount} Files</div>
            </div>
          </div>
        ))}
        <div className="bg-card rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-secondary/70 transition-colors h-[104px]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Plus className="h-5 w-5" />
            <span>Add New</span>
          </div>
        </div>
      </div>
    </div>
  )
}
