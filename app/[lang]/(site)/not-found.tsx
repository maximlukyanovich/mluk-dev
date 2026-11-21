import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { localePath } from "@/shared/i18n/locales";

export default async function NotFound() {
  const [locale, { notFound: copy }] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-6 px-4 py-16 sm:px-8">
      <p className="mk-eyebrow">
        <span className="mk-dot" aria-hidden="true" />
        {copy.eyebrow}
      </p>
      <h1 className="font-display text-display-title text-fg">{copy.title}</h1>
      <p className="text-lead text-muted">{copy.body}</p>
      <p>
        <a className="mk-link" href={localePath(locale, "/")}>
          {copy.home}
        </a>
      </p>
    </main>
  );
}
