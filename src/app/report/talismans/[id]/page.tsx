import SavedTalismanDetailPage from "@/features/report/components/SavedTalismanDetailPage";

type TalismanDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TalismanDetailPage({
  params,
}: TalismanDetailPageProps) {
  const { id } = await params;

  return <SavedTalismanDetailPage talismanId={id} />;
}
