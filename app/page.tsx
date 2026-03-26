"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Users, Shield, Clock } from "lucide-react"

export default function LoginPage() {
  const { session, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && session) {
      router.push("/dashboard")
    }
  }, [session, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Sistema de Gestão de Funcionários
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Gerencie sua equipe de forma eficiente. Controle turnos, horas trabalhadas e informações dos funcionários em um só lugar.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-chart-1 " />
                </div>
                <CardTitle className="text-lg">Gestão de Equipe</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cadastre, edite e remova funcionários com facilidade. Organize por turnos e cargos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-chart-2" />
                </div>
                <CardTitle className="text-lg">Controle de Horas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Registre e acompanhe as horas trabalhadas de cada funcionário ao longo da semana.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 text-chart-3" />
                </div>
                <CardTitle className="text-lg">Acesso Seguro</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Login via Discord com controle de acesso baseado em cargos do servidor.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Login Card */}
          <Card className="max-w-md mx-auto border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Entrar no Sistema</CardTitle>
              <CardDescription>
                Use sua conta do Discord para acessar o painel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                size="lg"
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
              >
                <a href="/api/auth/discord">
                  <svg
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Entrar com Discord
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Ao entrar, você concorda com os termos de uso do sistema.
          </p>
        </div>
      </div>
    </div>
  )
}
