import { redirect } from "next/navigation"

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/callback`
  
  const params = new URLSearchParams({
    client_id: clientId || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify guilds guilds.members.read",
  })

  redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`)
}
