import { cacheLife } from "next/cache";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { videoPoster } from "./video-poster";

vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  fetchMock.mockReset();
  vi.mocked(cacheLife).mockReset();
});

describe("videoPoster", () => {
  it("keeps a found picture for good", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
    await expect(videoPoster("youtube", "aqz-KE-bpKQ")).resolves.toBe(
      "https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg",
    );
    expect(cacheLife).toHaveBeenCalledWith("max");
  });

  it("gives up after five seconds", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
    await videoPoster("youtube", "aqz-KE-bpKQ");
    expect(timeout).toHaveBeenCalledWith(5000);
    expect(fetchMock.mock.calls[0][1]?.signal).toBe(
      timeout.mock.results[0].value,
    );
  });

  it("takes the 480px picture for good when YouTube has no 1280px one", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 404 }));
    await expect(videoPoster("youtube", "aqz-KE-bpKQ")).resolves.toBe(
      "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg",
    );
    expect(cacheLife).toHaveBeenCalledWith("max");
  });

  it.each([
    [
      "a network error",
      () => fetchMock.mockRejectedValue(new TypeError("fetch failed")),
    ],
    [
      "a timeout",
      () => fetchMock.mockRejectedValue(new DOMException("", "TimeoutError")),
    ],
    [
      "an error answer",
      () => fetchMock.mockResolvedValue(new Response(null, { status: 503 })),
    ],
  ])(
    "keeps no picture for an hour only after %s, and says so",
    async (_, fail) => {
      fail();
      await expect(videoPoster("vimeo", "1084537")).resolves.toBeNull();
      expect(cacheLife).toHaveBeenCalledWith("hours");
      expect(cacheLife).not.toHaveBeenCalledWith("max");
      expect(console.warn).toHaveBeenCalled();
    },
  );

  it.each([429, 403, 500])(
    "keeps no picture for an hour only when YouTube answers %i",
    async (status) => {
      fetchMock.mockResolvedValue(new Response(null, { status }));
      await expect(videoPoster("youtube", "aqz-KE-bpKQ")).resolves.toBeNull();
      expect(cacheLife).toHaveBeenCalledWith("hours");
      expect(cacheLife).not.toHaveBeenCalledWith("max");
      expect(console.warn).toHaveBeenCalled();
    },
  );
});
