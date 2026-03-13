import type { PlotProposal } from '../contracts';

export interface PlotSessionState {
  proposals: PlotProposal[];
  selectedProposalId: string | null;
  revision: number;
}

export function createPlotSessionState(proposals: PlotProposal[]): PlotSessionState {
  return {
    proposals,
    selectedProposalId: null,
    revision: 0,
  };
}

export function selectPlotProposal(
  state: PlotSessionState,
  proposalId: string,
): PlotSessionState {
  return {
    ...state,
    selectedProposalId: proposalId,
  };
}

export function regeneratePlotSessionState(
  state: PlotSessionState,
  proposals: PlotProposal[],
): PlotSessionState {
  return {
    proposals,
    selectedProposalId: null,
    revision: state.revision + 1,
  };
}
