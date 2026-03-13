import {
  knowledgeContextName,
  plottingContextName,
  simulationContextName,
  validationContextName,
} from '../../src/contracts';
import { describe, expect, it } from 'vitest';

describe('context contracts', () => {
  it('exports stable context names', () => {
    expect(knowledgeContextName).toBe('knowledge');
    expect(plottingContextName).toBe('plotting');
    expect(simulationContextName).toBe('simulation');
    expect(validationContextName).toBe('validation');
  });
});
