// Local storage utilities for client-side data persistence

export interface StorageData {
  tasks: any[]
  users: any[]
  customization: any
  settings: any
}

class LocalStorageService {
  private prefix = "task-tracker-"

  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(this.prefix + key, serializedValue)
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.prefix + key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return defaultValue
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key)
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error("Error clearing localStorage:", error)
    }
  }

  // Specific methods for app data
  saveTasks(tasks: any[]): void {
    this.setItem("tasks", tasks)
  }

  getTasks(): any[] {
    return this.getItem("tasks", [])
  }

  saveUsers(users: any[]): void {
    this.setItem("users", users)
  }

  getUsers(): any[] {
    return this.getItem("users", [])
  }

  saveCustomization(customization: any): void {
    this.setItem("customization", customization)
  }

  getCustomization(): any {
    return this.getItem("customization", {
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
  }

  saveSettings(settings: any): void {
    this.setItem("settings", settings)
  }

  getSettings(): any {
    return this.getItem("settings", {
      notifications: {
        email: true,
        dailyReminders: true,
        taskUpdates: true,
      },
      autoLogout: true,
      theme: "light",
    })
  }
}

export const storage = new LocalStorageService()
