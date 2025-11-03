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
    logo?: string;
    companyName?: string;
    navigationItems?: NavigationItem[];
    languages?: LanguageOption[];
    currentLanguage?: string;
    onLanguageChange?: (language: string) => void;
    onSearch?: (query: string) => void;
    soundSettings?: SoundSettings;
    onSoundSettingsChange?: (settings: SoundSettings) => void;
}
export interface SearchResult {
    id: string;
    title: string;
    type: 'product' | 'category' | 'page';
    url: string;
    description?: string;
}
//# sourceMappingURL=head-experience-types.d.ts.map