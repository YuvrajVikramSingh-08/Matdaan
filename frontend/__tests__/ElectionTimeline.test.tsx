import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ElectionTimeline from '../src/components/Timeline/ElectionTimeline';

describe('ElectionTimeline', () => {
  it('renders all 8 election steps', () => {
    render(<ElectionTimeline onAskMatdaan={vi.fn()} onTabChange={vi.fn()} />);
    expect(screen.getByText('Election Announcement')).toBeTruthy();
    expect(screen.getByText('Result Declaration')).toBeTruthy();
  });

  it('renders timeline title', () => {
    render(<ElectionTimeline onAskMatdaan={vi.fn()} onTabChange={vi.fn()} />);
    expect(screen.getByText(/Indian General Election Process/i)).toBeTruthy();
  });
});
