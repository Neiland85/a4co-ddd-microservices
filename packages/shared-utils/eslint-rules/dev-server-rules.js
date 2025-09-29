/**
 * ESLint rules para detectar configuraciones inseguras de Dev Servers
 */

module.exports = {
  rules: {
    'no-insecure-dev-host': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detecta configuraciones de host inseguras en dev servers',
          category: 'Security',
          recommended: true
        },
        messages: {
          insecureHost: 'Host "{{host}}" permite acceso externo. Use "127.0.0.1" para desarrollo local.',
          missingHost: 'Host no especificado. Agregue host: "127.0.0.1" para desarrollo seguro.'
        },
        schema: []
      },
      create(context) {
        return {
          Property(node) {
            // Verificar configuraciones de Vite
            if (node.key.name === 'host' || node.key.value === 'host') {
              const parent = node.parent;
              if (parent && parent.type === 'ObjectExpression') {
                // Buscar propiedad server
                const serverProp = parent.properties.find((p: any) =>
                  (p.key.name === 'server' || p.key.value === 'server')
                );

                if (serverProp && serverProp.value === parent) {
                  if (node.value.type === 'Literal') {
                    if (node.value.value === '0.0.0.0') {
                      context.report({
                        node,
                        messageId: 'insecureHost',
                        data: { host: node.value.value }
                      });
                    }
                  }
                }
              }
            }

            // Verificar configuraciones de Next.js
            if (node.key.name === 'HOST' || node.key.value === 'HOST') {
              if (node.value.type === 'Literal') {
                if (node.value.value === '0.0.0.0') {
                  context.report({
                    node,
                    messageId: 'insecureHost',
                    data: { host: node.value.value }
                  });
                }
              }
            }
          }
        };
      }
    },

    'no-dev-cors-wildcard': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detecta configuraciones CORS inseguras en desarrollo',
          category: 'Security',
          recommended: true
        },
        messages: {
          wildcardOrigin: 'CORS origin "*" permite requests desde cualquier dominio. Use origen específico o deshabilite CORS en desarrollo.',
          permissiveCors: 'Configuración CORS permisiva detectada. Restrinja origins en desarrollo.'
        },
        schema: []
      },
      create(context) {
        return {
          Property(node) {
            if (node.key.name === 'cors' || node.key.value === 'cors') {
              if (node.value.type === 'ObjectExpression') {
                const originProp = node.value.properties.find((p: any) =>
                  p.key.name === 'origin' || p.key.value === 'origin'
                );

                if (originProp && originProp.value.type === 'Literal') {
                  if (originProp.value.value === '*') {
                    context.report({
                      node: originProp,
                      messageId: 'wildcardOrigin'
                    });
                  }
                }
              }
            }
          }
        };
      }
    },

    'no-dev-secrets-exposure': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detecta exposición potencial de secrets en código de desarrollo',
          category: 'Security',
          recommended: true
        },
        messages: {
          exposedSecret: 'Posible exposición de secret "{{secret}}" en código. Use variables de entorno.',
          hardcodedApiKey: 'API key hardcodeada detectada. Use variables de entorno.'
        },
        schema: []
      },
      create(context) {
        const secretPatterns = [
          /api[_-]?key/i,
          /secret[_-]?key/i,
          /access[_-]?token/i,
          /auth[_-]?token/i,
          /password/i,
          /database[_-]?url/i
        ];

        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              const value = node.value.toLowerCase();

              for (const pattern of secretPatterns) {
                if (pattern.test(value) && value.length > 10) {
                  // Verificar si parece un valor real (no solo el nombre)
                  if (!value.includes('process.env') && !value.includes('import.meta.env')) {
                    context.report({
                      node,
                      messageId: 'exposedSecret',
                      data: { secret: node.value.substring(0, 20) + '...' }
                    });
                    break;
                  }
                }
              }
            }
          }
        };
      }
    }
  }
};