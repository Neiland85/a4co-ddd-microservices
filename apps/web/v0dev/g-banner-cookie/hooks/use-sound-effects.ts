"use client"

import { useCallback, useRef, useEffect } from "react"

interface SoundEffectOptions {
  volume?: number
  playbackRate?: number
  interrupt?: boolean
}

interface UseSoundEffectsReturn {
  playClick: (options?: SoundEffectOptions) => void
  playHover: (options?: SoundEffectOptions) => void
  playMenuOpen: (options?: SoundEffectOptions) => void
  playMenuClose: (options?: SoundEffectOptions) => void
  playSuccess: (options?: SoundEffectOptions) => void
  playError: (options?: SoundEffectOptions) => void
  setGlobalVolume: (volume: number) => void
  isEnabled: boolean
  setEnabled: (enabled: boolean) => void
}

export function useSoundEffects(): UseSoundEffectsReturn {
  const audioContextRef = useRef<AudioContext | null>(null)
  const soundsRef = useRef<Map<string, AudioBuffer>>(new Map())
  const isEnabledRef = useRef(true)
  const globalVolumeRef = useRef(0.3)

  // Initialize audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

        // Load sound effects
        const sounds = {
          click: generateTone(800, 0.1, "sine"),
          hover: generateTone(1000, 0.05, "sine"),
          menuOpen: generateTone(600, 0.2, "triangle"),
          menuClose: generateTone(400, 0.15, "triangle"),
          success: generateChord([523, 659, 784], 0.3),
          error: generateTone(200, 0.4, "sawtooth"),
        }

        for (const [name, buffer] of Object.entries(sounds)) {
          soundsRef.current.set(name, buffer)
        }
      } catch (error) {
        console.warn("Audio context initialization failed:", error)
      }
    }

    initAudio()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const generateTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine"): AudioBuffer => {
      if (!audioContextRef.current) throw new Error("Audio context not initialized")

      const sampleRate = audioContextRef.current.sampleRate
      const buffer = audioContextRef.current.createBuffer(1, sampleRate * duration, sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate
        let sample = 0

        if (type === "sine") {
          sample = Math.sin(2 * Math.PI * frequency * t)
        } else if (type === "triangle") {
          sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t))
        } else if (type === "sawtooth") {
          sample = 2 * (frequency * t - Math.floor(frequency * t + 0.5))
        }

        // Apply envelope (fade in/out)
        const envelope = Math.min(t * 10, (duration - t) * 10, 1)
        data[i] = sample * envelope
      }

      return buffer
    },
    [],
  )

  const generateChord = useCallback((frequencies: number[], duration: number): AudioBuffer => {
    if (!audioContextRef.current) throw new Error("Audio context not initialized")

    const sampleRate = audioContextRef.current.sampleRate
    const buffer = audioContextRef.current.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let sample = 0

      frequencies.forEach((freq) => {
        sample += Math.sin(2 * Math.PI * freq * t) / frequencies.length
      })

      // Apply envelope
      const envelope = Math.min(t * 5, (duration - t) * 5, 1)
      data[i] = sample * envelope
    }

    return buffer
  }, [])

  const playSound = useCallback((soundName: string, options: SoundEffectOptions = {}) => {
    if (!isEnabledRef.current || !audioContextRef.current || !soundsRef.current.has(soundName)) {
      return
    }

    try {
      const buffer = soundsRef.current.get(soundName)!
      const source = audioContextRef.current.createBufferSource()
      const gainNode = audioContextRef.current.createGain()

      source.buffer = buffer
      source.playbackRate.value = options.playbackRate || 1
      gainNode.gain.value = (options.volume || 1) * globalVolumeRef.current

      source.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      source.start()
    } catch (error) {
      console.warn("Sound playback failed:", error)
    }
  }, [])

  const playClick = useCallback(
    (options?: SoundEffectOptions) => {
      playSound("click", options)
    },
    [playSound],
  )

  const playHover = useCallback(
    (options?: SoundEffectOptions) => {
      playSound("hover", { volume: 0.5, ...options })
    },
    [playSound],
  )

  const playMenuOpen = useCallback(
    (options?: SoundEffectOptions) => {
      playSound("menuOpen", options)
    },
    [playSound],
  )

  const playMenuClose = useCallback(
    (options?: SoundEffectOptions) => {
      playSound("menuClose", options)
    },
    [playSound],
  )

  const playSuccess = useCallback(
    (options?: SoundEffectOptions) => {
      playSound("success", options)
    },
    [playSound],
  )

  const playError = useCallback(
    (options?: SoundEffectOptions) => {
      playSound("error", options)
    },
    [playSound],
  )

  const setGlobalVolume = useCallback((volume: number) => {
    globalVolumeRef.current = Math.max(0, Math.min(1, volume))
  }, [])

  const setEnabled = useCallback((enabled: boolean) => {
    isEnabledRef.current = enabled
  }, [])

  return {
    playClick,
    playHover,
    playMenuOpen,
    playMenuClose,
    playSuccess,
    playError,
    setGlobalVolume,
    isEnabled: isEnabledRef.current,
    setEnabled,
  }
}
