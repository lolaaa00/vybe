"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect } from "react"

export default function NotFound() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark")
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--background)" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="text-6xl font-black mb-4" style={{ color: "var(--primary)" }}>404</div>
        <div className="text-xl font-bold mb-2" style={{ color: "var(--body)" }}>
          Page not found
        </div>
        <div className="text-sm mb-8" style={{ color: "var(--secondary)" }}>
          This page does not exist or has been moved.
        </div>
        <Link href="/"
          className="inline-block px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200"
          style={{ background: "var(--primary)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}>
          Back to Vybe →
        </Link>
        <div className="text-xs font-mono mt-8" style={{ color: "var(--secondary)" }}>
          VYBE · INTERNET PASSPORT · 2026
        </div>
      </motion.div>
    </div>
  )
}
