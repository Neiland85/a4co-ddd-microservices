export class TemplateSanitizer {
  static sanitizeTemplate(template: string): string {
    if (typeof template !== 'string') return template;

    let sanitized = template;
    sanitized = sanitized.replace(/<%=(.*?)%>/g, (match, content) => {
      if (content.includes('eval') || content.includes('Function')) {
        return '<!-- DANGEROUS CODE REMOVED -->';
      }
      return match;
    });

    return sanitized;
  }

  static compileSafeTemplate(template: string) {
    const sanitized = this.sanitizeTemplate(template);
    return new Function('data', 'user', 'config', 'return `' + sanitized + '`');
  }

  static renderTemplate(template: string, params: Record<string, unknown>): string {
    const compiled = this.compileSafeTemplate(template);
    return compiled(params['data'], params['user'], params['config']);
  }
}

export default TemplateSanitizer;
