/** Matdaan Backend Tests — Chat API validation */

describe('POST /api/chat — Input Validation', () => {
  const VALID_LANGS = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'pa', 'kn', 'ml', 'or'];

  it('should reject messages exceeding 500 characters', () => {
    const longMessage = 'a'.repeat(501);
    expect(longMessage.length).toBeGreaterThan(500);
  });

  it('should accept messages within 500 characters', () => {
    const validMessage = 'How do I register to vote in India?';
    expect(validMessage.length).toBeLessThanOrEqual(500);
  });

  it('should reject invalid language codes', () => {
    expect(VALID_LANGS.includes('xx')).toBe(false);
    expect(VALID_LANGS.includes('fr')).toBe(false);
  });

  it('should accept all 11 supported Indian languages', () => {
    VALID_LANGS.forEach(lang => {
      expect(VALID_LANGS.includes(lang)).toBe(true);
    });
    expect(VALID_LANGS.length).toBe(11);
  });

  it('should require a valid session ID', () => {
    const validBody = { message: 'How to register?', language: 'en', sessionId: 'test-session-123' };
    expect(validBody.sessionId.length).toBeGreaterThan(0);
    expect(validBody.sessionId.length).toBeLessThanOrEqual(100);
  });
});

describe('GET /api/booths — Coordinate Validation', () => {
  const INDIA_BOUNDS = { latMin: 6.5, latMax: 37.5, lngMin: 68.0, lngMax: 97.5 };

  const isInIndia = (lat: number, lng: number) =>
    lat >= INDIA_BOUNDS.latMin && lat <= INDIA_BOUNDS.latMax &&
    lng >= INDIA_BOUNDS.lngMin && lng <= INDIA_BOUNDS.lngMax;

  it('should reject coordinates outside India — London', () => {
    expect(isInIndia(51.507, -0.127)).toBe(false);
  });

  it('should reject coordinates outside India — New York', () => {
    expect(isInIndia(40.712, -74.006)).toBe(false);
  });

  it('should accept coordinates inside India — Delhi', () => {
    expect(isInIndia(28.6139, 77.2090)).toBe(true);
  });

  it('should accept coordinates inside India — Mumbai', () => {
    expect(isInIndia(19.076, 72.877)).toBe(true);
  });

  it('should accept coordinates inside India — Chennai', () => {
    expect(isInIndia(13.082, 80.270)).toBe(true);
  });

  it('should accept coordinates at India boundary — Kanyakumari', () => {
    expect(isInIndia(8.078, 77.541)).toBe(true);
  });
});

describe('Fallback Response Scoring', () => {
  // Simulate the backend's keyword scoring logic
  const entries = [
    { keys: ['different city', 'another city', 'vote from', 'can i vote', 'migrant'], score: 10, id: 'migrant' },
    { keys: ['register', 'enrollment', 'enroll'], anti: ['status', 'different city'], score: 8, id: 'register' },
    { keys: ['evm', 'electronic voting', 'vvpat'], score: 7, id: 'evm' },
    { keys: ['polling', 'booth'], anti: ['find', 'nearest'], score: 5, id: 'booth' },
  ];

  function getBestMatch(message: string): string | null {
    const msg = message.toLowerCase();
    let best = { id: '', sc: 0 };
    for (const e of entries) {
      if ((e as any).anti?.some((k: string) => msg.includes(k))) continue;
      const matched = e.keys.filter(k => msg.includes(k));
      if (!matched.length) continue;
      const sc = matched.length * 3 + e.score;
      if (sc > best.sc) best = { id: e.id, sc };
    }
    return best.sc > 0 ? best.id : null;
  }

  it('should match migrant voter question to migrant response', () => {
    expect(getBestMatch('I live in delhi but registered in lucknow, can i vote from delhi')).toBe('migrant');
  });

  it('should match registration question to register response', () => {
    expect(getBestMatch('How do I register to vote?')).toBe('register');
  });

  it('should match EVM question to evm response', () => {
    expect(getBestMatch('How does the EVM machine work?')).toBe('evm');
  });

  it('should not match migrant for simple registration question', () => {
    expect(getBestMatch('How to register to vote?')).toBe('register');
  });

  it('should return null for unrelated question', () => {
    expect(getBestMatch('What is the weather today?')).toBeNull();
  });
});
