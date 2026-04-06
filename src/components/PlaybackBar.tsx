interface PlaybackBarProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speedMs: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onScrub: (nextStep: number) => void;
  onSpeedChange: (nextSpeed: number) => void;
}

export function PlaybackBar({
  currentStep,
  totalSteps,
  isPlaying,
  speedMs,
  onPlay,
  onPause,
  onReset,
  onScrub,
  onSpeedChange,
}: PlaybackBarProps) {
  const isDisabled = totalSteps <= 1;

  return (
    <section className="panel playback-panel">
      <div className="panel-header">
        <div>
          <p className="panel-eyebrow">Timeline Control</p>
          <h3>Replay the run</h3>
        </div>
        <span className="timeline-badge">
          Step {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
        </span>
      </div>

      <div className="playback-actions">
        <button type="button" className="secondary-button" onClick={onReset}>
          Restart
        </button>
        <button
          type="button"
          className="primary-button"
          disabled={isDisabled}
          onClick={isPlaying ? onPause : onPlay}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <label className="range-field">
        <span>Step scrubber</span>
        <input
          type="range"
          min={0}
          max={Math.max(totalSteps - 1, 0)}
          value={Math.min(currentStep, Math.max(totalSteps - 1, 0))}
          disabled={isDisabled}
          onChange={(event) => onScrub(Number(event.target.value))}
        />
      </label>

      <label className="range-field">
        <span>Playback speed: {speedMs} ms</span>
        <input
          type="range"
          min={40}
          max={600}
          step={20}
          value={speedMs}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
        />
      </label>
    </section>
  );
}
