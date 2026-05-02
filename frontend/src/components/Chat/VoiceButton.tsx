import React from 'react';
import { useSpeech } from '../../hooks/useSpeech';
import { getTranslation } from '../../constants/languages';

interface VoiceButtonProps {
  language: string;
}

/** Microphone button for voice input — pulses red while recording */
export default function VoiceButton({ language }: VoiceButtonProps) {
  const { isRecording, startRecording, stopRecording } = useSpeech(language);

  return (
    <button
      className={`voice-btn ${isRecording ? 'recording' : ''}`}
      onClick={isRecording ? stopRecording : startRecording}
      aria-label={isRecording ? getTranslation('stopRecording', language) : getTranslation('startVoiceInput', language)}
      id="voice-btn"
      title={isRecording ? getTranslation('stopRecording', language) : getTranslation('startVoiceInput', language)}
    >
      {isRecording ? '⏹️' : '🎤'}
    </button>
  );
}
