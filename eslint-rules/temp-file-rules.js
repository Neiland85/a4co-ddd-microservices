/**
 * ESLint rules for detecting insecure temp file operations
 */

module.exports = {
  rules: {
    'no-insecure-temp-file-creation': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detect insecure temporary file creation patterns',
          category: 'Security',
          recommended: true
        },
        schema: [],
        messages: {
          insecureTempCreation: 'Insecure temporary file creation detected. Use fs.mkdtemp() or SafeTempFileManager instead.',
          avoidPredictableTempNames: 'Avoid predictable temporary file names. Use random suffixes.',
          noDirectTempOperations: 'Direct temp file operations without validation detected. Use protected wrappers.'
        }
      },
      create(context) {
        return {
          CallExpression(node) {
            const { callee } = node;

            // Detect fs.writeFile, fs.writeFileSync with temp paths
            if (
              callee.type === 'MemberExpression' &&
              callee.object.name === 'fs' &&
              ['writeFile', 'writeFileSync', 'appendFile', 'appendFileSync'].includes(callee.property.name)
            ) {
              const args = node.arguments;
              if (args.length > 0 && args[0].type === 'Literal') {
                const filePath = args[0].value;
                if (typeof filePath === 'string' && (filePath.includes('/tmp/') || filePath.includes('/var/tmp/'))) {
                  context.report({
                    node,
                    messageId: 'noDirectTempOperations',
                    data: { filePath }
                  });
                }
              }
            }

            // Detect insecure temp directory creation
            if (
              callee.type === 'MemberExpression' &&
              callee.object.name === 'fs' &&
              ['mkdir', 'mkdirSync'].includes(callee.property.name)
            ) {
              const args = node.arguments;
              if (args.length > 0 && args[0].type === 'Literal') {
                const dirPath = args[0].value;
                if (typeof dirPath === 'string' && (dirPath.includes('/tmp/') || dirPath.includes('/var/tmp/'))) {
                  context.report({
                    node,
                    messageId: 'insecureTempCreation'
                  });
                }
              }
            }

            // Detect predictable temp file names
            if (
              callee.type === 'CallExpression' &&
              callee.callee.name === 'path.join' &&
              node.arguments.some(arg =>
                arg.type === 'Literal' &&
                typeof arg.value === 'string' &&
                arg.value.includes('temp') &&
                !arg.value.includes(Math.random().toString())
              )
            ) {
              context.report({
                node,
                messageId: 'avoidPredictableTempNames'
              });
            }
          },

          VariableDeclarator(node) {
            // Detect variable assignments with temp paths
            if (
              node.init &&
              node.init.type === 'CallExpression' &&
              node.init.callee.name === 'require' &&
              node.init.arguments[0].value === 'tmp'
            ) {
              context.report({
                node,
                messageId: 'insecureTempCreation'
              });
            }
          }
        };
      }
    },

    'no-symlink-temp-operations': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detect operations on symlinked temp files',
          category: 'Security',
          recommended: true
        },
        schema: [],
        messages: {
          symlinkTempOperation: 'Operation on potentially symlinked temp file detected. Use SafeTempFileManager for validation.'
        }
      },
      create(context) {
        return {
          CallExpression(node) {
            const { callee } = node;

            if (
              callee.type === 'MemberExpression' &&
              callee.object.name === 'fs' &&
              ['readFile', 'readFileSync', 'writeFile', 'writeFileSync', 'unlink', 'unlinkSync'].includes(callee.property.name)
            ) {
              const args = node.arguments;
              if (args.length > 0 && args[0].type === 'Literal') {
                const filePath = args[0].value;
                if (typeof filePath === 'string' && (filePath.includes('/tmp/') || filePath.includes('/var/tmp/'))) {
                  context.report({
                    node,
                    messageId: 'symlinkTempOperation'
                  });
                }
              }
            }
          }
        };
      }
    }
  }
};