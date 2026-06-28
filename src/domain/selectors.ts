import type { FreexsterState, TopicChannel } from "./types";

export function getUnreadInboxCount(state: FreexsterState): number {
  return state.inboxThreads.filter((thread) => thread.unread).length;
}

export function getActiveThread(state: FreexsterState) {
  return state.inboxThreads.find((thread) => thread.id === state.activeThreadId) ?? state.inboxThreads[0] ?? null;
}

export function listApprovedChannels(state: FreexsterState): TopicChannel[] {
  return state.channels.filter((channel) => channel.status === "approved");
}

export function getActiveChannel(state: FreexsterState) {
  return state.channels.find((channel) => channel.id === state.activeChannelId) ?? listApprovedChannels(state)[0] ?? null;
}
