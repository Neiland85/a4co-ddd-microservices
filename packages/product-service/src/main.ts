import { connectDatabase, disconnectDatabase } from './infrastructure/prisma/prisma.service';
import { createApp, configureServer } from './api/index';

/**
 * Función principal para iniciar el microservicio de productos
 * Incluye configuración de seguridad avanzada y rate limiting
 */
async function startProductService(): Promise<void> {
  try {
    console.log('🚀 Iniciando Product Service...');
    
    // Conectar a la base de datos
    await connectDatabase();
    console.log('✅ Base de datos conectada');
    
    // Crear aplicación Express con configuración de seguridad
    const app = createApp();
    console.log('✅ Aplicación Express configurada con seguridad');
    
    // Configurar y iniciar servidor
    configureServer(app);
    
    // Manejo de señales para shutdown graceful
    process.on('SIGTERM', async () => {
      console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
      await gracefulShutdown();
    });
    
    process.on('SIGINT', async () => {
      console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
      await gracefulShutdown();
    });
    
    // Manejo de errores no capturados
    process.on('uncaughtException', (error) => {
      console.error('❌ Error no capturado:', error);
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Promesa rechazada no manejada:', reason);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar Product Service:', error);
    process.exit(1);
  }
}

/**
 * Función para shutdown graceful del servicio
 */
async function gracefulShutdown(): Promise<void> {
  try {
    console.log('🔄 Cerrando conexiones...');
    
    // Desconectar de la base de datos
    await disconnectDatabase();
    console.log('✅ Base de datos desconectada');
    
    console.log('✅ Product Service cerrado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el shutdown:', error);
    process.exit(1);
  }
}

// Iniciar el servicio
startProductService(); 