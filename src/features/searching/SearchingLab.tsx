import { useState, useTransition } from "react";
import { CodeReferencePanel } from "../../components/CodeReferencePanel";
import { PlaybackBar } from "../../components/PlaybackBar";
import { StatPill } from "../../components/StatPill";
import { usePlayback } from "../../hooks/usePlayback";
import type { CodeLanguage } from "../../types/codeReference";
import { runSearchingAlgorithm, searchingOptions } from "./algorithms";
import { searchingReferences } from "./reference";
import type { SearchStep, SearchingAlgorithmId } from "./types";
import {
  formatNumberList,
  generateSearchExample,
  parseNumberList,
  parseTarget,
} from "./utils";

const initialValues = [4, 8, 15, 16, 23, 42, 55, 72];
const initialTarget = 23;
const searchingLegend = [
  { label: "Search range", color: "#dbeafe" },
  { label: "Checked", color: "#fef3c7" },
  { label: "Active", color: "#93c5fd" },
  { label: "Found", color: "#86efac" },
  { label: "Discarded", color: "#e2e8f0" },
] as const;

function SearchStrip({ step }: { step: SearchStep }) {
  return (
    <div className="search-strip" role="list" aria-label="Search values">
      {step.values.map((value, index) => {
        const isInWindow =
          step.window !== undefined &&
          index >= step.window.left &&
          index <= step.window.right;
        const classNames = [
          "search-item",
          isInWindow ? "in-window" : "",
          step.checked.includes(index) ? "checked" : "",
          step.active.includes(index) ? "active" : "",
          step.foundIndex === index ? "found" : "",
          step.discarded.includes(index) ? "discarded" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={`${index}-${value}`} className={classNames} role="listitem">
            <span className="search-item-index">Index {index}</span>
            <strong className="search-item-value">{value}</strong>
          </div>
        );
      })}
    </div>
  );
}

export function SearchingLab() {
  const [algorithm, setAlgorithm] = useState<SearchingAlgorithmId>("linear");
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>("typescript");
  const [draftInput, setDraftInput] = useState(formatNumberList(initialValues));
  const [draftTarget, setDraftTarget] = useState(String(initialTarget));
  const [randomSize, setRandomSize] = useState(initialValues.length);
  const [randomMaxValue, setRandomMaxValue] = useState(80);
  const [speedMs, setSpeedMs] = useState(260);
  const [timelineKey, setTimelineKey] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [run, setRun] = useState(() =>
    runSearchingAlgorithm("linear", initialValues, initialTarget),
  );

  const playback = usePlayback({
    totalSteps: run.steps.length,
    delayMs: speedMs,
    timelineKey,
    autoPlay,
  });

  const selectedAlgorithm =
    searchingOptions.find((option) => option.id === algorithm) ??
    searchingOptions[0]!;
  const currentStep = run.steps[playback.stepIndex] ?? run.steps[0]!;
  const codeReference = searchingReferences[algorithm];
  const resultLabel =
    playback.stepIndex >= run.steps.length - 1
      ? run.summary.found
        ? `Found at ${run.resultIndex}`
        : "Not found"
      : "Searching";

  const loadScenario = (
    nextAlgorithm: SearchingAlgorithmId,
    values: number[],
    target: number,
    shouldAutoPlay: boolean,
  ) => {
    startTransition(() => {
      setRun(runSearchingAlgorithm(nextAlgorithm, values, target));
      setAutoPlay(shouldAutoPlay);
      setTimelineKey((current) => current + 1);
      setError(null);
    });
  };

  const parseScenario = () => {
    const parsedValues = parseNumberList(draftInput);
    if (!parsedValues.ok) {
      setError(parsedValues.error);
      return null;
    }

    const parsedTarget = parseTarget(draftTarget);
    if (!parsedTarget.ok) {
      setError(parsedTarget.error);
      return null;
    }

    return {
      values: parsedValues.values,
      target: parsedTarget.value,
    };
  };

  const handlePreview = () => {
    const parsed = parseScenario();
    if (!parsed) {
      return;
    }

    loadScenario(algorithm, parsed.values, parsed.target, false);
  };

  const handleRun = () => {
    const parsed = parseScenario();
    if (!parsed) {
      return;
    }

    loadScenario(algorithm, parsed.values, parsed.target, true);
  };

  const handleGenerate = () => {
    const example = generateSearchExample(randomSize, randomMaxValue);
    setDraftInput(formatNumberList(example.values));
    setDraftTarget(String(example.target));
    loadScenario(algorithm, example.values, example.target, false);
  };

  return (
    <section className="lab-layout">
      <aside className="control-column">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Setup</p>
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
                const nextAlgorithm = event.target.value as SearchingAlgorithmId;
                setAlgorithm(nextAlgorithm);

                const parsed = parseScenario();
                if (parsed) {
                  loadScenario(nextAlgorithm, parsed.values, parsed.target, false);
                }
              }}
            >
              {searchingOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="input-field">
            <span>Input sequence</span>
            <textarea
              rows={4}
              value={draftInput}
              onChange={(event) => setDraftInput(event.target.value)}
              placeholder="Example: 4, 8, 15, 16, 23"
            />
          </label>

          <label className="input-field">
            <span>Target value</span>
            <input
              type="text"
              inputMode="numeric"
              value={draftTarget}
              onChange={(event) => setDraftTarget(event.target.value)}
              placeholder="Example: 23"
            />
          </label>

          <div className="button-row">
            <button type="button" className="secondary-button" onClick={handlePreview}>
              Preview
            </button>
            <button type="button" className="primary-button" onClick={handleRun}>
              Run
            </button>
          </div>

          {error ? <p className="error-text">{error}</p> : null}
          {isPending ? <p className="helper-text">Preparing search...</p> : null}
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Sample Data</p>
              <h3>Generate an example</h3>
            </div>
          </div>

          <label className="range-field">
            <span>List size: {randomSize}</span>
            <input
              type="range"
              min={4}
              max={20}
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
            Generate Example
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
              <p className="panel-eyebrow">Visualization</p>
              <h2>{run.label}</h2>
            </div>
            <div className="stat-row compact">
              <StatPill label="Target" value={run.target} />
              <StatPill label="Checks" value={currentStep.metrics.checks} />
              <StatPill label="Iterations" value={currentStep.metrics.iterations} />
              <StatPill label="Result" value={resultLabel} />
            </div>
          </div>

          <div className="legend-row" aria-label="Searching state legend">
            {searchingLegend.map((item) => (
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

          {run.inputNote ? <p className="helper-text search-note">{run.inputNote}</p> : null}

          <SearchStrip step={currentStep} />
          <p className="narration">{currentStep.description}</p>
        </section>

        <CodeReferencePanel
          reference={codeReference}
          selectedLanguage={codeLanguage}
          activeStageId={currentStep.stageId}
          currentDescription={currentStep.description}
          onLanguageChange={setCodeLanguage}
        />
      </div>
    </section>
  );
}
