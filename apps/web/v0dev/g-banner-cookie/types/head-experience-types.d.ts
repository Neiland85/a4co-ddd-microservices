import type React from 'react';
export interface NavigationItem {
    id: string;
    label: string;
    href: string;
    icon?: React.ComponentType<{
        className?: string;
    }>;
    badge?: string;
}
export interface LanguageOption {
    code: string;
    label: string;
    flag: string;
}
export interface SoundSettings {
    enabled: boolean;
    volume: number;
    clickSound: boolean;
    hoverSound: boolean;
    menuSound: boolean;
}
export interface HeadExperienceProps {
    readonly logo?: string;
    readonly companyName?: string;
    readonly navigationItems?: NavigationItem[];
    readonly languages?: LanguageOption[];
    readonly currentLanguage?: string;
    readonly onLanguageChange?: (language: string) => void;
    readonly onSearch?: (query: string) => void;
    readonly soundSettings?: SoundSettings;
    readonly onSoundSettingsChange?: (settings: SoundSettings) => void;
}
export interface SearchResult {
    id: string;
    title: string;
    type: 'product' | 'category' | 'page';
    url: string;
    description?: string;
}
//# sourceMappingURL=head-experience-types.d.ts.map