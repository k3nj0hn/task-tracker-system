"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface CustomizationContextType {
  customization: any
  updateCustomization: (path: string, value: any) => void
  loadCustomization: () => Promise<void>
  saveCustomization: () => Promise<void>
  applyCustomization: () => void
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined)

export function CustomizationProvider({ children }: { children: React.ReactNode }) {
  const [customization, setCustomization] = useState({
    systemTitle: "Task Tracker System",
    organizationName: "Ilocos Sur Medical Center",
    departmentName: "Engineering & General Services",
    tagline: "Empowering Smarter Healthcare Operations",
    colors: {
      primary: "#e84d0e",
      secondary: "#f0f0f0",
      accent: "#4caf50",
      background: "#f8f9fa",
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    layout: {
      sidebarPosition: "left",
      headerStyle: "fixed",
      contentWidth: "container",
      showBreadcrumbs: true,
      cardsPerRow: 4,
      cardStyle: "elevated",
      showCardIcons: true,
    },
    content: {
      welcomeTitle: "Welcome to Engineering and General Services Data Monitoring System",
      welcomeDescription:
        "A system providing solutions to help professionals and administrators manage operations with ease.",
      loginTitle: "Task Tracker System",
      loginSubtitle: "Engineering & General Services",
      loginInstructions: "Please sign in with your credentials to access the task tracking system.",
      copyright: "© 2024 Ilocos Sur Medical Center. All rights reserved.",
      version: "Version 1.0-2024-12-21",
    },
    logos: {
      mainLogo: "",
      deptLogo: "",
      favicon: "",
    },
  })

  const updateCustomization = (path: string, value: any) => {
    setCustomization((prev) => {
      const newCustomization = { ...prev }
      const keys = path.split(".")
      let current = newCustomization

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newCustomization
    })
  }

  const loadCustomization = async () => {
    try {
      const response = await fetch("/api/customization")
      if (response.ok) {
        const data = await response.json()
        setCustomization(data)
        applyCustomization()
      }
    } catch (error) {
      console.error("Error loading customization:", error)
    }
  }

  const saveCustomization = async () => {
    try {
      const response = await fetch("/api/customization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customization),
      })

      if (response.ok) {
        applyCustomization()
        return true
      } else {
        throw new Error("Failed to save customization")
      }
    } catch (error) {
      console.error("Error saving customization:", error)
      return false
    }
  }

  const applyCustomization = () => {
    // Apply CSS custom properties
    const root = document.documentElement
    root.style.setProperty("--primary-color", customization.colors.primary)
    root.style.setProperty("--secondary-color", customization.colors.secondary)
    root.style.setProperty("--accent-color", customization.colors.accent)
    root.style.setProperty("--background-color", customization.colors.background)
    root.style.setProperty("--success-color", customization.colors.success)
    root.style.setProperty("--warning-color", customization.colors.warning)
    root.style.setProperty("--error-color", customization.colors.error)
    root.style.setProperty("--info-color", customization.colors.info)

    // Update document title
    document.title = customization.systemTitle

    // Update favicon if provided
    if (customization.logos.favicon) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (favicon) {
        favicon.href = customization.logos.favicon
      }
    }
  }

  useEffect(() => {
    loadCustomization()
  }, [])

  const value = {
    customization,
    updateCustomization,
    loadCustomization,
    saveCustomization,
    applyCustomization,
  }

  return <CustomizationContext.Provider value={value}>{children}</CustomizationContext.Provider>
}

export function useCustomization() {
  const context = useContext(CustomizationContext)
  if (context === undefined) {
    throw new Error("useCustomization must be used within a CustomizationProvider")
  }
  return context
}
