export default function DashboardWorking(): React.ReactElement {
  return (
    <div className="dashboard-working-container">
      <h1 className="dashboard-working-title">🎉 A4CO DASHBOARD FUNCIONA! 🎉</h1>

      <div className="dashboard-working-card">
        <h2 className="dashboard-working-subtitle">✅ Sistema Completamente Operativo</h2>

        <p className="dashboard-working-description">
          El servidor Next.js está corriendo correctamente en puerto 3000.
          <br />
          Todos los componentes están funcionando perfectamente.
        </p>

        <div className="dashboard-working-success">
          <h3 className="dashboard-working-success-title">
            🚀 ¡Listo para continuar con el desarrollo!
          </h3>
        </div>
      </div>
    </div>
  );
}
