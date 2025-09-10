import type { CookiePreferences } from '../types/cookie-types';
interface CookiePreferencesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (preferences: CookiePreferences) => void;
    currentPreferences: CookiePreferences;
}
export declare function CookiePreferencesDialog({ isOpen, onClose, onSave, currentPreferences, }: CookiePreferencesDialogProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=cookie-preferences-dialog.d.ts.map