import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import type { KnowledgeDocument } from '../../domain/knowledge';
import { parseMarkdownDocument } from '../markdown/parse-markdown-document';

async function collectWorkspaceFiles(directoryPath: string): Promise<string[]> {
  const directoryEntries = await readdir(directoryPath, { withFileTypes: true });
  const nestedPaths = await Promise.all(
    directoryEntries.map(async (entry) => {
      const entryPath = join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectWorkspaceFiles(entryPath);
      }

      if (
        entry.isFile() &&
        (entry.name.endsWith('.md') || entry.name.endsWith('.lexical.json'))
      ) {
        return [entryPath];
      }

      return [];
    }),
  );

  return nestedPaths.flat().sort((left, right) => left.localeCompare(right));
}

function parseChapterDocument(filePath: string, source: string): KnowledgeDocument {
  const id = basename(filePath, '.lexical.json');

  return {
    id,
    type: 'chapter',
    title: id,
    tags: [],
    links: [],
    status: 'draft',
    body: source.trim(),
  };
}

export async function loadWorkspace(workspacePath: string): Promise<KnowledgeDocument[]> {
  const workspaceFiles = await collectWorkspaceFiles(workspacePath);

  return Promise.all(
    workspaceFiles.map(async (filePath) => {
      const source = await readFile(filePath, 'utf8');

      if (filePath.endsWith('.lexical.json')) {
        return parseChapterDocument(filePath, source);
      }

      return parseMarkdownDocument(source);
    }),
  );
}
