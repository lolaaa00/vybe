"use client"

import { useCallback, useEffect, useState } from "react"
import { useThemeStore } from "@/store/themeStore"
import ThemeToggle from "@/components/ui/ThemeToggle"
import SignIn from "@/features/auth/SignIn"
import HandleSetup from "@/features/auth/HandleSetup"
import ConnectPlatforms from "@/features/passport/ConnectPlatforms"
import GeneratingPassport from "@/features/passport/GeneratingPassport"
import PassportView from "@/features/passport/PassportView"
import {
  getCurrentSession,
  loadDashboardData,
  onAuthStateChange,
  signOut,
} from "@/features/auth/authService"
import { DashboardData } from "@/types"

function LoadingScreen({ label }: { label: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--primary)" }}>
          <span className="text-white font-bold text-sm">V</span>
        </div>
        <div className="text-xs font-mono" style={{ color: "var(--secondary)" }}>{label}</div>
      </div>
    </main>
  )
}

export default function Home() {
  const { theme } = useThemeStore()
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [notice, setNotice] = useState<string | null>(() => {
    if (typeof window === "undefined") return null

    const params = new URLSearchParams(window.location.search)
    const connected = params.get("connected")
    const integrationError = params.get("integration_error")
    const auth = params.get("auth")

    if (connected) return `${connected} connected successfully.`
    if (integrationError) return `Connection failed: ${integrationError}`
    if (auth === "required") return "Sign in before connecting a platform."
    return null
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const session = await getCurrentSession()
      setAuthenticated(Boolean(session))
      if (!session) {
        setDashboard(null)
        return
      }
      const data = await loadDashboardData()
      setDashboard(data)
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Unable to load Vybe.")
      setDashboard(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    queueMicrotask(() => {
      if (active) void refresh()
    })
    const unsubscribe = onAuthStateChange(refresh)
    return () => {
      active = false
      unsubscribe()
    }
  }, [refresh])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hasTransientParams =
      params.has("connected") || params.has("integration_error") || params.has("auth")

    if (hasTransientParams) {
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setDashboard(null)
    setAuthenticated(false)
  }

  if (loading) {
    return <LoadingScreen label="LOADING VYBE..." />
  }

  if (!authenticated || !dashboard) {
    return (
      <main style={{ background: "var(--background)", minHeight: "100vh" }}>
        <ThemeToggle />
        {notice && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-2 text-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--body)" }}>
            {notice}
          </div>
        )}
        <SignIn />
      </main>
    )
  }

  if (!dashboard.profile.handle) {
    return (
      <main style={{ background: "var(--background)", minHeight: "100vh" }}>
        <ThemeToggle />
        <HandleSetup profile={dashboard.profile} onSaved={refresh} />
      </main>
    )
  }

  if (generating) {
    return (
      <main style={{ background: "var(--background)", minHeight: "100vh" }}>
        <ThemeToggle />
        <GeneratingPassport
          onCancel={() => setGenerating(false)}
          onComplete={(data) => {
            setDashboard(data)
            setGenerating(false)
          }}
        />
      </main>
    )
  }

  return (
    <main style={{ background: "var(--background)", minHeight: "100vh" }}>
      <ThemeToggle />
      {notice && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-2 text-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--body)" }}>
          {notice}
        </div>
      )}
      {dashboard.sections.length > 0 ? (
        <PassportView
          profile={dashboard.profile}
          connectedAccounts={dashboard.connectedAccounts}
          sections={dashboard.sections}
          publicPassport={dashboard.publicPassport}
          onRefresh={refresh}
          onRegenerate={() => setGenerating(true)}
          onSignOut={handleSignOut}
        />
      ) : (
        <ConnectPlatforms
          profile={dashboard.profile}
          connectedAccounts={dashboard.connectedAccounts}
          hasSections={dashboard.sections.length > 0}
          onGenerate={() => setGenerating(true)}
          onRefresh={refresh}
        />
      )}
    </main>
  )
}
