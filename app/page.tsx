import { Answer } from "@/components/answer";
import { Catalog } from "@/components/catalog";
import { ElsewhereSection } from "@/components/elsewhere-section";
import { PipelineSection } from "@/components/pipeline-section";
import { PrincipalsSection } from "@/components/principals-section";
import { SiteHeader } from "@/components/site-header";
import { StrataSection } from "@/components/strata-section";
import catalogJson from "@/data/catalog.json";
import statsJson from "@/data/stats.json";
import type { Catalog as CatalogData, Stats } from "@/lib/types";
import { Suspense } from "react";

const catalog = catalogJson as CatalogData;
const stats = statsJson as Stats;

export default function Page({ searchParams }: PageProps<"/">) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-30 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Aller au contenu
      </a>
      <SiteHeader />
      <main>
        <Answer stats={stats} />
        <PipelineSection indexed={stats.indexed} />
        <StrataSection stats={stats} />
        <PrincipalsSection catalog={catalog} />
        <ElsewhereSection />
        <Suspense
          fallback={
            <p className="mx-auto max-w-6xl px-4 py-12 text-muted-foreground sm:px-6">
              Ouverture du catalogue…
            </p>
          }
        >
          <CatalogGate searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function CatalogGate({
  searchParams,
}: {
  searchParams: PageProps<"/">["searchParams"];
}) {
  const params = await searchParams;
  const raw = params.couche;
  const requested = Array.isArray(raw) ? raw[0] : (raw ?? null);
  return <Catalog catalog={catalog} requested={requested} />;
}
