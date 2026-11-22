import {
  BlogIndex,
  generateListPageParams,
  writingListMetadata,
} from "@/features/blog";

// Pages 2…N of the parent locale; one page or none → a placeholder that is
// a 404.
export const generateStaticParams = generateListPageParams;

// The page number is read outside Suspense, as on a post: the list is in the
// prerendered HTML, and an unknown page is the localized 404 under a 200.
export const instant = false;

type Props = PageProps<"/[lang]/writing/page/[n]">;

export async function generateMetadata({ params }: Props) {
  const { n } = await params;
  return writingListMetadata({ raw: n });
}

export default async function WritingListPage({ params }: Props) {
  const { n } = await params;
  return <BlogIndex query={{ raw: n }} />;
}
