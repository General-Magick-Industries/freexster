import { useState } from "react";
import type { ChannelRequestInput } from "../adapters/freexsterClient";
import { getActiveChannel, listApprovedChannels } from "../domain/selectors";
import type { FreexsterState } from "../domain/types";

const defaultChannelRequest: ChannelRequestInput = {
  requestedSlug: "robot-comms",
  requestedBy: "Mark",
  rationale: "A curated channel for future robot-to-robot communications design.",
};

type RequestStatus = "idle" | "submitting" | "success" | "error";

export function ChannelsPanel({
  state,
  onSubmitChannelRequest,
}: {
  state: FreexsterState;
  onSubmitChannelRequest: (input: ChannelRequestInput) => Promise<void>;
}) {
  const activeChannel = getActiveChannel(state);
  const channels = listApprovedChannels(state);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
  const [requestMessage, setRequestMessage] = useState("");

  async function handleChannelRequest() {
    if (requestStatus === "submitting") {
      return;
    }

    setRequestStatus("submitting");
    setRequestMessage("Submitting channel request...");

    try {
      await onSubmitChannelRequest(defaultChannelRequest);
      setRequestStatus("success");
      setRequestMessage("Channel request submitted for review.");
    } catch {
      setRequestStatus("error");
      setRequestMessage("Channel request failed. Please try again.");
    }
  }

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
        <div className="reader-actions">
          <button
            className="primary"
            type="button"
            onClick={handleChannelRequest}
            disabled={requestStatus === "submitting"}
          >
            {requestStatus === "submitting" ? "Requesting..." : "Request a channel"}
          </button>
          <p
            className={`status-note${requestStatus === "error" ? " error" : ""}${requestStatus === "success" ? " success" : ""}`}
            role="status"
            aria-live="polite"
          >
            {requestMessage}
          </p>
        </div>
      </section>
    </>
  );
}
