// Configuración de pruebas para auth-service
// Usa variables de entorno para evitar secretos hardcodeados

export const testConfig = {
  // Credenciales de prueba genéricas
  testCredentials: {
    username: process.env.TEST_USERNAME || 'test_user',
    password: process.env.TEST_PASSWORD || 'test_password',
    email: process.env.TEST_EMAIL || 'test@example.com',
  },
  
  // Datos de prueba para diferentes escenarios
  testData: {
    validUser: {
      username: 'valid_user',
      password: 'valid_password',
    },
    longUsername: 'user_with_very_long_username_that_exceeds_normal_length_limits',
    specialChars: 'user@domain.com',
    unicodeUser: 'usuario_ñáéíóú_测试_🚀',
    emptyString: '',
    numericInput: '12345',
  },
  
  // Configuración de seguridad para pruebas
  security: {
    minPasswordLength: 8,
    maxUsernameLength: 50,
    allowedSpecialChars: /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  },
};

// Función helper para generar credenciales de prueba seguras
export function generateTestCredentials(prefix: string = 'test') {
  const timestamp = Date.now();
  return {
    username: `${prefix}_user_${timestamp}`,
    password: `${prefix}_pass_${timestamp}`,
  };
}

// Función helper para limpiar credenciales de prueba
export function cleanupTestCredentials() {
  // En un entorno real, aquí se limpiarían las credenciales de prueba
  // Por ahora, solo es un placeholder
  console.log('Test credentials cleanup completed');
}
