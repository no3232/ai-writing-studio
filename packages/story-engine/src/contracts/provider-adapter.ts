import type { PlotProposal } from './plot-proposal';
import type { SceneSuggestion } from './scene-suggestion';
import type { ValidationFinding } from './validation-finding';

export const providerAdapterMethodNames = [
  'generatePlotProposals',
  'generateSceneSuggestions',
  'runValidationAssist',
] as const;

export interface ProviderAdapter {
  generatePlotProposals(): Promise<PlotProposal[]>;
  generateSceneSuggestions(): Promise<SceneSuggestion[]>;
  runValidationAssist(): Promise<ValidationFinding[]>;
}
