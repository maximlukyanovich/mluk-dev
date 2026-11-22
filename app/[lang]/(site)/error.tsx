"use client";

import { useParams } from "next/navigation";

import { dictionaryFor } from "@/shared/i18n/dictionaries";
import { defaultLocale, hasLocale, localePath } from "@/shared/i18n/locales";
import { Button } from "@/shared/ui/button";

/**
 * A page under `(site)` that failed to render: the header and footer stay,
 * the page gives way to this, in the visitor's locale. An error boundary is a
 * Client Component, so the locale comes from useParams, not next/root-params.
 */
export default function SiteError({ retry }: { retry: () => void }) {
  const { lang } = useParams<{ lang: string }>();
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const { error: copy, meta } = dictionaryFor(locale);

  return (
    <div className="flex max-w-3xl flex-col gap-6 py-18">
      {/* Error boundaries take no metadata exports. */}
      <title>{`${copy.title} · ${meta.siteName}`}</title>
      <meta name="robots" content="noindex" />
      <p className="mk-eyebrow">
        <span className="mk-dot" aria-hidden="true" />
        {copy.eyebrow}
      </p>
      <h1 className="font-display text-display-title text-fg">{copy.title}</h1>
      <p className="text-lead text-muted">{copy.body}</p>
      <div className="flex flex-wrap items-center gap-6">
        {/* retry() fetches the page again and renders it in place. */}
        <Button variant="primary" onClick={() => retry()}>
          {copy.retry}
        </Button>
        <a className="mk-link" href={localePath(locale, "/")}>
          {copy.home}
        </a>
      </div>
    </div>
  );
}
