import { describe, expect, it } from "vitest";

import { utcOffsetLabel } from "./time";

describe("utcOffsetLabel", () => {
  const winter = "2026-01-15T12:00:00Z";
  const summer = "2026-07-15T12:00:00Z";

  it.each([
    ["Asia/Tbilisi", winter, "UTC+4"],
    ["Asia/Tbilisi", summer, "UTC+4"],
    ["UTC", winter, "UTC"],
    ["Europe/London", winter, "UTC"],
    ["America/New_York", winter, "UTC−5"],
    ["America/New_York", summer, "UTC−4"],
    ["Asia/Kolkata", winter, "UTC+5:30"],
  ])("%s on %s is %s", (zone, date, label) => {
    expect(utcOffsetLabel(zone, new Date(date))).toBe(label);
  });
});
