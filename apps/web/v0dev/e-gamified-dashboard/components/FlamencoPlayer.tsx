"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Music, SkipForward, SkipBack } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FlamencoTrack {
  id: number
  title: string
  artist: string
  duration: string
  src: string
}

const flamencoTracks: FlamencoTrack[] = [
  {
    id: 1,
    title: "Entre Dos Aguas",
    artist: "Paco de Lucía",
    duration: "5:47",
    src: "", // Empty src to avoid audio loading errors
  },
  {
    id: 2,
    title: "Alegrías de Cádiz",
    artist: "Camarón de la Isla",
    duration: "4:23",
    src: "",
  },
  {
    id: 3,
    title: "Bulerías por Soleá",
    artist: "Tomatito",
    duration: "6:12",
    src: "",
  },
  {
    id: 4,
    title: "Tangos de Triana",
    artist: "Vicente Amigo",
    duration: "4:56",
    src: "",
  },
]

export default function FlamencoPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(0.3)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1
          if (newTime >= duration) {
            nextTrack()
            return 0
          }
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, duration])

  const togglePlay = () => {
    // Simulate audio playback without actual files
    if (isPlaying) {
      // Simulate pause
      setIsPlaying(false)
    } else {
      // Simulate play
      setIsPlaying(true)
      // Simulate track duration for demo purposes
      setDuration(347) // 5:47 in seconds for first track
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const changeVolume = (newVolume: number) => {
    const audio = audioRef.current
    if (!audio) return

    setVolume(newVolume)
    audio.volume = newVolume
  }

  const nextTrack = () => {
    const newTrackIndex = (currentTrack + 1) % flamencoTracks.length
    setCurrentTrack(newTrackIndex)
    setCurrentTime(0)

    // Set different durations for each track (in seconds)
    const durations = [347, 263, 372, 296] // 5:47, 4:23, 6:12, 4:56
    setDuration(durations[newTrackIndex])

    setIsPlaying(true)
  }

  const prevTrack = () => {
    const newTrackIndex = (currentTrack - 1 + flamencoTracks.length) % flamencoTracks.length
    setCurrentTrack(newTrackIndex)
    setCurrentTime(0)

    // Set different durations for each track (in seconds)
    const durations = [347, 263, 372, 296] // 5:47, 4:23, 6:12, 4:56
    setDuration(durations[newTrackIndex])

    setIsPlaying(true)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  return (
    <>
      {/* Floating Music Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 2, duration: 0.8, type: "spring" }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-2xl flex items-center justify-center border-4 border-yellow-400"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          animate={
            isPlaying
              ? {
                  boxShadow: [
                    "0 0 0 0 rgba(251, 146, 60, 0.7)",
                    "0 0 0 20px rgba(251, 146, 60, 0)",
                    "0 0 0 0 rgba(251, 146, 60, 0)",
                  ],
                }
              : {}
          }
          transition={{ duration: 2, repeat: isPlaying ? Number.POSITIVE_INFINITY : 0 }}
        >
          <Music className="w-8 h-8 text-white" />
        </motion.button>

        {/* Floating musical notes */}
        {isPlaying && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [-20, -60],
                  x: [0, Math.random() * 40 - 20],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                }}
                style={{
                  left: "50%",
                  top: "50%",
                }}
              >
                🎵
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Music Player Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-24 left-6 z-40 bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 rounded-3xl p-6 shadow-2xl border-4 border-yellow-400 w-80"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Music className="w-6 h-6 mr-2 text-yellow-400" />
                Flamenco Ambiental
                <span className="text-xs text-yellow-200 ml-2">(Demo)</span>
              </h3>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>

            {/* Current Track Info */}
            <div className="bg-white/10 rounded-2xl p-4 mb-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-3">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 3, repeat: isPlaying ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                >
                  🎸
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{flamencoTracks[currentTrack].title}</h4>
                  <p className="text-yellow-200 text-xs truncate">{flamencoTracks[currentTrack].artist}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                    style={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/70 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Button
                onClick={prevTrack}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 w-10 h-10"
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <motion.button
                onClick={togglePlay}
                className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
              </motion.button>

              <Button
                onClick={nextTrack}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 w-10 h-10"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <Button onClick={toggleMute} variant="ghost" size="icon" className="text-white hover:bg-white/20 w-8 h-8">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>

              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => changeVolume(Number.parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <span className="text-white text-xs w-8">{Math.round(volume * 100)}%</span>
            </div>

            {/* Track List */}
            <div className="mt-4 max-h-32 overflow-y-auto custom-scrollbar">
              <h4 className="text-white font-semibold text-sm mb-2">Lista de Reproducción</h4>
              {flamencoTracks.map((track, index) => (
                <motion.button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrack(index)
                    setIsPlaying(true)
                    setCurrentTime(0)
                    const durations = [347, 263, 372, 296] // 5:47, 4:23, 6:12, 4:56
                    setDuration(durations[index])
                  }}
                  className={`w-full text-left p-2 rounded-lg mb-1 transition-all ${
                    index === currentTrack
                      ? "bg-yellow-400/20 text-yellow-200"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-xs font-medium truncate">{track.title}</div>
                  <div className="text-xs opacity-70 truncate">{track.artist}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #fbbf24, #f97316);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #fbbf24, #f97316);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
      `}</style>
    </>
  )
}
