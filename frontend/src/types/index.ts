/** Chat message from user or bot */
export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
  language: string;
  source?: 'dialogflow' | 'vertex' | 'static';
}

/** Election timeline step */
export interface ElectionStep {
  id: number;
  phase: string;
  title: string;
  description: string;
  detailedExplanation: string;
  icon: string;
  color: string;
  chatPrompt: string;
  typicalMonth: string;
  status?: 'completed' | 'current' | 'upcoming';
}

/** Helpline contact entry */
export interface HelplineEntry {
  id: number;
  name: string;
  type: 'phone' | 'email' | 'url';
  value: string;
  description: string;
  icon: string;
}

/** Supported language option */
export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

/** Polling booth result from API */
export interface PollingBooth {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
}

/** API response types */
export interface ChatResponse {
  reply: string;
  source: 'dialogflow' | 'vertex' | 'static';
}

export interface TTSResponse {
  audioContent: string;
}

export interface STTResponse {
  transcript: string;
}

export interface TranslateResponse {
  translatedText: string;
  detectedSourceLanguage: string;
}

/** First-time voter checklist step */
export interface VoterChecklistStep {
  id: number;
  title: string;
  description: string;
  actionLabel: string;
  actionUrl?: string;
  icon: string;
  completed: boolean;
}

/** Fake news check result */
export interface FactCheckResult {
  claim: string;
  verdict: 'true' | 'false' | 'misleading' | 'unverified';
  explanation: string;
  sources: string[];
}

/** EVM step for interactive explainer */
export interface EVMStep {
  id: number;
  title: string;
  description: string;
  animation: string;
}

/** Tab definition */
export type TabId = 'chat' | 'timeline' | 'booth' | 'helpline' | 'first-voter' | 'fact-check' | 'evm' | 'voter-status';

export interface Tab {
  id: TabId;
  label: string;
  icon: string;
}
