# Writing a post

A post is a folder under `content/posts/` with one MDX file per locale. Start
one by copying `content/posts/_template/` to `content/posts/<slug>/`. The
reference post `content/posts/post-elements/` uses every element below; copy
from its source.

## Files

```text
content/posts/<slug>/
  en.mdx        the English version
  ru.mdx        the Russian version (optional: a post may exist in one locale)
  shot.png      pictures the post imports, next to it
```

- The folder name is the slug in the URL (`/en/writing/<slug>`): lowercase
  Latin letters, digits and hyphens. `page` and `tag` are reserved.
- A folder whose name starts with `_` is not a post. `_template` stays in the
  repository even when no post exists: the build needs one `.mdx` under
  `content/posts/` to compile the blog's import of a post.
- A post without a translation is fine: the language switch on it leads to the
  other locale's blog, and the post shows no «Русский ↗» / «English ↗» pill.
- Both locales of a post change in the same commit, like the dictionaries.

## Frontmatter

```yaml
---
title: "i18n in Next.js 16 without a library"
description: "One sentence: the lead under the title, the card text, RSS, Open Graph."
date: 2026-11-18
updated: 2026-11-19 # optional, not earlier than date
tags: [nextjs, i18n] # lowercase Latin slugs
---
```

A missing or unknown field (`draft:` is not one), a date that is not
`YYYY-MM-DD` or does not exist, or a tag with a capital letter fails the
build with the file's path. Give a translation the same tags: nothing checks
it, and a tag one locale lacks sends the language switch to the list. The excerpt, reading time and
table of contents are computed from the text.

## Text

Markdown with GFM: `**bold**`, `_italic_`, `` `code` ``, links, lists,
`> quotes`, tables and footnotes (`text[^id]` and `[^id]: the note` at the
end). `## Headings` are the post's sections: three or more give it a table of
contents, and they are numbered `01`, `02` … by the page, not in the text.

## Code blocks

````md
```tsx title="app/page.tsx" {4} /locale/
…
```
````

- The language after the backticks gives the badge and the highlighting.
- `title="…"` — the file name in the block's bar.
- `{4}` or `{2-5,8}` — highlighted lines; `/word/` — highlighted words.
- `// [!code ++]` and `// [!code --]` at the end of a line mark it added or
  removed; the copy button copies the new version only.
- A block over 20 lines opens collapsed; `nocollapse` after the language keeps
  it open.

## Components

```mdx
import shot from "./shot.png";

<Figure src={shot} alt="What the picture shows" caption="Optional caption" />

<Note>A rule the reader must not miss — once or twice a post.</Note>

<YouTube id="aqz-KE-bpKQ" title="Video title" caption="Optional caption" />
<Vimeo id="1084537" title="Video title" />
```

- **`Figure`** — a picture with an optional caption; a click opens it full
  size. `alt` describes the picture for screen readers. A file over 1 MB fails
  the tests. Diagrams are pictures too.
- **`Note`** — a callout with a lime outline.
- **`YouTube`, `Vimeo`** — the id from the video's address, not the URL. The
  facade shows the service's preview picture, looked up when the site is
  built and served through the site's own image optimiser, so the page loads
  nothing from the service until the reader presses play. A `poster={image}`
  of your own, imported beside the post, replaces it. The caption always
  ends with a link to the video on its service.
