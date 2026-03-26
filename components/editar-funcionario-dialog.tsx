"use client"

import { useState } from "react"
import { useSession } from "@/hooks/use-session"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { AlertCircle } from "lucide-react"
import type { Funcionario } from "@/lib/types"
import { TURNOS, CARGOS, PRESENCA_OPTIONS } from "@/lib/types"
import { alterarFuncionario, buscarFuncionarioPorId } from "@/lib/api"

interface EditarFuncionarioDialogProps {
  funcionario: Funcionario
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (funcionario: Funcionario) => void
}

export function EditarFuncionarioDialog({
  funcionario,
  open,
  onOpenChange,
  onSuccess,
}: EditarFuncionarioDialogProps) {
  const { session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nome: funcionario.nome,
    id: funcionario.id,
    cargo: funcionario.cargo,
    presenca: funcionario.presenca,
    turno: funcionario.turno,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    setLoading(true)
    setError(null)

    try {
      const responsavel = session.user.global_name || session.user.username
      await alterarFuncionario({
        nome: formData.nome,
        id: formData.id,
        idOriginal: funcionario.id,
        cargo: formData.cargo,
        presenca: formData.presenca,
        turnoAtual: funcionario.turno,
        turnoNovo: formData.turno,
        responsavel,
      })

      // Buscar funcionário atualizado
      const updated = await buscarFuncionarioPorId(formData.id)
      onSuccess(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar funcionário")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Funcionário</DialogTitle>
          <DialogDescription>
            Altere as informações do funcionário abaixo.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="id">ID</Label>
            <Input
              id="id"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo</Label>
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
            <Label htmlFor="turno">Turno</Label>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner className="mr-2 h-4 w-4" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
