import {
  HEALTH_ROUTE,
  HOST_AUTHORIZATION_HEADER,
  type HealthResponse,
  type HostConnectionConfig,
} from '@ai-writing-studio/contracts';

export type HostConnectionStatus = 'idle' | 'verifying' | 'connected' | 'failed';

export interface HostConnectionState {
  status: HostConnectionStatus;
  config?: HostConnectionConfig;
  health?: HealthResponse;
  error?: string;
}

export interface HostConnectionVerificationSuccess {
  ok: true;
  config: HostConnectionConfig;
  health: HealthResponse;
}

export type VerifyHostConnection = (
  config: HostConnectionConfig,
) => Promise<HostConnectionVerificationSuccess>;

export interface CreateHostConnectionStoreOptions {
  verifyConnection?: VerifyHostConnection;
}

export interface HostConnectionStore {
  getState(): HostConnectionState;
  setConfig(config: HostConnectionConfig): HostConnectionState;
  verify(): Promise<HostConnectionVerificationSuccess>;
}

export interface VerifyBackendHealthOptions {
  fetch?: typeof fetch;
}

export function createHostConnectionStore(
  options: CreateHostConnectionStoreOptions = {},
): HostConnectionStore {
  const verifyConnection = options.verifyConnection ?? verifyBackendHealth;

  let state: HostConnectionState = {
    status: 'idle',
  };

  return {
    getState() {
      return state;
    },
    setConfig(config) {
      state = {
        status: 'idle',
        config,
      };

      return state;
    },
    async verify() {
      const config = state.config;

      if (!config) {
        throw new Error('Host connection config is required before verification');
      }

      state = {
        ...state,
        status: 'verifying',
        error: undefined,
      };

      try {
        const result = await verifyConnection(config);
        state = {
          status: 'connected',
          config: result.config,
          health: result.health,
        };

        return result;
      } catch (error) {
        state = {
          status: 'failed',
          config: state.config,
          error: error instanceof Error ? error.message : 'Unknown host connection error',
        };

        throw error;
      }
    },
  };
}

export async function verifyBackendHealth(
  config: HostConnectionConfig,
  options: VerifyBackendHealthOptions = {},
): Promise<HostConnectionVerificationSuccess> {
  const fetchImpl = options.fetch ?? fetch;
  const healthUrl = new URL(HEALTH_ROUTE, ensureTrailingSlash(config.backendUrl)).toString();
  const headers = config.token
    ? {
        [HOST_AUTHORIZATION_HEADER]: config.token,
      }
    : undefined;

  const response = await fetchImpl(healthUrl, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  const health = (await response.json()) as HealthResponse;

  return {
    ok: true,
    config,
    health,
  };
}

function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}
