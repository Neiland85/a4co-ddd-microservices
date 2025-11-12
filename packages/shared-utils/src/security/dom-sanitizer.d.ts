export interface SanitizeOptions {
    allowedTags: string[];
    allowedAttributes: Record<string, string[]>;
    allowedClasses: Record<string, string[]>;
    allowedSchemes: string[];
    allowDataAttributes: boolean;
}
export declare class DomSanitizer {
    private options;
    constructor(options?: Partial<SanitizeOptions>);
    sanitize(html: string): Promise<string>;
    private sanitizeNode;
    private sanitizeAttributes;
    private isValidUrl;
}
//# sourceMappingURL=dom-sanitizer.d.ts.map