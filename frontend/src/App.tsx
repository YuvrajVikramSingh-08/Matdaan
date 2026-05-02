import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ChatWindow from './components/Chat/ChatWindow';
import ElectionTimeline from './components/Timeline/ElectionTimeline';
import BoothFinder from './components/PollingBooth/BoothFinder';
import HelplineCard from './components/Helpline/HelplineCard';
import FirstTimeVoterFlow from './components/FirstTimeVoter/FirstTimeVoterFlow';
import FakeNewsChecker from './components/FakeNewsChecker/FakeNewsChecker';
import EVMExplainer from './components/EVMExplainer/EVMExplainer';
import VoterStatusChecker from './components/VoterStatus/VoterStatusChecker';
import { useChat } from './hooks/useChat';
import type { TabId } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [language, setLanguage] = useState(() => localStorage.getItem('matdaan_lang') || 'en');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);

  const { messages, isLoading, sendMessage } = useChat(language);

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    localStorage.setItem('matdaan_lang', lang);
    document.documentElement.lang = lang;
  }, []);

  const showToast = useCallback((msg: string, type: 'success' | 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleAskMatdaan = useCallback((question: string) => {
    sendMessage(question);
  }, [sendMessage]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const renderTab = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatWindow messages={messages} isLoading={isLoading} language={language} onSend={sendMessage} onTabChange={setActiveTab} />;
      case 'timeline':
        return <ElectionTimeline onAskMatdaan={handleAskMatdaan} onTabChange={setActiveTab} />;
      case 'booth':
        return <BoothFinder language={language} onToast={showToast} />;
      case 'helpline':
        return <HelplineCard onToast={showToast} />;
      case 'first-voter':
        return <FirstTimeVoterFlow onToast={showToast} />;
      case 'fact-check':
        return <FakeNewsChecker language={language} />;
      case 'evm':
        return <EVMExplainer />;
      case 'voter-status':
        return <VoterStatusChecker />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Header activeTab={activeTab} language={language} onLanguageChange={handleLanguageChange} onTabChange={setActiveTab} />
      <main className="app-content" id="main-content">
        {renderTab()}
      </main>
      <Footer language={language} />
      {toast && (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
