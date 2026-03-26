"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { Spinner } from "@/components/ui/spinner"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session) {
      router.push("/")
    }
  }, [session, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-600 text-white">
      <DashboardNav />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
