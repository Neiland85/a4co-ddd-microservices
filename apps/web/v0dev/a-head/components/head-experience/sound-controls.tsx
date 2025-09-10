'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSoundEffects } from '../../hooks/use-sound-effects';
import type { SoundSettings } from '../../types/head-experience-types';

interface SoundControlsProps {
  settings: SoundSettings;
  onSettingsChange: (settings: SoundSettings) => void;
}

export function SoundControls({ settings, onSettingsChange }: SoundControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setGlobalVolume, setEnabled, playClick } = useSoundEffects();

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    const newSettings = { ...settings, volume: newVolume };
    onSettingsChange(newSettings);
    setGlobalVolume(newVolume);
  };

  const handleEnabledChange = (enabled: boolean) => {
    const newSettings = { ...settings, enabled };
    onSettingsChange(newSettings);
    setEnabled(enabled);
    if (enabled) playClick();
  };

  const handleSettingChange = (key: keyof SoundSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    onSettingsChange(newSettings);
    if (settings.enabled) playClick();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-a4co-olive-50 h-9 w-9 p-0 transition-colors"
          aria-label={settings.enabled ? 'Sonido activado' : 'Sonido desactivado'}
          onMouseEnter={() => settings.enabled && playClick({ volume: 0.3 })}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            {settings.enabled ? (
              <Volume2 className="text-a4co-olive-600 h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4 text-gray-400" />
            )}
          </motion.div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="border-a4co-olive-200 shadow-natural-lg w-80 bg-white/95 p-4 backdrop-blur-sm"
        align="end"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-a4co-olive-700 flex items-center gap-2 text-sm font-semibold">
              <Settings className="h-4 w-4" />
              Configuración de Sonido
            </h3>
          </div>

          {/* Master Enable/Disable */}
          <div className="flex items-center justify-between">
            <label htmlFor="sound-enabled" className="text-sm text-gray-700">
              Activar sonidos
            </label>
            <Switch
              id="sound-enabled"
              checked={settings.enabled}
              onCheckedChange={handleEnabledChange}
            />
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700">
              Volumen: {Math.round(settings.volume * 100)}%
            </label>
            <Slider
              value={[settings.volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={5}
              disabled={!settings.enabled}
              className="w-full"
            />
          </div>

          {/* Individual Sound Settings */}
          <div className="border-a4co-olive-200 space-y-3 border-t pt-2">
            <h4 className="text-xs font-medium uppercase tracking-wide text-gray-600">
              Efectos de Sonido
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="click-sound" className="text-sm text-gray-700">
                  Clicks
                </label>
                <Switch
                  id="click-sound"
                  checked={settings.clickSound}
                  onCheckedChange={checked => handleSettingChange('clickSound', checked)}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="hover-sound" className="text-sm text-gray-700">
                  Hover
                </label>
                <Switch
                  id="hover-sound"
                  checked={settings.hoverSound}
                  onCheckedChange={checked => handleSettingChange('hoverSound', checked)}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="menu-sound" className="text-sm text-gray-700">
                  Menús
                </label>
                <Switch
                  id="menu-sound"
                  checked={settings.menuSound}
                  onCheckedChange={checked => handleSettingChange('menuSound', checked)}
                  disabled={!settings.enabled}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
