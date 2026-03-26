"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Shield, Trash2, Clock, Users, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"
import { TURNOS } from "@/lib/types"
import { buscarUsuariosPorTurno, limparHoras } from "@/lib/api"

interface FuncionarioResumo {
  nome: string
  id: string
  cargo: string
  presenca: string
}

export default function AdminPage() {
  const { session, loading: sessionLoading } = useSession()
  const router = useRouter()
  const [funcionarios, setFuncionarios] = useState<Record<string, FuncionarioResumo[]>>({})
  const [loading, setLoading] = useState(true)
  const [clearingHours, setClearingHours] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionLoading && (!session || !session.isAdmin)) {
      router.push("/dashboard")
    }
  }, [session, sessionLoading, router])

  useEffect(() => {
    async function loadData() {
      if (!session?.isAdmin) return
      
      setLoading(true)
      const data: Record<string, FuncionarioResumo[]> = {}
      
      for (const turno of TURNOS) {
        try {
          const result = await buscarUsuariosPorTurno(turno)
          data[turno] = result.filter(f => f.nome && f.nome.trim() !== "")
        } catch {
          data[turno] = []
        }
      }
      
      setFuncionarios(data)
      setLoading(false)
    }

    loadData()
  }, [session])

  const handleClearHours = async () => {
    setClearingHours(true)
    setError(null)
    setSuccess(null)

    try {
      await limparHoras()
      setSuccess("Horas de todos os funcionários foram zeradas com sucesso!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao limpar horas")
    } finally {
      setClearingHours(false)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    const data: Record<string, FuncionarioResumo[]> = {}
    
    for (const turno of TURNOS) {
      try {
        const result = await buscarUsuariosPorTurno(turno)
        data[turno] = result.filter(f => f.nome && f.nome.trim() !== "")
      } catch {
        data[turno] = []
      }
    }
    
    setFuncionarios(data)
    setLoading(false)
  }

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!session?.isAdmin) {
    return null
  }

  const totalFuncionarios = Object.values(funcionarios).flat().length

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-chart-1" />
          <span className="text-sm text-chart-1 font-medium">Painel Administrativo</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Administração</h1>
        <p className="text-muted-foreground">
          Gerencie configurações avançadas do sistema
        </p>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success */}
      {success && (
        <Alert className="border-chart-2 text-chart-2">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFuncionarios}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{TURNOS.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrador</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">
              {session.user.global_name || session.user.username}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Administrativas</CardTitle>
          <CardDescription>
            Operações que afetam todo o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={refreshData} disabled={loading}>
              {loading ? <Spinner className="mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Atualizar Dados
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Zerar Todas as Horas
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação irá zerar as horas de <strong>todos os funcionários</strong> em{" "}
                    <strong>todos os turnos</strong>. Esta ação não pode ser desfeita.
                    <br /><br />
                    Tem certeza que deseja continuar?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearHours}
                    disabled={clearingHours}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {clearingHours ? <Spinner className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Funcionários por Turno */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionários por Turno</CardTitle>
          <CardDescription>
            Visão geral de todos os funcionários cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TURNOS.map((turno) => (
                <Card key={turno} className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {turno}
                      <Badge variant="secondary">
                        {funcionarios[turno]?.length || 0}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[150px]">
                      {funcionarios[turno]?.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nenhum funcionário
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {funcionarios[turno]?.map((func) => (
                            <div
                              key={func.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="truncate">{func.nome}</span>
                              <Badge
                                variant={func.presenca === "Ativo" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {func.presenca || "N/A"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
