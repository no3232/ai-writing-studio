import {
  DOCUMENTS_ROUTE,
  DOCUMENT_DETAIL_ROUTE,
  HOST_AUTHORIZATION_HEADER,
  PROJECTS_ROUTE,
  type DocumentDetailResponse,
  type DocumentListResponse,
  type ProjectListResponse,
} from '@ai-writing-studio/contracts';

export interface CreateProjectsClientOptions {
  backendUrl: string;
  token: string;
  fetch?: typeof fetch;
}

export interface ProjectsClient {
  listProjects(): Promise<ProjectListResponse>;
  listDocuments(projectId: string): Promise<DocumentListResponse>;
  getDocument(projectId: string, documentId: string): Promise<DocumentDetailResponse>;
}

export function createProjectsClient(options: CreateProjectsClientOptions): ProjectsClient {
  const fetchImpl = options.fetch ?? fetch;

  return {
    listProjects() {
      return getJson<ProjectListResponse>(fetchImpl, options, PROJECTS_ROUTE);
    },
    listDocuments(projectId) {
      return getJson<DocumentListResponse>(
        fetchImpl,
        options,
        DOCUMENTS_ROUTE.replace(':projectId', encodeURIComponent(projectId)),
      );
    },
    getDocument(projectId, documentId) {
      return getJson<DocumentDetailResponse>(
        fetchImpl,
        options,
        DOCUMENT_DETAIL_ROUTE.replace(':projectId', encodeURIComponent(projectId)).replace(
          ':documentId',
          encodeURIComponent(documentId),
        ),
      );
    },
  };
}

async function getJson<T>(
  fetchImpl: typeof fetch,
  options: CreateProjectsClientOptions,
  route: string,
): Promise<T> {
  const response = await fetchImpl(toUrl(options.backendUrl, route), {
    method: 'GET',
    headers: options.token
      ? {
          [HOST_AUTHORIZATION_HEADER]: options.token,
        }
      : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

function toUrl(backendUrl: string, route: string): string {
  return new URL(route.replace(/^\//, ''), ensureTrailingSlash(backendUrl)).toString();
}

function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}
