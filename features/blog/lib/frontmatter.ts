import type { PostMeta } from "./types";

/** A tag as it appears in a URL: lowercase Latin letters, digits, hyphens. */
export const tagPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function fail(file: string, message: string): never {
  throw new Error(`${file}: ${message}`);
}

function requiredText(
  data: Record<string, unknown>,
  key: string,
  file: string,
): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    fail(file, `frontmatter \`${key}\` must be a non-empty string`);
  }
  return value.trim();
}

/**
 * A `YYYY-MM-DD` date. YAML reads an unquoted `2026-11-18` as a Date at UTC
 * midnight and a quoted one as a string; both are accepted, a time of day or
 * an impossible day (`2026-02-30`) is not.
 */
function date(value: unknown, key: string, file: string): string {
  let text: string | undefined;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const iso = value.toISOString();
    if (iso.endsWith("T00:00:00.000Z")) text = iso.slice(0, 10);
  } else if (typeof value === "string" && isoDate.test(value)) {
    const parsed = new Date(`${value}T00:00:00Z`);
    if (
      !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().startsWith(value)
    ) {
      text = value;
    }
  }
  return (
    text ?? fail(file, `frontmatter \`${key}\` must be a date as YYYY-MM-DD`)
  );
}

/** Checks a post's frontmatter; a bad field throws with the file's path. */
export function parseFrontmatter(
  data: Record<string, unknown>,
  file: string,
): PostMeta {
  const title = requiredText(data, "title", file);
  const description = requiredText(data, "description", file);
  const published = date(data.date, "date", file);
  const updated =
    data.updated === undefined
      ? undefined
      : date(data.updated, "updated", file);
  if (updated !== undefined && updated < published) {
    fail(file, "frontmatter `updated` is earlier than `date`");
  }

  const tags = data.tags;
  if (!Array.isArray(tags)) fail(file, "frontmatter `tags` must be a list");
  for (const tag of tags) {
    if (typeof tag !== "string" || !tagPattern.test(tag)) {
      fail(
        file,
        `tag \`${String(tag)}\` must be lowercase Latin letters, digits and hyphens`,
      );
    }
  }
  if (new Set(tags).size !== tags.length)
    fail(file, "frontmatter `tags` has a duplicate");

  return {
    title,
    description,
    date: published,
    ...(updated !== undefined && { updated }),
    tags: tags as string[],
  };
}
