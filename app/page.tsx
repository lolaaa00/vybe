"use client"

import { useEffect } from "react"
import { useThemeStore } from "@/store/themeStore"
import { useAppStore } from "@/store/appStore"
import ThemeToggle from "@/components/ui/ThemeToggle"
import SignIn from "@/features/auth/SignIn"
import ConnectPlatforms from "@/features/passport/ConnectPlatforms"
import GeneratingPassport from "@/features/passport/GeneratingPassport"
import PassportView from "@/features/passport/PassportView"

export default function Home() {
  const { theme } = useThemeStore()
  const { step } = useAppStore()

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <main style={{ background: "var(--background)", minHeight: "100vh" }}>
      <ThemeToggle />
      {step === 1 && <SignIn />}
      {step === 2 && <ConnectPlatforms />}
      {step === 3 && <GeneratingPassport />}
      {step === 4 && <PassportView />}
    </main>
  )
}
