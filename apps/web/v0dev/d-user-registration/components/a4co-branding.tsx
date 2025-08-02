"use client"

import { motion } from "framer-motion"

export function A4coBranding() {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <span className="text-2xl font-bold text-white">a4</span>
          <span className="text-xl font-light text-blue-200">co</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Únete a a4co</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Crea tu cuenta y accede a soluciones empresariales innovadoras diseñadas para impulsar tu negocio.
        </p>
      </motion.div>
    </div>
  )
}

export function A4coFeatures() {
  const features = [
    {
      icon: "🚀",
      title: "Soluciones Innovadoras",
      description: "Herramientas de vanguardia para tu empresa",
    },
    {
      icon: "🔒",
      title: "Seguridad Empresarial",
      description: "Protección de datos de nivel corporativo",
    },
    {
      icon: "📊",
      title: "Analytics Avanzados",
      description: "Insights profundos para tomar mejores decisiones",
    },
    {
      icon: "🤝",
      title: "Soporte 24/7",
      description: "Asistencia especializada cuando la necesites",
    },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">¿Por qué elegir a4co?</h3>
      <div className="space-y-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100"
          >
            <div className="text-2xl">{feature.icon}</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
