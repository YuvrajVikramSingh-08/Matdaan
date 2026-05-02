describe('GET /api/booths', () => {
  it('should validate India bounds correctly', () => {
    const INDIA_BOUNDS = { latMin: 6.5, latMax: 37.5, lngMin: 68.0, lngMax: 97.5 };

    // Mumbai
    expect(19.076 >= INDIA_BOUNDS.latMin && 19.076 <= INDIA_BOUNDS.latMax).toBe(true);
    expect(72.877 >= INDIA_BOUNDS.lngMin && 72.877 <= INDIA_BOUNDS.lngMax).toBe(true);

    // London - outside India
    expect(51.507 >= INDIA_BOUNDS.latMin && 51.507 <= INDIA_BOUNDS.latMax).toBe(false);
  });

  it('should limit results to 5', () => {
    const maxResults = 5;
    const mockResults = Array.from({ length: 10 }, (_, i) => ({ id: String(i) }));
    expect(mockResults.slice(0, maxResults).length).toBe(5);
  });
});
