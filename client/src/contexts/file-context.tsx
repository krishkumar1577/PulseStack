import React, { createContext, useContext, useState } from "react"

export interface FileItem {
  id: number
  name: string
  folderId: number
  type: string // e.g. 'doc', 'pdf', etc.
}

interface FileContextType {
  files: FileItem[]
  addFile: (file: Omit<FileItem, "id">) => void
  updateFile: (id: number, data: Partial<Omit<FileItem, "id">>) => void
  deleteFile: (id: number) => void
}

const FileContext = createContext<FileContextType | undefined>(undefined)

const initialFiles: FileItem[] = []

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles)

  const addFile = (file: Omit<FileItem, "id">) => {
    setFiles(prev => [
      ...prev,
      { ...file, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
    ])
  }

  const updateFile = (id: number, data: Partial<Omit<FileItem, "id">>) => {
    setFiles(prev => prev.map(f => (f.id === id ? { ...f, ...data } : f)))
  }

  const deleteFile = (id: number) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  return (
    <FileContext.Provider value={{ files, addFile, updateFile, deleteFile }}>
      {children}
    </FileContext.Provider>
  )
}

export function useFileContext() {
  const ctx = useContext(FileContext)
  if (!ctx) throw new Error("useFileContext must be used within FileProvider")
  return ctx
}
