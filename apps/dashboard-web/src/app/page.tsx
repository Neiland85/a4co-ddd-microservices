import Link from "next/link";

export default function Home(): React.ReactElement {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestión Tributaria Inteligente
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Automatiza procesos fiscales, identifica subvenciones y optimiza tu compliance tributario con IA avanzada.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Comenzar Ahora
            </button>
          </Link>
          <button className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200">
            Ver Demo
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-blue-600 text-2xl">📄</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Automatización de Facturas</h3>
          <p className="text-gray-600">
            Procesa facturas automáticamente con OCR inteligente y validación en tiempo real.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-green-600 text-2xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Subvenciones Automáticas</h3>
          <p className="text-gray-600">
            Identifica y solicita subvenciones europeas elegibles sin esfuerzo manual.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-purple-600 text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Analytics Avanzado</h3>
          <p className="text-gray-600">
            Métricas en tiempo real y reportes inteligentes para optimizar tu negocio.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">€2.1M</div>
            <div className="text-gray-600">Subvenciones Gestionadas</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">15K+</div>
            <div className="text-gray-600">Facturas Procesadas</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
            <div className="text-gray-600">Precisión OCR</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Soporte Automático</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold">¿Listo para revolucionar tu gestión tributaria?</h2>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Únete a cientos de empresas que ya confían en TributariApp para su compliance fiscal.
        </p>
        <Link href="/dashboard">
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            Acceder al Dashboard
          </button>
        </Link>
      </section>
    </div>
  );
}
