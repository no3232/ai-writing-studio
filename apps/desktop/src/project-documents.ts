import {
  DOCUMENTS_ROUTE,
  DOCUMENT_CREATE_ROUTE,
  DOCUMENT_DETAIL_ROUTE,
  DOCUMENT_UPDATE_ROUTE,
  HOST_AUTHORIZATION_HEADER,
  PROJECTS_ROUTE,
  type DocumentCreateRequest,
  type DocumentCreateResponse,
  type DocumentDetailResponse,
  type DocumentListResponse,
  type DocumentUpdateRequest,
  type DocumentUpdateResponse,
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
  createDocument(projectId: string, request: DocumentCreateRequest): Promise<DocumentCreateResponse>;
  updateDocument(
    projectId: string,
    documentId: string,
    request: DocumentUpdateRequest,
  ): Promise<DocumentUpdateResponse>;
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
    createDocument(projectId, request) {
      return sendJson<DocumentCreateResponse>(
        fetchImpl,
        options,
        DOCUMENT_CREATE_ROUTE.replace(':projectId', encodeURIComponent(projectId)),
        'POST',
        request,
      );
    },
    updateDocument(projectId, documentId, request) {
      return sendJson<DocumentUpdateResponse>(
        fetchImpl,
        options,
        DOCUMENT_UPDATE_ROUTE.replace(':projectId', encodeURIComponent(projectId)).replace(
          ':documentId',
          encodeURIComponent(documentId),
        ),
        'PUT',
        request,
      );
    },
  };
}

async function getJson<T>(
  fetchImpl: typeof fetch,
  options: CreateProjectsClientOptions,
  route: string,
): Promise<T> {
  return send(fetchImpl, options, route, 'GET');
}

async function sendJson<T>(
  fetchImpl: typeof fetch,
  options: CreateProjectsClientOptions,
  route: string,
  method: 'POST' | 'PUT',
  body: unknown,
): Promise<T> {
  return send(fetchImpl, options, route, method, body);
}

async function send<T>(
  fetchImpl: typeof fetch,
  options: CreateProjectsClientOptions,
  route: string,
  method: 'GET' | 'POST' | 'PUT',
  body?: unknown,
): Promise<T> {
  const response = await fetchImpl(toUrl(options.backendUrl, route), {
    method,
    headers: buildHeaders(options.token, body !== undefined),
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

function toUrl(backendUrl: string, route: string): string {
  return new URL(route.replace(/^\//, ''), ensureTrailingSlash(backendUrl)).toString();
}

function buildHeaders(token: string, hasJsonBody: boolean): HeadersInit | undefined {
  const headers: Record<string, string> = {};

  if (token) {
    headers[HOST_AUTHORIZATION_HEADER] = token;
  }

  if (hasJsonBody) {
    headers['content-type'] = 'application/json';
  }

  return Object.keys(headers).length > 0 ? headers : undefined;
}

function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}
