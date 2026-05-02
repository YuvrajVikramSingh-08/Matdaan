import axios from 'axios';

/** Base API URL — proxied in dev, set via env in prod */
const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

/** Send a chat message to the backend */
export async function sendChatMessage(message: string, language: string, sessionId: string) {
  const res = await api.post('/api/chat', { message, language, sessionId });
  return res.data as { reply: string; source: string };
}

/** Request text-to-speech audio */
export async function requestTTS(text: string, language: string) {
  const res = await api.post('/api/tts', { text, language });
  return res.data as { audioContent: string };
}

/** Send audio for speech-to-text */
export async function requestSTT(audio: string, language: string) {
  const res = await api.post('/api/stt', { audio, language });
  return res.data as { transcript: string };
}

/** Translate text */
export async function translateText(text: string, targetLang: string) {
  const res = await api.post('/api/translate', { text, targetLang });
  return res.data as { translatedText: string; detectedSourceLanguage: string };
}

/** Find nearby polling booths */
export async function findBooths(lat: number, lng: number) {
  const res = await api.get('/api/booths', { params: { lat, lng } });
  return res.data as { booths: Array<{ id: string; name: string; address: string; lat: number; lng: number; distance: number }> };
}

/** Fact-check a claim */
export async function factCheck(claim: string, language: string) {
  const res = await api.post('/api/fact-check', { claim, language });
  return res.data as { verdict: string; explanation: string; sources: string[] };
}

export default api;
