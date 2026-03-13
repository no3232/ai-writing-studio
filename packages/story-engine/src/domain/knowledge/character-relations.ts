export interface Relationship {
  target: string;
  relation: string;
  mutual: boolean;
  notes?: string;
}

export const perceptionTruthStatuses = ['true', 'false', 'unknown'] as const;

export type PerceptionTruthStatus = (typeof perceptionTruthStatuses)[number];

export interface Perception {
  target: string;
  belief: string;
  truthStatus: PerceptionTruthStatus;
}

export interface Awareness {
  target: string;
  knowsExistence: boolean;
}
