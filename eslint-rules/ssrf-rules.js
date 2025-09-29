/**
 * Reglas personalizadas de ESLint para prevenir SSRF en Next.js
 */

module.exports = {
  'no-unsafe-redirect': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Detecta redirecciones inseguras que pueden causar SSRF'
      }
    },
    create(context) {
      return {
        CallExpression(node) {
          // Detectar NextResponse.redirect() sin validación
          if (node.callee.type === 'MemberExpression' &&
              node.callee.object.name === 'NextResponse' &&
              node.callee.property.name === 'redirect') {

            // Verificar si hay validación previa
            const hasValidation = this.hasValidationBefore(node);

            if (!hasValidation) {
              context.report({
                node,
                message: 'Unsafe redirect detected. Use SSRFSecurityUtils.validateAndSanitizeURL() before redirecting.'
              });
            }
          }
        },

        // Detectar fetch() calls sin validación
        CallExpression(node) {
          if (node.callee.name === 'fetch' && node.arguments.length > 0) {
            const urlArg = node.arguments[0];

            // Verificar si es una variable o expresión compleja
            if (urlArg.type === 'Identifier' || urlArg.type === 'MemberExpression') {
              // Podría ser inseguro, marcar para revisión
              context.report({
                node,
                message: 'Potential unsafe fetch. Consider using SSRFSecurityUtils.safeFetch().'
              });
            }
          }
        }
      };
    },

    hasValidationBefore(node) {
      // Lógica simplificada para detectar validación previa
      // En un caso real, esto sería más sofisticado
      return false;
    }
  },

  'no-internal-ip-access': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Detecta acceso a IPs internas que pueden indicar SSRF'
      }
    },
    create(context) {
      const internalIPRegex = /(10\.\d+|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.\d+|169\.254\.)/;

      return {
        Literal(node) {
          if (typeof node.value === 'string' && internalIPRegex.test(node.value)) {
            context.report({
              node,
              message: 'Internal IP address detected. This may indicate SSRF vulnerability.'
            });
          }
        }
      };
    }
  }
};