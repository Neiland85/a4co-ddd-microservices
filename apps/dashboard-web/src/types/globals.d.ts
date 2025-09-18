// Definiciones de tipos globales para el proyecto

declare global {
  // Definiciones de console para evitar errores no-undef
  interface Console {
    log(message?: unknown, ...optionalParams: unknown[]): void;
    warn(message?: unknown, ...optionalParams: unknown[]): void;
    error(message?: unknown, ...optionalParams: unknown[]): void;
    info(message?: unknown, ...optionalParams: unknown[]): void;
  }

  // Definición de window para SSR compatibility
  interface Window {
    console: Console;
  }

  // GlobalThis con console
  var console: Console;
}

// Exportar types para módulos
export { };

