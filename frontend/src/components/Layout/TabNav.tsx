import React from 'react';
import type { TabId } from '../../types';

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; icon: string }[] = [
  { id: 'chat', icon: '💬' },
  { id: 'timeline', icon: '🗓️' },
  { id: 'booth', icon: '📍' },
  { id: 'helpline', icon: '📞' },
  { id: 'first-voter', icon: '🎓' },
  { id: 'fact-check', icon: '🔍' },
  { id: 'evm', icon: '🖥️' },
  { id: 'voter-status', icon: '📋' },
];

/** Bottom tab bar for mobile */
export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="tab-nav" role="tablist" aria-label="Mobile navigation" style={{ justifyContent: 'space-around' }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{ padding: '8px 6px', fontSize: '1.1rem', minWidth: 0 }}
        >
          {tab.icon}
        </button>
      ))}
    </nav>
  );
}
