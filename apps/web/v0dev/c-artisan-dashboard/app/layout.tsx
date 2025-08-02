import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard Moderno - A4CO",
  description: "Dashboard funcional para gestión de usuarios y análisis",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-100 relative overflow-hidden">
          {/* Texturas de fondo */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-yellow-600/30 via-orange-500/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-radial from-fuchsia-500/20 via-pink-400/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-radial from-amber-600/25 via-yellow-500/15 to-transparent rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  )
}
