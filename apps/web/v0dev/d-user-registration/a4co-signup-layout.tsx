"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { A4coBranding, A4coFeatures } from "./components/a4co-branding"
import { A4coSignupForm } from "./components/a4co-signup-form"
import type { A4coSignupFormData } from "./lib/validation"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function A4coSignupLayout() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [userData, setUserData] = useState<A4coSignupFormData | null>(null)

  const handleSignupSuccess = (data: A4coSignupFormData) => {
    setUserData(data)
    setIsSuccess(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto min-h-screen">
          {/* Columna Izquierda - Branding y Features */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="sticky top-8">
              <A4coBranding />
              <div className="hidden lg:block">
                <A4coFeatures />
              </div>

              {/* Testimonial */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">María González</div>
                    <div className="text-sm text-gray-600">CEO, TechStart</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic">
                  "a4co transformó completamente nuestra operación. Las herramientas son intuitivas y el soporte es
                  excepcional."
                </p>
                <div className="flex text-yellow-400 mt-2">{"★".repeat(5)}</div>
              </motion.div>
            </div>
          </div>

          {/* Columna Derecha - Formulario */}
          <div className="lg:col-span-3 flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="signup-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <A4coSignupForm onSuccess={handleSignupSuccess} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <Card className="p-8 bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white mb-6"
                      >
                        <CheckCircle size={40} />
                      </motion.div>

                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        ¡Bienvenido a a4co, {userData?.firstName}!
                      </h2>

                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Tu cuenta ha sido creada exitosamente. Hemos enviado un correo de confirmación a{" "}
                        <span className="font-semibold text-blue-600">{userData?.email}</span>
                      </p>

                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-blue-900 mb-2">Próximos pasos:</h3>
                        <ul className="text-sm text-blue-800 space-y-1 text-left">
                          <li className="flex items-center gap-2">
                            <span className="text-blue-600">1.</span>
                            Verifica tu correo electrónico
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-blue-600">2.</span>
                            Completa la configuración de tu perfil
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-blue-600">3.</span>
                            Explora nuestras herramientas empresariales
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          <ArrowRight size={16} className="mr-2" />
                          Acceder a mi Dashboard
                        </Button>

                        <Button variant="outline" className="w-full border-gray-300 bg-transparent">
                          Reenviar correo de confirmación
                        </Button>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          ¿Necesitas ayuda?{" "}
                          <a href="#" className="text-blue-600 hover:underline font-medium">
                            Contacta a nuestro equipo de soporte
                          </a>
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">a4</span>
              </div>
              <span className="text-gray-600">© 2024 a4co. Todos los derechos reservados.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Términos
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Soporte
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
