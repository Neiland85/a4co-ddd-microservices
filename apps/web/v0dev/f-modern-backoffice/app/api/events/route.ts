import { NextResponse } from "next/server"

// Simulación de eventos del sistema
export async function GET() {
  const events = [
    {
      id: Date.now().toString(),
      type: "info",
      title: "Sistema iniciado",
      description: "El sistema se ha iniciado correctamente",
      timestamp: new Date().toISOString(),
      user: "system",
    },
    {
      id: (Date.now() - 1000).toString(),
      type: "warning",
      title: "Alto uso de memoria",
      description: "El uso de memoria ha superado el 80%",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      details: { memory: "82%" },
    },
  ]

  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const event = await request.json()

  // Aquí normalmente guardarías el evento en la base de datos
  console.log("Nuevo evento:", event)

  return NextResponse.json({ success: true, id: Date.now().toString() })
}
