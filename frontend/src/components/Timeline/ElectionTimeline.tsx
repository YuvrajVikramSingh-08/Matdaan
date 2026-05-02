import React, { useState } from 'react';
import TimelineStep from './TimelineStep';
import { ELECTION_STEPS } from '../../constants/electionSteps';
import type { TabId } from '../../types';

interface ElectionTimelineProps {
  onAskMatdaan: (question: string) => void;
  onTabChange: (tab: TabId) => void;
}

export default function ElectionTimeline({ onAskMatdaan, onTabChange }: ElectionTimelineProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const step = selectedStep !== null ? ELECTION_STEPS.find(s => s.id === selectedStep) : null;

  return (
    <div className="timeline-container">
      <h2 className="timeline-title">🗓️ Indian General Election Process</h2>
      <p style={{ textAlign: 'center', color: '#5F6368', fontSize: '.85rem', marginBottom: 20 }}>
        Click on any phase to learn more about it
      </p>

      <div className="timeline" role="list" aria-label="Election phases">
        {ELECTION_STEPS.map((s, i) => (
          <TimelineStep key={s.id} step={s} index={i} onClick={() => setSelectedStep(s.id)} />
        ))}
      </div>

      {step && (
        <>
          <div className="detail-overlay" onClick={() => setSelectedStep(null)} />
          <div className="detail-panel" role="dialog" aria-label={`Details: ${step.title}`}>
            <button onClick={() => setSelectedStep(null)} style={{ float: 'right', fontSize: '1.2rem', padding: 4 }} aria-label="Close">✕</button>
            <span className="step-phase" style={{ background: step.color, display: 'inline-block', marginBottom: 12 }}>{step.phase}</span>
            <h3>{step.title}</h3>
            <p>{step.detailedExplanation}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="ask-btn" onClick={() => { onAskMatdaan(step.chatPrompt); onTabChange('chat'); setSelectedStep(null); }}>
                💬 Ask Matdaan about this
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
