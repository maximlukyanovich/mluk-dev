import { describe, expect, it } from "vitest";

import { videoUrls } from "./embed";

describe("videoUrls", () => {
  it("plays YouTube from the no-cookie domain", () => {
    expect(videoUrls("youtube", "aqz-KE-bpKQ")).toEqual({
      player: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?autoplay=1",
      page: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    });
  });

  it("plays Vimeo without tracking", () => {
    expect(videoUrls("vimeo", "1084537")).toEqual({
      player: "https://player.vimeo.com/video/1084537?dnt=1&autoplay=1",
      page: "https://vimeo.com/1084537",
    });
  });

  it.each([
    ["youtube", "https://youtu.be/aqz-KE-bpKQ"],
    ["youtube", "short"],
    ["vimeo", "abc"],
    ["vimeo", "1084537?h=x"],
  ] as const)("rejects the %s id %j", (service, id) => {
    expect(() => videoUrls(service, id)).toThrow(/video id/);
  });
});
