import type {
  DocumentDetail,
  DocumentSummary,
  ProjectSummary,
} from '@ai-writing-studio/contracts';

import { createProjectsClient, type CreateProjectsClientOptions, type ProjectsClient } from './project-documents.js';

export type BrowseStatus = 'idle' | 'loading' | 'ready' | 'failed';

export interface BrowseState {
  status: BrowseStatus;
  projects: ProjectSummary[];
  selectedProjectId?: string;
  documents: DocumentSummary[];
  selectedDocumentId?: string;
  documentDetail?: DocumentDetail;
  error?: string;
}

export interface BrowseClient extends ProjectsClient {}

export interface CreateBrowseControllerOptions {
  client: BrowseClient;
}

export interface BrowseController {
  getState(): BrowseState;
  loadProjects(): Promise<BrowseState>;
  selectProject(projectId: string): Promise<BrowseState>;
  selectDocument(documentId: string): Promise<BrowseState>;
}

export interface MountBrowseUiOptions {
  root: HTMLElement;
  controller: BrowseController;
}

export function createBrowseClient(options: CreateProjectsClientOptions): BrowseClient {
  return createProjectsClient(options);
}

export function createBrowseController(options: CreateBrowseControllerOptions): BrowseController {
  let state: BrowseState = {
    status: 'idle',
    projects: [],
    documents: [],
  };

  return {
    getState() {
      return state;
    },
    async loadProjects() {
      state = {
        ...state,
        status: 'loading',
        error: undefined,
      };

      try {
        const { projects } = await options.client.listProjects();
        state = {
          status: 'ready',
          projects,
          documents: [],
        };

        if (projects[0]) {
          return await selectProject(projects[0].id);
        }

        return state;
      } catch (error) {
        state = toFailedState(state, error);
        return state;
      }
    },
    async selectProject(projectId) {
      return await selectProject(projectId);
    },
    async selectDocument(documentId) {
      return await selectDocument(documentId);
    },
  };

  async function selectProject(projectId: string): Promise<BrowseState> {
    state = {
      ...state,
      status: 'loading',
      selectedProjectId: projectId,
      selectedDocumentId: undefined,
      documents: [],
      documentDetail: undefined,
      error: undefined,
    };

    try {
      const { documents } = await options.client.listDocuments(projectId);
      state = {
        ...state,
        status: 'ready',
        selectedProjectId: projectId,
        documents,
      };

      if (documents[0]) {
        return await selectDocument(documents[0].id);
      }

      return state;
    } catch (error) {
      state = toFailedState(state, error);
      return state;
    }
  }

  async function selectDocument(documentId: string): Promise<BrowseState> {
    const projectId = state.selectedProjectId;

    if (!projectId) {
      throw new Error('A project must be selected before loading a document');
    }

    state = {
      ...state,
      status: 'loading',
      selectedDocumentId: documentId,
      documentDetail: undefined,
      error: undefined,
    };

    try {
      const response = await options.client.getDocument(projectId, documentId);
      state = {
        ...state,
        status: 'ready',
        selectedDocumentId: documentId,
        documentDetail: response.document,
      };

      return state;
    } catch (error) {
      state = toFailedState(state, error);
      return state;
    }
  }
}

export function mountBrowseUi(options: MountBrowseUiOptions): void {
  const { root, controller } = options;

  const render = () => {
    root.innerHTML = renderBrowseView(controller.getState());

    for (const button of root.querySelectorAll<HTMLButtonElement>('[data-project-id]')) {
      button.addEventListener('click', async () => {
        await controller.selectProject(button.dataset.projectId ?? '');
        render();
      });
    }

    for (const button of root.querySelectorAll<HTMLButtonElement>('[data-document-id]')) {
      button.addEventListener('click', async () => {
        await controller.selectDocument(button.dataset.documentId ?? '');
        render();
      });
    }
  };

  void controller.loadProjects().then(render, render);
  render();
}

export function renderBrowseView(state: BrowseState): string {
  return [
    '<section style="display:grid;grid-template-columns:240px 240px 1fr;gap:16px;font-family:sans-serif;line-height:1.4;padding:16px;">',
    '<header style="grid-column:1 / -1;">',
    '<h1>Remote project browser</h1>',
    `<p>Status: ${escapeHtml(state.status)}</p>`,
    state.error ? `<p style="color:#b00020;">${escapeHtml(state.error)}</p>` : '',
    '</header>',
    renderProjectList(state),
    renderDocumentList(state),
    renderDocumentDetail(state),
    '</section>',
  ].join('');
}

function renderProjectList(state: BrowseState): string {
  return [
    '<section>',
    '<h2>Projects</h2>',
    '<ul style="list-style:none;padding:0;margin:0;display:grid;gap:8px;">',
    ...state.projects.map((project) =>
      `<li><button type="button" data-project-id="${escapeAttribute(project.id)}" aria-current="${String(
        project.id === state.selectedProjectId,
      )}" style="width:100%;text-align:left;padding:8px;">${escapeHtml(project.name)}</button></li>`,
    ),
    state.projects.length === 0 ? '<li>No projects</li>' : '',
    '</ul>',
    '</section>',
  ].join('');
}

function renderDocumentList(state: BrowseState): string {
  return [
    '<section>',
    '<h2>Documents</h2>',
    '<ul style="list-style:none;padding:0;margin:0;display:grid;gap:8px;">',
    ...state.documents.map((document) =>
      `<li><button type="button" data-document-id="${escapeAttribute(document.id)}" aria-current="${String(
        document.id === state.selectedDocumentId,
      )}" style="width:100%;text-align:left;padding:8px;">${escapeHtml(
        document.title,
      )}</button></li>`,
    ),
    state.documents.length === 0 ? '<li>No documents</li>' : '',
    '</ul>',
    '</section>',
  ].join('');
}

function renderDocumentDetail(state: BrowseState): string {
  if (!state.documentDetail) {
    return '<section><h2>Document</h2><p>Select a document to inspect its content.</p></section>';
  }

  return [
    '<section>',
    `<h2>${escapeHtml(state.documentDetail.title)}</h2>`,
    `<p>Kind: ${escapeHtml(state.documentDetail.kind)}</p>`,
    `<pre>${escapeHtml(state.documentDetail.content)}</pre>`,
    '</section>',
  ].join('');
}

function toFailedState(state: BrowseState, error: unknown): BrowseState {
  return {
    ...state,
    status: 'failed',
    error: error instanceof Error ? error.message : 'Unknown browse error',
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
