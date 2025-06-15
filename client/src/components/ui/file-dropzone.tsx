import React, { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"

interface FileDropzoneProps {
  onFiles: (files: FileList) => void
}

export function FileDropzone({ onFiles }: FileDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFiles(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(e.target.files)
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${dragActive ? "border-primary bg-primary/10" : "border-muted"}`}
      onClick={handleClick}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <UploadCloud className="h-10 w-10 text-primary mb-2" />
      <p className="font-medium mb-1">Drag & drop files or folders here</p>
      <p className="text-xs text-muted-foreground mb-3">or click to select</p>
      <Button variant="outline" type="button" onClick={handleClick}>
        Browse Files
      </Button>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
        webkitdirectory="true"
        directory="true"
      />
    </div>
  )
}
