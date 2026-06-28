import type { ChannelRequest, FreexsterState } from "../domain/types";
import { demoState } from "../domain/fixtures";
import type { ChannelRequestInput, FreexsterClient } from "./freexsterClient";
import { loadNativeStatus } from "./nativeStatus";

function cloneState(): FreexsterState {
  return structuredClone(demoState);
}

export function createMockFreexsterClient(): FreexsterClient {
  let state = cloneState();

  return {
    async loadState() {
      const nativeStatus = await loadNativeStatus();
      state = { ...state, nativeStatus };
      return structuredClone(state);
    },
    async loadNativeStatus() {
      return loadNativeStatus();
    },
    async submitChannelRequest(input: ChannelRequestInput): Promise<ChannelRequest> {
      const request: ChannelRequest = {
        id: `request-${input.requestedSlug}`,
        requestedSlug: input.requestedSlug,
        requestedBy: input.requestedBy,
        rationale: input.rationale,
        status: "submitted",
      };

      state = {
        ...state,
        channelRequests: [request, ...state.channelRequests],
      };

      return structuredClone(request);
    },
  };
}
