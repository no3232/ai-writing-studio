export const HEALTH_ROUTE = '/health';
export const PROJECTS_ROUTE = '/projects';

export type HealthStatus = 'ok';

export interface HealthResponse {
  status: HealthStatus;
}

export interface ProjectSummary {
  id: string;
  name: string;
}

export interface ProjectListResponse {
  projects: ProjectSummary[];
}

export function createHealthResponse(): HealthResponse {
  return { status: 'ok' };
}

export function createProjectListResponse(projects: ProjectSummary[]): ProjectListResponse {
  return { projects };
}
