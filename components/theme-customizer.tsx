"use client"

import { useEffect } from "react"
import { useCustomization } from "./customization-provider"

export function ThemeCustomizer() {
  const { customization } = useCustomization()

  useEffect(() => {
    // Apply theme customizations to the document
    const root = document.documentElement

    // Apply color variables
    Object.entries(customization.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value as string)
    })

    // Apply layout classes
    document.body.className = `
      sidebar-${customization.layout.sidebarPosition}
      header-${customization.layout.headerStyle}
      content-${customization.layout.contentWidth}
      cards-${customization.layout.cardsPerRow}
      card-style-${customization.layout.cardStyle}
      ${customization.layout.showBreadcrumbs ? "show-breadcrumbs" : ""}
      ${customization.layout.showCardIcons ? "show-card-icons" : ""}
    `
      .trim()
      .replace(/\s+/g, " ")
  }, [customization])

  return null
}
