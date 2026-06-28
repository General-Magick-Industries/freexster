import type { InboxThread } from "../domain/types";

export function ThreadPanel({ thread }: { thread: InboxThread | null }) {
  if (!thread) {
    return <section className="reader">No private thread selected.</section>;
  }

  return (
    <section className="reader">
      <div className="panel-label">Private SimpleX-backed letter/chat</div>
      <h2>{thread.subject}</h2>
      <p className="lede">{thread.preview}</p>
      <div className="composer">Composer: reply privately, draft a public post, or prepare an agent handoff.</div>
      <div className="actions">
        <button className="primary" type="button">
          Reply
        </button>
        <button type="button">Archive</button>
        <button type="button">@agent</button>
      </div>
    </section>
  );
}
