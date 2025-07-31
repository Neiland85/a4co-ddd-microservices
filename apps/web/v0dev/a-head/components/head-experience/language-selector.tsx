"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronDown, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSoundEffects } from "../../hooks/use-sound-effects"
import type { LanguageOption } from "../../types/head-experience-types"

interface LanguageSelectorProps {
  languages: LanguageOption[]
  currentLanguage: string
  onLanguageChange: (language: string) => void
}

export function LanguageSelector({ languages, currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { playClick, playHover } = useSoundEffects()

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0]

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode)
    setIsOpen(false)
    playClick()
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 hover:bg-a4co-olive-50 transition-colors"
          aria-label={`Idioma actual: ${currentLang.label}`}
          onMouseEnter={() => playHover()}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-a4co-olive-600" />
            <span className="text-sm font-medium text-a4co-olive-700">
              {currentLang.flag} {currentLang.code.toUpperCase()}
            </span>
            <ChevronDown className={`h-3 w-3 text-a4co-olive-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </motion.div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-48 p-1 bg-white/95 backdrop-blur-sm border-a4co-olive-200 shadow-natural-lg"
        align="end"
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-1"
          >
            {languages.map((language, index) => (
              <motion.button
                key={language.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleLanguageSelect(language.code)}
                onMouseEnter={() => playHover()}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                  language.code === currentLanguage
                    ? "bg-a4co-olive-100 text-a4co-olive-700"
                    : "hover:bg-a4co-olive-50 text-gray-700"
                }`}
                role="menuitem"
                aria-selected={language.code === currentLanguage}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="flex-1 text-left">{language.label}</span>
                {language.code === currentLanguage && <Check className="h-4 w-4 text-a4co-olive-600" />}
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  )
}
