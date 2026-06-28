import type { ChannelRequestInput } from "../adapters/freexsterClient";
import { getActiveChannel, getActiveThread, listApprovedChannels } from "../domain/selectors";
import type { AgentPolicy, FreexsterState, Surface } from "../domain/types";
import { InboxPanel } from "./InboxPanel";
import { Sidebar } from "./Sidebar";
import { ThreadPanel } from "./ThreadPanel";
import { TrustPanel } from "./TrustPanel";

function ChannelsPanel({
  state,
  onSubmitChannelRequest,
}: {
  state: FreexsterState;
  onSubmitChannelRequest: (input: ChannelRequestInput) => Promise<void>;
}) {
  const activeChannel = getActiveChannel(state);
  const channels = listApprovedChannels(state);

  return (
    <>
      <aside className="panel">
        <div className="panel-label">Approved channels</div>
        <h2>Topic channels</h2>
        <div className="stack">
          {channels.map((channel) => (
            <article className="list-card" key={channel.id}>
              <strong>#{channel.slug}</strong>
              <p>{channel.charter}</p>
            </article>
          ))}
        </div>
      </aside>
      <section className="reader">
        <div className="panel-label">Public channel</div>
        <h2>{activeChannel?.title ?? "No channel selected"}</h2>
        <p className="lede">{activeChannel?.charter}</p>
        <button
          type="button"
          onClick={() =>
            void onSubmitChannelRequest({
              requestedSlug: "robot-comms",
              requestedBy: "Mark",
              rationale: "A curated channel for future robot-to-robot communications design.",
            })
          }
        >
          Request a channel
        </button>
      </section>
    </>
  );
}

function PlaceholderSurface({ surface, agents }: { surface: Surface; agents: AgentPolicy[] }) {
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
          <p className="lede">This area is available for permissions, identity, and stewardship controls as the product matures.</p>
        )}
      </section>
    </>
  );
}

export function AppShell({
  state,
  onSurfaceChange,
  onSubmitChannelRequest,
}: {
  state: FreexsterState;
  onSurfaceChange: (surface: Surface) => void;
  onSubmitChannelRequest: (input: ChannelRequestInput) => Promise<void>;
}) {
  const activeThread = getActiveThread(state);
  const activeChannel = getActiveChannel(state);
  const trustProofs =
    state.activeSurface === "channels" && activeChannel ? activeChannel.trust : activeThread?.trust ?? [];

  return (
    <div className="desktop-frame">
      <header className="topbar">
        <div className="topbar-brand">
          <h1>Freexster</h1>
          <span>Private inbox + public topic channels + trust registry</span>
        </div>
        <span>
          {state.nativeStatus.simplexRunner} · {state.nativeStatus.registry}
        </span>
      </header>
      <div className="workspace">
        <Sidebar activeSurface={state.activeSurface} onSurfaceChange={onSurfaceChange} />
        {state.activeSurface === "inbox" ? (
          <>
            <InboxPanel threads={state.inboxThreads} />
            <ThreadPanel thread={activeThread} />
          </>
        ) : state.activeSurface === "channels" ? (
          <ChannelsPanel state={state} onSubmitChannelRequest={onSubmitChannelRequest} />
        ) : (
          <PlaceholderSurface surface={state.activeSurface} agents={state.agents} />
        )}
        <TrustPanel proofs={trustProofs} />
      </div>
    </div>
  );
}
