import type {
  Cell,
  PathMetrics,
  PathRun,
  PathScenario,
  PathStep,
  PathfindingAlgorithmId,
} from "./types";
import { deserializeCell, sameCell, serializeCell } from "./utils";

type SearchNode = {
  cell: Cell;
  cost: number;
  priority: number;
};

const pathfindingMeta: Record<
  PathfindingAlgorithmId,
  { label: string; complexity: string; blurb: string }
> = {
  astar: {
    label: "A* Search",
    complexity: "O(E log V)",
    blurb: "Uses both travel cost and a heuristic estimate to focus the search toward the goal.",
  },
  dijkstra: {
    label: "Dijkstra",
    complexity: "O(E log V)",
    blurb: "Expands the cheapest-known frontier uniformly, guaranteeing optimal paths on non-negative edges.",
  },
};

function createMetrics(): PathMetrics {
  return {
    visitedCount: 0,
    frontierCount: 0,
    pathLength: 0,
    iterations: 0,
    found: false,
  };
}

function cloneMetrics(metrics: PathMetrics): PathMetrics {
  return { ...metrics };
}

function manhattanDistance(left: Cell, right: Cell) {
  return Math.abs(left.row - right.row) + Math.abs(left.col - right.col);
}

function getNeighbors(cell: Cell, scenario: PathScenario) {
  const candidates = [
    { row: cell.row - 1, col: cell.col },
    { row: cell.row + 1, col: cell.col },
    { row: cell.row, col: cell.col - 1 },
    { row: cell.row, col: cell.col + 1 },
  ];

  return candidates.filter((candidate) => {
    const inBounds =
      candidate.row >= 0 &&
      candidate.row < scenario.rows &&
      candidate.col >= 0 &&
      candidate.col < scenario.cols;

    return inBounds && !scenario.walls.has(serializeCell(candidate));
  });
}

function reconstructPath(
  parents: Map<string, string>,
  start: Cell,
  end: Cell,
): Cell[] {
  const path: Cell[] = [end];
  let currentKey = serializeCell(end);
  const startKey = serializeCell(start);

  while (currentKey !== startKey) {
    const parentKey = parents.get(currentKey);
    if (!parentKey) {
      return [];
    }

    path.unshift(deserializeCell(parentKey));
    currentKey = parentKey;
  }

  return path;
}

function createStep(
  metrics: PathMetrics,
  stageId: string,
  description: string,
  current: Cell | undefined,
  frontier: SearchNode[],
  visited: Set<string>,
  path: Cell[] = [],
): PathStep {
  return {
    current,
    frontier: frontier.map((entry) => entry.cell),
    visited: [...visited].map(deserializeCell),
    path,
    stageId,
    description,
    metrics: cloneMetrics(metrics),
  };
}

export function createPathPreviewRun(
  scenario: PathScenario,
  algorithm: PathfindingAlgorithmId = "astar",
): PathRun {
  const meta = pathfindingMeta[algorithm];

  return {
    algorithm,
    label: meta.label,
    complexity: meta.complexity,
    blurb: meta.blurb,
    steps: [
      {
        current: undefined,
        frontier: [],
        visited: [],
        path: [],
        stageId: "configure",
        description:
          "Configure the board, choose a routing strategy, and then run the search to review each frontier update and the resolved path.",
        metrics: createMetrics(),
      },
    ],
    summary: {
      ...createMetrics(),
      totalSteps: 1,
    },
  };
}

function runSearch(
  algorithm: PathfindingAlgorithmId,
  scenario: PathScenario,
): PathRun {
  const meta = pathfindingMeta[algorithm];
  const frontier: SearchNode[] = [
    {
      cell: scenario.start,
      cost: 0,
      priority:
        algorithm === "astar"
          ? manhattanDistance(scenario.start, scenario.end)
          : 0,
    },
  ];
  const visited = new Set<string>();
  const frontierKeys = new Set<string>([serializeCell(scenario.start)]);
  const parents = new Map<string, string>();
  const costs = new Map<string, number>([[serializeCell(scenario.start), 0]]);
  const metrics = createMetrics();
  const steps: PathStep[] = [
    {
      current: scenario.start,
      frontier: [scenario.start],
      visited: [],
      path: [],
      stageId: "seed",
      description: `Seed the frontier with the start node and begin ${meta.label}.`,
      metrics: createMetrics(),
    },
  ];

  while (frontier.length > 0) {
    frontier.sort(
      (left, right) => left.priority - right.priority || left.cost - right.cost,
    );

    const current = frontier.shift()!;
    const currentKey = serializeCell(current.cell);
    frontierKeys.delete(currentKey);

    if (visited.has(currentKey)) {
      continue;
    }

    visited.add(currentKey);
    metrics.iterations += 1;

    if (sameCell(current.cell, scenario.end)) {
      const path = reconstructPath(parents, scenario.start, scenario.end);
      metrics.pathLength = Math.max(path.length - 1, 0);
      metrics.frontierCount = frontier.length;
      metrics.visitedCount = visited.size;
      metrics.found = path.length > 0;

      steps.push(
        createStep(
          metrics,
          "resolve",
          `Goal reached after ${metrics.iterations} expansions. The highlighted path is optimal for this grid.`,
          current.cell,
          frontier,
          visited,
          path,
        ),
      );

      return {
        algorithm,
        label: meta.label,
        complexity: meta.complexity,
        blurb: meta.blurb,
        steps,
        summary: {
          ...metrics,
          totalSteps: steps.length,
        },
      };
    }

    let addedNeighbors = 0;
    for (const neighbor of getNeighbors(current.cell, scenario)) {
      const neighborKey = serializeCell(neighbor);
      if (visited.has(neighborKey)) {
        continue;
      }

      const tentativeCost = current.cost + 1;
      const knownCost = costs.get(neighborKey) ?? Number.POSITIVE_INFINITY;

      if (tentativeCost >= knownCost) {
        continue;
      }

      parents.set(neighborKey, currentKey);
      costs.set(neighborKey, tentativeCost);
      const nextNode: SearchNode = {
        cell: neighbor,
        cost: tentativeCost,
        priority:
          tentativeCost +
          (algorithm === "astar"
            ? manhattanDistance(neighbor, scenario.end)
            : 0),
      };
      const existingIndex = frontier.findIndex((entry) =>
        sameCell(entry.cell, neighbor),
      );

      if (existingIndex >= 0) {
        frontier[existingIndex] = nextNode;
      } else {
        frontier.push(nextNode);
        frontierKeys.add(neighborKey);
      }
      addedNeighbors += 1;
    }

    metrics.frontierCount = frontier.length;
    metrics.visitedCount = visited.size;

    steps.push(
        createStep(
          metrics,
          addedNeighbors > 0 ? "queue" : "expand",
          addedNeighbors > 0
            ? `Expand (${current.cell.row}, ${current.cell.col}) and queue ${addedNeighbors} promising neighbor${addedNeighbors === 1 ? "" : "s"}.`
            : `Expand (${current.cell.row}, ${current.cell.col}) and backtrack because no better neighbors remain.`,
        current.cell,
        frontier,
        visited,
      ),
    );
  }

  metrics.frontierCount = 0;
  metrics.visitedCount = visited.size;

  steps.push(
    createStep(
      metrics,
      "exhaust",
      "The frontier is empty, so this grid has no path between the chosen start and end nodes.",
      undefined,
      frontier,
      visited,
    ),
  );

  return {
    algorithm,
    label: meta.label,
    complexity: meta.complexity,
    blurb: meta.blurb,
    steps,
    summary: {
      ...metrics,
      totalSteps: steps.length,
    },
  };
}

export const pathfindingOptions = Object.entries(pathfindingMeta).map(
  ([id, meta]) => ({
    id: id as PathfindingAlgorithmId,
    ...meta,
  }),
);

export function runPathfindingAlgorithm(
  algorithm: PathfindingAlgorithmId,
  scenario: PathScenario,
) {
  return runSearch(algorithm, scenario);
}
