import type { ChannelRequestInput } from "../adapters/freexsterClient";
import { getActiveChannel, getActiveThread } from "../domain/selectors";
import type { FreexsterState, Surface } from "../domain/types";
import { ChannelsPanel } from "./ChannelsPanel";
import { InboxPanel } from "./InboxPanel";
import { PlaceholderSurface } from "./PlaceholderSurface";
import { SettingsPanel } from "./SettingsPanel";
import { Sidebar } from "./Sidebar";
import { ThreadPanel } from "./ThreadPanel";
import { TrustPanel } from "./TrustPanel";

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
          {state.nativeStatus.simplexRunner} / {state.nativeStatus.registry}
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
        ) : state.activeSurface === "settings" ? (
          <SettingsPanel simplexRunner={state.simplexRunner} />
        ) : (
          <PlaceholderSurface surface={state.activeSurface} agents={state.agents} />
        )}
        <TrustPanel proofs={trustProofs} />
      </div>
    </div>
  );
}
