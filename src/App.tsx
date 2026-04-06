import { useState } from "react";
import { PathfindingLab } from "./features/pathfinding/PathfindingLab";
import { SortingLab } from "./features/sorting/SortingLab";

const labs = [
  {
    id: "sorting",
    label: "Sorting Lab",
    eyebrow: "Array execution",
    summary:
      "Load custom sequences, generate sample inputs, and replay every comparison, write, and partition event with deterministic timing.",
  },
  {
    id: "pathfinding",
    label: "Pathfinding Lab",
    eyebrow: "Grid routing",
    summary:
      "Shape the board, place start and finish points, and inspect frontier expansion, cost updates, and route reconstruction step by step.",
  },
] as const;

type LabId = (typeof labs)[number]["id"];

export function App() {
  const [activeLab, setActiveLab] = useState<LabId>("sorting");
  const activeWorkspace = labs.find((lab) => lab.id === activeLab) ?? labs[0]!;

  return (
    <main className="app-shell">
      <header className="app-header panel">
        <div className="hero-copy">
          <p className="eyebrow">Algorithm Studio</p>
          <h1>Visualize algorithm behavior in a focused analysis workstation.</h1>
          <p className="hero-text">
            Replay sorting and graph-search timelines with synchronized metrics,
            implementation references, and controls that stay attached to the
            execution state instead of competing with it.
          </p>
        </div>

        <div className="hero-notes header-metrics">
          <div className="meta-card">
            <span className="note-label">Current Workspace</span>
            <strong>{activeWorkspace.label}</strong>
          </div>
          <div className="meta-card">
            <span className="note-label">Focus</span>
            <strong>{activeWorkspace.eyebrow}</strong>
          </div>
          <div className="meta-card">
            <span className="note-label">Mode</span>
            <strong>Deterministic playback with code trace</strong>
          </div>
        </div>
      </header>

      <section className="workspace-nav panel">
        <div className="workspace-copy">
          <p className="panel-eyebrow">Workspace Switcher</p>
          <h2>{activeWorkspace.label}</h2>
          <p className="panel-copy">{activeWorkspace.summary}</p>
        </div>

        <div className="lab-picker">
          {labs.map((lab) => (
            <button
              key={lab.id}
              type="button"
              className={`lab-tab ${activeLab === lab.id ? "active" : ""}`}
              onClick={() => setActiveLab(lab.id)}
            >
              <span>{lab.eyebrow}</span>
              <strong>{lab.label}</strong>
              <p>{lab.summary}</p>
            </button>
          ))}
        </div>
      </section>

      {activeLab === "sorting" ? <SortingLab /> : <PathfindingLab />}
    </main>
  );
}
