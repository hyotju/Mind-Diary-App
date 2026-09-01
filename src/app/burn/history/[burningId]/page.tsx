import BurningHistoryDetailPage from "@/features/burn/components/BurningHistoryDetailPage";

type PageProps = {
  params: Promise<{ burningId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { burningId } = await params;

  return <BurningHistoryDetailPage burningId={burningId} />;
}
