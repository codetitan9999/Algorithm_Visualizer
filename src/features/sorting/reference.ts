import type { CodeReference } from "../../types/codeReference";
import type { SortingAlgorithmId } from "./types";

export const sortingReferences: Record<SortingAlgorithmId, CodeReference> = {
  bubble: {
    title: "Bubble Sort Reference",
    summary:
      "Compare adjacent values, swap when they are out of order, and stop early once a full pass completes without changes.",
    stages: [
      {
        id: "compare",
        title: "Compare neighbors",
        description:
          "The inner loop checks the current pair and decides whether the larger value needs to move right.",
      },
      {
        id: "swap",
        title: "Swap values",
        description:
          "When a pair is inverted, both elements are exchanged so the larger value continues bubbling toward the end.",
      },
      {
        id: "lock",
        title: "Lock sorted suffix",
        description:
          "After each outer pass, the far-right boundary is confirmed and no longer needs to be revisited.",
      },
      {
        id: "complete",
        title: "Finish early",
        description:
          "If a full pass makes no swaps, the sequence is already sorted and execution can stop immediately.",
      },
    ],
    snippets: [
      {
        language: "typescript",
        label: "TypeScript",
        code: `function bubbleSort(values: number[]) {
  const items = [...values];

  for (let end = items.length - 1; end > 0; end -= 1) {
    let swapped = false;

    for (let index = 0; index < end; index += 1) {
      if (items[index] > items[index + 1]) {
        [items[index], items[index + 1]] = [items[index + 1], items[index]];
        swapped = true;
      }
    }

    if (!swapped) {
      break;
    }
  }

  return items;
}`,
      },
      {
        language: "python",
        label: "Python",
        code: `def bubble_sort(values: list[int]) -> list[int]:
    items = values[:]

    for end in range(len(items) - 1, 0, -1):
        swapped = False

        for index in range(end):
            if items[index] > items[index + 1]:
                items[index], items[index + 1] = items[index + 1], items[index]
                swapped = True

        if not swapped:
            break

    return items`,
      },
      {
        language: "java",
        label: "Java",
        code: `static int[] bubbleSort(int[] values) {
    int[] items = values.clone();

    for (int end = items.length - 1; end > 0; end--) {
        boolean swapped = false;

        for (int index = 0; index < end; index++) {
            if (items[index] > items[index + 1]) {
                int temp = items[index];
                items[index] = items[index + 1];
                items[index + 1] = temp;
                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }
    }

    return items;
}`,
      },
      {
        language: "cpp",
        label: "C++",
        code: `using namespace std;

vector<int> bubbleSort(vector<int> values) {
    for (int end = static_cast<int>(values.size()) - 1; end > 0; --end) {
        bool swapped = false;

        for (int index = 0; index < end; ++index) {
            if (values[index] > values[index + 1]) {
                swap(values[index], values[index + 1]);
                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }
    }

    return values;
}`,
      },
    ],
  },
  insertion: {
    title: "Insertion Sort Reference",
    summary:
      "Lift one value at a time, shift larger items rightward, and insert the key where the ordered prefix stays intact.",
    stages: [
      {
        id: "select",
        title: "Select key",
        description:
          "The algorithm takes the next unsorted value and prepares to place it into the ordered region on the left.",
      },
      {
        id: "compare",
        title: "Compare against prefix",
        description:
          "The key is tested against values in the sorted prefix until the correct insertion boundary is found.",
      },
      {
        id: "shift",
        title: "Shift larger values",
        description:
          "Items greater than the key move one position to the right, opening space for the insertion.",
      },
      {
        id: "insert",
        title: "Insert key",
        description:
          "Once the correct position is found, the key is written back into the array and the prefix grows.",
      },
      {
        id: "complete",
        title: "Merge all prefixes",
        description:
          "When every key has been placed, the entire sequence has become one ordered prefix.",
      },
    ],
    snippets: [
      {
        language: "typescript",
        label: "TypeScript",
        code: `function insertionSort(values: number[]) {
  const items = [...values];

  for (let index = 1; index < items.length; index += 1) {
    const key = items[index];
    let cursor = index - 1;

    while (cursor >= 0 && items[cursor] > key) {
      items[cursor + 1] = items[cursor];
      cursor -= 1;
    }

    items[cursor + 1] = key;
  }

  return items;
}`,
      },
      {
        language: "python",
        label: "Python",
        code: `def insertion_sort(values: list[int]) -> list[int]:
    items = values[:]

    for index in range(1, len(items)):
        key = items[index]
        cursor = index - 1

        while cursor >= 0 and items[cursor] > key:
            items[cursor + 1] = items[cursor]
            cursor -= 1

        items[cursor + 1] = key

    return items`,
      },
      {
        language: "java",
        label: "Java",
        code: `static int[] insertionSort(int[] values) {
    int[] items = values.clone();

    for (int index = 1; index < items.length; index++) {
        int key = items[index];
        int cursor = index - 1;

        while (cursor >= 0 && items[cursor] > key) {
            items[cursor + 1] = items[cursor];
            cursor--;
        }

        items[cursor + 1] = key;
    }

    return items;
}`,
      },
      {
        language: "cpp",
        label: "C++",
        code: `using namespace std;

vector<int> insertionSort(vector<int> values) {
    for (int index = 1; index < static_cast<int>(values.size()); ++index) {
        int key = values[index];
        int cursor = index - 1;

        while (cursor >= 0 && values[cursor] > key) {
            values[cursor + 1] = values[cursor];
            --cursor;
        }

        values[cursor + 1] = key;
    }

    return values;
}`,
      },
    ],
  },
  selection: {
    title: "Selection Sort Reference",
    summary:
      "Scan the remaining suffix for the smallest value, then place it into the next finalized position.",
    stages: [
      {
        id: "scan",
        title: "Scan unsorted region",
        description:
          "Each pass examines the unsorted suffix to locate the smallest remaining candidate.",
      },
      {
        id: "candidate",
        title: "Update minimum candidate",
        description:
          "When a lower value is discovered, its index becomes the new best candidate for the current slot.",
      },
      {
        id: "swap",
        title: "Place minimum",
        description:
          "The smallest discovered value is swapped into the current front boundary of the unsorted region.",
      },
      {
        id: "lock",
        title: "Advance boundary",
        description:
          "After the swap, that position is finalized and the next pass begins one index to the right.",
      },
    ],
    snippets: [
      {
        language: "typescript",
        label: "TypeScript",
        code: `function selectionSort(values: number[]) {
  const items = [...values];

  for (let start = 0; start < items.length; start += 1) {
    let minIndex = start;

    for (let scan = start + 1; scan < items.length; scan += 1) {
      if (items[scan] < items[minIndex]) {
        minIndex = scan;
      }
    }

    if (minIndex !== start) {
      [items[start], items[minIndex]] = [items[minIndex], items[start]];
    }
  }

  return items;
}`,
      },
      {
        language: "python",
        label: "Python",
        code: `def selection_sort(values: list[int]) -> list[int]:
    items = values[:]

    for start in range(len(items)):
        min_index = start

        for scan in range(start + 1, len(items)):
            if items[scan] < items[min_index]:
                min_index = scan

        items[start], items[min_index] = items[min_index], items[start]

    return items`,
      },
      {
        language: "java",
        label: "Java",
        code: `static int[] selectionSort(int[] values) {
    int[] items = values.clone();

    for (int start = 0; start < items.length; start++) {
        int minIndex = start;

        for (int scan = start + 1; scan < items.length; scan++) {
            if (items[scan] < items[minIndex]) {
                minIndex = scan;
            }
        }

        int temp = items[start];
        items[start] = items[minIndex];
        items[minIndex] = temp;
    }

    return items;
}`,
      },
      {
        language: "cpp",
        label: "C++",
        code: `using namespace std;

vector<int> selectionSort(vector<int> values) {
    for (int start = 0; start < static_cast<int>(values.size()); ++start) {
        int minIndex = start;

        for (int scan = start + 1; scan < static_cast<int>(values.size()); ++scan) {
            if (values[scan] < values[minIndex]) {
                minIndex = scan;
            }
        }

        swap(values[start], values[minIndex]);
    }

    return values;
}`,
      },
    ],
  },
  merge: {
    title: "Merge Sort Reference",
    summary:
      "Split the sequence recursively, then merge sorted halves back together by repeatedly writing the smaller front value.",
    stages: [
      {
        id: "split",
        title: "Split into halves",
        description:
          "The recursive phase keeps dividing the array until each subproblem becomes a single value.",
      },
      {
        id: "compare",
        title: "Compare front elements",
        description:
          "During merge, the algorithm compares the leading values of each sorted half to decide the next write.",
      },
      {
        id: "write",
        title: "Write merged output",
        description:
          "The chosen value is copied into the merged range, and any remaining tail values are appended afterward.",
      },
      {
        id: "complete",
        title: "Resolve full range",
        description:
          "Once the top-level merge finishes, the entire array has been rebuilt in sorted order.",
      },
    ],
    snippets: [
      {
        language: "typescript",
        label: "TypeScript",
        code: `function mergeSort(values: number[]): number[] {
  if (values.length <= 1) {
    return values.slice();
  }

  const middle = Math.floor(values.length / 2);
  const left = mergeSort(values.slice(0, middle));
  const right = mergeSort(values.slice(middle));

  return merge(left, right);
}

function merge(left: number[], right: number[]) {
  const merged: number[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      merged.push(left[leftIndex++]);
    } else {
      merged.push(right[rightIndex++]);
    }
  }

  return merged.concat(left.slice(leftIndex), right.slice(rightIndex));
}`,
      },
      {
        language: "python",
        label: "Python",
        code: `def merge_sort(values: list[int]) -> list[int]:
    if len(values) <= 1:
        return values[:]

    middle = len(values) // 2
    left = merge_sort(values[:middle])
    right = merge_sort(values[middle:])

    return merge(left, right)

def merge(left: list[int], right: list[int]) -> list[int]:
    merged: list[int] = []
    left_index = 0
    right_index = 0

    while left_index < len(left) and right_index < len(right):
        if left[left_index] <= right[right_index]:
            merged.append(left[left_index])
            left_index += 1
        else:
            merged.append(right[right_index])
            right_index += 1

    return merged + left[left_index:] + right[right_index:]`,
      },
      {
        language: "java",
        label: "Java",
        code: `static int[] mergeSort(int[] values) {
    if (values.length <= 1) {
        return values.clone();
    }

    int middle = values.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(values, 0, middle));
    int[] right = mergeSort(Arrays.copyOfRange(values, middle, values.length));

    return merge(left, right);
}

static int[] merge(int[] left, int[] right) {
    int[] merged = new int[left.length + right.length];
    int leftIndex = 0;
    int rightIndex = 0;
    int writeIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        merged[writeIndex++] =
            left[leftIndex] <= right[rightIndex] ? left[leftIndex++] : right[rightIndex++];
    }

    while (leftIndex < left.length) merged[writeIndex++] = left[leftIndex++];
    while (rightIndex < right.length) merged[writeIndex++] = right[rightIndex++];
    return merged;
}`,
      },
      {
        language: "cpp",
        label: "C++",
        code: `using namespace std;

vector<int> mergeSort(const vector<int>& values) {
    if (values.size() <= 1) {
        return values;
    }

    const auto middle = values.size() / 2;
    vector<int> left(values.begin(), values.begin() + middle);
    vector<int> right(values.begin() + middle, values.end());

    return merge(mergeSort(left), mergeSort(right));
}

vector<int> merge(const vector<int>& left, const vector<int>& right) {
    vector<int> merged;
    size_t leftIndex = 0;
    size_t rightIndex = 0;

    while (leftIndex < left.size() && rightIndex < right.size()) {
        if (left[leftIndex] <= right[rightIndex]) {
            merged.push_back(left[leftIndex++]);
        } else {
            merged.push_back(right[rightIndex++]);
        }
    }

    merged.insert(merged.end(), left.begin() + leftIndex, left.end());
    merged.insert(merged.end(), right.begin() + rightIndex, right.end());
    return merged;
}`,
      },
    ],
  },
  quick: {
    title: "Quick Sort Reference",
    summary:
      "Select a pivot, partition the current range into lower and higher segments, then recurse on both sides.",
    stages: [
      {
        id: "pivot",
        title: "Choose pivot",
        description:
          "The current range selects a pivot value that becomes the reference point for partitioning.",
      },
      {
        id: "compare",
        title: "Compare against pivot",
        description:
          "Each scanned value is tested against the pivot to decide whether it belongs in the left partition.",
      },
      {
        id: "partition",
        title: "Partition range",
        description:
          "Values less than or equal to the pivot are compacted toward the left side of the range.",
      },
      {
        id: "settle",
        title: "Settle pivot",
        description:
          "The pivot is placed at the boundary between partitions, locking one final position before recursion continues.",
      },
      {
        id: "complete",
        title: "Resolve all partitions",
        description:
          "When every partition collapses to one value, the entire array is sorted.",
      },
    ],
    snippets: [
      {
        language: "typescript",
        label: "TypeScript",
        code: `function quickSort(values: number[]) {
  const items = [...values];
  sortRange(items, 0, items.length - 1);
  return items;
}

function sortRange(items: number[], low: number, high: number) {
  if (low >= high) {
    return;
  }

  const pivotIndex = partition(items, low, high);
  sortRange(items, low, pivotIndex - 1);
  sortRange(items, pivotIndex + 1, high);
}

function partition(items: number[], low: number, high: number) {
  const pivot = items[high];
  let boundary = low;

  for (let scan = low; scan < high; scan += 1) {
    if (items[scan] <= pivot) {
      [items[boundary], items[scan]] = [items[scan], items[boundary]];
      boundary += 1;
    }
  }

  [items[boundary], items[high]] = [items[high], items[boundary]];
  return boundary;
}`,
      },
      {
        language: "python",
        label: "Python",
        code: `def quick_sort(values: list[int]) -> list[int]:
    items = values[:]
    sort_range(items, 0, len(items) - 1)
    return items

def sort_range(items: list[int], low: int, high: int) -> None:
    if low >= high:
        return

    pivot_index = partition(items, low, high)
    sort_range(items, low, pivot_index - 1)
    sort_range(items, pivot_index + 1, high)

def partition(items: list[int], low: int, high: int) -> int:
    pivot = items[high]
    boundary = low

    for scan in range(low, high):
        if items[scan] <= pivot:
            items[boundary], items[scan] = items[scan], items[boundary]
            boundary += 1

    items[boundary], items[high] = items[high], items[boundary]
    return boundary`,
      },
      {
        language: "java",
        label: "Java",
        code: `static int[] quickSort(int[] values) {
    int[] items = values.clone();
    sortRange(items, 0, items.length - 1);
    return items;
}

static void sortRange(int[] items, int low, int high) {
    if (low >= high) {
        return;
    }

    int pivotIndex = partition(items, low, high);
    sortRange(items, low, pivotIndex - 1);
    sortRange(items, pivotIndex + 1, high);
}

static int partition(int[] items, int low, int high) {
    int pivot = items[high];
    int boundary = low;

    for (int scan = low; scan < high; scan++) {
        if (items[scan] <= pivot) {
            int temp = items[boundary];
            items[boundary] = items[scan];
            items[scan] = temp;
            boundary++;
        }
    }

    int temp = items[boundary];
    items[boundary] = items[high];
    items[high] = temp;
    return boundary;
}`,
      },
      {
        language: "cpp",
        label: "C++",
        code: `using namespace std;

vector<int> quickSort(vector<int> values) {
    sortRange(values, 0, static_cast<int>(values.size()) - 1);
    return values;
}

void sortRange(vector<int>& values, int low, int high) {
    if (low >= high) {
        return;
    }

    const int pivotIndex = partition(values, low, high);
    sortRange(values, low, pivotIndex - 1);
    sortRange(values, pivotIndex + 1, high);
}

int partition(vector<int>& values, int low, int high) {
    const int pivot = values[high];
    int boundary = low;

    for (int scan = low; scan < high; ++scan) {
        if (values[scan] <= pivot) {
            swap(values[boundary], values[scan]);
            ++boundary;
        }
    }

    swap(values[boundary], values[high]);
    return boundary;
}`,
      },
    ],
  },
};
