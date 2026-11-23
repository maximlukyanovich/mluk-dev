/**
 * The UTC offset of `timeZone` at `date`: "UTC+4", "UTC−5", "UTC+5:30", and
 * "UTC" at zero. Read from `Intl` (its `shortOffset` name, "GMT+4"), so a
 * zone with summer time gets the offset of that day.
 */
export function utcOffsetLabel(timeZone: string, date: Date): string {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  // ICU names zero "GMT" or "GMT+0", depending on its version.
  if (/^GMT(?:[+-]0)?$/.test(name)) return "UTC";
  return name.replace(/^GMT/, "UTC").replace("-", "−");
}
