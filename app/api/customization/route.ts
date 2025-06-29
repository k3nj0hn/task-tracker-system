import { type NextRequest, NextResponse } from "next/server"

// Mock storage - in production, use a real database
let customizationSettings: any = {
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
      "A system providing solutions to help professionals and administrators manage operations with ease. The Data Monitoring System offers real-time insights, actionable data, and advanced analytics, ensuring the Hospital's Engineering and General Services run efficiently and effectively.",
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
}

export async function GET() {
  return NextResponse.json(customizationSettings)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the customization data
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid customization data" }, { status: 400 })
    }

    // Update the customization settings
    customizationSettings = {
      ...customizationSettings,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    // In production, save to database
    // await saveCustomizationToDatabase(customizationSettings)

    return NextResponse.json({
      success: true,
      message: "Customization settings saved successfully",
      data: customizationSettings,
    })
  } catch (error) {
    console.error("Error saving customization:", error)
    return NextResponse.json({ error: "Failed to save customization settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 })
    }

    // Update specific customization setting
    const keys = key.split(".")
    let current = customizationSettings

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    customizationSettings.updatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      message: "Customization setting updated successfully",
      data: customizationSettings,
    })
  } catch (error) {
    console.error("Error updating customization:", error)
    return NextResponse.json({ error: "Failed to update customization setting" }, { status: 500 })
  }
}

// Helper function to apply customizations to CSS variables
export async function generateCustomCSS(customization: any): Promise<string> {
  return `
    :root {
      --primary-color: ${customization.colors.primary};
      --secondary-color: ${customization.colors.secondary};
      --accent-color: ${customization.colors.accent};
      --background-color: ${customization.colors.background};
      --success-color: ${customization.colors.success};
      --warning-color: ${customization.colors.warning};
      --error-color: ${customization.colors.error};
      --info-color: ${customization.colors.info};
    }

    .custom-primary {
      background-color: var(--primary-color) !important;
    }

    .custom-secondary {
      background-color: var(--secondary-color) !important;
    }

    .custom-accent {
      background-color: var(--accent-color) !important;
    }

    .custom-text-primary {
      color: var(--primary-color) !important;
    }

    .custom-border-primary {
      border-color: var(--primary-color) !important;
    }

    .sidebar-${customization.layout.sidebarPosition} {
      ${customization.layout.sidebarPosition === "right" ? "order: 2;" : "order: 0;"}
    }

    .header-${customization.layout.headerStyle} {
      position: ${customization.layout.headerStyle};
      ${customization.layout.headerStyle === "fixed" ? "top: 0; z-index: 1000;" : ""}
    }

    .content-${customization.layout.contentWidth} {
      ${
        customization.layout.contentWidth === "full"
          ? "max-width: 100%;"
          : customization.layout.contentWidth === "narrow"
            ? "max-width: 1024px;"
            : "max-width: 1280px;"
      }
      margin: 0 auto;
    }

    .cards-grid-${customization.layout.cardsPerRow} {
      grid-template-columns: repeat(${customization.layout.cardsPerRow}, 1fr);
    }

    .card-${customization.layout.cardStyle} {
      ${
        customization.layout.cardStyle === "elevated"
          ? "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
          : customization.layout.cardStyle === "outlined"
            ? "border: 1px solid #e5e7eb;"
            : "box-shadow: none;"
      }
    }
  `
}
