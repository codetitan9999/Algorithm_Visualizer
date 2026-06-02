import { describe, expect, it } from "vitest";
import { runSearchingAlgorithm, searchingOptions } from "./algorithms";

describe("searching algorithms", () => {
  it("finds a shared target across every implemented search", () => {
    const values = [9, 2, 7, 4, 5, 1, 8];
    const target = 5;

    for (const option of searchingOptions) {
      const run = runSearchingAlgorithm(option.id, values, target);
      expect(run.summary.found).toBe(true);
      expect(run.resultIndex).toBeGreaterThanOrEqual(0);
      expect(run.steps.length).toBeGreaterThan(0);
      expect(run.summary.totalSteps).toBe(run.steps.length);
      expect(run.steps.at(-1)?.metrics.found).toBe(true);
    }
  });

  it("returns not found when the target is missing", () => {
    const run = runSearchingAlgorithm("binary", [11, 3, 8, 6, 4], 99);

    expect(run.summary.found).toBe(false);
    expect(run.resultIndex).toBe(-1);
    expect(run.steps.at(-1)?.description).toContain("without finding");
  });
});
