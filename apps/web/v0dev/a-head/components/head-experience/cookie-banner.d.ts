interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
}
interface CookieBannerProps {
    companyName?: string;
    privacyPolicyUrl?: string;
    onPreferencesChange?: (preferences: CookiePreferences) => void;
}
export declare function CookieBanner({ companyName, privacyPolicyUrl, onPreferencesChange, }: CookieBannerProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=cookie-banner.d.ts.map