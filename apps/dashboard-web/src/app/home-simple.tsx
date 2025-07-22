function HomePage() {
  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#1e40af',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          🎉 A4CO Dashboard FUNCIONA! 🎉
        </h1>

        <p
          style={{
            fontSize: '1.5rem',
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          El servidor Next.js está corriendo correctamente
        </p>

        <div
          style={{
            backgroundColor: '#dbeafe',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '2rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              color: '#1e40af',
              marginBottom: '1rem',
            }}
          >
            ✅ Sistema Operativo
          </h2>
          <ul
            style={{
              color: '#374151',
              fontSize: '1.1rem',
              lineHeight: '1.8',
            }}
          >
            <li>✓ Next.js 15 funcionando</li>
            <li>✓ React 18 activo</li>
            <li>✓ TypeScript compilando</li>
            <li>✓ Puerto 3000 disponible</li>
            <li>✓ Hot reload activado</li>
          </ul>
        </div>

        <div
          style={{
            backgroundColor: '#dcfce7',
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              color: '#166534',
              margin: 0,
            }}
          >
            🚀 Listo para desarrollar el dashboard completo!
          </h3>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
