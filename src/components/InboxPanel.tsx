import type { InboxThread } from "../domain/types";

export function InboxPanel({ threads }: { threads: InboxThread[] }) {
  return (
    <aside className="panel">
      <div className="panel-label">Private inbox</div>
      <h2>Priority letters</h2>
      <div className="stack">
        {threads.map((thread) => (
          <article className={thread.unread ? "list-card unread" : "list-card"} key={thread.id}>
            <strong>
              {thread.correspondent}: {thread.subject}
            </strong>
            <span>{thread.correspondent}</span>
            <p>{thread.preview}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}
