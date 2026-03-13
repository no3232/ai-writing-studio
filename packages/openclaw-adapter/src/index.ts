import type { DocumentDetail, DocumentSummary, ProjectSummary } from '@ai-writing-studio/contracts';

export type OpenClawHostStatus = 'connected' | 'disconnected';
export type HostProjectSummary = ProjectSummary;
export type HostDocumentSummary = DocumentSummary;
export type HostDocumentDetail = DocumentDetail;

export interface OpenClawHostConnection {
  getStatus(): Promise<OpenClawHostStatus>;
  listProjects(): Promise<HostProjectSummary[]>;
  listDocuments(projectId: string): Promise<HostDocumentSummary[] | undefined>;
  getDocument(projectId: string, documentId: string): Promise<HostDocumentDetail | undefined>;
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
  async getStatus(): Promise<OpenClawHostStatus> {
    return 'disconnected';
  }

  async listProjects(): Promise<HostProjectSummary[]> {
    return STUB_PROJECTS;
  }

  async listDocuments(projectId: string): Promise<HostDocumentSummary[] | undefined> {
    const documents = STUB_DOCUMENTS[projectId];

    return documents?.map(({ id, title, kind }) => ({ id, title, kind }));
  }

  async getDocument(projectId: string, documentId: string): Promise<HostDocumentDetail | undefined> {
    return STUB_DOCUMENTS[projectId]?.find((document) => document.id === documentId);
  }
}

export function createStubOpenClawHost(): OpenClawHostConnection {
  return new StubOpenClawHostConnection();
}
