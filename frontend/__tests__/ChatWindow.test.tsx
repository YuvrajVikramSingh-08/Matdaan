import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatWindow from '../src/components/Chat/ChatWindow';
import type { ChatMessage } from '../src/types';

const mockMessages: ChatMessage[] = [
  { id: 'welcome', role: 'bot', content: 'Namaste! I\'m Matdaan', timestamp: Date.now(), language: 'en', source: 'static' },
];

describe('ChatWindow', () => {
  it('renders initial greeting message', () => {
    render(
      <ChatWindow
        messages={mockMessages}
        isLoading={false}
        language="en"
        onSend={vi.fn()}
        onTabChange={vi.fn()}
      />
    );
    expect(screen.getAllByText(/Namaste/i).length).toBeGreaterThan(0);
  });

  it('renders quick reply chips', () => {
    render(
      <ChatWindow
        messages={mockMessages}
        isLoading={false}
        language="en"
        onSend={vi.fn()}
        onTabChange={vi.fn()}
      />
    );
    expect(screen.getByText(/How do I register to vote/i)).toBeTruthy();
  });

  it('shows typing dots when loading', () => {
    render(
      <ChatWindow
        messages={mockMessages}
        isLoading={true}
        language="en"
        onSend={vi.fn()}
        onTabChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText(/loading/i)).toBeTruthy();
  });
});
