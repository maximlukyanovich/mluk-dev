import { getDictionary } from "@/shared/i18n/get-dictionary";

// A stand-in until slice 5 builds the home page: proves the locale route.
export default async function Home() {
  const { meta } = await getDictionary();
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <h1 className="font-display text-display-title text-fg">
        {meta.siteName}
      </h1>
    </main>
  );
}
