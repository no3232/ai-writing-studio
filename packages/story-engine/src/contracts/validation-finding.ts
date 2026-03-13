export const validationFindingFieldNames = [
  'kind',
  'severity',
  'message',
  'documentIds',
  'evidence',
] as const;

export const validationFindingSeverities = ['info', 'warning', 'error'] as const;
export type ValidationFindingSeverity = (typeof validationFindingSeverities)[number];

export const validationFindingKinds = [
  'unknown-reference',
  'missing-linked-document',
  'relation-awareness-mismatch',
] as const;
export type ValidationFindingKind = (typeof validationFindingKinds)[number];

export interface ValidationFinding {
  kind: ValidationFindingKind;
  severity: ValidationFindingSeverity;
  message: string;
  documentIds: string[];
  evidence: string[];
}
