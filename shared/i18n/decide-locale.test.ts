import { describe, expect, it } from "vitest";

import { decideLocale, negotiate } from "./decide-locale";

describe("decideLocale", () => {
  it("redirects a bare root by Accept-Language when there is no cookie", () => {
    expect(
      decideLocale({ pathname: "/", acceptLanguage: "ru-RU,ru;q=0.9" }),
    ).toEqual({ redirect: "/ru" });
  });

  it("prefers the cookie over Accept-Language", () => {
    expect(
      decideLocale({ pathname: "/", cookie: "en", acceptLanguage: "ru" }),
    ).toEqual({ redirect: "/en" });
  });

  it("ignores a cookie with a foreign locale and falls back to the default", () => {
    expect(decideLocale({ pathname: "/", cookie: "de" })).toEqual({
      redirect: "/en",
    });
  });

  it("keeps the path and the query of an unprefixed request", () => {
    expect(
      decideLocale({ pathname: "/writing", search: "?x=1", cookie: "ru" }),
    ).toEqual({ redirect: "/ru/writing?x=1" });
  });

  it("treats a lookalike segment as unprefixed", () => {
    expect(decideLocale({ pathname: "/english", cookie: "en" })).toEqual({
      redirect: "/en/english",
    });
  });

  it("serves a prefixed path and remembers its locale", () => {
    expect(decideLocale({ pathname: "/ru/cv", cookie: "en" })).toEqual({
      next: true,
      setCookie: "ru",
    });
    expect(decideLocale({ pathname: "/ru" })).toEqual({
      next: true,
      setCookie: "ru",
    });
  });

  it("serves a prefixed path without a cookie when it already matches", () => {
    expect(decideLocale({ pathname: "/en/cv", cookie: "en" })).toEqual({
      next: true,
    });
  });
});

describe("negotiate", () => {
  it.each([
    ["ru-RU,ru;q=0.9,en;q=0.8", "ru"],
    ["de-DE,de;q=0.9,en;q=0.7,ru;q=0.8", "ru"],
    ["en;q=0.5, ru;q=0.5", "en"],
    ["ru;q=0, en;q=0.1", "en"],
    ["EN-gb", "en"],
    ["de, *", undefined],
    ["", undefined],
    [null, undefined],
  ])("%j → %j", (header, expected) => {
    expect(negotiate(header)).toBe(expected);
  });
});
