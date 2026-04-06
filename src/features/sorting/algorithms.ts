import type {
  SortMetrics,
  SortRun,
  SortStep,
  SortingAlgorithmId,
} from "./types";

type SnapshotOptions = {
  active?: number[];
  compared?: number[];
  sorted?: Iterable<number>;
  pivot?: number;
  stageId?: string;
  description: string;
};

type Recorder = {
  values: number[];
  steps: SortStep[];
  metrics: SortMetrics;
};

const algorithmMeta: Record<
  SortingAlgorithmId,
  { label: string; complexity: string; blurb: string }
> = {
  bubble: {
    label: "Bubble Sort",
    complexity: "O(n^2)",
    blurb: "Simple adjacent swaps make this a great teaching algorithm for local comparisons.",
  },
  insertion: {
    label: "Insertion Sort",
    complexity: "O(n^2)",
    blurb: "Builds a sorted prefix by shifting larger values to the right until the key fits.",
  },
  selection: {
    label: "Selection Sort",
    complexity: "O(n^2)",
    blurb: "Repeatedly selects the smallest remaining value and places it into the next final slot.",
  },
  merge: {
    label: "Merge Sort",
    complexity: "O(n log n)",
    blurb: "Splits the list recursively and merges sorted halves back together with stable writes.",
  },
  quick: {
    label: "Quick Sort",
    complexity: "O(n log n) average",
    blurb: "Partitions around pivots and tends to perform very well in practice for in-memory arrays.",
  },
};

function valueAt(values: number[], index: number) {
  return values[index]!;
}

function createRecorder(values: number[]) {
  return {
    values: [...values],
    steps: [],
    metrics: {
      comparisons: 0,
      swaps: 0,
      writes: 0,
    },
  } satisfies Recorder;
}

function snapshot(recorder: Recorder, options: SnapshotOptions) {
  recorder.steps.push({
    values: [...recorder.values],
    active: [...(options.active ?? [])],
    compared: [...(options.compared ?? [])],
    sorted: [...(options.sorted ?? [])].sort((left, right) => left - right),
    pivot: options.pivot,
    stageId: options.stageId,
    description: options.description,
    metrics: { ...recorder.metrics },
  });
}

function buildRun(
  algorithm: SortingAlgorithmId,
  recorder: Recorder,
  values: number[],
): SortRun {
  const meta = algorithmMeta[algorithm];
  return {
    algorithm,
    label: meta.label,
    complexity: meta.complexity,
    blurb: meta.blurb,
    steps: recorder.steps,
    result: [...values].sort((left, right) => left - right),
    summary: {
      ...recorder.metrics,
      totalSteps: recorder.steps.length,
    },
  };
}

function runBubbleSort(values: number[]) {
  const recorder = createRecorder(values);
  const sorted = new Set<number>();

  snapshot(recorder, {
    stageId: "compare",
    description: "Initial state. Bubble sort will compare adjacent values and float larger ones rightward.",
  });

  for (let i = 0; i < recorder.values.length; i += 1) {
    let swapped = false;

    for (let j = 0; j < recorder.values.length - i - 1; j += 1) {
      recorder.metrics.comparisons += 1;
      snapshot(recorder, {
        stageId: "compare",
        compared: [j, j + 1],
        sorted,
        description: `Compare ${valueAt(recorder.values, j)} and ${valueAt(recorder.values, j + 1)}.`,
      });

      if (valueAt(recorder.values, j) > valueAt(recorder.values, j + 1)) {
        const leftValue = valueAt(recorder.values, j);
        const rightValue = valueAt(recorder.values, j + 1);
        recorder.values[j] = rightValue;
        recorder.values[j + 1] = leftValue;
        recorder.metrics.swaps += 1;
        recorder.metrics.writes += 2;
        swapped = true;

        snapshot(recorder, {
          stageId: "swap",
          active: [j, j + 1],
          compared: [j, j + 1],
          sorted,
          description: `Swap to move ${valueAt(recorder.values, j + 1)} toward its final position.`,
        });
      }
    }

    sorted.add(recorder.values.length - i - 1);
    snapshot(recorder, {
      stageId: "lock",
      sorted,
      description: `Position ${recorder.values.length - i} is now locked in.`,
    });

    if (!swapped) {
      for (let index = 0; index < recorder.values.length - i - 1; index += 1) {
        sorted.add(index);
      }
      snapshot(recorder, {
        stageId: "complete",
        sorted,
        description: "No swaps were needed in this pass, so the list is fully sorted.",
      });
      break;
    }
  }

  return buildRun("bubble", recorder, values);
}

function runInsertionSort(values: number[]) {
  const recorder = createRecorder(values);
  const sorted = new Set<number>();

  snapshot(recorder, {
    stageId: "select",
    description: "Initial state. Insertion sort will grow a sorted prefix from left to right.",
  });

  if (recorder.values.length > 0) {
    sorted.add(0);
  }

  for (let i = 1; i < recorder.values.length; i += 1) {
    const key = valueAt(recorder.values, i);
    let j = i - 1;

    snapshot(recorder, {
      stageId: "select",
      active: [i],
      sorted,
      description: `Lift ${key} and slide it left until it fits inside the sorted prefix.`,
    });

    while (j >= 0) {
      recorder.metrics.comparisons += 1;
      snapshot(recorder, {
        stageId: "compare",
        compared: [j, j + 1],
        sorted,
        description: `Compare ${key} with ${valueAt(recorder.values, j)}.`,
      });

      if (valueAt(recorder.values, j) <= key) {
        break;
      }

      recorder.values[j + 1] = valueAt(recorder.values, j);
      recorder.metrics.writes += 1;
      snapshot(recorder, {
        stageId: "shift",
        active: [j, j + 1],
        compared: [j, j + 1],
        sorted,
        description: `Shift ${valueAt(recorder.values, j)} one slot to the right.`,
      });
      j -= 1;
    }

    recorder.values[j + 1] = key;
    recorder.metrics.writes += 1;
    for (let index = 0; index <= i; index += 1) {
      sorted.add(index);
    }
    snapshot(recorder, {
      stageId: "insert",
      active: [j + 1],
      sorted,
      description: `Insert ${key} at index ${j + 1}.`,
    });
  }

  snapshot(recorder, {
    stageId: "complete",
    sorted: recorder.values.map((_, index) => index),
    description: "Insertion sort finished with every prefix merged into one ordered list.",
  });

  return buildRun("insertion", recorder, values);
}

function runSelectionSort(values: number[]) {
  const recorder = createRecorder(values);
  const sorted = new Set<number>();

  snapshot(recorder, {
    stageId: "scan",
    description: "Initial state. Selection sort scans for the minimum unsorted value on each round.",
  });

  for (let i = 0; i < recorder.values.length; i += 1) {
    let minIndex = i;

    snapshot(recorder, {
      stageId: "scan",
      active: [i],
      sorted,
      description: `Start a new scan from index ${i}.`,
    });

    for (let j = i + 1; j < recorder.values.length; j += 1) {
      recorder.metrics.comparisons += 1;
      snapshot(recorder, {
        stageId: "scan",
        active: [minIndex],
        compared: [j, minIndex],
        sorted,
        description: `Check whether ${valueAt(recorder.values, j)} is smaller than the current minimum ${valueAt(recorder.values, minIndex)}.`,
      });

      if (valueAt(recorder.values, j) < valueAt(recorder.values, minIndex)) {
        minIndex = j;
        snapshot(recorder, {
          stageId: "candidate",
          active: [minIndex],
          sorted,
          description: `${valueAt(recorder.values, minIndex)} becomes the new minimum candidate.`,
        });
      }
    }

    if (minIndex !== i) {
      const leftValue = valueAt(recorder.values, i);
      const minimumValue = valueAt(recorder.values, minIndex);
      recorder.values[i] = minimumValue;
      recorder.values[minIndex] = leftValue;
      recorder.metrics.swaps += 1;
      recorder.metrics.writes += 2;
      snapshot(recorder, {
        stageId: "swap",
        active: [i, minIndex],
        sorted,
        description: `Swap the minimum value into slot ${i}.`,
      });
    }

    sorted.add(i);
    snapshot(recorder, {
      stageId: "lock",
      sorted,
      description: `Index ${i} is now part of the sorted prefix.`,
    });
  }

  return buildRun("selection", recorder, values);
}

function runMergeSort(values: number[]) {
  const recorder = createRecorder(values);

  snapshot(recorder, {
    stageId: "split",
    description: "Initial state. Merge sort will split the array into smaller pieces before merging them back together.",
  });

  function mergeSortRecursive(left: number, right: number) {
    if (left >= right) {
      return;
    }

    const mid = Math.floor((left + right) / 2);
    mergeSortRecursive(left, mid);
    mergeSortRecursive(mid + 1, right);
    merge(left, mid, right);
  }

  function merge(left: number, mid: number, right: number) {
    const leftSlice = recorder.values.slice(left, mid + 1);
    const rightSlice = recorder.values.slice(mid + 1, right + 1);
    let leftIndex = 0;
    let rightIndex = 0;
    let writeIndex = left;

    while (leftIndex < leftSlice.length && rightIndex < rightSlice.length) {
      recorder.metrics.comparisons += 1;
      const leftPosition = left + leftIndex;
      const rightPosition = mid + 1 + rightIndex;

      snapshot(recorder, {
        stageId: "compare",
        compared: [leftPosition, rightPosition],
        description: `Compare ${leftSlice[leftIndex]!} and ${rightSlice[rightIndex]!} while merging the range ${left + 1}-${right + 1}.`,
      });

      if (leftSlice[leftIndex]! <= rightSlice[rightIndex]!) {
        recorder.values[writeIndex] = leftSlice[leftIndex]!;
        leftIndex += 1;
      } else {
        recorder.values[writeIndex] = rightSlice[rightIndex]!;
        rightIndex += 1;
      }

      recorder.metrics.writes += 1;
      snapshot(recorder, {
        stageId: "write",
        active: [writeIndex],
        description: `Write the next merged value into index ${writeIndex}.`,
      });

      writeIndex += 1;
    }

    while (leftIndex < leftSlice.length) {
      recorder.values[writeIndex] = leftSlice[leftIndex]!;
      recorder.metrics.writes += 1;
      snapshot(recorder, {
        stageId: "write",
        active: [writeIndex],
        description: `Copy remaining left-side value ${leftSlice[leftIndex]!} into the merged range.`,
      });
      leftIndex += 1;
      writeIndex += 1;
    }

    while (rightIndex < rightSlice.length) {
      recorder.values[writeIndex] = rightSlice[rightIndex]!;
      recorder.metrics.writes += 1;
      snapshot(recorder, {
        stageId: "write",
        active: [writeIndex],
        description: `Copy remaining right-side value ${rightSlice[rightIndex]!} into the merged range.`,
      });
      rightIndex += 1;
      writeIndex += 1;
    }
  }

  mergeSortRecursive(0, recorder.values.length - 1);

  snapshot(recorder, {
    stageId: "complete",
    sorted: recorder.values.map((_, index) => index),
    description: "All sublists have been merged back into one globally sorted array.",
  });

  return buildRun("merge", recorder, values);
}

function runQuickSort(values: number[]) {
  const recorder = createRecorder(values);
  const sorted = new Set<number>();

  snapshot(recorder, {
    stageId: "pivot",
    description: "Initial state. Quick sort will partition around pivots and recurse on both sides.",
  });

  function quickSortRecursive(low: number, high: number) {
    if (low > high) {
      return;
    }

    if (low === high) {
      sorted.add(low);
      snapshot(recorder, {
        stageId: "settle",
        sorted,
        description: `Index ${low} contains a single value, so it is already sorted.`,
      });
      return;
    }

    const pivotIndex = partition(low, high);
    sorted.add(pivotIndex);

    snapshot(recorder, {
      stageId: "settle",
      pivot: pivotIndex,
      sorted,
      description: `${valueAt(recorder.values, pivotIndex)} lands in its final pivot position.`,
    });

    quickSortRecursive(low, pivotIndex - 1);
    quickSortRecursive(pivotIndex + 1, high);
  }

  function partition(low: number, high: number) {
    const pivotValue = valueAt(recorder.values, high);
    let smallerIndex = low;

    snapshot(recorder, {
      stageId: "pivot",
      pivot: high,
      active: [high],
      sorted,
      description: `Choose ${pivotValue} as the pivot for the range ${low + 1}-${high + 1}.`,
    });

    for (let scan = low; scan < high; scan += 1) {
      recorder.metrics.comparisons += 1;
      snapshot(recorder, {
        stageId: "compare",
        pivot: high,
        compared: [scan, high],
        sorted,
        description: `Compare ${valueAt(recorder.values, scan)} against the pivot ${pivotValue}.`,
      });

      if (valueAt(recorder.values, scan) <= pivotValue) {
        if (smallerIndex !== scan) {
          const smallerValue = valueAt(recorder.values, smallerIndex);
          const scanValue = valueAt(recorder.values, scan);
          recorder.values[smallerIndex] = scanValue;
          recorder.values[scan] = smallerValue;
          recorder.metrics.swaps += 1;
          recorder.metrics.writes += 2;

          snapshot(recorder, {
            stageId: "partition",
            active: [smallerIndex, scan],
            pivot: high,
            sorted,
            description: `Move ${valueAt(recorder.values, smallerIndex)} into the left partition.`,
          });
        }

        smallerIndex += 1;
      }
    }

    const smallerValue = valueAt(recorder.values, smallerIndex);
    recorder.values[smallerIndex] = valueAt(recorder.values, high);
    recorder.values[high] = smallerValue;
    recorder.metrics.swaps += 1;
    recorder.metrics.writes += 2;

    snapshot(recorder, {
      stageId: "settle",
      active: [smallerIndex, high],
      pivot: smallerIndex,
      sorted,
      description: `Place the pivot between the lower and higher partitions.`,
    });

    return smallerIndex;
  }

  quickSortRecursive(0, recorder.values.length - 1);

  snapshot(recorder, {
    stageId: "complete",
    sorted: recorder.values.map((_, index) => index),
    description: "Every pivot partition has resolved, leaving the full array sorted.",
  });

  return buildRun("quick", recorder, values);
}

const algorithmRunners: Record<SortingAlgorithmId, (values: number[]) => SortRun> = {
  bubble: runBubbleSort,
  insertion: runInsertionSort,
  selection: runSelectionSort,
  merge: runMergeSort,
  quick: runQuickSort,
};

export const sortingOptions = Object.entries(algorithmMeta).map(
  ([id, value]) => ({
    id: id as SortingAlgorithmId,
    ...value,
  }),
);

export function runSortingAlgorithm(
  algorithm: SortingAlgorithmId,
  values: number[],
) {
  return algorithmRunners[algorithm](values);
}
