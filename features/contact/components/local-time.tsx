"use client";

import type { Locale } from "@/shared/i18n/locales";

import { useMinute } from "../lib/minute-store";

type LocalTimeProps = {
  timeZone: string;
  locale: Locale;
};

/**
 * The owner's time of day, "14:20", kept current to the minute. The server
 * and a visitor without scripts get "--:--", as wide in the mono face.
 */
export function LocalTime({ timeZone, locale }: LocalTimeProps) {
  const minute = useMinute();
  if (minute === null) return <span className="tabular-nums">--:--</span>;

  const time = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(minute * 60_000);
  return (
    <time className="tabular-nums" dateTime={time}>
      {time}
    </time>
  );
}
