export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">A4CO Dashboard</h1>
      </div>

      <div className="relative flex place-items-center">
        <h2 className="text-2xl">Bienvenido al Dashboard</h2>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors">
          <h3 className="mb-3 text-2xl font-semibold">Dashboard</h3>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Panel de control principal para la gestión del comercio.
          </p>
        </div>
      </div>
    </main>
  );
}
