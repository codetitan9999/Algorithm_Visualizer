import { useState, useTransition } from "react";
import { CodeReferencePanel } from "../../components/CodeReferencePanel";
import { PlaybackBar } from "../../components/PlaybackBar";
import { StatPill } from "../../components/StatPill";
import { usePlayback } from "../../hooks/usePlayback";
import type { CodeLanguage } from "../../types/codeReference";
import { runSortingAlgorithm, sortingOptions } from "./algorithms";
import { sortingReferences } from "./reference";
import type { SortStep, SortingAlgorithmId } from "./types";
import {
  formatNumberList,
  generateRandomList,
  parseNumberList,
} from "./utils";

const initialValues = [42, 17, 8, 23, 15, 4, 16, 9, 31, 12];
const sortingLegend = [
  { label: "Base", color: "#5cb4ff" },
  { label: "Compared", color: "#f3b457" },
  { label: "Active", color: "#ff8a7a" },
  { label: "Sorted", color: "#28c8a7" },
  { label: "Pivot", color: "#7ce7f6" },
] as const;

function SortingChart({ step }: { step: SortStep }) {
  const maxValue = Math.max(...step.values, 1);

  return (
    <div className="sorting-chart">
      {step.values.map((value, index) => {
        const height = Math.max(8, (value / maxValue) * 100);
        const classNames = [
          "bar-card",
          step.sorted.includes(index) ? "sorted" : "",
          step.compared.includes(index) ? "compared" : "",
          step.active.includes(index) ? "active" : "",
          step.pivot === index ? "pivot" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={`${index}-${value}`} className={classNames}>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ height: `${height}%` }}
                title={`Value ${value}`}
              />
            </div>
            <span className="bar-label">{value}</span>
          </div>
        );
      })}
    </div>
  );
}

export function SortingLab() {
  const [algorithm, setAlgorithm] = useState<SortingAlgorithmId>("quick");
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>("typescript");
  const [draftInput, setDraftInput] = useState(formatNumberList(initialValues));
  const [randomSize, setRandomSize] = useState(initialValues.length);
  const [randomMaxValue, setRandomMaxValue] = useState(60);
  const [speedMs, setSpeedMs] = useState(140);
  const [timelineKey, setTimelineKey] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [run, setRun] = useState(() =>
    runSortingAlgorithm("quick", initialValues),
  );

  const playback = usePlayback({
    totalSteps: run.steps.length,
    delayMs: speedMs,
    timelineKey,
    autoPlay,
  });

  const selectedAlgorithm =
    sortingOptions.find((option) => option.id === algorithm) ?? sortingOptions[0]!;
  const currentStep = run.steps[playback.stepIndex] ?? run.steps[0]!;
  const codeReference = sortingReferences[algorithm];

  const loadScenario = (
    nextAlgorithm: SortingAlgorithmId,
    values: number[],
    shouldAutoPlay: boolean,
  ) => {
    startTransition(() => {
      setRun(runSortingAlgorithm(nextAlgorithm, values));
      setAutoPlay(shouldAutoPlay);
      setTimelineKey((current) => current + 1);
      setError(null);
    });
  };

  const handleGenerate = () => {
    const nextValues = generateRandomList(randomSize, randomMaxValue);
    setDraftInput(formatNumberList(nextValues));
    loadScenario(algorithm, nextValues, false);
  };

  const handleVisualize = () => {
    const parsed = parseNumberList(draftInput);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }

    loadScenario(algorithm, parsed.values, true);
  };

  const handlePreview = () => {
    const parsed = parseNumberList(draftInput);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }

    loadScenario(algorithm, parsed.values, false);
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
                const nextAlgorithm = event.target.value as SortingAlgorithmId;
                setAlgorithm(nextAlgorithm);

                const parsed = parseNumberList(draftInput);
                if (parsed.ok) {
                  loadScenario(nextAlgorithm, parsed.values, false);
                }
              }}
            >
              {sortingOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="input-field">
            <span>Input sequence</span>
            <textarea
              rows={5}
              value={draftInput}
              onChange={(event) => setDraftInput(event.target.value)}
              placeholder="Example: 42, 17, 8, 23, 15"
            />
          </label>

          <div className="button-row">
            <button type="button" className="secondary-button" onClick={handlePreview}>
              Load Sequence
            </button>
            <button type="button" className="primary-button" onClick={handleVisualize}>
              Run Analysis
            </button>
          </div>

          {error ? <p className="error-text">{error}</p> : null}
          {isPending ? <p className="helper-text">Processing sequence...</p> : null}
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Scenario Builder</p>
              <h3>Create sample input</h3>
            </div>
          </div>

          <label className="range-field">
            <span>Array size: {randomSize}</span>
            <input
              type="range"
              min={5}
              max={24}
              step={1}
              value={randomSize}
              onChange={(event) => setRandomSize(Number(event.target.value))}
            />
          </label>

          <label className="range-field">
            <span>Max value: {randomMaxValue}</span>
            <input
              type="range"
              min={20}
              max={120}
              step={5}
              value={randomMaxValue}
              onChange={(event) => setRandomMaxValue(Number(event.target.value))}
            />
          </label>

          <button type="button" className="secondary-button" onClick={handleGenerate}>
            Generate Sequence
          </button>
        </section>

        <PlaybackBar
          currentStep={playback.stepIndex}
          totalSteps={run.steps.length}
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
              <h2>{run.label}</h2>
            </div>
            <div className="stat-row compact">
              <StatPill label="Comparisons" value={currentStep.metrics.comparisons} />
              <StatPill label="Swaps" value={currentStep.metrics.swaps} />
              <StatPill label="Writes" value={currentStep.metrics.writes} />
            </div>
          </div>

          <div className="legend-row" aria-label="Sorting state legend">
            {sortingLegend.map((item) => (
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

          <SortingChart step={currentStep} />
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
              <StatPill label="Total steps" value={run.summary.totalSteps} />
              <StatPill label="Final comparisons" value={run.summary.comparisons} />
              <StatPill label="Final swaps" value={run.summary.swaps} />
              <StatPill label="Final writes" value={run.summary.writes} />
            </div>
          </div>

          <div className="panel">
            <p className="panel-eyebrow">Execution Signals</p>
            <ul className="signal-list">
              <li>The renderer replays precomputed snapshots instead of running algorithm logic during paint.</li>
              <li>Metrics, narration, and the active code stage stay synchronized across the full timeline.</li>
              <li>Manual input and generated samples flow through the same execution engine for consistent playback.</li>
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
}
