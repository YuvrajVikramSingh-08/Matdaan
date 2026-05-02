import React from 'react';
import { getTranslation } from '../../constants/languages';

interface FooterProps {
  language: string;
}

export default function Footer({ language }: FooterProps) {
  return (
    <footer style={{
      textAlign: 'center', padding: '8px 16px', fontSize: '.72rem',
      color: '#4A5568', borderTop: '1px solid #E2E8F0', background: '#FAFAFA',
    }}>
      {getTranslation('footerText', language)} · © 2025 Matdaan
    </footer>
  );
}
