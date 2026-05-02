import React, { useState } from 'react';

const EVM_STEPS = [
  { id: 1, title: 'Enter the Booth', description: 'After identity verification and ink application, you enter the voting compartment with the EVM.', icon: '🚶' },
  { id: 2, title: 'See the Ballot Unit', description: 'The ballot unit shows candidate names, party symbols, and a blue button next to each. Candidates are listed in alphabetical order.', icon: '📋' },
  { id: 3, title: 'Press Your Choice', description: 'Press the blue button next to your chosen candidate. You\'ll hear a beep and see a red light glow next to the pressed button.', icon: '👆' },
  { id: 4, title: 'VVPAT Verification', description: 'The VVPAT machine prints a paper slip showing your selected candidate\'s name and symbol. It\'s visible for 7 seconds through a glass window.', icon: '🖨️' },
  { id: 5, title: 'Vote Recorded', description: 'After 7 seconds, the VVPAT slip drops into a sealed box. Your vote is securely recorded in the EVM. Exit the booth.', icon: '✅' },
];

const CANDIDATES_DEMO = [
  { name: 'Candidate A', party: 'Party Alpha', symbol: '🌸' },
  { name: 'Candidate B', party: 'Party Beta', symbol: '🌿' },
  { name: 'Candidate C', party: 'Party Gamma', symbol: '⭐' },
  { name: 'NOTA', party: 'None of the Above', symbol: '✖️' },
];

export default function EVMExplainer() {
  const [pressedCandidate, setPressedCandidate] = useState<number | null>(null);
  const [showVVPAT, setShowVVPAT] = useState(false);
  const [lightOn, setLightOn] = useState<number | null>(null);

  const handleVote = (index: number) => {
    setPressedCandidate(index);
    setLightOn(index);
    setShowVVPAT(false);
    setTimeout(() => setShowVVPAT(true), 600);
    setTimeout(() => { setLightOn(null); setShowVVPAT(false); setPressedCandidate(null); }, 5000);
  };

  return (
    <div className="evm-container">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>🖥️ Interactive EVM Explainer</h2>
        <p style={{ fontSize: '.85rem', color: '#5F6368' }}>Try pressing a button to see how voting works!</p>
      </div>

      <div className="evm-machine">
        <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: 12 }}>Electronic Voting Machine (EVM)</div>
        <div className="evm-body">
          <div className="evm-buttons">
            {CANDIDATES_DEMO.map((c, i) => (
              <div key={i} className="evm-candidate-row">
                <div className={`evm-light ${lightOn === i ? 'on' : ''}`} />
                <span style={{ fontSize: '1.2rem' }}>{c.symbol}</span>
                <span className="evm-candidate-name">{c.name}<br /><span style={{ fontSize: '.7rem', color: '#5F6368' }}>{c.party}</span></span>
                <button
                  className={`evm-vote-btn ${pressedCandidate === i ? 'pressed' : ''}`}
                  onClick={() => handleVote(i)}
                  disabled={pressedCandidate !== null}
                  aria-label={`Vote for ${c.name}`}
                >
                  ●
                </button>
              </div>
            ))}
          </div>
        </div>

        {showVVPAT && pressedCandidate !== null && (
          <div className="vvpat-slip">
            <div style={{ fontWeight: 700, fontSize: '.75rem', marginBottom: 4 }}>🖨️ VVPAT Slip</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>{CANDIDATES_DEMO[pressedCandidate].symbol}</span>
              <span style={{ fontWeight: 600 }}>{CANDIDATES_DEMO[pressedCandidate].name}</span>
            </div>
            <div style={{ fontSize: '.7rem', color: '#5F6368', marginTop: 4 }}>This slip is visible for 7 seconds</div>
          </div>
        )}
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '20px 0 12px' }}>How Voting Works — Step by Step</h3>
      <div className="evm-steps">
        {EVM_STEPS.map(step => (
          <div key={step.id} className="evm-step-card">
            <div className="evm-step-num">{step.id}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.88rem', marginBottom: 2 }}>{step.icon} {step.title}</div>
              <p style={{ fontSize: '.82rem', color: '#5F6368' }}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
