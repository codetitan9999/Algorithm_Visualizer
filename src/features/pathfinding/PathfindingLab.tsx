import { useEffect, useState, useTransition } from "react";
import { CodeReferencePanel } from "../../components/CodeReferencePanel";
import { PlaybackBar } from "../../components/PlaybackBar";
import { StatPill } from "../../components/StatPill";
import { usePlayback } from "../../hooks/usePlayback";
import type { CodeLanguage } from "../../types/codeReference";
import {
  createPathPreviewRun,
  pathfindingOptions,
  runPathfindingAlgorithm,
} from "./algorithms";
import { pathfindingReferences } from "./reference";
import type {
  Cell,
  EditTool,
  PathScenario,
  PathfindingAlgorithmId,
} from "./types";
import {
  createEmptyScenario,
  randomizeWalls,
  sameCell,
  serializeCell,
} from "./utils";

const tools: { id: EditTool; label: string }[] = [
  { id: "wall", label: "Add obstacles" },
  { id: "erase", label: "Remove obstacles" },
  { id: "start", label: "Set origin" },
  { id: "end", label: "Set destination" },
];
const pathfindingLegend = [
  { label: "Wall", color: "#1b2738" },
  { label: "Start", color: "#28c8a7" },
  { label: "Finish", color: "#ff8a7a" },
  { label: "Visited", color: "#5cb4ff" },
  { label: "Frontier", color: "#f3b457" },
  { label: "Path", color: "#7ce7f6" },
] as const;

function GridBoard({
  scenario,
  step,
  tool,
  onCellMouseDown,
  onCellMouseEnter,
  onMouseLeave,
}: {
  scenario: PathScenario;
  step: ReturnType<typeof createPathPreviewRun>["steps"][number];
  tool: EditTool;
  onCellMouseDown: (cell: Cell) => void;
  onCellMouseEnter: (cell: Cell) => void;
  onMouseLeave: () => void;
}) {
  const visited = new Set(step.visited.map(serializeCell));
  const frontier = new Set(step.frontier.map(serializeCell));
  const path = new Set(step.path.map(serializeCell));
  const current = step.current ? serializeCell(step.current) : null;

  return (
    <div
      className={`grid-board tool-${tool}`}
      style={{
        gridTemplateColumns: `repeat(${scenario.cols}, minmax(0, 1fr))`,
      }}
      onMouseLeave={onMouseLeave}
    >
      {Array.from({ length: scenario.rows * scenario.cols }, (_, index) => {
        const row = Math.floor(index / scenario.cols);
        const col = index % scenario.cols;
        const cell = { row, col };
        const key = serializeCell(cell);

        const classes = [
          "grid-cell",
          scenario.walls.has(key) ? "wall" : "",
          sameCell(cell, scenario.start) ? "start" : "",
          sameCell(cell, scenario.end) ? "end" : "",
          visited.has(key) ? "visited" : "",
          frontier.has(key) ? "frontier" : "",
          path.has(key) ? "path" : "",
          current === key ? "current" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={key}
            type="button"
            className={classes}
            onMouseDown={() => onCellMouseDown(cell)}
            onMouseEnter={() => onCellMouseEnter(cell)}
            aria-label={`Cell ${row}, ${col}`}
          />
        );
      })}
    </div>
  );
}

export function PathfindingLab() {
  const [algorithm, setAlgorithm] = useState<PathfindingAlgorithmId>("astar");
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>("typescript");
  const [tool, setTool] = useState<EditTool>("wall");
  const [scenario, setScenario] = useState<PathScenario>(() =>
    createEmptyScenario(18, 28),
  );
  const [wallDensity, setWallDensity] = useState(0.2);
  const [speedMs, setSpeedMs] = useState(80);
  const [timelineKey, setTimelineKey] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isPainting, setIsPainting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [run, setRun] = useState<ReturnType<typeof createPathPreviewRun> | null>(null);

  useEffect(() => {
    const handleMouseUp = () => setIsPainting(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const activeRun = run ?? createPathPreviewRun(scenario, algorithm);
  const playback = usePlayback({
    totalSteps: activeRun.steps.length,
    delayMs: speedMs,
    timelineKey,
    autoPlay,
  });
  const currentStep = activeRun.steps[playback.stepIndex] ?? activeRun.steps[0]!;
  const selectedAlgorithm =
    pathfindingOptions.find((option) => option.id === algorithm) ??
    pathfindingOptions[0]!;
  const codeReference = pathfindingReferences[algorithm];

  const clearRun = () => {
    setRun(null);
    setAutoPlay(false);
    setTimelineKey((current) => current + 1);
  };

  const updateScenario = (updater: (current: PathScenario) => PathScenario) => {
    setScenario((current) => updater(current));
    clearRun();
  };

  const applyTool = (cell: Cell) => {
    updateScenario((current) => {
      const nextWalls = new Set(current.walls);
      const cellKey = serializeCell(cell);

      if (tool === "wall") {
        if (!sameCell(cell, current.start) && !sameCell(cell, current.end)) {
          nextWalls.add(cellKey);
        }
        return { ...current, walls: nextWalls };
      }

      if (tool === "erase") {
        nextWalls.delete(cellKey);
        return { ...current, walls: nextWalls };
      }

      if (tool === "start" && !sameCell(cell, current.end)) {
        nextWalls.delete(cellKey);
        return { ...current, start: cell, walls: nextWalls };
      }

      if (tool === "end" && !sameCell(cell, current.start)) {
        nextWalls.delete(cellKey);
        return { ...current, end: cell, walls: nextWalls };
      }

      return current;
    });
  };

  const handleRun = () => {
    startTransition(() => {
      setRun(runPathfindingAlgorithm(algorithm, scenario));
      setAutoPlay(true);
      setTimelineKey((current) => current + 1);
    });
  };

  return (
    <section className="lab-layout">
      <aside className="control-column">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Control Rail</p>
              <h2>{selectedAlgorithm.label}</h2>
            </div>
            <span className="timeline-badge">{selectedAlgorithm.complexity}</span>
          </div>
          <p className="panel-copy">{selectedAlgorithm.blurb}</p>

          <label className="input-field">
            <span>Algorithm</span>
            <select
              value={algorithm}
              onChange={(event) => {
                setAlgorithm(event.target.value as PathfindingAlgorithmId);
                clearRun();
              }}
            >
              {pathfindingOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="tool-grid">
            {tools.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`tool-chip ${tool === item.id ? "active" : ""}`}
                onClick={() => setTool(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="button-row">
            <button
              type="button"
              className="secondary-button"
              onClick={() => updateScenario((current) => ({ ...current, walls: new Set() }))}
            >
              Clear Obstacles
            </button>
            <button type="button" className="primary-button" onClick={handleRun}>
              Run Search
            </button>
          </div>

          {isPending ? <p className="helper-text">Processing board...</p> : null}
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Scenario Builder</p>
              <h3>Create grid patterns</h3>
            </div>
          </div>

          <label className="range-field">
            <span>Wall density: {Math.round(wallDensity * 100)}%</span>
            <input
              type="range"
              min={5}
              max={35}
              step={1}
              value={wallDensity * 100}
              onChange={(event) =>
                setWallDensity(Number(event.target.value) / 100)
              }
            />
          </label>

          <div className="button-row">
            <button
              type="button"
              className="secondary-button"
              onClick={() => updateScenario(() => createEmptyScenario(18, 28))}
            >
              Reset Board
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                updateScenario((current) => randomizeWalls(current, wallDensity))
              }
            >
              Generate Layout
            </button>
          </div>
        </section>

        <PlaybackBar
          currentStep={playback.stepIndex}
          totalSteps={activeRun.steps.length}
          isPlaying={playback.isPlaying}
          speedMs={speedMs}
          onPlay={playback.play}
          onPause={playback.pause}
          onReset={playback.reset}
          onScrub={playback.scrubTo}
          onSpeedChange={setSpeedMs}
        />
      </aside>

      <div className="visual-column">
        <section className="panel stage-panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Execution Trace</p>
              <h2>{activeRun.label}</h2>
            </div>
            <div className="stat-row compact">
              <StatPill label="Visited" value={currentStep.metrics.visitedCount} />
              <StatPill label="Frontier" value={currentStep.metrics.frontierCount} />
              <StatPill label="Path length" value={currentStep.metrics.pathLength} />
            </div>
          </div>

          <div className="legend-row" aria-label="Pathfinding state legend">
            {pathfindingLegend.map((item) => (
              <span key={item.label} className="legend-chip">
                <span
                  className="legend-swatch"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </span>
            ))}
          </div>

          <GridBoard
            scenario={scenario}
            step={currentStep}
            tool={tool}
            onCellMouseDown={(cell) => {
              setIsPainting(tool === "wall" || tool === "erase");
              applyTool(cell);
            }}
            onCellMouseEnter={(cell) => {
              if (isPainting && (tool === "wall" || tool === "erase")) {
                applyTool(cell);
              }
            }}
            onMouseLeave={() => setIsPainting(false)}
          />
          <p className="narration">{currentStep.description}</p>
        </section>

        <CodeReferencePanel
          reference={codeReference}
          selectedLanguage={codeLanguage}
          activeStageId={currentStep.stageId}
          currentDescription={currentStep.description}
          onLanguageChange={setCodeLanguage}
        />

        <section className="insights-grid">
          <div className="panel">
            <p className="panel-eyebrow">Run summary</p>
            <div className="stat-row">
              <StatPill label="Iterations" value={activeRun.summary.iterations} />
              <StatPill label="Visited" value={activeRun.summary.visitedCount} />
              <StatPill
                label="Solved"
                value={activeRun.summary.found ? "Yes" : "No"}
              />
              <StatPill label="Steps" value={activeRun.summary.totalSteps} />
            </div>
          </div>

          <div className="panel">
            <p className="panel-eyebrow">Board Notes</p>
            <ul className="signal-list">
              <li>Drag across the board to paint or erase walls, then reposition origin and destination as needed.</li>
              <li>A* blends travel cost with a goal-directed heuristic, so the frontier tends to move toward the finish.</li>
              <li>Dijkstra ignores heuristics and expands by cheapest known cost, making it the clean baseline for comparison.</li>
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
}
