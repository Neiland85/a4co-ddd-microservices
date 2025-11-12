"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomSanitizer = void 0;
class DomSanitizer {
    constructor(options) {
        this.options = {
            allowedTags: ['p', 'b', 'i', 'u', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'br', 'span', 'div'],
            allowedAttributes: {
                a: ['href', 'target', 'rel'],
                img: ['src', 'alt', 'width', 'height'],
            },
            allowedClasses: {},
            allowedSchemes: ['http', 'https', 'mailto', 'tel'],
            allowDataAttributes: false,
            ...options,
        };
    }
    async sanitize(html) {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            const { JSDOM } = await import('jsdom');
            const dom = new JSDOM(html);
            const doc = dom.window.document;
            this.sanitizeNode(doc.body);
            return doc.body.innerHTML;
        }
        else {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            this.sanitizeNode(doc.body);
            return doc.body.innerHTML;
        }
    }
    sanitizeNode(node) {
        const children = Array.from(node.childNodes);
        for (const child of children) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const element = child;
                if (!this.options.allowedTags.includes(element.tagName.toLowerCase())) {
                    const textNode = document.createTextNode(element.textContent || '');
                    node.replaceChild(textNode, element);
                }
                else {
                    this.sanitizeAttributes(element);
                    this.sanitizeNode(element);
                }
            }
            else if (child.nodeType === Node.TEXT_NODE) {
            }
            else if (child.nodeType === Node.COMMENT_NODE) {
                node.removeChild(child);
            }
            else {
                node.removeChild(child);
            }
        }
    }
    sanitizeAttributes(element) {
        const tagName = element.tagName.toLowerCase();
        const allowedForTag = this.options.allowedAttributes[tagName] || [];
        const allowedGlobal = this.options.allowedAttributes['*'] || [];
        const attributesToRemove = [];
        for (const attr of Array.from(element.attributes)) {
            if (!allowedForTag.includes(attr.name) && !allowedGlobal.includes(attr.name)) {
                attributesToRemove.push(attr.name);
            }
            if (attr.name === 'href' || attr.name === 'src') {
                if (!this.isValidUrl(attr.value)) {
                    attributesToRemove.push(attr.name);
                }
            }
            if (attr.name.startsWith('on')) {
                attributesToRemove.push(attr.name);
            }
        }
        attributesToRemove.forEach(attrName => element.removeAttribute(attrName));
    }
    isValidUrl(url) {
        try {
            const parsedUrl = new URL(url, typeof window !== 'undefined' ? window.location.href : 'http://localhost/');
            return this.options.allowedSchemes.includes(parsedUrl.protocol.replace(':', ''));
        }
        catch (e) {
            return false;
        }
    }
}
exports.DomSanitizer = DomSanitizer;
//# sourceMappingURL=dom-sanitizer.js.map