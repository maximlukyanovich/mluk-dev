import { describe, expect, it } from "vitest";

import { parseBody } from "./markdown";
import { readingTime, wordsPerMinute } from "./reading-time";

const words = (n: number) => Array.from({ length: n }, () => "слово").join(" ");

describe("readingTime", () => {
  it("is at least one minute", () => {
    expect(readingTime(parseBody(""))).toBe(1);
    expect(readingTime(parseBody("Two words."))).toBe(1);
  });

  it("rounds up by words a minute", () => {
    expect(readingTime(parseBody(words(wordsPerMinute)))).toBe(1);
    expect(readingTime(parseBody(words(wordsPerMinute + 1)))).toBe(2);
  });

  it("does not count code blocks or imports", () => {
    const code = "```js\n" + words(wordsPerMinute * 3) + "\n```";
    expect(
      readingTime(parseBody(`import x from "./x";\n\n${words(10)}\n\n${code}`)),
    ).toBe(1);
  });
});
