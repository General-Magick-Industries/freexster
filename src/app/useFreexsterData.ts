import { useEffect, useMemo, useState, useRef } from "react";
import type { ChannelRequestInput, FreexsterClient } from "../adapters/freexsterClient";
import { loadSimplexRunnerStatus } from "../adapters/simplexRunner";
import type { FreexsterState, NativeStatus, SimplexRunnerStatus, Surface } from "../domain/types";

type LoadStatus = "loading" | "ready" | "error";

export function useFreexsterData(client: FreexsterClient) {
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<FreexsterState | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    let active = true;

    async function load() {
      try {
        const [loadedState, simplexRunner] = await Promise.all([client.loadState(), loadSimplexRunnerStatus()]);
        if (!active || !isMountedRef.current) return;
        setState({
          ...loadedState,
          simplexRunner,
          nativeStatus: {
            ...loadedState.nativeStatus,
            simplexRunner: summarizeSimplexRunnerStatus(simplexRunner),
          },
        });
        setStatus("ready");
      } catch (caught) {
        if (!active || !isMountedRef.current) return;
        setError(caught instanceof Error ? caught.message : "Unable to load Freexster state.");
        setStatus("error");
      }
    }

    void load();

    return () => {
      isMountedRef.current = false;
      active = false;
    };
  }, [client]);

  return useMemo(
    () => ({
      status,
      error,
      state,
      setActiveSurface(surface: Surface) {
        setState((current) => (current ? { ...current, activeSurface: surface } : current));
      },
      async submitChannelRequest(input: ChannelRequestInput) {
        const request = await client.submitChannelRequest(input);
        if (!isMountedRef.current) return request;
        setState((current) =>
          current ? { ...current, channelRequests: [request, ...current.channelRequests] } : current,
        );
        return request;
      },
    }),
    [client, error, state, status],
  );
}

function summarizeSimplexRunnerStatus(status: SimplexRunnerStatus): NativeStatus["simplexRunner"] {
  if (status.canConnect) return "connected";
  if (status.state === "desktop-required" || status.state === "not-configured") return "not-configured";

  return "error";
}
