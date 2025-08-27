interface SanitizeOptions {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    allowedProtocols?: string[];
}
export declare class DOMSanitizer {
    private options;
    constructor(options?: SanitizeOptions);
    sanitize(html: string): string;
    private sanitizeNode;
    private sanitizeAttributes;
    private isValidUrl;
}
export declare const domSanitizer: DOMSanitizer;
export declare function sanitizeHTML(html: string, options?: SanitizeOptions): string;
export declare function useSanitizedHTML(html: string, options?: SanitizeOptions): string;
export {};
//# sourceMappingURL=dom-sanitizer.d.ts.map