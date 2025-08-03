/**
 * DOM Sanitizer - Utilidad para sanitizar contenido HTML de forma segura
 * Mitiga vulnerabilidades XSS detectadas por SonarQube
 */

interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  allowedProtocols?: string[];
}

const DEFAULT_ALLOWED_TAGS = [
  'p', 'div', 'span', 'a', 'b', 'i', 'em', 'strong', 
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'br', 'hr'
];

const DEFAULT_ALLOWED_ATTRIBUTES = {
  'a': ['href', 'title', 'target'],
  '*': ['class', 'id']
};

const DEFAULT_ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:'];

export class DOMSanitizer {
  private options: Required<SanitizeOptions>;

  constructor(options: SanitizeOptions = {}) {
    this.options = {
      allowedTags: options.allowedTags || DEFAULT_ALLOWED_TAGS,
      allowedAttributes: options.allowedAttributes || DEFAULT_ALLOWED_ATTRIBUTES,
      allowedProtocols: options.allowedProtocols || DEFAULT_ALLOWED_PROTOCOLS
    };
  }

  /**
   * Sanitiza contenido HTML eliminando elementos y atributos peligrosos
   */
  sanitize(html: string): string {
    if (!html) return '';

    // Crear un elemento temporal para parsear el HTML
    const template = document.createElement('template');
    template.innerHTML = html;
    
    // Sanitizar recursivamente
    this.sanitizeNode(template.content);
    
    return template.innerHTML;
  }

  /**
   * Sanitiza un nodo y sus hijos recursivamente
   */
  private sanitizeNode(node: Node): void {
    // Obtener todos los nodos hijos antes de modificar
    const childNodes = Array.from(node.childNodes);
    
    childNodes.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as Element;
        
        // Verificar si el tag está permitido
        if (!this.options.allowedTags.includes(element.tagName.toLowerCase())) {
          // Reemplazar con su contenido de texto
          const textNode = document.createTextNode(element.textContent || '');
          node.replaceChild(textNode, element);
          return;
        }
        
        // Sanitizar atributos
        this.sanitizeAttributes(element);
        
        // Sanitizar hijos recursivamente
        this.sanitizeNode(element);
      } else if (child.nodeType === Node.TEXT_NODE) {
        // Los nodos de texto son seguros por defecto
      } else {
        // Eliminar otros tipos de nodos (comentarios, etc.)
        node.removeChild(child);
      }
    });
  }

  /**
   * Sanitiza los atributos de un elemento
   */
  private sanitizeAttributes(element: Element): void {
    const attributes = Array.from(element.attributes);
    
    attributes.forEach(attr => {
      const tagName = element.tagName.toLowerCase();
      const allowedForTag = this.options.allowedAttributes[tagName] || [];
      const allowedGlobal = this.options.allowedAttributes['*'] || [];
      
      // Verificar si el atributo está permitido
      if (!allowedForTag.includes(attr.name) && !allowedGlobal.includes(attr.name)) {
        element.removeAttribute(attr.name);
        return;
      }
      
      // Sanitizar valores de atributos especiales
      if (attr.name === 'href' || attr.name === 'src') {
        if (!this.isValidUrl(attr.value)) {
          element.removeAttribute(attr.name);
        }
      }
      
      // Prevenir event handlers
      if (attr.name.startsWith('on')) {
        element.removeAttribute(attr.name);
      }
    });
  }

  /**
   * Valida si una URL es segura
   */
  private isValidUrl(url: string): boolean {
    try {
      // Use window.location.href if available, otherwise fallback to a default base URL
      const base =
        typeof window !== 'undefined' && window.location && window.location.href
          ? window.location.href
          : 'http://localhost';
      const parsedUrl = new URL(url, base);
      return this.options.allowedProtocols.includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  }
}

/**
 * Instancia singleton del sanitizador
 */
export const domSanitizer = new DOMSanitizer();

/**
 * Función helper para sanitizar HTML
 */
export function sanitizeHTML(html: string, options?: SanitizeOptions): string {
  if (options) {
    const customSanitizer = new DOMSanitizer(options);
    return customSanitizer.sanitize(html);
  }
  return domSanitizer.sanitize(html);
}

/**
 * Hook de React para contenido sanitizado
 */
export function useSanitizedHTML(html: string, options?: SanitizeOptions): string {
  return sanitizeHTML(html, options);
}