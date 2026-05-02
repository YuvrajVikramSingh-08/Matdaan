import React, { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import VoiceButton from './VoiceButton';
import { getTranslation } from '../../constants/languages';
import type { ChatMessage, TabId } from '../../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  language: string;
  onSend: (text: string) => void;
  onTabChange: (tab: TabId) => void;
}

export default function ChatWindow({ messages, isLoading, language, onSend, onTabChange }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showWelcome = messages.length <= 1;

  const quickReplies = [
    getTranslation('quickReply1', language),
    getTranslation('quickReply2', language),
    getTranslation('quickReply3', language),
    getTranslation('quickReply4', language),
    getTranslation('quickReply5', language),
  ];

  return (
    <div className="chat-container">
      <div className="chat-messages" role="log" aria-live="polite" aria-label="Conversation">
        {showWelcome && (
          <div className="welcome-card">
            <div className="welcome-icon">🗳️</div>
            <h2>{getTranslation('welcome', language)}</h2>
            <p>{getTranslation('welcomeSubtext', language)}</p>
            <div className="feature-chips">
              <button className="feature-chip" onClick={() => onTabChange('timeline')}>{getTranslation('electionTimeline', language)}</button>
              <button className="feature-chip" onClick={() => onTabChange('booth')}>{getTranslation('findYourBooth', language)}</button>
              <button className="feature-chip" onClick={() => onTabChange('helpline')}>{getTranslation('helplines', language)}</button>
              <button className="feature-chip" onClick={() => onTabChange('evm')}>{getTranslation('howEvmWorks', language)}</button>
            </div>
          </div>
        )}

        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} language={language} />
        ))}

        {isLoading && (
          <div className="chat-bubble bot" role="status" aria-label="Loading">
            <div className="typing-dots">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-chips">
        {quickReplies.map(q => (
          <button key={q} className="chip" onClick={() => onSend(q)}>{q}</button>
        ))}
      </div>

      <div className="chat-input-area">
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <VoiceButton language={language} />
          <ChatInput onSend={onSend} disabled={isLoading} language={language} />
        </div>
      </div>
    </div>
  );
}
