export type SortingAlgorithmId =
  | "bubble"
  | "insertion"
  | "selection"
  | "merge"
  | "quick";

export interface SortMetrics {
  comparisons: number;
  swaps: number;
  writes: number;
}

export interface SortStep {
  values: number[];
  active: number[];
  compared: number[];
  sorted: number[];
  pivot?: number;
  stageId?: string;
  description: string;
  metrics: SortMetrics;
}

export interface SortRun {
  algorithm: SortingAlgorithmId;
  label: string;
  complexity: string;
  blurb: string;
  steps: SortStep[];
  result: number[];
  summary: SortMetrics & {
    totalSteps: number;
  };
}
