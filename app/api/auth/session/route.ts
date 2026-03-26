import { cookies } from "next/headers"
import type { Session } from "@/lib/types"

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return Response.json({ session: null })
  }

  try {
    const session: Session & { expiresAt: number } = JSON.parse(sessionCookie.value)
    
    if (session.expiresAt < Date.now()) {
      cookieStore.delete("session")
      return Response.json({ session: null })
    }

    return Response.json({ session })
  } catch {
    return Response.json({ session: null })
  }
}
