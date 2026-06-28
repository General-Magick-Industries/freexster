import type { AgentPolicy, Surface } from "../domain/types";

export function PlaceholderSurface({ surface, agents }: { surface: Surface; agents: AgentPolicy[] }) {
  const title = surface[0].toUpperCase() + surface.slice(1);

  return (
    <>
      <aside className="panel">
        <div className="panel-label">{title}</div>
        <h2>{title}</h2>
        <p>This surface is part of the v1 shell so the information architecture is honest from the outset.</p>
      </aside>
      <section className="reader">
        <div className="panel-label">Design-ready surface</div>
        {surface === "agents" ? (
          agents.map((agent) => (
            <article className="list-card" key={agent.id}>
              <strong>{agent.name}</strong>
              <p>{agent.auditSummary}</p>
            </article>
          ))
        ) : (
          <p className="lede">
            This area is available for permissions, identity, and stewardship controls as the product matures.
          </p>
        )}
      </section>
    </>
  );
}
