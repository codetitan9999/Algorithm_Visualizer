import { describe, expect, it } from "vitest";
import { runPathfindingAlgorithm } from "./algorithms";
import type { PathScenario } from "./types";

const scenario: PathScenario = {
  rows: 5,
  cols: 5,
  start: { row: 0, col: 0 },
  end: { row: 4, col: 4 },
  walls: new Set(["1:0", "1:1", "1:2", "3:3"]),
};

describe("pathfinding algorithms", () => {
  it("finds a route with A* and Dijkstra on the same board", () => {
    const astarRun = runPathfindingAlgorithm("astar", scenario);
    const dijkstraRun = runPathfindingAlgorithm("dijkstra", scenario);

    expect(astarRun.summary.found).toBe(true);
    expect(dijkstraRun.summary.found).toBe(true);
    expect(astarRun.summary.pathLength).toBeGreaterThan(0);
    expect(dijkstraRun.summary.pathLength).toBe(astarRun.summary.pathLength);
  });
});
