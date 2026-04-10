import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ResultPanel } from "@/components/result-panel";
import { getSuggestedTypes, getTypeBySlug } from "@/lib/sbti-data";

type ResultPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ResultPage({ params }: ResultPageProps) {
  const { slug } = await params;
  const type = getTypeBySlug(slug);

  if (!type) {
    notFound();
  }

  const suggestedTypes = getSuggestedTypes(type.code, 3);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div>
        <Link
          href="/types"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--emerald)] transition hover:text-[var(--emerald-strong)]"
        >
          <ArrowLeft size={16} />
          返回人格图鉴
        </Link>
      </div>
      <ResultPanel type={type} suggestedTypes={suggestedTypes} />
    </div>
  );
}
