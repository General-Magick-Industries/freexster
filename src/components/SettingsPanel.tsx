import type { SimplexRunnerStatus } from "../domain/types";

export function SettingsPanel({ simplexRunner }: { simplexRunner: SimplexRunnerStatus }) {
  return (
    <>
      <aside className="panel settings-summary">
        <div className="panel-label">Settings</div>
        <h2>SimpleX runner</h2>
        <span className={`runner-state ${simplexRunner.canConnect ? "ready" : "pending"}`}>
          {simplexRunner.state}
        </span>
        <p>{simplexRunner.securityBoundary}</p>
      </aside>
      <section className="reader settings-reader">
        <div className="panel-label">Desktop bridge</div>
        <p className="lede">Freexster uses your local SimpleX runner for private inbox transport.</p>
        <dl className="status-grid">
          <div>
            <dt>Runner URL</dt>
            <dd>{simplexRunner.webSocketUrl}</dd>
          </div>
          <div>
            <dt>Binary</dt>
            <dd>{simplexRunner.binaryPath ?? "Set FREEXSTER_SIMPLEX_CHAT_PATH"}</dd>
          </div>
        </dl>
        {simplexRunner.lastError ? <p className="status-note error">{simplexRunner.lastError}</p> : null}
        <code className="command-chip">simplex-chat -p {simplexRunner.port}</code>
      </section>
    </>
  );
}
