// Configuración de pruebas para auth-service
// Usa variables de entorno para evitar secretos hardcodeados

export const testConfig = {
  // Credenciales de prueba genéricas
  // IMPORTANTE: Estos son valores de prueba únicamente, NO usar en producción
  testCredentials: {
    username: process.env['TEST_USERNAME'] || 'mock_test_user',
    password: process.env['TEST_PASSWORD'] || 'FAKE_PASSWORD_FOR_TESTS_ONLY',
    email: process.env['TEST_EMAIL'] || 'mock@test.example.com',
  },

  // Datos de prueba para diferentes escenarios
  testData: {
    validUser: {
      username: 'mock_valid_user',
      password: 'FAKE_VALID_PASSWORD_FOR_TESTS',
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
