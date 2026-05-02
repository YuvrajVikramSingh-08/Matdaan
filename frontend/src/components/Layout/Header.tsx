import React, { useState } from 'react';
import { LANGUAGES, getTranslation } from '../../constants/languages';
import type { TabId } from '../../types';

interface HeaderProps {
  activeTab: TabId;
  language: string;
  onLanguageChange: (lang: string) => void;
  onTabChange: (tab: TabId) => void;
}

const TAB_KEYS: { id: TabId; labelKey: string; icon: string }[] = [
  { id: 'chat', labelKey: 'chatTab', icon: '💬' },
  { id: 'timeline', labelKey: 'timelineTab', icon: '🗓️' },
  { id: 'booth', labelKey: 'boothTab', icon: '📍' },
  { id: 'helpline', labelKey: 'helplineTab', icon: '📞' },
  { id: 'first-voter', labelKey: 'firstVoterTab', icon: '🎓' },
  { id: 'fact-check', labelKey: 'factCheckTab', icon: '🔍' },
  { id: 'evm', labelKey: 'evmTab', icon: '🖥️' },
  { id: 'voter-status', labelKey: 'voterStatusTab', icon: '📋' },
];

export default function Header({ activeTab, language, onLanguageChange, onTabChange }: HeaderProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <>
      <header className="header">
        <div className="header-top">
          <div>
            <div className="header-logo">🗳️ Matdaan</div>
            <div className="header-tagline">मतदान करें — Cast Your Vote</div>
          </div>

          <button className="hamburger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">☰</button>

          <div className="lang-selector">
            <button className="lang-trigger" onClick={() => setLangOpen(!langOpen)} aria-label="Select language" aria-expanded={langOpen}>
              {currentLang.flag} {currentLang.nativeName} ▾
            </button>
            {langOpen && (
              <div className="lang-dropdown" role="listbox" aria-label="Language options" style={{ top: '100%', bottom: 'auto', marginTop: 8 }}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    className={`lang-option ${lang.code === language ? 'active' : ''}`}
                    role="option"
                    aria-selected={lang.code === language}
                    onClick={() => { onLanguageChange(lang.code); setLangOpen(false); }}
                  >
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="tab-nav desktop-only" role="tablist" aria-label="Main navigation">
        {TAB_KEYS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon} {getTranslation(tab.labelKey, language)}
          </button>
        ))}
      </nav>

      {drawerOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="drawer" role="dialog" aria-label="Navigation menu">
            <div style={{ marginBottom: 16, fontWeight: 700, fontSize: '1.1rem' }}>🗳️ Matdaan</div>
            {TAB_KEYS.map(tab => (
              <button
                key={tab.id}
                className={`drawer-item ${activeTab === tab.id ? 'active' : ''}`}
                style={{ display: 'block', width: '100%', textAlign: 'left' }}
                onClick={() => { onTabChange(tab.id); setDrawerOpen(false); }}
              >
                {tab.icon} {getTranslation(tab.labelKey, language)}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
