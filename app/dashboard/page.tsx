"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Clock, Sun, Moon, Sunrise, Sunset, Shield } from "lucide-react"
import { TURNOS } from "@/lib/types"
import { buscarUsuariosPorTurno } from "@/lib/api"

interface FuncionarioResumo {
  nome: string
  id: string
  cargo: string
  presenca: string
}

const turnoIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Supervisão": Shield,
  "Manhã": Sunrise,
  "Tarde": Sun,
  "Noite": Sunset,
  "Madrugada": Moon,
}

export default function DashboardPage() {
  const [funcionarios, setFuncionarios] = useState<Record<string, FuncionarioResumo[]>>({})
  const [loading, setLoading] = useState(true)
  const [selectedTurno, setSelectedTurno] = useState<string>("Manhã")

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data: Record<string, FuncionarioResumo[]> = {}
      
      for (const turno of TURNOS) {
        try {
          const result = await buscarUsuariosPorTurno(turno)
          data[turno] = result.filter(f => f.nome && f.nome.trim() !== "")
        } catch (error) {
          console.error(`Erro ao buscar turno ${turno}:`, error)
          data[turno] = []
        }
      }
      
      setFuncionarios(data)
      setLoading(false)
    }

    loadData()
  }, [])

  const totalFuncionarios = Object.values(funcionarios).flat().length
  const ativos = Object.values(funcionarios)
    .flat()
    .filter(f => f.presenca === "Ativo").length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral dos funcionários por turno
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFuncionarios}</div>
            <p className="text-xs text-muted-foreground">
              em todos os turnos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{ativos}</div>
            <p className="text-xs text-muted-foreground">
              {totalFuncionarios > 0 ? Math.round((ativos / totalFuncionarios) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-5">{totalFuncionarios - ativos}</div>
            <p className="text-xs text-muted-foreground">
              férias, afastados, etc.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos Ativos</CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{TURNOS.length}</div>
            <p className="text-xs text-muted-foreground">
              turnos configurados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs por Turno */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionários por Turno</CardTitle>
          <CardDescription>
            Selecione um turno para ver os funcionários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTurno} onValueChange={setSelectedTurno}>
            <TabsList className="mb-4">
              {TURNOS.map((turno) => {
                const Icon = turnoIcons[turno] || Users
                return (
                  <TabsTrigger key={turno} value={turno} className="gap-2">
                    <Icon className="h-4 w-4" />
                    {turno}
                    <Badge variant="secondary" className="ml-1">
                      {funcionarios[turno]?.length || 0}
                    </Badge>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {TURNOS.map((turno) => (
              <TabsContent key={turno} value={turno}>
                <ScrollArea className="h-[400px]">
                  {funcionarios[turno]?.length === 0 ? (
                    <div className="flex items-center justify-center py-10 text-muted-foreground">
                      Nenhum funcionário neste turno
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {funcionarios[turno]?.map((func) => (
                        <div
                          key={func.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">{func.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {func.id} - {func.cargo}
                            </p>
                          </div>
                          <Badge
                            variant={func.presenca === "Ativo" ? "default" : "secondary"}
                          >
                            {func.presenca || "Sem status"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
