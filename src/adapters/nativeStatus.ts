import type { NativeStatus } from "../domain/types";

export async function loadNativeStatus(): Promise<NativeStatus> {
  const { invoke, isTauri } = await import("@tauri-apps/api/core");

  if (!isTauri()) {
    return {
      runtime: "web",
      simplexRunner: "mock-connected",
      registry: "mock",
    };
  }

  return invoke<NativeStatus>("freexster_status");
}
