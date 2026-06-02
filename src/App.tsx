import { useState } from "react";
import { PathfindingLab } from "./features/pathfinding/PathfindingLab";
import { SearchingLab } from "./features/searching/SearchingLab";
import { SortingLab } from "./features/sorting/SortingLab";

const labs = [
  {
    id: "sorting",
    label: "Sorting",
    summary:
      "Enter numbers, pick an algorithm, and watch how the array changes step by step.",
  },
  {
    id: "searching",
    label: "Searching",
    summary:
      "Choose a target and follow how linear and binary search inspect each value.",
  },
  {
    id: "pathfinding",
    label: "Pathfinding",
    summary:
      "Build a grid, add walls, and follow how the algorithm searches for a path.",
  },
] as const;

type LabId = (typeof labs)[number]["id"];

export function App() {
  const [activeLab, setActiveLab] = useState<LabId>("sorting");
  const activeWorkspace = labs.find((lab) => lab.id === activeLab) ?? labs[0]!;

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Algorithm Visualizer</p>
        <h1>Learn algorithms by stepping through them.</h1>
        <p className="hero-text">{activeWorkspace.summary}</p>
      </header>

      <nav className="workspace-nav" aria-label="Workspaces">
        <div className="lab-picker">
          {labs.map((lab) => (
            <button
              key={lab.id}
              type="button"
              className={`lab-tab ${activeLab === lab.id ? "active" : ""}`}
              onClick={() => setActiveLab(lab.id)}
            >
              <strong>{lab.label}</strong>
              <p>{lab.summary}</p>
            </button>
          ))}
        </div>
      </nav>

      {activeLab === "sorting" ? (
        <SortingLab />
      ) : activeLab === "searching" ? (
        <SearchingLab />
      ) : (
        <PathfindingLab />
      )}
    </main>
  );
}
