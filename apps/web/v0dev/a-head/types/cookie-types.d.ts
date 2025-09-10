export interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
}
export interface CookieConsentState {
    hasConsented: boolean;
    preferences: CookiePreferences;
    consentDate?: Date;
    version: string;
}
export declare const DEFAULT_COOKIE_PREFERENCES: CookiePreferences;
export declare const COOKIE_CONSENT_KEY = "cookie-consent";
export declare const COOKIE_CONSENT_VERSION = "1.0";
//# sourceMappingURL=cookie-types.d.ts.map