import type {
  SearchMetrics,
  SearchRun,
  SearchStep,
  SearchWindow,
  SearchingAlgorithmId,
} from "./types";

type SnapshotOptions = {
  active?: number[];
  checked?: Iterable<number>;
  discarded?: Iterable<number>;
  foundIndex?: number;
  window?: SearchWindow;
  stageId?: string;
  description: string;
};

type Recorder = {
  values: number[];
  target: number;
  steps: SearchStep[];
  metrics: SearchMetrics;
};

const algorithmMeta: Record<
  SearchingAlgorithmId,
  { label: string; complexity: string; blurb: string }
> = {
  linear: {
    label: "Linear Search",
    complexity: "O(n)",
    blurb: "Checks values from left to right until the target is found or the list runs out.",
  },
  binary: {
    label: "Binary Search",
    complexity: "O(log n)",
    blurb: "Works on sorted data by repeatedly cutting the search range in half.",
  },
};

export const searchingOptions = (
  Object.entries(algorithmMeta) as Array<
    [SearchingAlgorithmId, (typeof algorithmMeta)[SearchingAlgorithmId]]
  >
).map(([id, meta]) => ({
  id,
  ...meta,
}));

function createRecorder(values: number[], target: number): Recorder {
  return {
    values: [...values],
    target,
    steps: [],
    metrics: {
      checks: 0,
      iterations: 0,
      found: false,
    },
  };
}

function snapshot(recorder: Recorder, options: SnapshotOptions) {
  recorder.steps.push({
    values: [...recorder.values],
    target: recorder.target,
    active: [...(options.active ?? [])],
    checked: [...(options.checked ?? [])].sort((left, right) => left - right),
    discarded: [...(options.discarded ?? [])].sort((left, right) => left - right),
    foundIndex: options.foundIndex,
    window: options.window,
    stageId: options.stageId,
    description: options.description,
    metrics: { ...recorder.metrics },
  });
}

function buildRun(
  algorithm: SearchingAlgorithmId,
  recorder: Recorder,
  resultIndex: number,
  inputNote?: string,
): SearchRun {
  const meta = algorithmMeta[algorithm];

  return {
    algorithm,
    label: meta.label,
    complexity: meta.complexity,
    blurb: meta.blurb,
    steps: recorder.steps,
    target: recorder.target,
    resultIndex,
    inputNote,
    summary: {
      ...recorder.metrics,
      totalSteps: recorder.steps.length,
      resultIndex,
    },
  };
}

function runLinearSearch(values: number[], target: number) {
  const recorder = createRecorder(values, target);
  const checked = new Set<number>();

  snapshot(recorder, {
    stageId: "prepare",
    description: `Start linear search for ${target}. The algorithm will inspect values from left to right.`,
  });

  for (let index = 0; index < recorder.values.length; index += 1) {
    recorder.metrics.iterations += 1;
    recorder.metrics.checks += 1;

    snapshot(recorder, {
      stageId: "inspect",
      active: [index],
      checked,
      description: `Check index ${index}. Is ${recorder.values[index]} equal to ${target}?`,
    });

    checked.add(index);

    if (recorder.values[index] === target) {
      recorder.metrics.found = true;
      snapshot(recorder, {
        stageId: "found",
        active: [index],
        checked,
        foundIndex: index,
        description: `Target found at index ${index}.`,
      });

      return buildRun("linear", recorder, index);
    }

    snapshot(recorder, {
      stageId: "advance",
      checked,
      description: `Target not at index ${index}, so move to the next value.`,
    });
  }

  snapshot(recorder, {
    stageId: "complete",
    checked: recorder.values.map((_, index) => index),
    description: `Linear search finished without finding ${target}.`,
  });

  return buildRun("linear", recorder, -1);
}

function runBinarySearch(values: number[], target: number) {
  const sortedValues = [...values].sort((left, right) => left - right);
  const wasAlreadySorted = values.every((value, index) => value === sortedValues[index]);
  const inputNote = wasAlreadySorted
    ? undefined
    : "Binary search needs sorted input, so the list was sorted before the search started.";
  const recorder = createRecorder(sortedValues, target);
  const checked = new Set<number>();
  const discarded = new Set<number>();
  let left = 0;
  let right = recorder.values.length - 1;

  snapshot(recorder, {
    stageId: "prepare",
    window: { left, right },
    description: inputNote
      ? `${inputNote} Now search for ${target} by repeatedly halving the remaining range.`
      : `Start binary search for ${target}. The active search range covers the full sorted list.`,
  });

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const middleValue = recorder.values[middle]!;
    recorder.metrics.iterations += 1;
    recorder.metrics.checks += 1;
    checked.add(middle);

    snapshot(recorder, {
      stageId: "inspect",
      active: [middle],
      checked,
      discarded,
      window: { left, right },
      description: `Check the middle value ${middleValue} at index ${middle}.`,
    });

    if (middleValue === target) {
      recorder.metrics.found = true;
      snapshot(recorder, {
        stageId: "found",
        active: [middle],
        checked,
        discarded,
        window: { left, right },
        foundIndex: middle,
        description: `Target found at index ${middle}.`,
      });

      return buildRun("binary", recorder, middle, inputNote);
    }

    if (middleValue < target) {
      for (let index = left; index <= middle; index += 1) {
        discarded.add(index);
      }
      left = middle + 1;

      snapshot(recorder, {
        stageId: "narrow",
        checked,
        discarded,
        window: left <= right ? { left, right } : undefined,
        description: `${middleValue} is smaller than ${target}, so search the right half.`,
      });
      continue;
    }

    for (let index = middle; index <= right; index += 1) {
      discarded.add(index);
    }
    right = middle - 1;

    snapshot(recorder, {
      stageId: "narrow",
      checked,
      discarded,
      window: left <= right ? { left, right } : undefined,
      description: `${middleValue} is larger than ${target}, so search the left half.`,
    });
  }

  snapshot(recorder, {
    stageId: "complete",
    checked,
    discarded: recorder.values.map((_, index) => index),
    description: `Binary search finished without finding ${target}.`,
  });

  return buildRun("binary", recorder, -1, inputNote);
}

export function runSearchingAlgorithm(
  algorithm: SearchingAlgorithmId,
  values: number[],
  target: number,
) {
  switch (algorithm) {
    case "linear":
      return runLinearSearch(values, target);
    case "binary":
      return runBinarySearch(values, target);
  }
}
