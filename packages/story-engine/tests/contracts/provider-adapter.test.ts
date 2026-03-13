import {
  providerAdapterMethodNames,
  type ProviderAdapter,
} from '../../src/contracts/provider-adapter';
import type {
  PlotProposal,
  SceneSuggestion,
  ValidationFinding,
} from '../../src/contracts';
import { describe, expect, it } from 'vitest';

describe('provider adapter contract', () => {
  it('exports the stable provider adapter methods', () => {
    expect(providerAdapterMethodNames).toEqual([
      'generatePlotProposals',
      'generateSceneSuggestions',
      'runValidationAssist',
    ]);
  });

  it('describes the minimum provider adapter shape', async () => {
    const adapter: ProviderAdapter = {
      async generatePlotProposals(): Promise<PlotProposal[]> {
        return [];
      },
      async generateSceneSuggestions(): Promise<SceneSuggestion[]> {
        return [];
      },
      async runValidationAssist(): Promise<ValidationFinding[]> {
        return [];
      },
    };

    expect(await adapter.generatePlotProposals()).toEqual([]);
    expect(await adapter.generateSceneSuggestions()).toEqual([]);
    expect(await adapter.runValidationAssist()).toEqual([]);
  });
});
