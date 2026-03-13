export const HEALTH_ROUTE = '/health';
export const PROJECTS_ROUTE = '/projects';
export const HOST_AUTHORIZATION_HEADER = 'x-openclaw-token';

export type HealthStatus = 'ok';
export type HealthService = 'backend';

export interface HealthResponse {
  status: HealthStatus;
  service: HealthService;
}

export interface HostConnectionConfig {
  backendUrl: string;
  token: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
}

export interface ProjectListResponse {
  projects: ProjectSummary[];
}

export function createHealthResponse(): HealthResponse {
  return {
    status: 'ok',
    service: 'backend',
  };
}

export function createHostConnectionConfig(config: HostConnectionConfig): HostConnectionConfig {
  return {
    backendUrl: config.backendUrl,
    token: config.token,
  };
}

export function createProjectListResponse(projects: ProjectSummary[]): ProjectListResponse {
  return { projects };
}
