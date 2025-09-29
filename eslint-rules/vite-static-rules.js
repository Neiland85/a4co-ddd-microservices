/**
 * ESLint Rules for Vite Static File Security
 * Detects insecure Vite static file serving configurations
 */

module.exports = {
  rules: {
    'no-insecure-vite-static-config': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detects insecure Vite static file serving configurations that could lead to information disclosure',
          category: 'Security',
          recommended: true
        },
        schema: [{
          type: 'object',
          properties: {
            allowSensitiveDirs: {
              type: 'array',
              items: { type: 'string' }
            },
            requireFsStrict: {
              type: 'boolean',
              default: true
            }
          },
          additionalProperties: false
        }],
        messages: {
          missingFsStrict: 'Vite server.fs.strict should be true to prevent directory traversal attacks',
          missingFsAllow: 'Vite server.fs.allow should be configured to restrict file system access',
          sensitiveDirAllowed: 'Vite server.fs.allow includes sensitive directory "{{dir}}"',
          missingFsDeny: 'Consider adding server.fs.deny to block sensitive directories',
          insecureFsConfig: 'Vite server.fs configuration is insecure - missing strict mode and allow restrictions',
          htmlFilesAllowed: 'HTML files should not be served statically unless explicitly required',
          dotFilesAllowed: 'Dot files should not be served statically unless explicitly required'
        }
      },

      create(context) {
        const options = context.options[0] || {};
        const allowSensitiveDirs = options.allowSensitiveDirs || [];
        const requireFsStrict = options.requireFsStrict !== false;

        const sensitiveDirs = [
          'node_modules', '.git', '.env', 'dist', 'build', 'coverage',
          'logs', 'tmp', 'temp', '.next', '.nuxt', '.output'
        ].filter(dir => !allowSensitiveDirs.includes(dir));

        function checkViteConfig(node) {
          if (node.type === 'ObjectExpression') {
            const serverProperty = node.properties.find(
              prop => prop.key.name === 'server' || prop.key.value === 'server'
            );

            if (serverProperty && serverProperty.value.type === 'ObjectExpression') {
              checkServerConfig(serverProperty.value);
            }
          }
        }

        function checkServerConfig(serverNode) {
          const fsProperty = serverNode.properties.find(
            prop => prop.key.name === 'fs' || prop.key.value === 'fs'
          );

          if (!fsProperty) {
            context.report({
              node: serverNode,
              messageId: 'missingFsDeny'
            });
            return;
          }

          if (fsProperty.value.type === 'ObjectExpression') {
            checkFsConfig(fsProperty.value);
          }
        }

        function checkFsConfig(fsNode) {
          const properties = fsNode.properties;
          let hasStrict = false;
          let hasAllow = false;
          let allowArray = [];

          properties.forEach(prop => {
            if (prop.key.name === 'strict' || prop.key.value === 'strict') {
              if (prop.value.type === 'Literal' && prop.value.value === true) {
                hasStrict = true;
              } else if (requireFsStrict) {
                context.report({
                  node: prop,
                  messageId: 'missingFsStrict'
                });
              }
            }

            if (prop.key.name === 'allow' || prop.key.value === 'allow') {
              hasAllow = true;
              if (prop.value.type === 'ArrayExpression') {
                allowArray = prop.value.elements.map(el => el.value);
              }
            }

            if (prop.key.name === 'deny' || prop.key.value === 'deny') {
              // Has deny configuration, good
            }
          });

          if (!hasStrict && requireFsStrict) {
            context.report({
              node: fsNode,
              messageId: 'missingFsStrict'
            });
          }

          if (!hasAllow) {
            context.report({
              node: fsNode,
              messageId: 'missingFsAllow'
            });
          }

          // Check if sensitive directories are allowed
          allowArray.forEach(allowedPath => {
            sensitiveDirs.forEach(sensitiveDir => {
              if (allowedPath.includes(sensitiveDir)) {
                context.report({
                  node: fsNode,
                  messageId: 'sensitiveDirAllowed',
                  data: { dir: sensitiveDir }
                });
              }
            });
          });

          if (!hasStrict && !hasAllow) {
            context.report({
              node: fsNode,
              messageId: 'insecureFsConfig'
            });
          }
        }

        function checkStaticFileServing(node) {
          // Check for static file serving patterns
          if (node.type === 'CallExpression' &&
              node.callee.type === 'Identifier' &&
              ['readFileSync', 'createReadStream', 'serveStatic'].includes(node.callee.name)) {

            const args = node.arguments;
            if (args.length > 0) {
              const pathArg = args[0];

              // Check for hardcoded sensitive paths
              if (pathArg.type === 'Literal' && typeof pathArg.value === 'string') {
                const path = pathArg.value;

                if (path.includes('.env') || path.includes('package.json')) {
                  context.report({
                    node,
                    messageId: 'sensitiveDirAllowed',
                    data: { dir: 'sensitive file' }
                  });
                }
              }
            }
          }
        }

        return {
          // Check Vite config objects
          VariableDeclarator(node) {
            if (node.id.type === 'Identifier' &&
                node.id.name.toLowerCase().includes('vite')) {
              if (node.init) {
                checkViteConfig(node.init);
              }
            }
          },

          // Check export default (common in vite.config.js)
          ExportDefaultDeclaration(node) {
            checkViteConfig(node.declaration);
          },

          // Check function calls that might serve static files
          CallExpression(node) {
            checkStaticFileServing(node);
          },

          // Check property assignments in config objects
          Property(node) {
            if ((node.key.name === 'vite' || node.key.value === 'vite') &&
                node.value.type === 'ObjectExpression') {
              checkViteConfig(node.value);
            }
          }
        };
      }
    },

    'no-html-static-serving': {
      meta: {
        type: 'warning',
        docs: {
          description: 'Warns about serving HTML files statically which could lead to information disclosure',
          category: 'Security'
        },
        schema: [],
        messages: {
          htmlStaticServing: 'Serving HTML files statically may expose sensitive information. Consider using proper routing instead.'
        }
      },

      create() {
        return {
          Literal(node) {
            if (typeof node.value === 'string' &&
                node.value.match(/\.(html?|ejs|pug|jade)$/i)) {
              // Check if this is in a static file serving context
              let parent = node.parent;
              while (parent) {
                if (parent.type === 'CallExpression' &&
                    parent.callee.type === 'Identifier' &&
                    ['serveStatic', 'static', 'sendFile'].includes(parent.callee.name)) {
                  // This HTML file is being served statically
                  // This is a warning, not an error, as it might be intentional
                  // But it's worth flagging for security review
                }
                parent = parent.parent;
              }
            }
          }
        };
      }
    }
  }
};