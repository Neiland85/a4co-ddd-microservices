'use client';

import { motion } from 'framer-motion';

export function A4coBranding() {
  return (
    <div className="mb-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
          <span className="text-2xl font-bold text-white">a4</span>
          <span className="text-xl font-light text-blue-200">co</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Únete a a4co</h1>
        <p className="mx-auto max-w-md text-gray-600">
          Crea tu cuenta y accede a soluciones empresariales innovadoras diseñadas para impulsar tu
          negocio.
        </p>
      </motion.div>
    </div>
  );
}

export function A4coFeatures() {
  const features = [
    {
      icon: '🚀',
      title: 'Soluciones Innovadoras',
      description: 'Herramientas de vanguardia para tu empresa',
    },
    {
      icon: '🔒',
      title: 'Seguridad Empresarial',
      description: 'Protección de datos de nivel corporativo',
    },
    {
      icon: '📊',
      title: 'Analytics Avanzados',
      description: 'Insights profundos para tomar mejores decisiones',
    },
    {
      icon: '🤝',
      title: 'Soporte 24/7',
      description: 'Asistencia especializada cuando la necesites',
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-xl font-semibold text-gray-900">¿Por qué elegir a4co?</h3>
      <div className="space-y-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white/60 p-4 backdrop-blur-sm"
          >
            <div className="text-2xl">{feature.icon}</div>
            <div>
              <h4 className="mb-1 font-semibold text-gray-900">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
