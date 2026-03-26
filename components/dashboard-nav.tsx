"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, Clock, Search, UserPlus, Settings, LogOut, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Visão Geral", icon: Users },
  { href: "/dashboard/buscar", label: "Buscar", icon: Search },
  { href: "/dashboard/horas", label: "Horas", icon: Clock },
]

const adminItems = [
  { href: "/dashboard/cadastrar", label: "Cadastrar", icon: UserPlus },
  { href: "/dashboard/admin", label: "Admin", icon: Settings },
]

export function DashboardNav() {
  const { session, logout } = useSession()
  const pathname = usePathname()

  if (!session) return null

  const avatarUrl = session.user.avatar
    ? `https://cdn.discordapp.com/avatars/${session.user.id}/${session.user.avatar}.png`
    : null

  const displayName = session.user.global_name || session.user.username

  return (
    <header className="flex justify-center sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-gray-800 text-amber-50">
      <div className="container flex justify-between h-14 items-center">
        <div className="mr-4 flex justify-between">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <img src="/pc.png" alt="pc" className="w-5" />
            <span className="font-bold">SGPC</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                asChild
                className={cn(
                  "h-8",
                  pathname === item.href && "bg-secondary"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
            {session.isAdmin &&
              adminItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "h-8",
                    pathname === item.href && "bg-secondary"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {session.isAdmin && (
            <div className="flex items-center gap-1 rounded-full bg-chart-1/10 px-2 py-1 text-xs text-chart-1">
              <Shield className="h-3 w-3" />
              Admin
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                  <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    @{session.user.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
