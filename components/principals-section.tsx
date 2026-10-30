import { ExternalLink } from "@/components/external-link";
import { principalGroups } from "@/lib/content";
import { formatParis } from "@/lib/format";
import type { Catalog, Repo } from "@/lib/types";

export function PrincipalsSection({ catalog }: { catalog: Catalog }) {
  const byName = new Map(catalog.repos.map((repo) => [repo.name, repo]));

  return (
    <section id="depots" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
      <h2 className="text-3xl tracking-tight sm:text-4xl">Dépôts à ouvrir en premier</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Une quarantaine de dépôts, choisis parce qu’ils portent l’image, la
        session, l’interface ou le SDK. Le reste du catalogue est l’empaquetage
        de la distribution.
      </p>
      <div className="mt-8 space-y-10">
        {principalGroups.map((group) => (
          <section key={group.id} aria-labelledby={`groupe-${group.id}`}>
            <h3 id={`groupe-${group.id}`} className="text-2xl">
              {group.title}
            </h3>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{group.lede}</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {group.repos.map((item) => (
                <PrincipalCard key={item.name} item={item} repo={byName.get(item.name)} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

function PrincipalCard({
  item,
  repo,
}: {
  item: { name: string; text: string };
  repo: Repo | undefined;
}) {
  const href = repo?.url ?? `https://github.com/sailfishos/${item.name}`;
  return (
    <li className="rounded-2xl border border-border bg-card/50 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-lg">
          <ExternalLink href={href} className="font-mono text-base text-foam no-underline hover:underline">
            {item.name}
          </ExternalLink>
        </h4>
        <p className="font-mono text-xs text-muted-foreground">
          {repo ? `${repo.stars} ★ · ${formatParis(repo.pushed)}` : "lien direct"}
          {repo?.archived ? " · archivé" : ""}
        </p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
    </li>
  );
}
