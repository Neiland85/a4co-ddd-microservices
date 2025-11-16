/**
 * Voice Input Component for AI-assisted text generation
 */
'use client';

import { useState } from 'react';
import { useVoiceToText } from '@/lib/hooks/useVoiceToText';
import { aiApi } from '@/lib/api/client';
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react';
import { AnimatedCard } from './AnimatedCard';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onTextGenerated: (text: string) => void;
  context?: string;
  placeholder?: string;
}

export function VoiceInput({ onTextGenerated, context, placeholder }: VoiceInputProps) {
  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error: voiceError,
  } = useVoiceToText();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setGeneratedText('');
      setError(null);
      startListening();
    }
  };

  const handleGenerateDescription = async () => {
    if (!transcript.trim()) {
      setError('No hay texto para generar descripción');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await aiApi.generateDescription(transcript, context);
      setGeneratedText(response.description);
      onTextGenerated(response.description);
    } catch (err) {
      console.error('Error generating description:', err);
      setError('Error al generar la descripción. Por favor, inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
        Tu navegador no soporta reconocimiento de voz. Por favor, usa Chrome o Edge.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatedCard className="bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Asistente de IA por Voz
            </h3>
            <p className="text-sm text-gray-600">
              {placeholder || 'Pulsa el micrófono y describe tu producto o servicio'}
            </p>
          </div>
          <button
            onClick={handleToggleListening}
            disabled={isGenerating}
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300',
              isListening
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 hover:bg-red-600'
                : 'bg-purple-500 text-white shadow-lg shadow-purple-500/50 hover:bg-purple-600',
              isGenerating && 'cursor-not-allowed opacity-50'
            )}
          >
            {isListening ? (
              <MicOff className="h-8 w-8 animate-pulse" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </button>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mt-4 rounded-lg bg-white p-4">
            <p className="mb-2 text-xs font-medium text-gray-500">
              {isListening ? 'Escuchando...' : 'Transcripción:'}
            </p>
            <p className="text-sm text-gray-900">{transcript}</p>
          </div>
        )}

        {/* Generate Button */}
        {transcript && !isListening && (
          <button
            onClick={handleGenerateDescription}
            disabled={isGenerating}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-white transition-all hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generando descripción...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generar Descripción Optimizada
              </>
            )}
          </button>
        )}

        {/* Generated Text Display */}
        {generatedText && (
          <div className="mt-4 rounded-lg border-2 border-purple-200 bg-purple-50 p-4">
            <p className="mb-2 text-xs font-medium text-purple-700">
              ✨ Descripción Generada:
            </p>
            <p className="text-sm text-gray-900">{generatedText}</p>
          </div>
        )}

        {/* Error Messages */}
        {(error || voiceError) && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error || voiceError}
          </div>
        )}
      </AnimatedCard>
    </div>
  );
}
