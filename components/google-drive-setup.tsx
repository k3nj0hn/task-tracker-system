"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { initializeGoogleDrive } from "@/lib/google-drive-service"

export function GoogleDriveSetup() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      // Check if user is already signed in
      if (typeof window !== "undefined" && (window as any).gapi) {
        const authInstance = (window as any).gapi.auth2?.getAuthInstance()
        if (authInstance?.isSignedIn?.get()) {
          setIsConnected(true)
        }
      }
    } catch (error) {
      console.error("Error checking Google Drive connection:", error)
    }
  }

  const handleConnect = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const success = await initializeGoogleDrive()
      if (success) {
        setIsConnected(true)
      } else {
        setError("Failed to connect to Google Drive. Please try again.")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to connect to Google Drive")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    try {
      if (typeof window !== "undefined" && (window as any).gapi) {
        const authInstance = (window as any).gapi.auth2?.getAuthInstance()
        authInstance?.signOut()
        setIsConnected(false)
      }
    } catch (error) {
      console.error("Error disconnecting from Google Drive:", error)
    }
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Google Drive Integration
              {isConnected && (
                <Badge variant="default" className="rounded-full">
                  Connected
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Connect to Google Drive to store and manage your uploaded images</CardDescription>
          </div>
          {isConnected ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <AlertCircle className="w-8 h-8 text-orange-500" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isConnected ? (
          <div className="space-y-4">
            <Alert className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                To upload images, you need to connect to Google Drive. This will allow the system to store your images
                securely.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-medium">Setup Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Click "Connect to Google Drive" below</li>
                <li>Sign in with your Google account</li>
                <li>Grant permission to access Google Drive</li>
                <li>Start uploading images to the system</li>
              </ol>
            </div>

            <Button onClick={handleConnect} disabled={isLoading} className="w-full rounded-xl">
              {isLoading ? "Connecting..." : "Connect to Google Drive"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="rounded-xl border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Successfully connected to Google Drive! You can now upload images.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDisconnect} className="rounded-xl bg-transparent">
                Disconnect
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("https://drive.google.com", "_blank")}
                className="rounded-xl"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Google Drive
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
