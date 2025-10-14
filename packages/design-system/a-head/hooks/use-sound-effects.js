'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSoundEffects = useSoundEffects;
const react_1 = require("react");
function useSoundEffects() {
    const audioContextRef = (0, react_1.useRef)(null);
    const soundsRef = (0, react_1.useRef)(new Map());
    const isEnabledRef = (0, react_1.useRef)(true);
    const globalVolumeRef = (0, react_1.useRef)(0.3);
    // Initialize audio context
    (0, react_1.useEffect)(() => {
        const initAudio = async () => {
            try {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                // Load sound effects
                const sounds = {
                    click: generateTone(800, 0.1, 'sine'),
                    hover: generateTone(1000, 0.05, 'sine'),
                    menuOpen: generateTone(600, 0.2, 'triangle'),
                    menuClose: generateTone(400, 0.15, 'triangle'),
                    success: generateChord([523, 659, 784], 0.3),
                    error: generateTone(200, 0.4, 'sawtooth'),
                };
                for (const [name, buffer] of Object.entries(sounds)) {
                    soundsRef.current.set(name, buffer);
                }
            }
            catch (error) {
                console.warn('Audio context initialization failed:', error);
            }
        };
        initAudio();
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);
    const generateTone = (0, react_1.useCallback)((frequency, duration, type = 'sine') => {
        if (!audioContextRef.current)
            throw new Error('Audio context not initialized');
        const sampleRate = audioContextRef.current.sampleRate;
        const buffer = audioContextRef.current.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            let sample = 0;
            if (type === 'sine') {
                sample = Math.sin(2 * Math.PI * frequency * t);
            }
            else if (type === 'triangle') {
                sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t));
            }
            else if (type === 'sawtooth') {
                sample = 2 * (frequency * t - Math.floor(frequency * t + 0.5));
            }
            // Apply envelope (fade in/out)
            const envelope = Math.min(t * 10, (duration - t) * 10, 1);
            data[i] = sample * envelope;
        }
        return buffer;
    }, []);
    const generateChord = (0, react_1.useCallback)((frequencies, duration) => {
        if (!audioContextRef.current)
            throw new Error('Audio context not initialized');
        const sampleRate = audioContextRef.current.sampleRate;
        const buffer = audioContextRef.current.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            let sample = 0;
            frequencies.forEach(freq => {
                sample += Math.sin(2 * Math.PI * freq * t) / frequencies.length;
            });
            // Apply envelope
            const envelope = Math.min(t * 5, (duration - t) * 5, 1);
            data[i] = sample * envelope;
        }
        return buffer;
    }, []);
    const playSound = (0, react_1.useCallback)((soundName, options = {}) => {
        if (!isEnabledRef.current || !audioContextRef.current || !soundsRef.current.has(soundName)) {
            return;
        }
        try {
            const buffer = soundsRef.current.get(soundName);
            const source = audioContextRef.current.createBufferSource();
            const gainNode = audioContextRef.current.createGain();
            source.buffer = buffer;
            source.playbackRate.value = options.playbackRate || 1;
            gainNode.gain.value = (options.volume || 1) * globalVolumeRef.current;
            source.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);
            source.start();
        }
        catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }, []);
    const playClick = (0, react_1.useCallback)((options) => {
        playSound('click', options);
    }, [playSound]);
    const playHover = (0, react_1.useCallback)((options) => {
        playSound('hover', { volume: 0.5, ...options });
    }, [playSound]);
    const playMenuOpen = (0, react_1.useCallback)((options) => {
        playSound('menuOpen', options);
    }, [playSound]);
    const playMenuClose = (0, react_1.useCallback)((options) => {
        playSound('menuClose', options);
    }, [playSound]);
    const playSuccess = (0, react_1.useCallback)(() => {
        // Mock sound effect - in a real app you'd play an actual sound
        console.log('🔊 Success sound played');
    }, []);
    const playError = (0, react_1.useCallback)(() => {
        // Mock sound effect - in a real app you'd play an actual sound
        console.log('🔊 Error sound played');
    }, []);
    const setGlobalVolume = (0, react_1.useCallback)((volume) => {
        globalVolumeRef.current = Math.max(0, Math.min(1, volume));
    }, []);
    const setEnabled = (0, react_1.useCallback)((enabled) => {
        isEnabledRef.current = enabled;
    }, []);
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
    };
}
//# sourceMappingURL=use-sound-effects.js.map