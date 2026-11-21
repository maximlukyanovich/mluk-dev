import {
  BlogIndex,
  generateTagParams,
  writingListMetadata,
} from "@/features/blog";

// The parent locale's tags; none → a placeholder that is a 404.
export const generateStaticParams = generateTagParams;

// The tag is read outside Suspense, as on a post: the list is in the
// prerendered HTML, and an unknown tag is the localized 404 under a 200.
export const instant = false;

type Props = PageProps<"/[lang]/writing/tag/[tag]">;

export async function generateMetadata({ params }: Props) {
  const { tag } = await params;
  return writingListMetadata({ tag });
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  return <BlogIndex query={{ tag }} />;
}
