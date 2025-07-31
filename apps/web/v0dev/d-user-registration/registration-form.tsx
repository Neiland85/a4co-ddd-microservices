"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { registrationSchema, type RegistrationFormData } from "@/lib/validation"
import { AnimatedCircles } from "@/components/animated-circles"
import { CookieBanner } from "@/components/cookie-banner"
import { OffersSection } from "@/components/offers-section"
import { TwoFactorVerification } from "@/components/two-factor-verification"
import { User, Mail, Lock, Phone, Eye, EyeOff, UserPlus, CheckCircle, Sparkles } from "lucide-react"

type Step = "registration" | "verification" | "success"

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState<Step>("registration")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [registrationData, setRegistrationData] = useState<RegistrationFormData | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  const watchedFields = watch()

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true)
    setRegistrationData(data)

    // Simular registro
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setCurrentStep("verification")
  }

  const handleVerificationSuccess = () => {
    setCurrentStep("success")
  }

  const handleBackToRegistration = () => {
    setCurrentStep("registration")
  }

  const getProgressPercentage = () => {
    const fields = ["name", "email", "password", "confirmPassword"]
    const filledFields = fields.filter((field) => watchedFields[field as keyof RegistrationFormData])
    return (filledFields.length / fields.length) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <AnimatedCircles section={currentStep} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Columna Principal - Formulario */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === "registration" && (
                <motion.div
                  key="registration"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full max-w-2xl mx-auto"
                >
                  <Card className="p-8 bg-white/95 backdrop-blur-lg border-2 border-purple-200 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white mb-4"
                      >
                        <UserPlus size={40} />
                      </motion.div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Únete a Nuestra Comunidad!</h1>
                      <p className="text-gray-600">Crea tu cuenta y descubre un mundo de posibilidades</p>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progreso del registro</span>
                        <span>{Math.round(getProgressPercentage())}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${getProgressPercentage()}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <User size={16} className="text-purple-600" />
                            Nombre Completo
                          </Label>
                          <Input
                            {...register("name")}
                            id="name"
                            placeholder="Tu nombre completo"
                            className="border-2 border-gray-200 focus:border-purple-500 transition-colors"
                          />
                          {errors.name && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-red-600"
                            >
                              {errors.name.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail size={16} className="text-purple-600" />
                            Correo Electrónico
                          </Label>
                          <Input
                            {...register("email")}
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            className="border-2 border-gray-200 focus:border-purple-500 transition-colors"
                          />
                          {errors.email && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-red-600"
                            >
                              {errors.email.message}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Contraseña */}
                        <div className="space-y-2">
                          <Label htmlFor="password" className="flex items-center gap-2">
                            <Lock size={16} className="text-purple-600" />
                            Contraseña
                          </Label>
                          <div className="relative">
                            <Input
                              {...register("password")}
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Mínimo 8 caracteres"
                              className="border-2 border-gray-200 focus:border-purple-500 transition-colors pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          {errors.password && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-red-600"
                            >
                              {errors.password.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Confirmar Contraseña */}
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                            <Lock size={16} className="text-purple-600" />
                            Confirmar Contraseña
                          </Label>
                          <div className="relative">
                            <Input
                              {...register("confirmPassword")}
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Repite tu contraseña"
                              className="border-2 border-gray-200 focus:border-purple-500 transition-colors pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-red-600"
                            >
                              {errors.confirmPassword.message}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      {/* Teléfono (Opcional) */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone size={16} className="text-purple-600" />
                          Número de Teléfono (Opcional)
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            Para verificación 2FA
                          </span>
                        </Label>
                        <Input
                          {...register("phone")}
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className="border-2 border-gray-200 focus:border-purple-500 transition-colors"
                        />
                      </div>

                      {/* Checkboxes */}
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox {...register("acceptTerms")} id="acceptTerms" className="mt-1" />
                          <Label htmlFor="acceptTerms" className="text-sm text-gray-700 leading-relaxed">
                            Acepto los{" "}
                            <a href="#" className="text-purple-600 hover:underline font-medium">
                              Términos y Condiciones
                            </a>{" "}
                            y la{" "}
                            <a href="#" className="text-purple-600 hover:underline font-medium">
                              Política de Privacidad
                            </a>
                          </Label>
                        </div>
                        {errors.acceptTerms && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-600"
                          >
                            {errors.acceptTerms.message}
                          </motion.p>
                        )}

                        <div className="flex items-start space-x-3">
                          <Checkbox {...register("marketingEmails")} id="marketingEmails" className="mt-1" />
                          <Label htmlFor="marketingEmails" className="text-sm text-gray-700 leading-relaxed">
                            Quiero recibir ofertas especiales y noticias por correo electrónico
                          </Label>
                        </div>
                      </div>

                      {/* Botón de Registro */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Creando tu cuenta...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Sparkles size={20} />
                              Crear Mi Cuenta
                            </div>
                          )}
                        </Button>
                      </motion.div>

                      {/* Login Link */}
                      <div className="text-center">
                        <p className="text-gray-600">
                          ¿Ya tienes una cuenta?{" "}
                          <a href="#" className="text-purple-600 hover:underline font-medium">
                            Inicia sesión aquí
                          </a>
                        </p>
                      </div>
                    </form>
                  </Card>
                </motion.div>
              )}

              {currentStep === "verification" && registrationData && (
                <TwoFactorVerification
                  email={registrationData.email}
                  phone={registrationData.phone}
                  onBack={handleBackToRegistration}
                  onSuccess={handleVerificationSuccess}
                />
              )}

              {currentStep === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-md mx-auto"
                >
                  <Card className="p-8 bg-white/95 backdrop-blur-lg border-2 border-green-200 shadow-2xl text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white mb-6"
                    >
                      <CheckCircle size={40} />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Cuenta Creada Exitosamente!</h2>
                    <p className="text-gray-600 mb-6">
                      Bienvenido a nuestra comunidad. Tu cuenta ha sido verificada y está lista para usar.
                    </p>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                      Comenzar a Explorar
                    </Button>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Columna Lateral - Ofertas */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OffersSection />
            </div>
          </div>
        </div>
      </div>

      <CookieBanner />
    </div>
  )
}
