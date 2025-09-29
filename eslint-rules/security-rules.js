module.exports = {
  'no-dangerous-lodash': {
    create(context) {
      return {
        CallExpression(node) {
          if (node.callee.object && node.callee.object.name === '_' &&
              ['merge', 'defaults'].includes(node.callee.property.name)) {
            context.report({
              node,
              message: 'Use SafeObjectUtils.safeMerge instead of _.merge'
            });
          }
        }
      };
    }
  },

  'no-prototype-pollution': {
    create(context) {
      return {
        MemberExpression(node) {
          if (node.property.name === '__proto__') {
            context.report({
              node,
              message: 'Direct access to __proto__ is dangerous'
            });
          }
        }
      };
    }
  }
};