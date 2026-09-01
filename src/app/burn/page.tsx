import BurnPage from "@/features/burn/components/BurnPage";

type PageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { tab } = await searchParams;

  return <BurnPage initialTab={tab === "diary" ? "diary" : "emotion"} />;
}
