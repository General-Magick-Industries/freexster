import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import type { ChannelRequestInput, FreexsterClient } from "../adapters/freexsterClient";
import type { FreexsterState, Surface } from "../domain/types";

type LoadStatus = "loading" | "ready" | "error";

export function useFreexsterData(client: FreexsterClient) {
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<FreexsterState | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const loadedState = await client.loadState();
        if (!active) return;
        setState(loadedState);
        setStatus("ready");
      } catch (caught) {
        if (!active) return;
        setError(caught instanceof Error ? caught.message : "Unable to load Freexster state.");
        setStatus("error");
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [client]);

  return useMemo(
    () => ({
      status,
      error,
      state,
      setActiveSurface(surface: Surface) {
        flushSync(() => {
          setState((current) => (current ? { ...current, activeSurface: surface } : current));
        });
      },
      async submitChannelRequest(input: ChannelRequestInput) {
        const request = await client.submitChannelRequest(input);
        flushSync(() => {
          setState((current) =>
            current ? { ...current, channelRequests: [request, ...current.channelRequests] } : current,
          );
        });
        return request;
      },
    }),
    [client, error, state, status],
  );
}
