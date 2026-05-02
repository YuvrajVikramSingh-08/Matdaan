import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BoothFinder from '../src/components/PollingBooth/BoothFinder';

describe('BoothFinder', () => {
  it('renders find booth prompt', () => {
    render(<BoothFinder language="en" onToast={vi.fn()} />);
    expect(screen.getByText(/Find Your Nearest Polling Booth/i)).toBeTruthy();
  });

  it('has a find button', () => {
    render(<BoothFinder language="en" onToast={vi.fn()} />);
    expect(screen.getByText(/Find My Nearest Booth/i)).toBeTruthy();
  });
});
