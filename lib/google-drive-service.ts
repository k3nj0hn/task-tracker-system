/**
 * Google Drive API service for file uploads and management
 */

interface GoogleDriveConfig {
  apiKey: string
  clientId: string
  discoveryDoc: string
  scopes: string
}

interface UploadedFile {
  id: string
  name: string
  webViewLink: string
  webContentLink: string
  thumbnailLink?: string
}

class GoogleDriveService {
  private gapi: any
  private isInitialized = false
  private config: GoogleDriveConfig

  constructor() {
    this.config = {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      discoveryDoc: "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
      scopes: "https://www.googleapis.com/auth/drive.file",
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Load Google API
      await this.loadGoogleAPI()

      // Initialize gapi
      await this.gapi.load("auth2", () => {})
      await this.gapi.load("client", () => {})

      await this.gapi.client.init({
        apiKey: this.config.apiKey,
        clientId: this.config.clientId,
        discoveryDocs: [this.config.discoveryDoc],
        scope: this.config.scopes,
      })

      this.isInitialized = true
    } catch (error) {
      console.error("Failed to initialize Google Drive API:", error)
      throw new Error("Failed to initialize Google Drive API")
    }
  }

  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && (window as any).gapi) {
        this.gapi = (window as any).gapi
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = "https://apis.google.com/js/api.js"
      script.onload = () => {
        this.gapi = (window as any).gapi
        resolve()
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async signIn(): Promise<boolean> {
    try {
      await this.initialize()
      const authInstance = this.gapi.auth2.getAuthInstance()

      if (authInstance.isSignedIn.get()) {
        return true
      }

      await authInstance.signIn()
      return authInstance.isSignedIn.get()
    } catch (error) {
      console.error("Google Drive sign-in failed:", error)
      return false
    }
  }

  async uploadFile(file: File, folderId?: string): Promise<UploadedFile> {
    try {
      await this.initialize()

      const isSignedIn = await this.signIn()
      if (!isSignedIn) {
        throw new Error("User not signed in to Google Drive")
      }

      // Create file metadata
      const metadata = {
        name: file.name,
        parents: folderId ? [folderId] : undefined,
      }

      // Create form data for multipart upload
      const form = new FormData()
      form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }))
      form.append("file", file)

      // Upload to Google Drive
      const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`,
        },
        body: form,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const uploadedFile = await response.json()

      // Make file publicly viewable
      await this.makeFilePublic(uploadedFile.id)

      // Get file details with public links
      const fileDetails = await this.getFileDetails(uploadedFile.id)

      return fileDetails
    } catch (error) {
      console.error("File upload failed:", error)
      throw error
    }
  }

  private async makeFilePublic(fileId: string): Promise<void> {
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "reader",
          type: "anyone",
        }),
      })
    } catch (error) {
      console.error("Failed to make file public:", error)
    }
  }

  private async getFileDetails(fileId: string): Promise<UploadedFile> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,webViewLink,webContentLink,thumbnailLink`,
        {
          headers: {
            Authorization: `Bearer ${this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to get file details: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to get file details:", error)
      throw error
    }
  }

  async createFolder(name: string, parentId?: string): Promise<string> {
    try {
      await this.initialize()

      const isSignedIn = await this.signIn()
      if (!isSignedIn) {
        throw new Error("User not signed in to Google Drive")
      }

      const metadata = {
        name: name,
        mimeType: "application/vnd.google-apps.folder",
        parents: parentId ? [parentId] : undefined,
      }

      const response = await fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      })

      if (!response.ok) {
        throw new Error(`Folder creation failed: ${response.statusText}`)
      }

      const folder = await response.json()
      return folder.id
    } catch (error) {
      console.error("Folder creation failed:", error)
      throw error
    }
  }

  // Convert Google Drive file ID to direct image URL
  getDirectImageUrl(fileId: string): string {
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }

  // Convert Google Drive file ID to thumbnail URL
  getThumbnailUrl(fileId: string, size = 200): string {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=s${size}`
  }
}

// Export singleton instance
export const googleDriveService = new GoogleDriveService()

// Helper functions for easier usage
export async function uploadImageToDrive(file: File, folderName?: string): Promise<string> {
  try {
    // Create or get folder for task tracker images
    let folderId: string | undefined

    if (folderName) {
      try {
        folderId = await googleDriveService.createFolder(folderName)
      } catch (error) {
        console.warn("Folder might already exist, continuing with upload...")
      }
    }

    const uploadedFile = await googleDriveService.uploadFile(file, folderId)
    return googleDriveService.getDirectImageUrl(uploadedFile.id)
  } catch (error) {
    console.error("Failed to upload image to Google Drive:", error)
    throw error
  }
}

export async function initializeGoogleDrive(): Promise<boolean> {
  try {
    await googleDriveService.initialize()
    return await googleDriveService.signIn()
  } catch (error) {
    console.error("Failed to initialize Google Drive:", error)
    return false
  }
}
