import React, { useState } from 'react';

interface FirstTimeVoterProps {
  onToast: (msg: string, type: 'success' | 'info') => void;
}

const CHECKLIST = [
  { id: 1, title: 'Check Your Age Eligibility', description: 'You must be 18 years or older on January 1st of the current year to vote in India.', actionLabel: 'Check on NVSP', actionUrl: 'https://voters.eci.gov.in', icon: '🎂' },
  { id: 2, title: 'Register on NVSP Portal', description: 'Fill Form 6 online at the National Voters\' Service Portal. You\'ll need age proof (birth certificate/school leaving cert) and address proof (Aadhaar/utility bill).', actionLabel: 'Register Now', actionUrl: 'https://voters.eci.gov.in/login', icon: '📝' },
  { id: 3, title: 'Download Your Voter Slip', description: 'Once registered, download your digital voter slip from the NVSP portal. This shows your polling booth number, serial number, and constituency.', actionLabel: 'Download Slip', actionUrl: 'https://electoralsearch.eci.gov.in', icon: '📄' },
  { id: 4, title: 'Find Your Polling Booth', description: 'Locate your assigned polling booth using the booth finder. Know the exact address, timings (7 AM – 6 PM), and facilities available.', actionLabel: 'Find Booth', icon: '📍' },
  { id: 5, title: 'What to Carry on Polling Day', description: 'Carry your voter ID (EPIC) or any approved photo ID (Aadhaar, Passport, DL, PAN). Wear comfortable clothes, carry water. No phones allowed inside the booth.', actionLabel: 'View ID List', icon: '🎒' },
];

export default function FirstTimeVoter({ onToast }: FirstTimeVoterProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    if (!completed.has(id)) onToast('Step completed! ✅', 'success');
  };

  const progress = Math.round((completed.size / CHECKLIST.length) * 100);

  return (
    <div className="ftv-container">
      <div className="ftv-header">
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎓</div>
        <h2>First-Time Voter? We've Got You!</h2>
        <p>Follow this 5-step checklist to be election-ready</p>
        <div style={{ marginTop: 12, background: '#DADCE0', borderRadius: 8, height: 8, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #1A73E8, #00ACC1)', borderRadius: 8, transition: '.3s' }} />
        </div>
        <span style={{ fontSize: '.75rem', color: '#5F6368', marginTop: 4, display: 'block' }}>{progress}% complete</span>
      </div>

      <div className="checklist">
        {CHECKLIST.map(item => (
          <div key={item.id} className={`checklist-item ${completed.has(item.id) ? 'done' : ''}`}>
            <button className={`check-circle ${completed.has(item.id) ? 'checked' : ''}`} onClick={() => toggle(item.id)} aria-label={completed.has(item.id) ? 'Mark incomplete' : 'Mark complete'}>
              {completed.has(item.id) ? '✓' : item.icon}
            </button>
            <div className="checklist-content">
              <h4 style={{ textDecoration: completed.has(item.id) ? 'line-through' : 'none' }}>{item.title}</h4>
              <p>{item.description}</p>
              {item.actionUrl ? (
                <button className="checklist-action" onClick={() => window.open(item.actionUrl, '_blank')}>{item.actionLabel} →</button>
              ) : (
                <button className="checklist-action" onClick={() => toggle(item.id)}>{item.actionLabel}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
