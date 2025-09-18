'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Navigation } from './navigation';
import { SearchBar } from './search-bar';
import { LanguageSelector } from './language-selector';
import { ThemeToggle } from './theme-toggle';
import { SoundControls } from './sound-controls';
import { CookieBanner } from './cookie-banner';
import { useSoundEffects } from '../../hooks/use-sound-effects';
import type {
  HeadExperienceProps,
  SoundSettings,
  LanguageOption,
} from '../../types/head-experience-types';

const defaultLanguages: LanguageOption[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

const defaultSoundSettings: SoundSettings = {
  enabled: true,
  volume: 0.3,
  clickSound: true,
  hoverSound: true,
  menuSound: true,
};

export default function HeadExperience({
  logo = '/images/logo-green.jpeg',
  companyName = 'A4CO',
  navigationItems,
  languages = defaultLanguages,
  currentLanguage = 'es',
  onLanguageChange,
  onSearch,
  soundSettings = defaultSoundSettings,
  onSoundSettingsChange,
}: Readonly<HeadExperienceProps>) {
  const [currentPath, setCurrentPath] = useState('/');
  const [localSoundSettings, setLocalSoundSettings] = useState(soundSettings);
  const { setGlobalVolume, setEnabled } = useSoundEffects();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    setGlobalVolume(localSoundSettings.volume);
    setEnabled(localSoundSettings.enabled);
  }, [localSoundSettings, setGlobalVolume, setEnabled]);

  const handleSoundSettingsChange = (settings: SoundSettings) => {
    setLocalSoundSettings(settings);
    onSoundSettingsChange?.(settings);
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    onSearch?.(query);
  };

  const handleLanguageChange = (language: string) => {
    console.log('Language changed to:', language);
    onLanguageChange?.(language);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="border-a4co-olive-200 shadow-natural-sm sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-sm"
        role="banner"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3"
            >
              <Link
                href="/"
                className="flex items-center gap-3"
                aria-label={`Ir a inicio de ${companyName}`}
              >
                <div className="shadow-natural relative h-10 w-10 overflow-hidden rounded-lg">
                  <Image
                    src={logo || '/placeholder.svg'}
                    alt={`Logo de ${companyName}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-a4co-olive-700 text-xl font-bold tracking-tight">
                    {companyName}
                  </h1>
                  <p className="text-a4co-clay-600 -mt-1 text-xs">Artesanía Auténtica</p>
                </div>
              </Link>
            </motion.div>

            {/* Navigation */}
            <div className="flex flex-1 justify-center">
              <Navigation items={navigationItems} currentPath={currentPath} />
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <SearchBar onSearch={handleSearch} />

              <div className="hidden items-center gap-1 sm:flex">
                <LanguageSelector
                  languages={languages}
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                />
                <ThemeToggle />
                <SoundControls
                  settings={localSoundSettings}
                  onSettingsChange={handleSoundSettingsChange}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Cookie Banner */}
      <CookieBanner companyName={companyName} privacyPolicyUrl="/politica-privacidad" />
    </>
  );
}
