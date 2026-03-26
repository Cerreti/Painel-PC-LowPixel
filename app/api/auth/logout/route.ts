import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  redirect("/")
}

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  return Response.json({ success: true })
}
