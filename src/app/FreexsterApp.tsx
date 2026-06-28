import { useMemo } from "react";
import { createMockFreexsterClient } from "../adapters/mockFreexsterClient";
import { AppShell } from "../components/AppShell";
import { useFreexsterData } from "./useFreexsterData";

export function FreexsterApp() {
  const client = useMemo(() => createMockFreexsterClient(), []);
  const data = useFreexsterData(client);

  if (data.status === "loading") {
    return <main className="app-boot">Loading Freexster...</main>;
  }

  if (data.status === "error" || !data.state) {
    return <main className="app-boot">Freexster could not load: {data.error}</main>;
  }

  return (
    <AppShell
      state={data.state}
      onSurfaceChange={data.setActiveSurface}
      onSubmitChannelRequest={async (input) => {
        await data.submitChannelRequest(input);
      }}
    />
  );
}
