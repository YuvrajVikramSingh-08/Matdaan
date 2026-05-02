import { getSecret } from '../utils/secrets';
import { logger } from '../utils/logger';

/**
 * Dialogflow CX service for intent detection.
 * Falls back gracefully if not configured.
 */
export async function detectIntent(message: string, sessionId: string, language: string): Promise<{ response: string; confidence: number; intent: string } | null> {
  try {
    const projectId = await getSecret('DIALOGFLOW_PROJECT_ID');
    const agentId = await getSecret('DIALOGFLOW_AGENT_ID');

    if (!projectId || !agentId) {
      logger.warn('Dialogflow not configured, skipping');
      return null;
    }

    const { SessionsClient } = await import('@google-cloud/dialogflow-cx');
    const client = new SessionsClient();
    const sessionPath = client.projectLocationAgentSessionPath(
      projectId, 'asia-south1', agentId, sessionId
    );

    const [response] = await client.detectIntent({
      session: sessionPath,
      queryInput: {
        text: { text: message },
        languageCode: language === 'en' ? 'en' : `${language}-IN`,
      },
    });

    const result = response.queryResult;
    if (!result) return null;

    const confidence = result.match?.confidence || 0;
    const intentName = result.match?.intent?.displayName || 'Default Fallback Intent';
    const responseText = result.responseMessages?.[0]?.text?.text?.[0] || '';

    return { response: responseText, confidence, intent: intentName };
  } catch (err) {
    logger.error('Dialogflow error', { error: (err as Error).message });
    return null;
  }
}
