import RulesPage from '@/modules/client/rules/components/RulesPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <RulesPage slug={slug} />;
}

export async function generateStaticParams() {
  return [];
}
