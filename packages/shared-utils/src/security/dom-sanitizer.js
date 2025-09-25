"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
            const { JSDOM } = await Promise.resolve().then(() => __importStar(require('jsdom')));
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