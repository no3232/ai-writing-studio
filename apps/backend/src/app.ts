import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';

import {
  DOCUMENTS_ROUTE,
  DOCUMENT_CREATE_ROUTE,
  DOCUMENT_DETAIL_ROUTE,
  DOCUMENT_UPDATE_ROUTE,
  HEALTH_ROUTE,
  PROJECTS_ROUTE,
  createDocumentCreateResponse,
  createDocumentDetailResponse,
  createDocumentListResponse,
  createDocumentUpdateResponse,
  createHealthResponse,
  createProjectListResponse,
  type DocumentCreateRequest,
  type DocumentUpdateRequest,
} from '@ai-writing-studio/contracts';
import { type OpenClawHostConnection } from '@ai-writing-studio/openclaw-adapter';

export interface BuildAppOptions {
  hostConnection: OpenClawHostConnection;
}

const DESKTOP_DEV_ORIGINS = new Set([
  'http://127.0.0.1:5173',
  'http://localhost:5173',
]);

export function buildApp(options: BuildAppOptions): FastifyInstance {
  const app = Fastify();
  const { hostConnection } = options;

  void app.register(cors, {
    methods: ['GET', 'HEAD', 'POST', 'PUT'],
    origin(origin, callback) {
      if (!origin || DESKTOP_DEV_ORIGINS.has(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
  });

  app.get(HEALTH_ROUTE, async () => createHealthResponse());
  app.get(PROJECTS_ROUTE, async () => {
    const projects = await hostConnection.listProjects();
    return createProjectListResponse(projects);
  });
  app.get(DOCUMENTS_ROUTE, async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const documents = await hostConnection.listDocuments(projectId);

    if (!documents) {
      reply.code(404);
      return { message: 'Project not found' };
    }

    return createDocumentListResponse(projectId, documents);
  });
  app.get(DOCUMENT_DETAIL_ROUTE, async (request, reply) => {
    const { projectId, documentId } = request.params as {
      projectId: string;
      documentId: string;
    };
    const document = await hostConnection.getDocument(projectId, documentId);

    if (!document) {
      reply.code(404);
      return { message: 'Document not found' };
    }

    return createDocumentDetailResponse({
      projectId,
      document,
    });
  });
  app.post(DOCUMENT_CREATE_ROUTE, async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const document = await hostConnection.createDocument(
      projectId,
      request.body as DocumentCreateRequest,
    );

    if (!document) {
      reply.code(404);
      return { message: 'Project not found' };
    }

    reply.code(201);
    return createDocumentCreateResponse({
      projectId,
      document,
    });
  });
  app.put(DOCUMENT_UPDATE_ROUTE, async (request, reply) => {
    const { projectId, documentId } = request.params as {
      projectId: string;
      documentId: string;
    };
    const document = await hostConnection.updateDocument(
      projectId,
      documentId,
      request.body as DocumentUpdateRequest,
    );

    if (!document) {
      reply.code(404);
      return { message: 'Document not found' };
    }

    return createDocumentUpdateResponse({
      projectId,
      document,
    });
  });

  return app;
}
