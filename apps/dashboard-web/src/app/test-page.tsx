export default function Home() {
  return (
    <main
      style={{
        padding: '40px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          🎉 A4CO Dashboard 🎉
        </h1>

        <p
          style={{
            fontSize: '1.25rem',
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          ¡El proyecto está funcionando correctamente!
        </p>

        <div
          style={{
            backgroundColor: '#f1f5f9',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '2rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '1rem',
            }}
          >
            ✅ Estado del Sistema
          </h2>

          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ color: '#059669', fontWeight: '500' }}>
              ✓ Next.js 15 configurado y funcionando
            </div>
            <div style={{ color: '#059669', fontWeight: '500' }}>
              ✓ Tailwind CSS disponible
            </div>
            <div style={{ color: '#059669', fontWeight: '500' }}>
              ✓ shadcn/ui components instalados
            </div>
            <div style={{ color: '#059669', fontWeight: '500' }}>
              ✓ Turbopack activo para desarrollo
            </div>
            <div style={{ color: '#059669', fontWeight: '500' }}>
              ✓ Sistema de temas (dark/light) configurado
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            padding: '24px',
            border: '1px solid #dbeafe',
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e40af',
              marginBottom: '1rem',
            }}
          >
            🚀 Próximos Pasos
          </h3>

          <ol
            style={{
              color: '#3730a3',
              paddingLeft: '1.5rem',
              lineHeight: '1.6',
            }}
          >
            <li>Implementar dashboard completo con shadcn/ui</li>
            <li>Conectar con los microservicios backend</li>
            <li>Agregar autenticación y autorización</li>
            <li>Configurar métricas y monitoreo</li>
          </ol>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#ecfdf5',
            borderRadius: '8px',
            border: '1px solid #d1fae5',
          }}
        >
          <p
            style={{
              color: '#065f46',
              fontWeight: '600',
              fontSize: '1.1rem',
            }}
          >
            🎯 Microservicios DDD Architecture - Ready to Rock!
          </p>
        </div>
      </div>
    </main>
  );
}
