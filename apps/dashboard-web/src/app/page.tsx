export default function Home(): React.ReactElement {
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
              margin: '8px',
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
              margin: '8px',
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
              margin: '8px',
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
              margin: '8px',
            }}
          >
            👨‍🌾 API Artesanos
          </a>
        </div>
      </div>
    </div>
  );
}
