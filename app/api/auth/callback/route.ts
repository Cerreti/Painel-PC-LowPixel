import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { DiscordUser } from "@/lib/types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    redirect("/?error=no_code")
  }

  const clientId = process.env.DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/callback`

  // Trocar code por access token
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId || "",
      client_secret: clientSecret || "",
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  })

  if (!tokenResponse.ok) {
    redirect("/?error=token_failed")
  }

  const tokenData = await tokenResponse.json()
  const accessToken = tokenData.access_token

  // Buscar dados do usuário
  const userResponse = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!userResponse.ok) {
    redirect("/?error=user_fetch_failed")
  }

  const user: DiscordUser = await userResponse.json()

  // Buscar guilds do usuário para verificar cargos
  const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  let userRoles: string[] = []
  let isAdmin = false

  if (guildsResponse.ok) {
    const adminRoleIds = (process.env.ADMIN_ROLE_IDS || "").split(",").filter(Boolean)
    
    // Nota: Para obter roles específicos do usuário em uma guild, 
    // seria necessário um bot com acesso ao servidor.
    // Por simplicidade, vamos verificar se o usuário tem acesso ao sistema.
    // Em produção, você pode usar um bot para verificar roles específicos.
    
    // Por agora, verificamos se o ID do usuário está em uma lista de admins
    // ou se há uma variável de ambiente com IDs de admins
    const adminUserIds = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean)
    isAdmin = adminUserIds.includes(user.id) || adminRoleIds.length === 0
    
    // Para um sistema mais robusto, você precisaria de um bot Discord
    // que possa verificar os roles do usuário em um servidor específico
  }

  // Criar sessão
  const session = {
    user,
    accessToken,
    isAdmin,
    roles: userRoles,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 dias
  }

  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  })

  redirect("/dashboard")
}
