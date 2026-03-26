"use client"

import { useEffect, useState, useCallback } from "react"
import type { Session } from "@/lib/types"

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session")
      const data = await response.json()
      setSession(data.session)
    } catch (error) {
      console.error("Erro ao buscar sessão:", error)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setSession(null)
    window.location.href = "/"
  }, [])

  return { session, loading, logout, refetch: fetchSession }
}
