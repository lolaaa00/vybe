"use client"

import { useEffect } from "react"
import { useThemeStore } from "@/store/themeStore"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <html lang="en" data-theme="dark">
      <head>
        <title>Vybe — Your Internet Passport</title>
        <meta name="description" content="A living passport for your internet identity" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
