import {
  BlogIndex,
  generateTagPageParams,
  writingListMetadata,
} from "@/features/blog";

// Each tag of the parent locale with its pages 2…N — the tag too: the sibling
// tag/[tag]/page.tsx is no parent segment. None → a placeholder that is a 404.
export const generateStaticParams = generateTagPageParams;

// Read outside Suspense, as on a post: the list is in the prerendered HTML,
// and an unknown page is the localized 404 under a 200.
export const instant = false;

type Props = PageProps<"/[lang]/writing/tag/[tag]/page/[n]">;

export async function generateMetadata({ params }: Props) {
  const { tag, n } = await params;
  return writingListMetadata({ tag, raw: n });
}

export default async function TagListPage({ params }: Props) {
  const { tag, n } = await params;
  return <BlogIndex query={{ tag, raw: n }} />;
}
