import type { ChannelRequest, FreexsterState, NativeStatus } from "../domain/types";

export type ChannelRequestInput = {
  requestedSlug: string;
  requestedBy: string;
  rationale: string;
};

export type FreexsterClient = {
  loadState(): Promise<FreexsterState>;
  loadNativeStatus(): Promise<NativeStatus>;
  submitChannelRequest(input: ChannelRequestInput): Promise<ChannelRequest>;
};
