'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { A4coBranding, A4coFeatures } from './components/a4co-branding';
import { A4coSignupForm } from './components/a4co-signup-form';
import type { A4coSignupFormData } from './lib/validation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function A4coSignupLayout() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState<A4coSignupFormData | null>(null);

  const handleSignupSuccess = (data: A4coSignupFormData) => {
    setUserData(data);
    setIsSuccess(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-400 opacity-20 mix-blend-multiply blur-xl filter"></div>
        <div className="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-400 opacity-20 mix-blend-multiply blur-xl filter"></div>
        <div className="animate-blob animation-delay-4000 absolute left-40 top-40 h-80 w-80 rounded-full bg-purple-400 opacity-20 mix-blend-multiply blur-xl filter"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className="mx-auto grid min-h-screen max-w-7xl gap-8 lg:grid-cols-5">
          {/* Columna Izquierda - Branding y Features */}
          <div className="flex flex-col justify-center lg:col-span-2">
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
                className="mt-8 rounded-lg border border-gray-100 bg-white/60 p-6 backdrop-blur-sm"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 font-semibold text-white">
                    M
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">María González</div>
                    <div className="text-sm text-gray-600">CEO, TechStart</div>
                  </div>
                </div>
                <p className="text-sm italic text-gray-700">
                  "a4co transformó completamente nuestra operación. Las herramientas son intuitivas
                  y el soporte es excepcional."
                </p>
                <div className="mt-2 flex text-yellow-400">{'★'.repeat(5)}</div>
              </motion.div>
            </div>
          </div>

          {/* Columna Derecha - Formulario */}
          <div className="flex items-center justify-center lg:col-span-3">
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
                    <Card className="border border-gray-200 bg-white/95 p-8 shadow-xl backdrop-blur-lg">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      >
                        <CheckCircle size={40} />
                      </motion.div>

                      <h2 className="mb-4 text-3xl font-bold text-gray-900">
                        ¡Bienvenido a a4co, {userData?.firstName}!
                      </h2>

                      <p className="mx-auto mb-6 max-w-md text-gray-600">
                        Tu cuenta ha sido creada exitosamente. Hemos enviado un correo de
                        confirmación a{' '}
                        <span className="font-semibold text-blue-600">{userData?.email}</span>
                      </p>

                      <div className="mb-6 rounded-lg bg-blue-50 p-4">
                        <h3 className="mb-2 font-semibold text-blue-900">Próximos pasos:</h3>
                        <ul className="space-y-1 text-left text-sm text-blue-800">
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

                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <p className="text-sm text-gray-600">
                          ¿Necesitas ayuda?{' '}
                          <a href="#" className="font-medium text-blue-600 hover:underline">
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
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                <span className="text-sm font-bold text-white">a4</span>
              </div>
              <span className="text-gray-600">© 2024 a4co. Todos los derechos reservados.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
                Términos
              </a>
              <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
                Privacidad
              </a>
              <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
                Soporte
              </a>
              <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
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
  );
}
