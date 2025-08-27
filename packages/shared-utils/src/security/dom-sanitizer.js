"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domSanitizer = exports.DOMSanitizer = void 0;
exports.sanitizeHTML = sanitizeHTML;
exports.useSanitizedHTML = useSanitizedHTML;
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
class DOMSanitizer {
    options;
    constructor(options = {}) {
        this.options = {
            allowedTags: options.allowedTags || DEFAULT_ALLOWED_TAGS,
            allowedAttributes: options.allowedAttributes || DEFAULT_ALLOWED_ATTRIBUTES,
            allowedProtocols: options.allowedProtocols || DEFAULT_ALLOWED_PROTOCOLS
        };
    }
    sanitize(html) {
        if (!html)
            return '';
        const template = document.createElement('template');
        template.innerHTML = html;
        this.sanitizeNode(template.content);
        return template.innerHTML;
    }
    sanitizeNode(node) {
        const childNodes = Array.from(node.childNodes);
        childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const element = child;
                if (!this.options.allowedTags.includes(element.tagName.toLowerCase())) {
                    const textNode = document.createTextNode(element.textContent || '');
                    node.replaceChild(textNode, element);
                    return;
                }
                this.sanitizeAttributes(element);
                this.sanitizeNode(element);
            }
            else if (child.nodeType === Node.TEXT_NODE) {
            }
            else {
                node.removeChild(child);
            }
        });
    }
    sanitizeAttributes(element) {
        const attributes = Array.from(element.attributes);
        attributes.forEach(attr => {
            const tagName = element.tagName.toLowerCase();
            const allowedForTag = this.options.allowedAttributes[tagName] || [];
            const allowedGlobal = this.options.allowedAttributes['*'] || [];
            if (!allowedForTag.includes(attr.name) && !allowedGlobal.includes(attr.name)) {
                element.removeAttribute(attr.name);
                return;
            }
            if (attr.name === 'href' || attr.name === 'src') {
                if (!this.isValidUrl(attr.value)) {
                    element.removeAttribute(attr.name);
                }
            }
            if (attr.name.startsWith('on')) {
                element.removeAttribute(attr.name);
            }
        });
    }
    isValidUrl(url) {
        try {
            const base = typeof window !== 'undefined' && window.location && window.location.href
                ? window.location.href
                : 'http://localhost';
            const parsedUrl = new URL(url, base);
            return this.options.allowedProtocols.includes(parsedUrl.protocol);
        }
        catch {
            return false;
        }
    }
}
exports.DOMSanitizer = DOMSanitizer;
exports.domSanitizer = new DOMSanitizer();
function sanitizeHTML(html, options) {
    if (options) {
        const customSanitizer = new DOMSanitizer(options);
        return customSanitizer.sanitize(html);
    }
    return exports.domSanitizer.sanitize(html);
}
function useSanitizedHTML(html, options) {
    return sanitizeHTML(html, options);
}
//# sourceMappingURL=dom-sanitizer.js.map