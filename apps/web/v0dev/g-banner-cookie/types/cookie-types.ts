export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  purposes: string[];
  dataProcessed: string[];
  retention: string;
  required: boolean;
  enabled: boolean;
  vendors?: string[];
  legalBasis: string;
}

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  personalization: boolean;
  social: boolean;
}

export interface BannerCookieProps {
  companyName?: string;
  privacyPolicyUrl?: string;
  cookiePolicyUrl?: string;
  contactEmail?: string;
  onPreferencesChange?: (preferences: CookiePreferences) => void;
  position?: 'bottom' | 'top' | 'center';
  theme?: 'light' | 'dark' | 'auto';
}

export interface CookieConsent {
  preferences: CookiePreferences;
  timestamp: string;
  version: string;
  userAgent: string;
  ipHash?: string;
}
