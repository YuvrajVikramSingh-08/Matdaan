import { useState, useCallback, useRef } from 'react';
import type { ChatMessage } from '../types';
import { sendChatMessage } from '../services/api';

/** Generate a unique session ID for anonymous users */
function getSessionId(): string {
  const KEY = 'matdaan_session_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  content: 'Namaste! 🙏 I\'m Matdaan, your AI assistant for understanding India\'s election process. Ask me anything about voter registration, election timelines, polling booths, or how voting works!',
  timestamp: Date.now(),
  language: 'en',
  source: 'static',
};

/**
 * Hook managing chat state: messages, loading, sending messages.
 */
export function useChat(language: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = useRef(getSessionId());

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
      language,
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const data = await sendChatMessage(text.trim(), language, sessionId.current);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: data.reply,
        timestamp: Date.now(),
        language,
        source: data.source as ChatMessage['source'],
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'bot',
        content: 'Sorry, I couldn\'t process your request right now. Please try again in a moment.',
        timestamp: Date.now(),
        language: 'en',
        source: 'static',
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [language, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);

  return { messages, isLoading, sendMessage, clearChat };
}
