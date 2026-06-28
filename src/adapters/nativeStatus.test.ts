import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.fn();
const isTauriMock = vi.fn();

vi.mock("@tauri-apps/api/core", () => ({
  invoke: invokeMock,
  isTauri: isTauriMock,
}));

describe("loadNativeStatus", () => {
  beforeEach(() => {
    invokeMock.mockReset();
    isTauriMock.mockReset();
    vi.resetModules();
  });

  it("returns the web fallback when not running in Tauri", async () => {
    isTauriMock.mockReturnValue(false);

    const { loadNativeStatus } = await import("./nativeStatus");

    await expect(loadNativeStatus()).resolves.toEqual({
      runtime: "web",
      simplexRunner: "mock-connected",
      registry: "mock",
    });
    expect(isTauriMock).toHaveBeenCalledTimes(1);
    expect(invokeMock).not.toHaveBeenCalled();
  });

  it("invokes the freexster_status command when running in Tauri", async () => {
    isTauriMock.mockReturnValue(true);
    invokeMock.mockResolvedValue({
      runtime: "tauri",
      simplexRunner: "mock-connected",
      registry: "mock",
    });

    const { loadNativeStatus } = await import("./nativeStatus");

    await expect(loadNativeStatus()).resolves.toEqual({
      runtime: "tauri",
      simplexRunner: "mock-connected",
      registry: "mock",
    });
    expect(isTauriMock).toHaveBeenCalledTimes(1);
    expect(invokeMock).toHaveBeenCalledWith("freexster_status");
  });
});
