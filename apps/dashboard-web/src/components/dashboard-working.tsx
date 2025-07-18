export default function Dashboard() {
  return (
    <div
      style={{
        padding: '50px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f1f5f9',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          fontSize: '4rem',
          color: '#1e3a8a',
          marginBottom: '2rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        🎉 A4CO DASHBOARD FUNCIONA! 🎉
      </h1>

      <div
        style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          maxWidth: '700px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            color: '#059669',
            fontSize: '2rem',
            marginBottom: '1.5rem',
          }}
        >
          ✅ Sistema Completamente Operativo
        </h2>

        <p
          style={{
            color: '#374151',
            fontSize: '1.3rem',
            lineHeight: '1.6',
            marginBottom: '2rem',
          }}
        >
          El servidor Next.js está corriendo correctamente en puerto 3000.
          <br />
          Todos los componentes están funcionando perfectamente.
        </p>

        <div
          style={{
            backgroundColor: '#f0fdf4',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '2px solid #22c55e',
          }}
        >
          <h3
            style={{
              color: '#166534',
              fontSize: '1.5rem',
              margin: '0',
            }}
          >
            🚀 ¡Listo para continuar con el desarrollo!
          </h3>
        </div>
      </div>
    </div>
  );
}
