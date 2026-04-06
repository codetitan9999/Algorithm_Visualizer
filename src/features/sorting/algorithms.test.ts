import { describe, expect, it } from "vitest";
import { runSortingAlgorithm, sortingOptions } from "./algorithms";

describe("sorting algorithms", () => {
  it("sorts a shared sample input across every algorithm", () => {
    const values = [9, 2, 7, 4, 5, 1, 8];

    for (const option of sortingOptions) {
      const run = runSortingAlgorithm(option.id, values);
      expect(run.result).toEqual([1, 2, 4, 5, 7, 8, 9]);
      expect(run.steps.length).toBeGreaterThan(0);
      expect(run.summary.totalSteps).toBe(run.steps.length);
    }
  });
});
