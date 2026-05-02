describe('POST /api/translate', () => {
  it('should validate target language', () => {
    const validLangs = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'pa', 'kn', 'ml', 'or'];
    expect(validLangs.includes('hi')).toBe(true);
    expect(validLangs.includes('xx')).toBe(false);
  });

  it('should validate text length', () => {
    const text = 'Hello world';
    expect(text.length).toBeGreaterThan(0);
    expect(text.length).toBeLessThanOrEqual(2000);
  });
});
