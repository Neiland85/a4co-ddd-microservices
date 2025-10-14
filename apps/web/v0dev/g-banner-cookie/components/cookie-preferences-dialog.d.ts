import type { CookiePreferences } from '../types/cookie-types';
interface CookiePreferencesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (preferences: CookiePreferences) => void;
    onAcceptAll: () => void;
    onRejectAll: () => void;
    companyName: string;
    contactEmail: string;
}
export declare function CookiePreferencesDialog({ open, onOpenChange, onSave, onAcceptAll, onRejectAll, companyName, contactEmail, }: CookiePreferencesDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=cookie-preferences-dialog.d.ts.map