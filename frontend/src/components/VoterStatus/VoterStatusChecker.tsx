import React, { useState } from 'react';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

export default function VoterStatusChecker() {
  const [mode, setMode] = useState<'epic' | 'name'>('epic');
  const [epic, setEpic] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [state, setState] = useState('');

  const handleCheck = () => {
    if (mode === 'epic' && epic.trim()) {
      window.open(`https://electoralsearch.eci.gov.in/`, '_blank');
    } else if (mode === 'name' && firstName.trim() && state) {
      window.open(`https://electoralsearch.eci.gov.in/`, '_blank');
    }
  };

  return (
    <div className="voter-status-container">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📋</div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>Voter Registration Status</h2>
        <p style={{ fontSize: '.85rem', color: '#5F6368' }}>Check if you're registered to vote by entering your EPIC number or name</p>
      </div>

      <div className="voter-form">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            className={mode === 'epic' ? 'checklist-action' : 'booth-action-btn'}
            style={{ flex: 1 }}
            onClick={() => setMode('epic')}
          >
            Search by EPIC
          </button>
          <button
            className={mode === 'name' ? 'checklist-action' : 'booth-action-btn'}
            style={{ flex: 1 }}
            onClick={() => setMode('name')}
          >
            Search by Name
          </button>
        </div>

        {mode === 'epic' ? (
          <div className="form-group">
            <label htmlFor="epic-input">EPIC / Voter ID Number</label>
            <input
              id="epic-input"
              className="form-input"
              value={epic}
              onChange={e => setEpic(e.target.value.toUpperCase())}
              placeholder="e.g. ABC1234567"
              maxLength={10}
            />
            <p style={{ fontSize: '.72rem', color: '#5F6368', marginTop: 4 }}>Your 10-character alphanumeric voter ID number</p>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="state-select">State / UT</label>
              <select id="state-select" className="form-select" value={state} onChange={e => setState(e.target.value)}>
                <option value="">Select State...</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="fname">First Name</label>
                <input id="fname" className="form-input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="lname">Last Name</label>
                <input id="lname" className="form-input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
              </div>
            </div>
          </>
        )}

        <button className="form-submit" onClick={handleCheck} style={{ marginTop: 8 }}>
          🔍 Check Registration Status
        </button>

        <div style={{ marginTop: 16, padding: 12, background: '#FFF8E1', borderRadius: 8, fontSize: '.78rem', color: '#5F6368' }}>
          <strong>ℹ️ How it works:</strong> We'll redirect you to the official Electoral Search portal (electoralsearch.eci.gov.in) where you can verify your voter registration status securely.
        </div>
      </div>
    </div>
  );
}
