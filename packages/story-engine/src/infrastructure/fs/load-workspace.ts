import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { KnowledgeDocument } from '../../domain/knowledge';
import { parseMarkdownDocument } from '../markdown/parse-markdown-document';

async function collectMarkdownFiles(directoryPath: string): Promise<string[]> {
  const directoryEntries = await readdir(directoryPath, { withFileTypes: true });
  const nestedPaths = await Promise.all(
    directoryEntries.map(async (entry) => {
      const entryPath = join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectMarkdownFiles(entryPath);
      }

      if (entry.isFile() && entry.name.endsWith('.md')) {
        return [entryPath];
      }

      return [];
    }),
  );

  return nestedPaths.flat().sort((left, right) => left.localeCompare(right));
}

export async function loadWorkspace(workspacePath: string): Promise<KnowledgeDocument[]> {
  const markdownFiles = await collectMarkdownFiles(workspacePath);

  return Promise.all(
    markdownFiles.map(async (filePath) => {
      const source = await readFile(filePath, 'utf8');
      return parseMarkdownDocument(source);
    }),
  );
}
