export type SearchingAlgorithmId = "linear" | "binary";

export interface SearchMetrics {
  checks: number;
  iterations: number;
  found: boolean;
}

export interface SearchWindow {
  left: number;
  right: number;
}

export interface SearchStep {
  values: number[];
  target: number;
  active: number[];
  checked: number[];
  discarded: number[];
  foundIndex?: number;
  window?: SearchWindow;
  stageId?: string;
  description: string;
  metrics: SearchMetrics;
}

export interface SearchRun {
  algorithm: SearchingAlgorithmId;
  label: string;
  complexity: string;
  blurb: string;
  steps: SearchStep[];
  target: number;
  resultIndex: number;
  inputNote?: string;
  summary: SearchMetrics & {
    totalSteps: number;
    resultIndex: number;
  };
}
