import type { ProjectSummary } from '@ai-writing-studio/contracts';

export type OpenClawHostStatus = 'connected' | 'disconnected';
export type HostProjectSummary = ProjectSummary;

export interface OpenClawHostConnection {
  getStatus(): Promise<OpenClawHostStatus>;
  listProjects(): Promise<HostProjectSummary[]>;
}

class StubOpenClawHostConnection implements OpenClawHostConnection {
  async getStatus(): Promise<OpenClawHostStatus> {
    return 'disconnected';
  }

  async listProjects(): Promise<HostProjectSummary[]> {
    return [];
  }
}

export function createStubOpenClawHost(): OpenClawHostConnection {
  return new StubOpenClawHostConnection();
}
