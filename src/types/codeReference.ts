export type CodeLanguage = "typescript" | "python" | "java" | "cpp";

export interface CodeReferenceSnippet {
  language: CodeLanguage;
  label: string;
  code: string;
}

export interface CodeReferenceStage {
  id: string;
  title: string;
  description: string;
}

export interface CodeReference {
  title: string;
  summary: string;
  snippets: CodeReferenceSnippet[];
  stages: CodeReferenceStage[];
}
