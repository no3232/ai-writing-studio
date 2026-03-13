export type OpenClawHostStatus = 'connected' | 'disconnected';

export interface HostProjectSummary {
  id: string;
  name: string;
}

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
