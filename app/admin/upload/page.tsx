"use client"

import { useState } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { uploadImage } from "@/lib/upload-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<Record<string, string>>({
    logo: "",
    generalServicesLogo: "",
    dashboardIllustration: "",
    aboutIllustration: "",
    profileHead: "",
    profile1: "",
    profile2: "",
    profile3: "",
    profile4: "",
  })

  const handleUpload = async (id: string, file: File) => {
    try {
      setIsUploading(true)
      const url = await uploadImage(file)

      setUploadedUrls((prev) => ({
        ...prev,
        [id]: url,
      }))

      toast({
        title: "Upload successful",
        description: `${id} has been uploaded successfully.`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveAll = () => {
    // Here you would typically save all the URLs to your database
    console.log("Saving all uploaded images:", uploadedUrls)

    toast({
      title: "Settings saved",
      description: "All image settings have been saved successfully.",
    })
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Upload System Images</h1>
      <p className="text-muted-foreground mb-8">
        Upload images for the Engineering and General Services Data Monitoring System. These images will be displayed
        throughout the application.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Main Logo</CardTitle>
            <CardDescription>The main logo of Ilocos Sur Medical Center</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader id="logo" onUpload={(file) => handleUpload("logo", file)} label="Upload Logo" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>General Services Logo</CardTitle>
            <CardDescription>Logo for the General Services Office</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              id="generalServicesLogo"
              onUpload={(file) => handleUpload("generalServicesLogo", file)}
              label="Upload Logo"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard Illustration</CardTitle>
            <CardDescription>Main illustration for the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              id="dashboardIllustration"
              onUpload={(file) => handleUpload("dashboardIllustration", file)}
              label="Upload Illustration"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Illustration</CardTitle>
            <CardDescription>Illustration for the About section</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              id="aboutIllustration"
              onUpload={(file) => handleUpload("aboutIllustration", file)}
              label="Upload Illustration"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Head Profile</CardTitle>
            <CardDescription>Profile picture of the department head</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              id="profileHead"
              onUpload={(file) => handleUpload("profileHead", file)}
              label="Upload Profile"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Profiles</CardTitle>
            <CardDescription>Profile pictures for staff members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="mb-2">
                <p className="text-sm mb-1">Staff Member {index}</p>
                <ImageUploader
                  id={`profile${index}`}
                  onUpload={(file) => handleUpload(`profile${index}`, file)}
                  label={`Upload Profile ${index}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveAll} disabled={isUploading} className="px-8">
          Save All Images
        </Button>
      </div>
    </div>
  )
}
