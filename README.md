# Algorithm Visualizer

A modern algorithm visualizer rebuilt around dynamic user input, deterministic algorithm timelines, and a cleaner architecture that is easier to discuss in interviews.

## Live Deployment

- Production: https://algorithm-visualizer-xi-ten.vercel.app
- Alternate URL: https://algorithm-visualizer-codetitan9999s-projects.vercel.app

## What Changed

This repository started as a Python + Pygame collection of individual scripts. The new version is a browser-based TypeScript app with:

- A dedicated sorting studio for user-provided arrays
- A pathfinding lab with editable start, end, and wall nodes
- Reusable playback controls for stepping, scrubbing, and speed tuning
- Language-switchable code references with synchronized stage explanations
- Pure algorithm engines separated from the rendering layer
- Tests for both sorting and pathfinding logic

The original implementation is still available in `legacy/python-pygame/`.

## Architecture

```text
src/
|-- App.tsx
|-- components/
|-- hooks/
`-- features/
    |-- sorting/
    `-- pathfinding/
```

Each feature keeps its own algorithm implementations, types, and UI surface. The algorithms produce step-by-step timelines, which makes the app easier to animate, test, and extend.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Run the test suite:

```bash
npm test
```

4. Create a production build:

```bash
npm run build
```

## Current Features

- Bubble Sort
- Insertion Sort
- Selection Sort
- Merge Sort
- Quick Sort
- A* Search
- Dijkstra's Algorithm
- Random input generation for arrays
- Interactive grid editing for pathfinding
- Live metrics for comparisons, swaps, writes, frontier size, and path length
- TypeScript, Python, Java, and C++ reference implementations for each algorithm

## Good Next Steps

- Add a code-trace panel that highlights pseudocode alongside each step
- Support weighted grids and algorithms like BFS, DFS, and Bellman-Ford
- Add saved scenarios and shareable URLs for interview walkthroughs
- Introduce complexity comparisons and benchmark charts for larger inputs
