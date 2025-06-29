import { uploadImageToDrive, initializeGoogleDrive } from "./google-drive-service"

/**
 * Uploads a file using Google Drive
 * @param file The file to upload
 * @returns A promise that resolves to the URL of the uploaded file
 */
export async function uploadFile(file: File): Promise<string> {
  try {
    // Initialize Google Drive if not already done
    const isInitialized = await initializeGoogleDrive()
    if (!isInitialized) {
      throw new Error("Failed to initialize Google Drive. Please sign in.")
    }

    // Upload to Google Drive
    const url = await uploadImageToDrive(file, "Task Tracker Images")
    return url
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

/**
 * Uploads an image file with validation to Google Drive
 * @param file The image file to upload
 * @param maxSizeMB Maximum file size in MB
 * @returns A promise that resolves to the URL of the uploaded image
 */
export async function uploadImage(file: File, maxSizeMB = 5): Promise<string> {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image")
  }

  // Validate file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    throw new Error(`Image must be smaller than ${maxSizeMB}MB`)
  }

  return uploadFile(file)
}

/**
 * Upload multiple images to Google Drive
 * @param files Array of files to upload
 * @param onProgress Callback for upload progress
 * @returns Promise that resolves to array of URLs
 */
export async function uploadMultipleImages(
  files: File[],
  onProgress?: (completed: number, total: number) => void,
): Promise<string[]> {
  const urls: string[] = []

  for (let i = 0; i < files.length; i++) {
    try {
      const url = await uploadImage(files[i])
      urls.push(url)

      if (onProgress) {
        onProgress(i + 1, files.length)
      }
    } catch (error) {
      console.error(`Failed to upload file ${files[i].name}:`, error)
      throw error
    }
  }

  return urls
}
