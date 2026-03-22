const DEFAULT_GRAPHQL_URL = 'http://localhost:5432/graphql';

const normalizeOptionalEnv = (value?: string): string | undefined => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const toWebSocketUrl = (httpUrl: string): string => {
  const parsed = new URL(httpUrl);
  parsed.protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
  return parsed.toString();
};

const graphqlUrl = normalizeOptionalEnv(import.meta.env.VITE_API_URL) ?? DEFAULT_GRAPHQL_URL;
const websocketUrl =
  normalizeOptionalEnv(import.meta.env.VITE_WEBSOCKET_URL) ??
  toWebSocketUrl(graphqlUrl);
const organizationId = normalizeOptionalEnv(import.meta.env.VITE_ORGANIZATION_ID);

export const apiConfig = {
  graphqlUrl,
  websocketUrl,
  organizationId,
};
