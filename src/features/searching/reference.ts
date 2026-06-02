import type { CodeReference } from "../../types/codeReference";
import type { SearchingAlgorithmId } from "./types";

export const searchingReferences: Record<SearchingAlgorithmId, CodeReference> = {
  linear: {
    title: "Linear Search",
    summary:
      "Linear search walks through the list one value at a time until it finds the target or reaches the end.",
    stages: [
      {
        id: "prepare",
        title: "Prepare the scan",
        description:
          "The algorithm begins at the first element and plans to inspect values from left to right.",
      },
      {
        id: "inspect",
        title: "Inspect current value",
        description:
          "The current index is compared directly with the target value.",
      },
      {
        id: "advance",
        title: "Move forward",
        description:
          "If the current value is not the target, the search advances to the next index.",
      },
      {
        id: "found",
        title: "Return match",
        description:
          "Once the target is found, the algorithm returns the matching index immediately.",
      },
      {
        id: "complete",
        title: "Finish without match",
        description:
          "If every value is checked and none match the target, the search ends with no result.",
      },
    ],
    snippets: [
      {
        language: "typescript",
        label: "TypeScript",
        code: `function linearSearch(values: number[], target: number) {
  for (let index = 0; index < values.length; index += 1) {
    if (values[index] === target) {
      return index;
    }
  }

  return -1;
}`,
      },
      {
        language: "python",
        label: "Python",
        code: `def linear_search(values: list[int], target: int) -> int:
    for index, value in enumerate(values):
        if value == target:
            return index

    return -1`,
      },
      {
        language: "java",
        label: "Java",
        code: `static int linearSearch(int[] values, int target) {
    for (int index = 0; index < values.length; index++) {
        if (values[index] == target) {
            return index;
        }
    }

    return -1;
}`,
      },
      {
        language: "cpp",
        label: "C++",
        code: `using namespace std;

int linearSearch(const vector<int>& values, int target) {
    for (int index = 0; index < static_cast<int>(values.size()); ++index) {
        if (values[index] == target) {
            return index;
        }
    }

    return -1;
}`,
      },
    ],
  },
  binary: {
    title: "Binary Search",
    summary:
      "Binary search works on sorted data by checking the middle value and cutting the remaining search range in half each round.",
    stages: [
      {
        id: "prepare",
        title: "Prepare sorted input",
        description:
          "The algorithm starts with a sorted list and an active range spanning the full array.",
      },
      {
        id: "inspect",
        title: "Inspect middle value",
        description:
          "The middle index is compared with the target to decide whether to stop or narrow the range.",
      },
      {
        id: "narrow",
        title: "Discard half",
        description:
          "One half of the current range is eliminated because it cannot contain the target.",
      },
      {
        id: "found",
        title: "Return match",
        description:
          "If the middle value matches the target, the algorithm returns that index.",
      },
      {
        id: "complete",
        title: "Finish without match",
        description:
          "If the active range becomes empty, the target is not present in the list.",
      },
    ],
    snippets: [
      {
        language: "typescript",
        label: "TypeScript",
        code: `function binarySearch(values: number[], target: number) {
  let left = 0;
  let right = values.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    if (values[middle] === target) {
      return middle;
    }

    if (values[middle] < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}`,
      },
      {
        language: "python",
        label: "Python",
        code: `def binary_search(values: list[int], target: int) -> int:
    left = 0
    right = len(values) - 1

    while left <= right:
        middle = (left + right) // 2

        if values[middle] == target:
            return middle

        if values[middle] < target:
            left = middle + 1
        else:
            right = middle - 1

    return -1`,
      },
      {
        language: "java",
        label: "Java",
        code: `static int binarySearch(int[] values, int target) {
    int left = 0;
    int right = values.length - 1;

    while (left <= right) {
        int middle = (left + right) / 2;

        if (values[middle] == target) {
            return middle;
        }

        if (values[middle] < target) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    return -1;
}`,
      },
      {
        language: "cpp",
        label: "C++",
        code: `using namespace std;

int binarySearch(const vector<int>& values, int target) {
    int left = 0;
    int right = static_cast<int>(values.size()) - 1;

    while (left <= right) {
        int middle = (left + right) / 2;

        if (values[middle] == target) {
            return middle;
        }

        if (values[middle] < target) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    return -1;
}`,
      },
    ],
  },
};
