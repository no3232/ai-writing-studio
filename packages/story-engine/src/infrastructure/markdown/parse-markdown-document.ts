import {
  knowledgeDocumentTypes,
  type KnowledgeDocument,
  type KnowledgeDocumentType,
} from '../../domain/knowledge';
import { parseGrayMatterDocument } from './gray-matter-adapter';

function readRequiredString(data: Record<string, unknown>, key: string): string {
  const value = data[key];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Expected "${key}" to be a non-empty string.`);
  }

  return value.trim();
}

function normalizeStringArray(value: unknown): string[] {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized === '' ? [] : [normalized];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function readDocumentType(data: Record<string, unknown>): KnowledgeDocumentType {
  const type = readRequiredString(data, 'type');

  if (!knowledgeDocumentTypes.includes(type as KnowledgeDocumentType)) {
    throw new Error(`Unsupported knowledge document type: ${type}`);
  }

  return type as KnowledgeDocumentType;
}

export function parseMarkdownDocument(source: string): KnowledgeDocument {
  const { data, content } = parseGrayMatterDocument(source);

  return {
    id: readRequiredString(data, 'id'),
    type: readDocumentType(data),
    title: readRequiredString(data, 'title'),
    tags: normalizeStringArray(data.tags),
    links: normalizeStringArray(data.links),
    status: readRequiredString(data, 'status'),
    body: content.trim(),
  };
}
