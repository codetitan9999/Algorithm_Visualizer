import type { CodeLanguage, CodeReference } from "../types/codeReference";

interface CodeReferencePanelProps {
  reference: CodeReference;
  selectedLanguage: CodeLanguage;
  activeStageId?: string;
  currentDescription: string;
  onLanguageChange: (language: CodeLanguage) => void;
}

export function CodeReferencePanel({
  reference,
  selectedLanguage,
  activeStageId,
  currentDescription,
  onLanguageChange,
}: CodeReferencePanelProps) {
  const activeSnippet =
    reference.snippets.find((snippet) => snippet.language === selectedLanguage) ??
    reference.snippets[0]!;
  const activeStage =
    reference.stages.find((stage) => stage.id === activeStageId) ??
    reference.stages[0];

  return (
    <section className="panel code-panel">
      <div className="panel-header">
        <div>
          <p className="panel-eyebrow">Reference Deck</p>
          <h2>{reference.title}</h2>
        </div>
        <span className="timeline-badge">{activeSnippet.label}</span>
      </div>

      <p className="panel-copy">{reference.summary}</p>

      <div className="language-tabs" aria-label="Implementation language">
        {reference.snippets.map((snippet) => (
          <button
            key={snippet.language}
            type="button"
            aria-pressed={snippet.language === activeSnippet.language}
            className={`language-chip ${snippet.language === activeSnippet.language ? "active" : ""}`}
            onClick={() => onLanguageChange(snippet.language)}
          >
            {snippet.label}
          </button>
        ))}
      </div>

      <div className="code-panel-layout">
        <div className="code-column">
          <div className="code-surface">
            <div className="code-surface-bar">
              <span className="code-window-title">{reference.title}</span>
              <span className="code-window-mode">{activeSnippet.label}</span>
            </div>

            <pre className="code-block">
              <code>{activeSnippet.code}</code>
            </pre>
          </div>
        </div>

        <div className="explanation-column">
          <div className="focus-card">
            <p className="panel-eyebrow">Current Focus</p>
            <h3>{activeStage?.title}</h3>
            <p className="focus-text">{activeStage?.description}</p>
            <p className="focus-callout">{currentDescription}</p>
          </div>

          <div className="stage-list">
            {reference.stages.map((stage, index) => (
              <div
                key={stage.id}
                className={`stage-item ${stage.id === activeStage?.id ? "active" : ""}`}
              >
                <span className="stage-index">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{stage.title}</strong>
                  <p>{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
