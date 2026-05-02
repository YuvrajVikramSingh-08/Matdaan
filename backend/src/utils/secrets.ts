/**
 * Google Secret Manager client.
 * In production, fetches secrets from Secret Manager.
 * In development, falls back to environment variables.
 */
export async function getSecret(name: string): Promise<string> {
  // In production with Secret Manager:
  if (process.env.NODE_ENV === 'production' && process.env.PROJECT_ID) {
    try {
      const { SecretManagerServiceClient } = await import('@google-cloud/secret-manager');
      const client = new SecretManagerServiceClient();
      const [version] = await client.accessSecretVersion({
        name: `projects/${process.env.PROJECT_ID}/secrets/${name}/versions/latest`,
      });
      return version.payload?.data?.toString() || '';
    } catch (err) {
      console.error(`Failed to fetch secret ${name}:`, err);
    }
  }

  // Fallback to environment variables
  return process.env[name] || '';
}
