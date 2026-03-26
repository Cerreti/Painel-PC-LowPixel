export interface Funcionario {
  nome: string
  id: string
  turno: string
  cargo: string
  presenca: string
  dom?: string
  seg?: string
  ter?: string
  qua?: string
  qui?: string
  sex?: string
  sab?: string
  total?: string
  description?: string
}

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string
  global_name?: string
}

export interface DiscordGuildMember {
  user: DiscordUser
  roles: string[]
  nick?: string
}

export interface Session {
  user: DiscordUser
  accessToken: string
  isAdmin: boolean
  roles: string[]
}

export type Turno = "Supervisão" | "Manhã" | "Tarde" | "Noite" | "Madrugada"

export const TURNOS: Turno[] = ["Supervisão", "Manhã", "Tarde", "Noite", "Madrugada"]

export const CARGOS = [
  "Agente Probatorio",
  "Agente 3 classe",
  "Agente 2 classe", 
  "Agente 1 classe",
  "Agente Especial",
  "Inspetor",
  "Inspetor Especial",
  "Inspetor Chefe",
  "Perito Criminal",
  "Escrivão",
  "Delegado Substituto",
  "Delegado Tíular",
  "Delegado Geral Adjunto",
  "Delegado Geral",
]

export const PRESENCA_OPTIONS = [
  "Presente",
  "Ausente",
  "F4 pendente",
]
