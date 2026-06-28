import type { NativeStatus } from "../domain/types";

export async function loadNativeStatus(): Promise<NativeStatus> {
  if (!("__TAURI_INTERNALS__" in window)) {
    return {
      runtime: "web",
      simplexRunner: "mock-connected",
      registry: "mock",
    };
  }

  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<NativeStatus>("freexster_status");
}
