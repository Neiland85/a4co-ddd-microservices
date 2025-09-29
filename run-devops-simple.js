#!/usr/bin/env node

// Script simple para ejecutar el maestro de DevOps Excellence
console.log('🚀 Iniciando ejecución del script maestro...');

try {
  // Importar y ejecutar el script maestro
  const { DevOpsExcellenceNextSteps } = require('./scripts/devops-excellence-next-steps.js');

  const excellence = new DevOpsExcellenceNextSteps();
  excellence.executeAllSteps().then(() => {
    console.log('✅ Script completado exitosamente');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Error ejecutando script:', error.message);
    process.exit(1);
  });

} catch (error) {
  console.error('❌ Error cargando script:', error.message);
  process.exit(1);
}