export const HEALTH_ROUTE = '/health';
export const PROJECTS_ROUTE = '/projects';
export const DOCUMENTS_ROUTE = '/projects/:projectId/documents';
export const DOCUMENT_DETAIL_ROUTE = '/projects/:projectId/documents/:documentId';
export const HOST_AUTHORIZATION_HEADER = 'x-openclaw-token';

export type HealthStatus = 'ok';
export type HealthService = 'backend';
export type DocumentKind = 'markdown' | 'chapter';

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

export interface DocumentSummary {
  id: string;
  title: string;
  kind: DocumentKind;
}

export interface DocumentListResponse {
  projectId: string;
  documents: DocumentSummary[];
}

export interface DocumentDetail extends DocumentSummary {
  content: string;
}

export interface DocumentDetailResponse {
  projectId: string;
  document: DocumentDetail;
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

export function createDocumentListResponse(
  projectId: string,
  documents: DocumentSummary[],
): DocumentListResponse {
  return {
    projectId,
    documents,
  };
}

export function createDocumentDetailResponse(payload: DocumentDetailResponse): DocumentDetailResponse {
  return payload;
}
