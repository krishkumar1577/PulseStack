"use client"

import { useFolderContext } from "@/contexts/folder-context"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FolderCard } from "@/components/ui/folder-card"
import { useState } from "react"
import { FileDropzone } from "@/components/ui/file-dropzone"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export default function FilesPage() {
  const { folders } = useFolderContext()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [activeFolder, setActiveFolder] = useState(null)
  const [folderDialogOpen, setFolderDialogOpen] = useState(false)

  // Placeholder upload modal content
  const handleFiles = (files: FileList) => {
    setUploadOpen(false)
  }
 
  // Folder management modal for inside-folder view
  const FolderManageModal = activeFolder && (
    <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
      <DialogContent className="w-[802px] h-[470px] flex flex-col items-center justify-center p-0">
        {/* Accessible title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">{activeFolder.name}</DialogTitle>
        <div className="w-full flex flex-col items-center justify-center py-10">
          <h3 className="text-2xl font-bold mb-6 text-center">{activeFolder.name}</h3>
          <div className="w-full flex flex-col gap-8">
            {/* Tabular file list example */}
            <div className="overflow-x-auto w-full">
              <table className="min-w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">File Name</th>
                    <th className="px-4 py-2 text-left font-semibold">Type</th>
                    <th className="px-4 py-2 text-left font-semibold">Size</th>
                    <th className="px-4 py-2 text-left font-semibold">Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2">ProjectPlan.pdf</td>
                    <td className="px-4 py-2">PDF</td>
                    <td className="px-4 py-2">1.2 MB</td>
                    <td className="px-4 py-2">2025-06-10</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2">Design.sketch</td>
                    <td className="px-4 py-2">Sketch</td>
                    <td className="px-4 py-2">3.8 MB</td>
                    <td className="px-4 py-2">2025-06-09</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Notes.txt</td>
                    <td className="px-4 py-2">Text</td>
                    <td className="px-4 py-2">8 KB</td>
                    <td className="px-4 py-2">2025-06-08</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <Button variant="outline" size="sm">Add File</Button>
              <Button variant="outline" size="sm">Rename Folder</Button>
              <Button variant="secondary" size="sm">Open Canvas</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="flex-1 overflow-auto px-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Folders</h2>
        <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {folders.map(folder => (
          <FolderCard
            key={folder.id}
            count={folder.fileCount}
            title={folder.name}
            icon={folder.icon}
            onClick={() => {
              setActiveFolder(folder)
              setFolderDialogOpen(true)
            }}
          />
        ))}
        <div
          className="bg-card rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-secondary/70 transition-colors h-[104px]"
          onClick={() => setUploadOpen(true)}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Plus className="h-5 w-5" />
            <span>Add New</span>
          </div>
        </div>
      </div>
      {/* Upload Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-xl shadow-lg w-full max-w-2xl p-8 relative flex flex-col items-center">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setUploadOpen(false)}
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-6 text-center">Upload Files or Folders</h3>
            <div className="w-full max-w-md">
              <FileDropzone onFiles={handleFiles} />
            </div>
          </div>
        </div>
      )}
      {/* Folder Management Modal */}
      {FolderManageModal}
    </div>
  )
}
