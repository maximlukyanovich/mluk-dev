import { localePath, type Locale } from "@/shared/i18n/locales";
import { personId, siteUrl } from "@/shared/lib/site";

import { casePath } from "./cases";
import type { Collaborator, Project } from "./types";

function contributor({ name, href }: Collaborator) {
  return { "@type": "Person", name, ...(href && { url: href }) };
}

/**
 * A project as a schema.org CreativeWork by the site's Person. Its URL is the
 * live site, else the code, and is left out when the project has neither.
 */
function work(project: Project) {
  // `||`: an empty string is no link, as on the card.
  const url = project.links.live || project.links.code;
  return {
    "@type": "CreativeWork",
    name: project.name,
    description: project.description,
    ...(url && { url }),
    author: { "@id": personId },
    ...(project.feat && { contributor: contributor(project.feat) }),
  };
}

/**
 * The projects page as a schema.org CollectionPage. `projects` is the list in
 * the order the page shows it, so each `position` matches the card.
 */
export function projectsJsonLd(projects: readonly Project[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: siteUrl + localePath(locale, "/projects"),
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: work(project),
      })),
    },
  };
}

/**
 * A case page's project as a schema.org CreativeWork: the work of the
 * projects page, the case page as the page about it, and the cover as its
 * image when it has one. The page's BreadcrumbList comes from `Breadcrumbs`.
 */
export function caseJsonLd(project: Project, locale: Locale) {
  return {
    "@context": "https://schema.org",
    ...work(project),
    inLanguage: locale,
    mainEntityOfPage: siteUrl + localePath(locale, casePath(project.slug)),
    ...(project.cover && { image: siteUrl + project.cover }),
  };
}
