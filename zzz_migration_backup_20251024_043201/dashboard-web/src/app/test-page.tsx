export default function Home(): React.ReactElement {
  return (
    <main className="test-main">
      <div className="test-card">
        <h1 className="test-title">🎉 A4CO Dashboard 🎉</h1>

        <p className="test-subtitle">¡El proyecto está funcionando correctamente!</p>

        <div className="test-status-section">
          <h2 className="test-status-title">✅ Estado del Sistema</h2>

          <div className="test-status-grid">
            <div className="test-status-item">✓ Next.js 15 configurado y funcionando</div>
            <div className="test-status-item">✓ Tailwind CSS disponible</div>
            <div className="test-status-item">✓ shadcn/ui components instalados</div>
            <div className="test-status-item">✓ Turbopack activo para desarrollo</div>
            <div className="test-status-item">✓ Sistema de temas (dark/light) configurado</div>
          </div>
        </div>

        <div className="test-next-section">
          <h3 className="test-next-title">🚀 Próximos Pasos</h3>

          <ol className="test-next-list">
            <li>Implementar dashboard completo con shadcn/ui</li>
            <li>Conectar con los microservicios backend</li>
            <li>Agregar autenticación y autorización</li>
            <li>Configurar métricas y monitoreo</li>
          </ol>
        </div>

        <div className="test-final-section">
          <p className="test-final-text">🎯 Microservicios DDD Architecture - Ready to Rock!</p>
        </div>
      </div>
    </main>
  );
}
