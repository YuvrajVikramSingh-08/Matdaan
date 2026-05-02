import React from 'react';
import type { ElectionStep } from '../../types';

interface TimelineStepProps {
  step: ElectionStep;
  index: number;
  onClick: () => void;
}

export default function TimelineStep({ step, index, onClick }: TimelineStepProps) {
  const statusClass = step.status || 'upcoming';

  return (
    <div
      className={`timeline-step ${statusClass}`}
      onClick={onClick}
      role="listitem"
      aria-current={step.status === 'current' ? 'true' : undefined}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      style={{ animationDelay: `${index * 100}ms`, animation: `slideUp .4s ease ${index * 100}ms both` }}
    >
      <div className="step-dot">
        {step.status === 'completed' && <span style={{ color: '#fff', fontSize: '.6rem' }}>✓</span>}
      </div>
      <div className="step-header">
        <span className="step-phase" style={{ background: step.color }}>{step.phase}</span>
        <span className="step-title">{step.title}</span>
      </div>
      <p className="step-desc">{step.description}</p>
      <div className="step-month">📅 {step.typicalMonth}</div>
    </div>
  );
}
