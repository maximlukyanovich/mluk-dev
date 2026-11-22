/** Posts on a page of a list; the featured post on `/writing` is one of them. */
export const pageSize = 10;

/** Pages a list of `total` posts takes; an empty list is still one page. */
export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** The posts of page `page` (1-based). */
export function pageItems<T>(items: readonly T[], page: number): T[] {
  return items.slice((page - 1) * pageSize, page * pageSize);
}

/**
 * The page number in `/writing/page/<n>`, or null for a 404: not a plain
 * positive integer (`0`, `02`, `2a`), past the last page, or `1` — the first
 * page lives at the list's own URL, not under `page/1`.
 */
export function parsePage(raw: string, pages: number): number | null {
  if (!/^[1-9]\d*$/.test(raw)) return null;
  const page = Number(raw);
  return page >= 2 && page <= pages ? page : null;
}

export type PageWindowItem = number | "gap";

/**
 * The pager's buttons: the first and last page, the current one and its
 * neighbours, a gap for each hidden run — `1 … 4 5 6 … 10`. A gap never
 * hides a single page: that page is shown instead.
 */
export function pageWindow(current: number, total: number): PageWindowItem[] {
  const shown = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const items: PageWindowItem[] = [];
  for (const page of shown) {
    const previous = items.at(-1);
    if (typeof previous === "number" && page - previous === 2)
      items.push(previous + 1);
    else if (typeof previous === "number" && page - previous > 2)
      items.push("gap");
    items.push(page);
  }
  return items;
}
