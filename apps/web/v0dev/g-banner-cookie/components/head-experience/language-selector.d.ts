import type { LanguageOption } from '../../types/head-experience-types';
interface LanguageSelectorProps {
    readonly languages: LanguageOption[];
    readonly currentLanguage: string;
    readonly onLanguageChange: (language: string) => void;
}
export declare function LanguageSelector({ languages, currentLanguage, onLanguageChange, }: LanguageSelectorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=language-selector.d.ts.map