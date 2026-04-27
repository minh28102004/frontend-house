import CategoryPostsPage from "@/modules/client/posts/pages/CategoryPostsPage";

export default async function PostsByCategorySlug({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryPostsPage slug={slug} />;
}