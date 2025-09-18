/// <reference lib="dom" />

import type { JSDOM } from 'jsdom'; // Usar import type para evitar bundling en browser

export interface SanitizeOptions {
  allowedTags: string[];
  allowedAttributes: Record<string, string[]>;
  allowedClasses: Record<string, string[]>;
  allowedSchemes: string[];
  allowDataAttributes: boolean;
}

export class DomSanitizer {
  private options: SanitizeOptions;

  constructor(options?: Partial<SanitizeOptions>) {
    this.options = {
      allowedTags: ['p', 'b', 'i', 'u', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'br', 'span', 'div'],
      allowedAttributes: {
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt', 'width', 'height'],
        // Add other element-specific attributes here
      },
      allowedClasses: {},
      allowedSchemes: ['http', 'https', 'mailto', 'tel'],
      allowDataAttributes: false,
      ...options,
    };
  }

<<<<<<< Updated upstream
  public async sanitize(html: string): Promise<string> {
    // Hacer el método asíncrono
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // Si no estamos en un entorno de navegador, usar JSDOM para la sanitización
      // Importación dinámica para que no se bundle en el lado del cliente
      const { JSDOM } = await import('jsdom');
=======
  public async sanitize(html: string): Promise<string> { // Hacer el método asíncrono
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // Si no estamos en un entorno de navegador, usar JSDOM para la sanitización
      // Importación dinámica para que no se bundle en el lado del cliente
      const { JSDOM } = await import('jsdom'); 
>>>>>>> Stashed changes
      const dom = new JSDOM(html);
      const doc = dom.window.document;
      this.sanitizeNode(doc.body);
      return doc.body.innerHTML;
    } else {
      // En entorno de navegador, usar DOM Parser nativo
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      this.sanitizeNode(doc.body);
      return doc.body.innerHTML;
    }
  }

  private sanitizeNode(node: Node): void {
    const children = Array.from(node.childNodes);
<<<<<<< Updated upstream

    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement;

=======
    
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement;
        
>>>>>>> Stashed changes
        // Remover tags no permitidos
        if (!this.options.allowedTags.includes(element.tagName.toLowerCase())) {
          const textNode = document.createTextNode(element.textContent || '');
          node.replaceChild(textNode, element);
        } else {
          // Remover atributos no permitidos
          this.sanitizeAttributes(element);
          // Recorrer hijos recursivamente
          this.sanitizeNode(element);
        }
      } else if (child.nodeType === Node.TEXT_NODE) {
        // Dejar nodos de texto como están
      } else if (child.nodeType === Node.COMMENT_NODE) {
        // Remover comentarios
        node.removeChild(child);
      } else {
        // Remover otros tipos de nodos (doctype, etc.)
        node.removeChild(child);
      }
    }
  }

  private sanitizeAttributes(element: HTMLElement): void {
<<<<<<< Updated upstream
    const tagName = element.tagName.toLowerCase();
    const allowedForTag = this.options.allowedAttributes[tagName] || [];
    const allowedGlobal = this.options.allowedAttributes['*'] || []; // Atributos permitidos globalmente

=======
      const tagName = element.tagName.toLowerCase();
      const allowedForTag = this.options.allowedAttributes[tagName] || [];
    const allowedGlobal = this.options.allowedAttributes['*'] || []; // Atributos permitidos globalmente
      
>>>>>>> Stashed changes
    const attributesToRemove: string[] = [];
    for (const attr of Array.from(element.attributes)) {
      // Remover atributos no permitidos para el tag o globalmente
      if (!allowedForTag.includes(attr.name) && !allowedGlobal.includes(attr.name)) {
        attributesToRemove.push(attr.name);
      }
<<<<<<< Updated upstream

=======
      
>>>>>>> Stashed changes
      // Sanitizar URLs en href/src
      if (attr.name === 'href' || attr.name === 'src') {
        if (!this.isValidUrl(attr.value)) {
          attributesToRemove.push(attr.name);
        }
      }
<<<<<<< Updated upstream

=======
      
>>>>>>> Stashed changes
      // Remover event handlers (on* attributes)
      if (attr.name.startsWith('on')) {
        attributesToRemove.push(attr.name);
      }
    }

    attributesToRemove.forEach(attrName => element.removeAttribute(attrName));
  }

  private isValidUrl(url: string): boolean {
    try {
<<<<<<< Updated upstream
      const parsedUrl = new URL(
        url,
        typeof window !== 'undefined' ? window.location.href : 'http://localhost/'
      );
=======
      const parsedUrl = new URL(url, typeof window !== 'undefined' ? window.location.href : 'http://localhost/');
>>>>>>> Stashed changes
      return this.options.allowedSchemes.includes(parsedUrl.protocol.replace(':', ''));
    } catch (e) {
      return false;
    }
  }
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
