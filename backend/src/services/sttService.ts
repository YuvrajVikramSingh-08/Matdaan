import { logger } from '../utils/logger';

const LANG_MAP: Record<string, string> = {
  en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN', mr: 'mr-IN',
  ta: 'ta-IN', gu: 'gu-IN', pa: 'pa-IN', kn: 'kn-IN', ml: 'ml-IN', or: 'or-IN',
};

/** Convert speech audio to text using Cloud STT API */
export async function speechToText(audioBase64: string, language: string): Promise<string> {
  try {
    const speech = await import('@google-cloud/speech');
    const client = new speech.SpeechClient();
    const langCode = LANG_MAP[language] || 'en-IN';

    const [response] = await client.recognize({
      config: { encoding: 'WEBM_OPUS' as any, sampleRateHertz: 48000, languageCode: langCode },
      audio: { content: audioBase64 },
    });

    return response.results?.[0]?.alternatives?.[0]?.transcript || '';
  } catch (err) {
    logger.error('STT error', { error: (err as Error).message });
    throw new Error('STT service unavailable');
  }
}
