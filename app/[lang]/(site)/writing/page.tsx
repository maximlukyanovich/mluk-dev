import { BlogIndex, writingListMetadata } from "@/features/blog";

export const generateMetadata = () => writingListMetadata();

export default function WritingPage() {
  return <BlogIndex />;
}
