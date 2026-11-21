import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { localePath } from "@/shared/i18n/locales";

export default async function NotFound() {
  const [locale, { notFound: copy }] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);

  return (
    <div className="flex max-w-3xl flex-col gap-6 py-18">
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
    </div>
  );
}
