import { logger } from '../utils/logger';

const VOICE_MAP: Record<string, { languageCode: string; name: string }> = {
  en: { languageCode: 'en-IN', name: 'en-IN-Wavenet-A' },
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-A' },
  bn: { languageCode: 'bn-IN', name: 'bn-IN-Wavenet-A' },
  te: { languageCode: 'te-IN', name: 'te-IN-Standard-A' },
  mr: { languageCode: 'mr-IN', name: 'mr-IN-Standard-A' },
  ta: { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-A' },
  gu: { languageCode: 'gu-IN', name: 'gu-IN-Wavenet-A' },
  pa: { languageCode: 'pa-IN', name: 'pa-IN-Wavenet-A' },
  kn: { languageCode: 'kn-IN', name: 'kn-IN-Wavenet-A' },
  ml: { languageCode: 'ml-IN', name: 'ml-IN-Wavenet-A' },
  or: { languageCode: 'or-IN', name: 'or-IN-Standard-A' },
};

/** Convert text to speech audio using Cloud TTS API */
export async function textToSpeech(text: string, language: string): Promise<string> {
  try {
    const tts = await import('@google-cloud/text-to-speech');
    const client = new tts.TextToSpeechClient();
    const voice = VOICE_MAP[language] || VOICE_MAP.en;

    const [response] = await client.synthesizeSpeech({
      input: { text: text.substring(0, 300) },
      voice: { languageCode: voice.languageCode, name: voice.name, ssmlGender: 'FEMALE' as any },
      audioConfig: { audioEncoding: 'MP3' as any, speakingRate: 0.9 },
    });

    return Buffer.from(response.audioContent as Uint8Array).toString('base64');
  } catch (err) {
    logger.error('TTS error', { error: (err as Error).message });
    throw new Error('TTS service unavailable');
  }
}
