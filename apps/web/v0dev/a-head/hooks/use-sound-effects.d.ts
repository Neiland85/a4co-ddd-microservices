interface SoundEffectOptions {
    volume?: number;
    playbackRate?: number;
    interrupt?: boolean;
}
interface UseSoundEffectsReturn {
    playClick: (options?: SoundEffectOptions) => void;
    playHover: (options?: SoundEffectOptions) => void;
    playMenuOpen: (options?: SoundEffectOptions) => void;
    playMenuClose: (options?: SoundEffectOptions) => void;
    playSuccess: (options?: SoundEffectOptions) => void;
    playError: (options?: SoundEffectOptions) => void;
    setGlobalVolume: (volume: number) => void;
    isEnabled: boolean;
    setEnabled: (enabled: boolean) => void;
}
export declare function useSoundEffects(): UseSoundEffectsReturn;
export {};
//# sourceMappingURL=use-sound-effects.d.ts.map