import type {
  DocumentCreateRequest,
  DocumentDetail,
  DocumentSummary,
  DocumentUpdateRequest,
  ProjectSummary,
} from '@ai-writing-studio/contracts';

export type OpenClawHostStatus = 'connected' | 'disconnected';
export type HostProjectSummary = ProjectSummary;
export type HostDocumentSummary = DocumentSummary;
export type HostDocumentDetail = DocumentDetail;

export interface OpenClawHostConnection {
  getStatus(): Promise<OpenClawHostStatus>;
  listProjects(): Promise<HostProjectSummary[]>;
  listDocuments(projectId: string): Promise<HostDocumentSummary[] | undefined>;
  getDocument(projectId: string, documentId: string): Promise<HostDocumentDetail | undefined>;
  createDocument(
    projectId: string,
    request: DocumentCreateRequest,
  ): Promise<HostDocumentDetail | undefined>;
  updateDocument(
    projectId: string,
    documentId: string,
    request: DocumentUpdateRequest,
  ): Promise<HostDocumentDetail | undefined>;
}

const STUB_PROJECTS: HostProjectSummary[] = [{
  id: 'demo-project',
  name: 'Demo Novel Workspace',
}];

const STUB_DOCUMENTS: Record<string, HostDocumentDetail[]> = {
  'demo-project': [
    {
      id: 'outline',
      title: 'Story Outline',
      kind: 'markdown',
      content: '# Story Outline\n\n- Opening image\n- Inciting incident\n- First reversal',
    },
    {
      id: 'chapter-1',
      title: 'Chapter 1',
      kind: 'chapter',
      content:
        'The train eased into the station just before dawn, and Mira stepped onto the platform with a stolen key in her coat pocket.',
    },
  ],
};

class StubOpenClawHostConnection implements OpenClawHostConnection {
  private readonly documents: Record<string, HostDocumentDetail[]>;

  constructor() {
    this.documents = Object.fromEntries(
      Object.entries(STUB_DOCUMENTS).map(([projectId, documents]) => [
        projectId,
        documents.map((document) => ({ ...document })),
      ]),
    );
  }

  async getStatus(): Promise<OpenClawHostStatus> {
    return 'disconnected';
  }

  async listProjects(): Promise<HostProjectSummary[]> {
    return STUB_PROJECTS;
  }

  async listDocuments(projectId: string): Promise<HostDocumentSummary[] | undefined> {
    const documents = this.documents[projectId];

    return documents?.map(({ id, title, kind }) => ({ id, title, kind }));
  }

  async getDocument(projectId: string, documentId: string): Promise<HostDocumentDetail | undefined> {
    return this.documents[projectId]?.find((document) => document.id === documentId);
  }

  async createDocument(
    projectId: string,
    request: DocumentCreateRequest,
  ): Promise<HostDocumentDetail | undefined> {
    const documents = this.documents[projectId];

    if (!documents) {
      return undefined;
    }

    const document = { ...request };
    documents.push(document);

    return document;
  }

  async updateDocument(
    projectId: string,
    documentId: string,
    request: DocumentUpdateRequest,
  ): Promise<HostDocumentDetail | undefined> {
    const documents = this.documents[projectId];
    const index = documents?.findIndex((document) => document.id === documentId) ?? -1;

    if (!documents || index < 0) {
      return undefined;
    }

    const updatedDocument = {
      id: documentId,
      ...request,
    };
    documents[index] = updatedDocument;

    return updatedDocument;
  }
}

export function createStubOpenClawHost(): OpenClawHostConnection {
  return new StubOpenClawHostConnection();
}
