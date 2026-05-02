import React from 'react';
import { useSpeech } from '../../hooks/useSpeech';
import { getTranslation } from '../../constants/languages';
import type { ChatMessage } from '../../types';

interface ChatBubbleProps {
  message: ChatMessage;
  language: string;
}

/** Individual chat bubble with listen button for bot messages */
export default function ChatBubble({ message, language }: ChatBubbleProps) {
  const { speak, isPlaying } = useSpeech(language);

  return (
    <div
      className={`chat-bubble ${message.role}`}
      role="listitem"
      aria-label={`${message.role === 'user' ? 'You' : 'Matdaan'}: ${message.content}`}
    >
      <div>{message.content}</div>
      {message.role === 'bot' && (
        <button
          className="listen-btn"
          onClick={() => speak(message.content)}
          disabled={isPlaying}
          aria-label={isPlaying ? 'Playing audio' : 'Listen to this message'}
        >
          {isPlaying ? getTranslation('playing', language) : getTranslation('listen', language)}
        </button>
      )}
    </div>
  );
}
