import { useState, useCallback } from 'react';
import { translateText } from '../services/api';

/**
 * Hook for translating text via the backend Translation API.
 * Includes a simple in-memory cache to avoid duplicate calls.
 */
export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const cache = new Map<string, string>();

  const translate = useCallback(async (text: string, targetLang: string): Promise<string> => {
    if (targetLang === 'en') return text;

    const cacheKey = `${text}:${targetLang}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;

    setIsTranslating(true);
    try {
      const result = await translateText(text, targetLang);
      cache.set(cacheKey, result.translatedText);
      return result.translatedText;
    } catch {
      return text; // fallback to original
    } finally {
      setIsTranslating(false);
    }
  }, []);

  return { translate, isTranslating };
}
