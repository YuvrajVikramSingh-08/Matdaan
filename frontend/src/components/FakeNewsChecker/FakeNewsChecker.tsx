import React, { useState } from 'react';
import { factCheck } from '../../services/api';

interface FakeNewsCheckerProps {
  language: string;
}

const VERDICT_COLORS: Record<string, string> = {
  true: '#2E7D32', false: '#C62828', misleading: '#F9A825', unverified: '#5F6368',
};
const VERDICT_LABELS: Record<string, string> = {
  true: '✅ TRUE', false: '❌ FALSE', misleading: '⚠️ MISLEADING', unverified: '❓ UNVERIFIED',
};

export default function FakeNewsChecker({ language }: FakeNewsCheckerProps) {
  const [claim, setClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ verdict: string; explanation: string; sources: string[] } | null>(null);

  const handleCheck = async () => {
    if (!claim.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await factCheck(claim.trim(), language);
      setResult(data);
    } catch {
      // Demo fallback
      setResult({
        verdict: 'unverified',
        explanation: 'This claim could not be verified against official ECI sources at this time. We recommend checking the official Election Commission website (eci.gov.in) or the Press Information Bureau (pib.gov.in) for authoritative information about elections in India.',
        sources: ['https://eci.gov.in', 'https://pib.gov.in/factcheck'],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="factcheck-container">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔍</div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>Election Fact Checker</h2>
        <p style={{ fontSize: '.85rem', color: '#5F6368' }}>Paste a WhatsApp forward or claim about elections to fact-check it against official ECI sources</p>
      </div>

      <div className="factcheck-input-area">
        <textarea
          className="factcheck-textarea"
          value={claim}
          onChange={e => setClaim(e.target.value)}
          placeholder="Paste a message or claim to fact-check..."
          maxLength={1000}
          aria-label="Claim to fact-check"
        />
        <button className="factcheck-btn" onClick={handleCheck} disabled={loading || !claim.trim()}>
          {loading ? '🔄 Checking...' : '🔍 Check Fact'}
        </button>
      </div>

      {result && (
        <div className={`verdict-card ${result.verdict}`}>
          <span className="verdict-badge" style={{ background: VERDICT_COLORS[result.verdict] || '#5F6368' }}>
            {VERDICT_LABELS[result.verdict] || result.verdict.toUpperCase()}
          </span>
          <p style={{ fontSize: '.88rem', color: '#202124', lineHeight: 1.6, margin: '8px 0' }}>{result.explanation}</p>
          {result.sources.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <strong style={{ fontSize: '.78rem' }}>Sources:</strong>
              {result.sources.map((s, i) => (
                <a key={i} href={s} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '.78rem', color: '#1A73E8', marginTop: 2 }}>{s}</a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
