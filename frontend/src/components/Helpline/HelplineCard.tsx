import React from 'react';
import { HELPLINES } from '../../constants/helplines';

interface HelplineCardProps {
  onToast: (msg: string, type: 'success' | 'info') => void;
}

const ICONS: Record<string, string> = { phone: '📞', email: '✉️', globe: '🌐', info: 'ℹ️' };

export default function HelplineCard({ onToast }: HelplineCardProps) {
  const handleAction = (entry: typeof HELPLINES[0]) => {
    if (entry.type === 'url') {
      window.open(entry.value, '_blank', 'noopener');
    } else {
      navigator.clipboard.writeText(entry.value);
      onToast('Copied!', 'success');
    }
  };

  const getButtonLabel = (type: string) => {
    switch (type) {
      case 'phone': return '📋 Copy Number';
      case 'email': return '📋 Copy Email';
      case 'url': return '🔗 Open Website';
      default: return '📋 Copy';
    }
  };

  return (
    <div className="helpline-container">
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>📞 Emergency & Helpline Contacts</h2>
      <div className="helpline-grid">
        {HELPLINES.map(entry => (
          <div key={entry.id} className="helpline-card">
            <div className="icon-circle">{ICONS[entry.icon] || '📌'}</div>
            <h4>{entry.name}</h4>
            <div className="value">{entry.value}</div>
            <p className="desc">{entry.description}</p>
            <button className="copy-btn" onClick={() => handleAction(entry)} id={`helpline-${entry.id}`}>
              {getButtonLabel(entry.type)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
