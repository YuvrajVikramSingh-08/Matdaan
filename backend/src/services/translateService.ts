import { logger } from '../utils/logger';

/** Translate text using Google Cloud Translation API */
export async function translateText(text: string, targetLang: string): Promise<{ translatedText: string; detectedSourceLanguage: string }> {
  try {
    const { Translate } = await import('@google-cloud/translate').then(m => m.v2);
    const translate = new Translate();
    const [translation] = await translate.translate(text, targetLang);
    return { translatedText: translation, detectedSourceLanguage: 'en' };
  } catch (err) {
    logger.error('Translation error', { error: (err as Error).message });
    return { translatedText: text, detectedSourceLanguage: 'en' };
  }
}
