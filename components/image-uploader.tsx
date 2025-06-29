"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, CheckCircle, AlertCircle } from "lucide-react"
import { uploadImage } from "@/lib/upload-service"

interface ImageUploaderProps {
  id: string
  onUpload: (file: File) => void
  className?: string
  label?: string
  disabled?: boolean
}

export function ImageUploader({
  id,
  onUpload,
  className = "",
  label = "Upload Image",
  disabled = false,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Start upload process
    setIsUploading(true)
    setUploadStatus("uploading")
    setUploadProgress(0)
    setError(null)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload to Google Drive
      await uploadImage(file)

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadStatus("success")

      // Call the onUpload callback
      onUpload(file)
    } catch (error) {
      setUploadStatus("error")
      setError(error instanceof Error ? error.message : "Upload failed")
      setPreview(null)
    } finally {
      setIsUploading(false)

      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0)
        if (uploadStatus === "success") {
          setUploadStatus("idle")
        }
      }, 2000)
    }
  }

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Upload className="h-6 w-6" />
    }
  }

  const getStatusText = () => {
    switch (uploadStatus) {
      case "uploading":
        return "Uploading to Google Drive..."
      case "success":
        return "Upload successful!"
      case "error":
        return error || "Upload failed"
      default:
        return label
    }
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || isUploading}
      />

      {preview ? (
        <div className="relative mb-2 w-full">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-auto rounded-md object-cover max-h-48"
          />
          <Button
            size="sm"
            variant="secondary"
            className="absolute bottom-2 right-2 opacity-80"
            onClick={handleClick}
            disabled={disabled || isUploading}
          >
            {isUploading ? "Uploading..." : "Change"}
          </Button>

          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
              <div className="bg-white p-4 rounded-lg min-w-48">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">{uploadProgress}%</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className={`w-full h-24 flex flex-col items-center justify-center border-dashed ${
            uploadStatus === "error" ? "border-red-300 bg-red-50" : ""
          } ${uploadStatus === "success" ? "border-green-300 bg-green-50" : ""}`}
        >
          {getStatusIcon()}
          <span className="mt-1 text-sm">{getStatusText()}</span>
          {isUploading && (
            <div className="w-full mt-2">
              <Progress value={uploadProgress} className="h-1" />
            </div>
          )}
        </Button>
      )}

      {error && uploadStatus === "error" && <p className="text-xs text-red-600 mt-1 text-center">{error}</p>}
    </div>
  )
}
