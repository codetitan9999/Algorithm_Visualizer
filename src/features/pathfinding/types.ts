export type PathfindingAlgorithmId = "astar" | "dijkstra";
export type EditTool = "wall" | "erase" | "start" | "end";

export interface Cell {
  row: number;
  col: number;
}

export interface PathMetrics {
  visitedCount: number;
  frontierCount: number;
  pathLength: number;
  iterations: number;
  found: boolean;
}

export interface PathStep {
  current?: Cell;
  frontier: Cell[];
  visited: Cell[];
  path: Cell[];
  stageId?: string;
  description: string;
  metrics: PathMetrics;
}

export interface PathScenario {
  rows: number;
  cols: number;
  start: Cell;
  end: Cell;
  walls: Set<string>;
}

export interface PathRun {
  algorithm: PathfindingAlgorithmId;
  label: string;
  complexity: string;
  blurb: string;
  steps: PathStep[];
  summary: PathMetrics & {
    totalSteps: number;
  };
}
