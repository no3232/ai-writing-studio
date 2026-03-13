import type { SceneSuggestion } from '../contracts/scene-suggestion';
import type { WorkspaceIndex } from './build-workspace-index';

export interface GenerateSceneSuggestionsInput {
  workspaceIndex: WorkspaceIndex;
  selectedCharacterIds: string[];
  chapterText?: string;
  chapterLexicalPayload?: unknown;
}

function collectLexicalText(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectLexicalText(entry));
  }

  if (value && typeof value === 'object') {
    return Object.values(value).flatMap((entry) => collectLexicalText(entry));
  }

  return [];
}

function readChapterContext({
  chapterText,
  chapterLexicalPayload,
}: Pick<GenerateSceneSuggestionsInput, 'chapterText' | 'chapterLexicalPayload'>): string {
  if (typeof chapterText === 'string' && chapterText.trim() !== '') {
    return chapterText.trim();
  }

  const lexicalText = collectLexicalText(chapterLexicalPayload)
    .map((text) => text.trim())
    .filter((text) => text.length > 0)
    .join(' ');

  return lexicalText;
}

export function generateSceneSuggestions({
  workspaceIndex,
  selectedCharacterIds,
  chapterText,
  chapterLexicalPayload,
}: GenerateSceneSuggestionsInput): SceneSuggestion[] {
  const selectedCharacters = selectedCharacterIds
    .map((documentId) => workspaceIndex.byId.get(documentId))
    .filter((document): document is NonNullable<typeof document> => document !== undefined)
    .sort((left, right) => left.id.localeCompare(right.id));

  const chapterContext = readChapterContext({ chapterText, chapterLexicalPayload });

  if (selectedCharacters.length === 0 || chapterContext === '') {
    return [];
  }

  const referencedDocumentIds = selectedCharacters.map((character) => character.id);
  const characterTitles = selectedCharacters.map((character) => character.title);

  return [
    {
      id: `scene-${referencedDocumentIds.join('-')}`,
      message: `Play ${characterTitles.join(' and ')} against the current chapter tension: ${chapterContext}`,
      rationale: `Generated deterministically from chapter context and selected characters: ${characterTitles.join(', ')}.`,
      referencedDocumentIds,
    },
  ];
}
