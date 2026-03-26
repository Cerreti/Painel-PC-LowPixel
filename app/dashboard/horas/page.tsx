"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Clock, Save, AlertCircle, CheckCircle2 } from "lucide-react"
import type { Funcionario } from "@/lib/types"
import { buscarFuncionarioPorId, salvarHoras } from "@/lib/api"

export default function HorasPage() {
  const [searchId, setSearchId] = useState("")
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [horas, setHoras] = useState({
    dom: "",
    seg: "",
    ter: "",
    qua: "",
    qui: "",
    sex: "",
    sab: "",
    description: "",
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchId.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(null)
    setFuncionario(null)

    try {
      const result = await buscarFuncionarioPorId(searchId.trim())
      setFuncionario(result)
      setHoras({
        dom: result.dom || "",
        seg: result.seg || "",
        ter: result.ter || "",
        qua: result.qua || "",
        qui: result.qui || "",
        sex: result.sex || "",
        sab: result.sab || "",
        description: result.description || "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar funcionário")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!funcionario) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await salvarHoras({
        nome: funcionario.nome,
        ...horas,
      })
      setSuccess("Horas salvas com sucesso!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar horas")
    } finally {
      setSaving(false)
    }
  }

  const diasSemana = [
    { key: "dom", label: "Domingo", short: "Dom" },
    { key: "seg", label: "Segunda", short: "Seg" },
    { key: "ter", label: "Terça", short: "Ter" },
    { key: "qua", label: "Quarta", short: "Qua" },
    { key: "qui", label: "Quinta", short: "Qui" },
    { key: "sex", label: "Sexta", short: "Sex" },
    { key: "sab", label: "Sábado", short: "Sáb" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Controle de Horas</h1>
        <p className="text-muted-foreground">
          Registre as horas trabalhadas de cada funcionário
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Funcionário
          </CardTitle>
          <CardDescription>
            Digite o ID do funcionário para registrar as horas
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

      {/* Success */}
      {success && (
        <Alert className="border-chart-2 text-chart-2">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Horas Form */}
      {funcionario && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horas de {funcionario.nome}
            </CardTitle>
            <CardDescription>
              {funcionario.cargo} - Turno: {funcionario.turno}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Horas Grid */}
              <div className="grid gap-4 md:grid-cols-7">
                {diasSemana.map((dia) => (
                  <div key={dia.key} className="space-y-2">
                    <Label htmlFor={dia.key} className="text-xs">
                      {dia.label}
                    </Label>
                    <Input
                      id={dia.key}
                      placeholder="00:00:00"
                      value={horas[dia.key as keyof typeof horas]}
                      onChange={(e) =>
                        setHoras({ ...horas, [dia.key]: e.target.value })
                      }
                      className="font-mono text-center"
                    />
                  </div>
                ))}
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="description">Observações</Label>
                <Textarea
                  id="description"
                  placeholder="Adicione observações sobre as horas trabalhadas..."
                  value={horas.description}
                  onChange={(e) => setHoras({ ...horas, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                  Salvar Horas
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
