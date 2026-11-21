import { describe, expect, it } from "vitest";

import { videoUrls, vimeoPoster, youtubePoster } from "./embed";

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

describe("youtubePoster", () => {
  it("takes the 1280px picture when it exists, else the 480px one", () => {
    expect(youtubePoster("aqz-KE-bpKQ", true)).toBe(
      "https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg",
    );
    expect(youtubePoster("aqz-KE-bpKQ", false)).toBe(
      "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg",
    );
  });
});

describe("vimeoPoster", () => {
  it("reads the picture from the oEmbed answer, without its query", () => {
    expect(
      vimeoPoster({
        thumbnail_url:
          "https://i.vimeocdn.com/video/20963649-abc-d_960?region=us",
      }),
    ).toBe("https://i.vimeocdn.com/video/20963649-abc-d_960");
  });

  it.each([
    ["no answer", null],
    ["no picture", { title: "x" }],
    ["another host", { thumbnail_url: "https://example.com/x.jpg" }],
  ])("has none for %s", (_, answer) => {
    expect(vimeoPoster(answer)).toBeNull();
  });
});
