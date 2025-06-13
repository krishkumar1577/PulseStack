import React, { createContext, useContext, useState } from "react"

export interface Folder {
  id: number
  name: string
  fileCount: number
  icon?: React.ReactNode
}

interface FolderContextType {
  folders: Folder[]
  addFolder: (folder: Omit<Folder, "id">) => void
  updateFolder: (id: number, data: Partial<Omit<Folder, "id">>) => void
  deleteFolder: (id: number) => void
}

const FolderContext = createContext<FolderContextType | undefined>(undefined)

const initialFolders: Folder[] = [
  { id: 1, name: "My Portfolio", fileCount: 54 },
  { id: 2, name: "Client Projects", fileCount: 87 },
  { id: 3, name: "Website Resources", fileCount: 145 },
  { id: 4, name: "Creative Assets", fileCount: 102 },
  { id: 5, name: "Product Designs", fileCount: 36 },
]

export function FolderProvider({ children }: { children: React.ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders)

  const addFolder = (folder: Omit<Folder, "id">) => {
    setFolders(prev => [
      ...prev,
      { ...folder, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
    ])
  }

  const updateFolder = (id: number, data: Partial<Omit<Folder, "id">>) => {
    setFolders(prev => prev.map(f => (f.id === id ? { ...f, ...data } : f)))
  }

  const deleteFolder = (id: number) => {
    setFolders(prev => prev.filter(f => f.id !== id))
  }

  return (
    <FolderContext.Provider value={{ folders, addFolder, updateFolder, deleteFolder }}>
      {children}
    </FolderContext.Provider>
  )
}

export function useFolderContext() {
  const ctx = useContext(FolderContext)
  if (!ctx) throw new Error("useFolderContext must be used within FolderProvider")
  return ctx
}
