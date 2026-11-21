import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary } from "@/shared/i18n/get-dictionary";

// An unmatched path under a locale (`/en/nope`) lands here and gets the
// localized 404 of `(site)`. Without it Next answers with its built-in page.

export async function generateMetadata(): Promise<Metadata> {
  const { notFound } = await getDictionary();
  return { title: notFound.title };
}

export default function CatchAll() {
  notFound();
}
