'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FlamencoPlayer;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const flamencoTracks = [
    {
        id: 1,
        title: 'Entre Dos Aguas',
        artist: 'Paco de Lucía',
        duration: '5:47',
        src: '', // Empty src to avoid audio loading errors
    },
    {
        id: 2,
        title: 'Alegrías de Cádiz',
        artist: 'Camarón de la Isla',
        duration: '4:23',
        src: '',
    },
    {
        id: 3,
        title: 'Bulerías por Soleá',
        artist: 'Tomatito',
        duration: '6:12',
        src: '',
    },
    {
        id: 4,
        title: 'Tangos de Triana',
        artist: 'Vicente Amigo',
        duration: '4:56',
        src: '',
    },
];
function FlamencoPlayer() {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const [isMuted, setIsMuted] = (0, react_1.useState)(false);
    const [currentTrack, setCurrentTrack] = (0, react_1.useState)(0);
    const [volume, setVolume] = (0, react_1.useState)(0.3);
    const [currentTime, setCurrentTime] = (0, react_1.useState)(0);
    const [duration, setDuration] = (0, react_1.useState)(0);
    const audioRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prev => {
                    const newTime = prev + 1;
                    if (newTime >= duration) {
                        nextTrack();
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
        }
        return () => {
            if (interval)
                clearInterval(interval);
        };
    }, [isPlaying, duration]);
    const togglePlay = () => {
        // Simulate audio playback without actual files
        if (isPlaying) {
            // Simulate pause
            setIsPlaying(false);
        }
        else {
            // Simulate play
            setIsPlaying(true);
            // Simulate track duration for demo purposes
            setDuration(347); // 5:47 in seconds for first track
        }
    };
    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio)
            return;
        audio.muted = !isMuted;
        setIsMuted(!isMuted);
    };
    const changeVolume = (newVolume) => {
        const audio = audioRef.current;
        if (!audio)
            return;
        setVolume(newVolume);
        audio.volume = newVolume;
    };
    const nextTrack = () => {
        const newTrackIndex = (currentTrack + 1) % flamencoTracks.length;
        setCurrentTrack(newTrackIndex);
        setCurrentTime(0);
        // Set different durations for each track (in seconds)
        const durations = [347, 263, 372, 296]; // 5:47, 4:23, 6:12, 4:56
        setDuration(durations[newTrackIndex]);
        setIsPlaying(true);
    };
    const prevTrack = () => {
        const newTrackIndex = (currentTrack - 1 + flamencoTracks.length) % flamencoTracks.length;
        setCurrentTrack(newTrackIndex);
        setCurrentTime(0);
        // Set different durations for each track (in seconds)
        const durations = [347, 263, 372, 296]; // 5:47, 4:23, 6:12, 4:56
        setDuration(durations[newTrackIndex]);
        setIsPlaying(true);
    };
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "fixed bottom-6 left-6 z-50", initial: { scale: 0, rotate: -180 }, animate: { scale: 1, rotate: 0 }, transition: { delay: 2, duration: 0.8, type: 'spring' }, children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { onClick: () => setIsOpen(!isOpen), className: "flex h-16 w-16 items-center justify-center rounded-full border-4 border-yellow-400 bg-gradient-to-r from-orange-500 to-red-600 shadow-2xl", whileHover: { scale: 1.1, rotate: 5 }, whileTap: { scale: 0.9 }, animate: isPlaying
                            ? {
                                boxShadow: [
                                    '0 0 0 0 rgba(251, 146, 60, 0.7)',
                                    '0 0 0 20px rgba(251, 146, 60, 0)',
                                    '0 0 0 0 rgba(251, 146, 60, 0)',
                                ],
                            }
                            : {}, transition: { duration: 2, repeat: isPlaying ? Number.POSITIVE_INFINITY : 0 }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Music, { className: "h-8 w-8 text-white" }) }), isPlaying && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: [...Array(3)].map((_, i) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute text-2xl", initial: { opacity: 0, y: 0, x: 0 }, animate: {
                                opacity: [0, 1, 0],
                                y: [-20, -60],
                                x: [0, Math.random() * 40 - 20],
                            }, transition: {
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.5,
                            }, style: {
                                left: '50%',
                                top: '50%',
                            }, children: "\uD83C\uDFB5" }, i))) }))] }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: isOpen && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, x: -400 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -400 }, transition: { type: 'spring', damping: 25, stiffness: 200 }, className: "fixed bottom-24 left-6 z-40 w-80 rounded-3xl border-4 border-yellow-400 bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 p-6 shadow-2xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "flex items-center text-xl font-bold text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Music, { className: "mr-2 h-6 w-6 text-yellow-400" }), "Flamenco Ambiental", (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-xs text-yellow-200", children: "(Demo)" })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { onClick: () => setIsOpen(false), className: "text-white/70 hover:text-white", whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-3 flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { rotate: isPlaying ? 360 : 0 }, transition: {
                                                duration: 3,
                                                repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                                                ease: 'linear',
                                            }, className: "flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500", children: "\uD83C\uDFB8" }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "truncate text-sm font-bold text-white", children: flamencoTracks[currentTrack].title }), (0, jsx_runtime_1.jsx)("p", { className: "truncate text-xs text-yellow-200", children: flamencoTracks[currentTrack].artist })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-2 w-full overflow-hidden rounded-full bg-white/20", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "h-full bg-gradient-to-r from-yellow-400 to-orange-500", style: { width: `${progressPercentage}%` }, transition: { duration: 0.1 } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 flex justify-between text-xs text-white/70", children: [(0, jsx_runtime_1.jsx)("span", { children: formatTime(currentTime) }), (0, jsx_runtime_1.jsx)("span", { children: formatTime(duration) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4 flex items-center justify-center space-x-4", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { onClick: prevTrack, variant: "ghost", size: "icon", className: "h-10 w-10 text-white hover:bg-white/20", children: (0, jsx_runtime_1.jsx)(lucide_react_1.SkipBack, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { onClick: togglePlay, className: "flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: isPlaying ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Pause, { className: "h-6 w-6 text-white" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "ml-1 h-6 w-6 text-white" })) }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: nextTrack, variant: "ghost", size: "icon", className: "h-10 w-10 text-white hover:bg-white/20", children: (0, jsx_runtime_1.jsx)(lucide_react_1.SkipForward, { className: "h-5 w-5" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { onClick: toggleMute, variant: "ghost", size: "icon", className: "h-8 w-8 text-white hover:bg-white/20", children: isMuted ? (0, jsx_runtime_1.jsx)(lucide_react_1.VolumeX, { className: "h-4 w-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Volume2, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)("input", { type: "range", min: "0", max: "1", step: "0.1", value: volume, onChange: e => changeVolume(Number.parseFloat(e.target.value)), className: "slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20" }) }), (0, jsx_runtime_1.jsxs)("span", { className: "w-8 text-xs text-white", children: [Math.round(volume * 100), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "custom-scrollbar mt-4 max-h-32 overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-2 text-sm font-semibold text-white", children: "Lista de Reproducci\u00F3n" }), flamencoTracks.map((track, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { onClick: () => {
                                        setCurrentTrack(index);
                                        setIsPlaying(true);
                                        setCurrentTime(0);
                                        const durations = [347, 263, 372, 296]; // 5:47, 4:23, 6:12, 4:56
                                        setDuration(durations[index]);
                                    }, className: `mb-1 w-full rounded-lg p-2 text-left transition-all ${index === currentTrack
                                        ? 'bg-yellow-400/20 text-yellow-200'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'}`, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "truncate text-xs font-medium", children: track.title }), (0, jsx_runtime_1.jsx)("div", { className: "truncate text-xs opacity-70", children: track.artist })] }, track.id)))] })] })) }), (0, jsx_runtime_1.jsx)("style", { jsx: true, children: `
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
      ` })] }));
}
//# sourceMappingURL=FlamencoPlayer.js.map