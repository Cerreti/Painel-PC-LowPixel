import { NextRequest, NextResponse } from "next/server"

const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL

export async function POST(request: NextRequest) {
  if (!SCRIPT_URL) {
    return NextResponse.json(
      { erro: "GOOGLE_SCRIPT_URL não configurada" },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao chamar Google Script:", error)
    return NextResponse.json(
      { erro: "Erro ao comunicar com a planilha" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  if (!SCRIPT_URL) {
    return NextResponse.json(
      { erro: "GOOGLE_SCRIPT_URL não configurada" },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const params = new URLSearchParams()
    
    searchParams.forEach((value, key) => {
      params.append(key, value)
    })

    const response = await fetch(`${SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao chamar Google Script:", error)
    return NextResponse.json(
      { erro: "Erro ao comunicar com a planilha" },
      { status: 500 }
    )
  }
}
