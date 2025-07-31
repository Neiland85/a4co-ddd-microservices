"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">J</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Jaén Artesanal</CardTitle>
            <p className="text-gray-600 mt-2">Accede a tu cuenta o crea una nueva</p>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <LoginForm />
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
