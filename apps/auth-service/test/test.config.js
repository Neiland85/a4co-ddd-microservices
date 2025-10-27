"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConfig = void 0;
exports.generateTestCredentials = generateTestCredentials;
exports.cleanupTestCredentials = cleanupTestCredentials;
exports.testConfig = {
    testCredentials: {
        username: process.env['TEST_USERNAME'] || 'test_user',
        password: process.env['TEST_PASSWORD'] || 'test_password',
        email: process.env['TEST_EMAIL'] || 'test@example.com',
        username: process.env.TEST_USERNAME || 'test_user',
        password: process.env.TEST_PASSWORD || 'test_password',
        email: process.env.TEST_EMAIL || 'test@example.com',
    },
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
    security: {
        minPasswordLength: 8,
        maxUsernameLength: 50,
        allowedSpecialChars: /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    },
};
function generateTestCredentials(prefix = 'test') {
    const timestamp = Date.now();
    return {
        username: `${prefix}_user_${timestamp}`,
        password: `${prefix}_pass_${timestamp}`,
    };
}
function cleanupTestCredentials() {
    console.log('Test credentials cleanup completed');
}
//# sourceMappingURL=test.config.js.map