"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, AlertCircle, CheckCircle2, Shield } from "lucide-react"
import { TURNOS, CARGOS, PRESENCA_OPTIONS } from "@/lib/types"
import { cadastrarFuncionario } from "@/lib/api"

export default function CadastrarPage() {
  const { session, loading: sessionLoading } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    id: "",
    cargo: "",
    turno: "",
    presenca: "Presente",
  })

  useEffect(() => {
    if (!sessionLoading && (!session || !session.isAdmin)) {
      router.push("/dashboard")
    }
  }, [session, sessionLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    // Validação
    if (!formData.nome || !formData.id || !formData.cargo || !formData.turno) {
      setError("Preencha todos os campos obrigatórios")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const responsavel = session.user.global_name || session.user.username
      await cadastrarFuncionario(formData, responsavel)
      setSuccess(`Funcionário ${formData.nome} cadastrado com sucesso!`)
      setFormData({
        nome: "",
        id: "",
        cargo: "",
        turno: "",
        presenca: "Ativo",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar funcionário")
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-chart-1" />
          <span className="text-sm text-chart-1 font-medium">Área Administrativa</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar Funcionário</h1>
        <p className="text-muted-foreground">
          Adicione novos funcionários ao sistema
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

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Novo Funcionário
          </CardTitle>
          <CardDescription>
            Preencha as informações do novo funcionário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="id">ID *</Label>
              <Input
                id="id"
                placeholder="ID único do funcionário"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo *</Label>
              <Select
                value={formData.cargo}
                onValueChange={(value) => setFormData({ ...formData, cargo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cargo" />
                </SelectTrigger>
                <SelectContent>
                  {CARGOS.map((cargo) => (
                    <SelectItem key={cargo} value={cargo}>
                      {cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="turno">Turno *</Label>
              <Select
                value={formData.turno}
                onValueChange={(value) => setFormData({ ...formData, turno: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um turno" />
                </SelectTrigger>
                <SelectContent>
                  {TURNOS.map((turno) => (
                    <SelectItem key={turno} value={turno}>
                      {turno}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="presenca">Status</Label>
              <Select
                value={formData.presenca}
                onValueChange={(value) => setFormData({ ...formData, presenca: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {PRESENCA_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Spinner className="mr-2 h-4 w-4" />}
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar Funcionário
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
