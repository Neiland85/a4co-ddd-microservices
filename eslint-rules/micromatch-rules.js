/**
 * ESLint Rules for Micromatch Security
 * Detects insecure micromatch pattern usage
 */

module.exports = {
  rules: {
    'no-dangerous-micromatch-patterns': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detects potentially dangerous micromatch patterns that could lead to ReDoS attacks',
          category: 'Security',
          recommended: true
        },
        schema: [{
          type: 'object',
          properties: {
            allowRiskyPatterns: {
              type: 'boolean',
              default: false
            },
            maxComplexity: {
              type: 'number',
              default: 50
            }
          },
          additionalProperties: false
        }],
        messages: {
          dangerousPattern: 'Micromatch pattern "{{pattern}}" has {{riskLevel}} risk level (complexity: {{complexity}}). {{recommendations}}',
          excessiveWildcards: 'Pattern contains excessive wildcards ({{count}} stars) which may cause performance issues',
          nestedGroups: 'Pattern contains nested groups which significantly increase ReDoS risk',
          multipleAlternations: 'Pattern contains multiple alternations ({{count}}) that can lead to exponential backtracking'
        }
      },

      create(context) {
        const options = context.options[0] || {};
        const allowRiskyPatterns = options.allowRiskyPatterns || false;
        const maxComplexity = options.maxComplexity || 50;

        // Simple complexity calculation (subset of full validator)
        function calculateComplexity(pattern) {
          if (typeof pattern !== 'string') return 0;

          const starCount = (pattern.match(/\*/g) || []).length;
          const braceCount = (pattern.match(/\{/g) || []).length;
          const alternationCount = (pattern.match(/\|/g) || []).length;
          const nestedGroups = (pattern.match(/\([^)]*\(/g) || []).length;

          return starCount * 2 + braceCount * 3 + alternationCount * 4 + nestedGroups * 5;
        }

        function assessRiskLevel(complexity) {
          if (complexity >= 90) return 'critical';
          if (complexity >= 75) return 'high';
          if (complexity >= 50) return 'medium';
          return 'low';
        }

        function checkPattern(node, pattern) {
          if (typeof pattern !== 'string') return;

          const complexity = calculateComplexity(pattern);
          const riskLevel = assessRiskLevel(complexity);

          // Check for specific dangerous patterns
          const starCount = (pattern.match(/\*/g) || []).length;
          const alternationCount = (pattern.match(/\|/g) || []).length;
          const nestedGroups = (pattern.match(/\([^)]*\(/g) || []).length;

          if (complexity > maxComplexity && !allowRiskyPatterns) {
            const recommendations = [];

            if (starCount > 10) recommendations.push('reduce wildcard usage');
            if (alternationCount > 3) recommendations.push('minimize alternations');
            if (nestedGroups > 2) recommendations.push('avoid nested groups');
            if (complexity > 90) recommendations.push('consider rejecting this pattern');

            context.report({
              node,
              messageId: 'dangerousPattern',
              data: {
                pattern: pattern.substring(0, 50) + (pattern.length > 50 ? '...' : ''),
                riskLevel,
                complexity,
                recommendations: recommendations.join(', ')
              }
            });
          }

          // Specific checks for known dangerous patterns
          if (starCount > 15) {
            context.report({
              node,
              messageId: 'excessiveWildcards',
              data: { count: starCount }
            });
          }

          if (nestedGroups > 2) {
            context.report({
              node,
              messageId: 'nestedGroups'
            });
          }

          if (alternationCount > 5) {
            context.report({
              node,
              messageId: 'multipleAlternations',
              data: { count: alternationCount }
            });
          }
        }

        return {
          // Check micromatch function calls
          CallExpression(node) {
            if (node.callee.type === 'Identifier' &&
                ['match', 'isMatch', 'makeRe', 'some', 'every', 'all', 'not'].includes(node.callee.name)) {
              // Check if it's a micromatch call (simple heuristic)
              const args = node.arguments;
              if (args.length > 1) {
                // Second argument is usually patterns
                const patternsArg = args[1];
                if (patternsArg.type === 'Literal' && typeof patternsArg.value === 'string') {
                  checkPattern(node, patternsArg.value);
                } else if (patternsArg.type === 'ArrayExpression') {
                  patternsArg.elements.forEach(element => {
                    if (element.type === 'Literal' && typeof element.value === 'string') {
                      checkPattern(node, element.value);
                    }
                  });
                }
              }
            }
          },

          // Check variable declarations that might contain patterns
          VariableDeclarator(node) {
            if (node.id.type === 'Identifier' &&
                node.id.name.toLowerCase().includes('pattern') &&
                node.init?.type === 'Literal' &&
                typeof node.init.value === 'string') {
              checkPattern(node, node.init.value);
            }
          }
        };
      }
    }
  }
};