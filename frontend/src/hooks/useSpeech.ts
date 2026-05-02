import { useState, useCallback, useRef } from 'react';

const LANG_MAP: Record<string, string> = {
  en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN', mr: 'mr-IN',
  ta: 'ta-IN', gu: 'gu-IN', pa: 'pa-IN', kn: 'kn-IN', ml: 'ml-IN', or: 'or-IN',
};

/**
 * Hook for Text-to-Speech and Speech-to-Text.
 * Uses browser-native Web Speech API (works without API keys).
 */
export function useSpeech(language: string) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const recognitionRef = useRef<any>(null);

  /** Play TTS using browser's built-in speech synthesis */
  const speak = useCallback(async (text: string) => {
    if (isPlaying || !text) return;
    setIsPlaying(true);

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.substring(0, 500));
    utterance.lang = LANG_MAP[language] || 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to find a good voice for the language
    const voices = window.speechSynthesis.getVoices();
    const langVoice = voices.find(v => v.lang === (LANG_MAP[language] || 'en-IN'));
    if (langVoice) utterance.voice = langVoice;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  }, [language, isPlaying]);

  /** Start STT using browser's Web Speech API (SpeechRecognition) */
  const startRecording = useCallback(() => {
    // Check for Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = LANG_MAP[language] || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        window.dispatchEvent(new CustomEvent('stt-result', { detail: transcript }));
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access was denied. Please allow microphone access in your browser settings.');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [language]);

  /** Stop recording */
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return { isRecording, isPlaying, speak, startRecording, stopRecording };
}
