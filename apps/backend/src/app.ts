import Fastify, { type FastifyInstance } from 'fastify';

import {
  HEALTH_ROUTE,
  PROJECTS_ROUTE,
  createHealthResponse,
  createProjectListResponse,
} from '@ai-writing-studio/contracts';
import { type OpenClawHostConnection } from '@ai-writing-studio/openclaw-adapter';

export interface BuildAppOptions {
  hostConnection: OpenClawHostConnection;
}

export function buildApp(options: BuildAppOptions): FastifyInstance {
  const app = Fastify();
  const { hostConnection } = options;

  app.get(HEALTH_ROUTE, async () => createHealthResponse());
  app.get(PROJECTS_ROUTE, async () => {
    const projects = await hostConnection.listProjects();
    return createProjectListResponse(projects);
  });

  return app;
}
