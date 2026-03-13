import type {
  DocumentDetail,
  DocumentSummary,
  ProjectSummary,
} from '@ai-writing-studio/contracts';

import { renderAppShell } from './app-shell.js';
import { createProjectsClient, type CreateProjectsClientOptions, type ProjectsClient } from './project-documents.js';

export type BrowseStatus = 'idle' | 'loading' | 'ready' | 'failed';
export type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'failed';

export interface BrowseState {
  status: BrowseStatus;
  saveState: SaveState;
  projects: ProjectSummary[];
  selectedProjectId?: string;
  documents: DocumentSummary[];
  selectedDocumentId?: string;
  documentDetail?: DocumentDetail;
  draftTitle?: string;
  draftContent?: string;
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
  createDocument(): Promise<BrowseState>;
  updateDraft(draft: { title?: string; content?: string }): BrowseState;
  saveDocument(): Promise<BrowseState>;
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
    saveState: 'idle',
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
          saveState: 'idle',
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
    async createDocument() {
      return await createDocument();
    },
    updateDraft(draft) {
      const nextTitle = draft.title ?? state.draftTitle ?? '';
      const nextContent = draft.content ?? state.draftContent ?? '';
      const saveState = isDraftDirty(state, nextTitle, nextContent) ? 'dirty' : 'idle';

      state = {
        ...state,
        draftTitle: nextTitle,
        draftContent: nextContent,
        saveState,
      };

      return state;
    },
    async saveDocument() {
      return await saveDocument();
    },
  };

  async function selectProject(projectId: string): Promise<BrowseState> {
    state = {
      ...state,
      status: 'loading',
      saveState: 'idle',
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
        saveState: 'idle',
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
      saveState: 'idle',
      selectedDocumentId: documentId,
      documentDetail: undefined,
      error: undefined,
    };

    try {
      const response = await options.client.getDocument(projectId, documentId);
      state = {
        ...state,
        status: 'ready',
        saveState: 'idle',
        selectedDocumentId: documentId,
        documentDetail: response.document,
        draftTitle: response.document.title,
        draftContent: response.document.content,
      };

      return state;
    } catch (error) {
      state = toFailedState(state, error);
      return state;
    }
  }

  async function createDocument(): Promise<BrowseState> {
    const projectId = state.selectedProjectId;

    if (!projectId) {
      throw new Error('A project must be selected before creating a document');
    }

    state = {
      ...state,
      status: 'loading',
      saveState: 'idle',
      error: undefined,
    };

    try {
      const response = await options.client.createDocument(projectId, {
        id: 'untitled-document',
        title: 'Untitled document',
        kind: 'markdown',
        content: '',
      });
      const documentSummary = toDocumentSummary(response.document);
      state = {
        ...state,
        status: 'ready',
        saveState: 'idle',
        documents: [...state.documents, documentSummary],
        selectedDocumentId: response.document.id,
        documentDetail: response.document,
        draftTitle: response.document.title,
        draftContent: response.document.content,
      };

      return state;
    } catch (error) {
      state = toFailedState(state, error);
      return state;
    }
  }

  async function saveDocument(): Promise<BrowseState> {
    const projectId = state.selectedProjectId;
    const documentId = state.selectedDocumentId;
    const documentDetail = state.documentDetail;

    if (!projectId || !documentId || !documentDetail) {
      throw new Error('A document must be selected before saving');
    }

    state = {
      ...state,
      status: 'loading',
      saveState: 'saving',
      error: undefined,
    };

    try {
      const response = await options.client.updateDocument(projectId, documentId, {
        title: state.draftTitle ?? documentDetail.title,
        kind: documentDetail.kind,
        content: state.draftContent ?? documentDetail.content,
      });
      const documentSummary = toDocumentSummary(response.document);
      state = {
        ...state,
        status: 'ready',
        saveState: 'saved',
        documents: state.documents.map((item) =>
          item.id === documentSummary.id ? documentSummary : item,
        ),
        documentDetail: response.document,
        draftTitle: response.document.title,
        draftContent: response.document.content,
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

    const createButton = root.querySelector<HTMLButtonElement>('[data-action="create-document"]');
    createButton?.addEventListener('click', async () => {
      await controller.createDocument();
      render();
    });

    const saveButton = root.querySelector<HTMLButtonElement>('[data-action="save-document"]');
    saveButton?.addEventListener('click', async () => {
      await controller.saveDocument();
      render();
    });

    const titleInput = root.querySelector<HTMLInputElement>('[name="document-title"]');
    titleInput?.addEventListener('input', () => {
      controller.updateDraft({ title: titleInput.value });
    });

    const contentInput = root.querySelector<HTMLTextAreaElement>('[name="document-content"]');
    contentInput?.addEventListener('input', () => {
      controller.updateDraft({ content: contentInput.value });
    });
  };

  void controller.loadProjects().then(render, render);
  render();
}

export function renderBrowseView(state: BrowseState): string {
  return renderAppShell(state);
}

function toFailedState(state: BrowseState, error: unknown): BrowseState {
  return {
    ...state,
    status: 'failed',
    saveState: state.saveState === 'saving' ? 'failed' : state.saveState,
    error: error instanceof Error ? error.message : 'Unknown browse error',
  };
}

function isDraftDirty(state: BrowseState, title: string, content: string): boolean {
  if (!state.documentDetail) {
    return false;
  }

  return title !== state.documentDetail.title || content !== state.documentDetail.content;
}

function toDocumentSummary(document: DocumentDetail): DocumentSummary {
  return {
    id: document.id,
    title: document.title,
    kind: document.kind,
  };
}

