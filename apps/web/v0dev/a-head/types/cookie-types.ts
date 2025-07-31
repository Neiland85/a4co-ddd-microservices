export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

export interface CookieConsentState {
  hasConsented: boolean
  preferences: CookiePreferences
  consentDate?: Date
  version: string
}

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
}

export const COOKIE_CONSENT_KEY = "cookie-consent"
export const COOKIE_CONSENT_VERSION = "1.0"
