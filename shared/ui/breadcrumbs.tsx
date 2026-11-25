import Link from "next/link";
import { Fragment } from "react";

import { siteUrl } from "@/shared/lib/site";
import { JsonLd } from "@/shared/ui/json-ld";

type Crumb = { name: string; href: string };

type BreadcrumbsProps = {
  label: string;
  /** The ancestors, from the home page down; the last is the parent. */
  trail: readonly Crumb[];
  current: string;
};

/**
 * The kit's Breadcrumbs: ancestors as links, `›` between, the page as text;
 * on a phone one link back to the parent. The same items go to search
 * engines as a JSON-LD BreadcrumbList.
 */
export function Breadcrumbs({ label, trail, current }: BreadcrumbsProps) {
  const parent = trail.at(-1);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      ...trail.map(({ name, href }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
        item: siteUrl + href,
      })),
      { "@type": "ListItem", position: trail.length + 1, name: current },
    ],
  };

  return (
    <nav className="mk-crumbs" aria-label={label}>
      <JsonLd data={jsonLd} />
      <ol>
        {trail.map(({ name, href }) => (
          <Fragment key={href}>
            <li>
              <Link href={href}>{name}</Link>
            </li>
            <li className="mk-crumbs-sep" aria-hidden="true">
              ›
            </li>
          </Fragment>
        ))}
        <li aria-current="page">{current}</li>
      </ol>
      {parent && (
        <Link className="mk-crumbs-back" href={parent.href}>
          <span aria-hidden="true">←</span>
          {parent.name}
        </Link>
      )}
    </nav>
  );
}
