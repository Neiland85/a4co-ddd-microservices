<<<<<<< HEAD
import Link from 'next/link';

// Temporary Button component for testing
const Button = ({ variant = 'primary', children, ...props }: any) => (
  <button
    className={`rounded px-4 py-2 ${
      variant === 'outline' ? 'border border-gray-300' : 'bg-blue-500 text-white'
    }`}
    {...props}
  >
    {children}
  </button>
);

export default function Home(): React.ReactElement {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="space-y-8 py-12 text-center">
        <div className="space-y-4">
          <h1 className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            Conecta el Comercio Andaluz
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Únete a la red colaborativa que impulsa el pequeño comercio de Andalucía. Comparte
            recursos, optimiza logística y crece juntos.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/dashboard">
            <button className="rounded-xl bg-green-600 px-8 py-3 text-white shadow-lg transition-all duration-200 hover:bg-green-700 hover:shadow-xl">
              Comenzar Ahora
            </button>
          </Link>
          <Button variant="outline">Ver Marketplace</Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-8 shadow-lg transition-shadow duration-200 hover:shadow-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <span className="text-2xl text-blue-600">📄</span>
          </div>
          <h3 className="mb-3 text-xl font-semibold">Automatización de Facturas</h3>
          <p className="text-gray-600">
            Procesa facturas automáticamente con OCR inteligente y validación en tiempo real.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg transition-shadow duration-200 hover:shadow-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
            <span className="text-2xl text-green-600">🎯</span>
          </div>
          <h3 className="mb-3 text-xl font-semibold">Subvenciones Automáticas</h3>
          <p className="text-gray-600">
            Identifica y solicita subvenciones europeas elegibles sin esfuerzo manual.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg transition-shadow duration-200 hover:shadow-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
            <span className="text-2xl text-purple-600">📊</span>
          </div>
          <h3 className="mb-3 text-xl font-semibold">Analytics Avanzado</h3>
          <p className="text-gray-600">
            Métricas en tiempo real y reportes inteligentes para optimizar tu negocio.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="rounded-2xl bg-white p-8 shadow-lg">
        <div className="grid gap-8 text-center md:grid-cols-4">
          <div>
            <div className="mb-2 text-3xl font-bold text-blue-600">€2.1M</div>
            <div className="text-gray-600">Subvenciones Gestionadas</div>
          </div>
          <div>
            <div className="mb-2 text-3xl font-bold text-green-600">15K+</div>
            <div className="text-gray-600">Facturas Procesadas</div>
          </div>
          <div>
            <div className="mb-2 text-3xl font-bold text-purple-600">98%</div>
            <div className="text-gray-600">Precisión OCR</div>
          </div>
          <div>
            <div className="mb-2 text-3xl font-bold text-orange-600">24/7</div>
            <div className="text-gray-600">Soporte Automático</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="space-y-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
        <h2 className="text-3xl font-bold">¿Listo para revolucionar tu gestión tributaria?</h2>
        <p className="mx-auto max-w-2xl text-xl opacity-90">
          Únete a cientos de empresas que ya confían en TributariApp para su compliance fiscal.
        </p>
        <Link href="/dashboard">
          <button className="rounded-xl bg-white px-8 py-3 text-blue-600 shadow-lg transition-all duration-200 hover:bg-gray-100 hover:shadow-xl">
            Acceder al Dashboard
          </button>
        </Link>
      </section>
=======
export default function Home() {
  return (
    <div className="dashboard-working-container">
      <h1 className="dashboard-working-title">🎉 A4CO DASHBOARD - TEST INTERFACES 🎉</h1>

      <div className="dashboard-working-card">
        <h2 className="dashboard-working-subtitle">✅ Sistema de Testing de Interfaces</h2>

        <p className="dashboard-working-description">
          Bienvenido al dashboard de testing de A4CO.
          <br />
          Aquí puedes probar todas las interfaces implementadas.
        </p>

        <div className="dashboard-working-success">
          <h3 className="dashboard-working-success-title">
            🧪 ¡Accede a la página de testing de integraciones!
          </h3>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a 
            href="/test-integrations" 
            style={{ 
              display: 'inline-block',
              backgroundColor: '#059669',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              margin: '8px'
            }}
          >
            🧪 Probar Todas las Interfaces
          </a>
          
          <a 
            href="/api/products" 
            style={{ 
              display: 'inline-block',
              backgroundColor: '#1e40af',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              margin: '8px'
            }}
          >
            📊 API Productos
          </a>
          
          <a 
            href="/api/sales-opportunities" 
            style={{ 
              display: 'inline-block',
              backgroundColor: '#7c2d12',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              margin: '8px'
            }}
          >
            💼 API Oportunidades
          </a>
          
          <a 
            href="/api/artisans" 
            style={{ 
              display: 'inline-block',
              backgroundColor: '#7c2d92',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              margin: '8px'
            }}
          >
            👨‍🌾 API Artesanos
          </a>
        </div>
      </div>
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    </div>
  );
}
