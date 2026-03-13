import matter from 'gray-matter';

export interface GrayMatterDocument {
  data: Record<string, unknown>;
  content: string;
}

export function parseGrayMatterDocument(source: string): GrayMatterDocument {
  const { data, content } = matter(source);

  return {
    data: data as Record<string, unknown>,
    content,
  };
}
