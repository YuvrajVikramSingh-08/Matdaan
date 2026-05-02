import React, { useState, useRef, useEffect } from 'react';
import { getTranslation } from '../../constants/languages';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  language: string;
}

export default function ChatInput({ onSend, disabled, language }: ChatInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Listen for STT results
  useEffect(() => {
    const handler = (e: Event) => {
      const transcript = (e as CustomEvent).detail;
      if (transcript) {
        setText(transcript);
        setTimeout(() => onSend(transcript), 100);
      }
    };
    window.addEventListener('stt-result', handler);
    return () => window.removeEventListener('stt-result', handler);
  }, [onSend]);

  const handleSubmit = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-row">
      <textarea
        ref={inputRef}
        className="chat-input"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={getTranslation('typeMessage', language)}
        disabled={disabled}
        rows={1}
        aria-label="Type your message"
        id="chat-input"
      />
      <button
        className="send-btn"
        onClick={handleSubmit}
        disabled={disabled || !text.trim()}
        aria-label="Send message"
        id="send-btn"
      >
        ➤
      </button>
    </div>
  );
}
