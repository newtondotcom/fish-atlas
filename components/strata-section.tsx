import { strata } from "@/lib/content";
import type { Stats } from "@/lib/types";

export function StrataSection({ stats }: { stats: Stats }) {
  const counts = new Map(stats.categories.map((category) => [category.id, category]));

  return (
    <section id="couches" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
      <h2 className="text-3xl tracking-tight sm:text-4xl">Coupe du système</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        De l’application jusqu’au noyau. Chaque bande de l’organisation ouvre
        le catalogue filtré.
      </p>
      <ol className="mt-8 overflow-hidden rounded-2xl border border-border">
        {strata.map((layer, index) => {
          const category = layer.id === "outside" ? null : counts.get(layer.id);
          const href =
            layer.id === "outside"
              ? "#ailleurs"
              : `/?couche=${layer.id}#catalogue`;
          return (
            <li key={layer.title} className="border-b border-border last:border-0">
              <a
                href={href}
                className="grid gap-2 px-4 py-4 transition-colors hover:bg-accent/60 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6 sm:px-5"
              >
                <span className="font-mono text-xs tracking-wide text-sand uppercase">
                  {String(index + 1).padStart(2, "0")} · {layer.depth}
                </span>
                <span>
                  <span className="block text-lg font-semibold">{layer.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {layer.text}
                  </span>
                </span>
                <span className="font-mono text-xs text-foam sm:text-right">
                  {category
                    ? `${category.active} actifs · ${category.count} dépôts`
                    : "mer-hybris"}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
