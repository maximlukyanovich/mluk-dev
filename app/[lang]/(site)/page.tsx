import type { Metadata } from "next";

import { alternates } from "@/shared/i18n/alternates";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: alternates("/", await getLocale()) };
}

// A stand-in until slice 5 builds the home page: proves the locale route.
export default async function Home() {
  const { meta } = await getDictionary();
  return (
    <h1 className="py-18 font-display text-display-title text-fg">
      {meta.siteName}
    </h1>
  );
}
