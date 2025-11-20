"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateSanitizer = void 0;
class TemplateSanitizer {
    static sanitizeTemplate(template) {
        if (typeof template !== 'string')
            return template;
        let sanitized = template;
        sanitized = sanitized.replace(/<%=(.*?)%>/g, (match, content) => {
            if (content.includes('eval') || content.includes('Function')) {
                return '<!-- DANGEROUS CODE REMOVED -->';
            }
            return match;
        });
        return sanitized;
    }
    static compileSafeTemplate(template) {
        const sanitized = this.sanitizeTemplate(template);
        return new Function('data', 'user', 'config', 'return `' + sanitized + '`');
    }
    static renderTemplate(template, params) {
        const compiled = this.compileSafeTemplate(template);
        return compiled(params['data'], params['user'], params['config']);
    }
}
exports.TemplateSanitizer = TemplateSanitizer;
exports.default = TemplateSanitizer;
//# sourceMappingURL=template-sanitizer.js.map