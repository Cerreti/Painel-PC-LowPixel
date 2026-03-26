"use client"

import { useState } from "react"
import { useSession } from "@/hooks/use-session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { Search, User, Briefcase, Clock, Calendar, Edit, Trash2, AlertCircle } from "lucide-react"
import type { Funcionario } from "@/lib/types"
import { buscarFuncionarioPorId, removerFuncionario } from "@/lib/api"
import { EditarFuncionarioDialog } from "@/components/editar-funcionario-dialog"

export default function BuscarPage() {
  const { session } = useSession()
  const [searchId, setSearchId] = useState("")
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchId.trim()) return

    setLoading(true)
    setError(null)
    setFuncionario(null)

    try {
      const result = await buscarFuncionarioPorId(searchId.trim())
      setFuncionario(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar funcionário")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!funcionario || !session) return

    setDeleteLoading(true)
    try {
      const responsavel = session.user.global_name || session.user.username
      await removerFuncionario(funcionario.id, funcionario.turno, responsavel)
      setFuncionario(null)
      setSearchId("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover funcionário")
    } finally {
      setDeleteLoading(false)
    }
  }

  const diasSemana = [
    { key: "dom", label: "Domingo" },
    { key: "seg", label: "Segunda" },
    { key: "ter", label: "Terça" },
    { key: "qua", label: "Quarta" },
    { key: "qui", label: "Quinta" },
    { key: "sex", label: "Sexta" },
    { key: "sab", label: "Sábado" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buscar Funcionário</h1>
        <p className="text-muted-foreground">
          Pesquise por ID para ver informações detalhadas
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pesquisar
          </CardTitle>
          <CardDescription>
            Digite o ID do funcionário para buscar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Digite o ID do funcionário"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit" disabled={loading || !searchId.trim()}>
              {loading ? <Spinner className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Buscar</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Result */}
      {funcionario && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {funcionario.nome}
              </CardTitle>
              <CardDescription>ID: {funcionario.id}</CardDescription>
            </div>
            {session?.isAdmin && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover o funcionário{" "}
                        <strong>{funcionario.nome}</strong>? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleteLoading ? <Spinner className="h-4 w-4" /> : "Remover"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Info Grid */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  Cargo
                </p>
                <p className="font-medium">{funcionario.cargo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Turno
                </p>
                <p className="font-medium">{funcionario.turno}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={funcionario.presenca === "Ativo" ? "default" : "secondary"}>
                  {funcionario.presenca || "Sem status"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Semanal</p>
                <p className="font-medium text-chart-2">{funcionario.total || "00:00:00"}</p>
              </div>
            </div>

            {/* Horas por Dia */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Horas por Dia
              </h3>
              <div className="grid gap-3 md:grid-cols-7">
                {diasSemana.map((dia) => (
                  <div
                    key={dia.key}
                    className="rounded-lg border p-3 text-center"
                  >
                    <p className="text-xs text-muted-foreground mb-1">{dia.label}</p>
                    <p className="font-mono text-sm">
                      {funcionario[dia.key as keyof Funcionario] || "00:00:00"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Observações */}
            {funcionario.description && (
              <div>
                <h3 className="font-semibold mb-2">Observações</h3>
                <p className="text-muted-foreground rounded-lg border p-3">
                  {funcionario.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {funcionario && (
        <EditarFuncionarioDialog
          funcionario={funcionario}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSuccess={(updated) => {
            setFuncionario(updated)
            setEditOpen(false)
          }}
        />
      )}
    </div>
  )
}
