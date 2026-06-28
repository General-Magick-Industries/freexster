import type { TrustProof } from "../domain/types";

export function TrustPanel({ proofs }: { proofs: TrustProof[] }) {
  return (
    <aside className="context-panel">
      <div className="panel-label">Trust and stewardship</div>
      <h2>Proofs</h2>
      <div className="stack">
        {proofs.map((proof) => (
          <article className="proof-card" key={`${proof.label}-${proof.detail}`}>
            <span className={`proof-state ${proof.state}`}>{proof.state}</span>
            <strong>{proof.label}</strong>
            <p>{proof.detail}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}
