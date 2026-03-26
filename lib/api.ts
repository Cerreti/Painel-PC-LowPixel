import type { Funcionario } from "./types"

async function callScript<T>(data: Record<string, unknown>): Promise<T> {
  const response = await fetch("/api/sheets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`)
  }

  const result = await response.json()
  
  if (result.erro) {
    throw new Error(result.erro)
  }

  return result
}

export async function cadastrarFuncionario(
  funcionario: Omit<Funcionario, "dom" | "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "total" | "description">,
  responsavel: string
): Promise<string> {
  return callScript({
    action: "cadastrar",
    funcionario: {
      ...funcionario,
      responsavel,
    },
  })
}

export async function buscarFuncionarioPorId(id: string): Promise<Funcionario> {
  return callScript({
    action: "buscar",
    id,
  })
}

export async function alterarFuncionario(
  funcionario: {
    nome: string
    id: string
    idOriginal: string
    cargo: string
    presenca: string
    turnoAtual: string
    turnoNovo: string
    responsavel: string
  }
): Promise<{ success: boolean; message: string }> {
  return callScript({
    action: "alterar",
    funcionario,
  })
}

export async function removerFuncionario(
  id: string,
  turno: string,
  responsavel: string
): Promise<string> {
  return callScript({
    action: "remover",
    id,
    turno,
    responsavel,
  })
}

export async function salvarHoras(dados: {
  nome: string
  dom: string
  seg: string
  ter: string
  qua: string
  qui: string
  sex: string
  sab: string
  description: string
}): Promise<string> {
  return callScript({
    action: "salvarHoras",
    dados,
  })
}

export async function buscarUsuariosPorTurno(
  turno: string
): Promise<Array<{ nome: string; id: string; cargo: string; presenca: string }>> {
  return callScript({
    action: "usuariosTurno",
    turno,
  })
}

export async function limparHoras(): Promise<string> {
  return callScript({
    action: "limparHoras",
  })
}
