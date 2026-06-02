# Testing Strategy

This document describes the current testing approach for Algorithm Visualizer.

## 1. Testing Goals

The project emphasizes correctness of algorithm behavior and stability of the
execution timeline model.

The most important things to verify are:

- each algorithm produces the expected result
- the generated timeline is not empty
- summary values match the returned steps
- equivalent algorithms agree on shared outcomes where appropriate

## 2. Current Automated Test Stack

- Vitest
- TypeScript

Run the full test suite with:

```bash
npm test
```

## 3. Current Test Files

| Test File | What It Verifies |
| --- | --- |
| `src/features/sorting/algorithms.test.ts` | Every implemented sorting algorithm returns the same sorted result for a shared sample input |
| `src/features/searching/algorithms.test.ts` | All implemented search algorithms find a shared target, and binary search returns not-found correctly |
| `src/features/pathfinding/algorithms.test.ts` | A* and Dijkstra both find a valid route and agree on path length for the same board |

## 4. Current Coverage Philosophy

The existing tests primarily target pure algorithm engines because they provide
the highest value and lowest maintenance cost.

That means the current suite is strongest at:

- algorithm correctness
- timeline generation integrity
- summary consistency

It is currently lighter on:

- React component rendering tests
- accessibility tests
- visual regression tests
- cross-browser checks

## 5. Manual Verification Checklist

After changing the UI or algorithm behavior, manually validate:

1. Sorting workspace accepts custom input and generated arrays.
2. Searching workspace accepts custom arrays and targets.
3. Binary search explains when unsorted input is normalized.
4. Pathfinding workspace updates the grid correctly when editing walls, start, and end.
5. Playback works for play, pause, reset, scrub, and speed changes.
6. Code reference language switching stays synchronized with the current stage.

## 6. Build Verification

In addition to tests, validate production readiness with:

```bash
npm run build
```

This ensures:

- TypeScript types are valid
- imports resolve correctly
- the production bundle can be generated successfully

## 7. Recommended Future Improvements

- Add component tests for shared UI controls
- Add integration tests for workspace flows
- Add browser-based end-to-end tests for playback and input handling
- Add visual regression checks for the main workspaces
- Add performance tests for larger inputs and denser pathfinding boards
