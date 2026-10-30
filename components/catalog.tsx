"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink } from "@/components/external-link";
import { formatParis } from "@/lib/format";
import type { Catalog, CategoryId } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const PAGE_SIZE = 24;

const sorts = [
  { id: "pushed", label: "Activité récente" },
  { id: "stars", label: "Étoiles" },
  { id: "name", label: "Nom" },
] as const;

type SortId = (typeof sorts)[number]["id"];

export function Catalog({
  catalog,
  requested,
}: {
  catalog: Catalog;
  requested: string | null;
}) {
  const router = useRouter();
  const known = catalog.categories.some((category) => category.id === requested);
  const couche = known && requested ? requested : "all";
  const [query, setQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [sort, setSort] = useState<SortId>("pushed");
  const [page, setPage] = useState(1);
  const [tracked, setTracked] = useState(couche);

  if (couche !== tracked) {
    setTracked(couche);
    setPage(1);
  }

  const labels = useMemo(
    () => new Map(catalog.categories.map((category) => [category.id, category.label])),
    [catalog.categories],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = catalog.repos.filter((repo) => {
      if (couche !== "all" && repo.category !== couche) return false;
      if (!showArchived && repo.archived) return false;
      if (!needle) return true;
      return (
        repo.name.toLowerCase().includes(needle) ||
        repo.description.toLowerCase().includes(needle)
      );
    });
    const copy = [...list];
    copy.sort((a, b) => {
      if (sort === "stars") return b.stars - a.stars || a.name.localeCompare(b.name, "fr");
      if (sort === "name") return a.name.localeCompare(b.name, "fr");
      const aTime = a.pushed ? Date.parse(a.pushed) : 0;
      const bTime = b.pushed ? Date.parse(b.pushed) : 0;
      return bTime - aTime || a.name.localeCompare(b.name, "fr");
    });
    return copy;
  }, [catalog.repos, couche, query, showArchived, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const hiddenArchived = catalog.repos.filter((repo) => {
    if (showArchived || !repo.archived) return false;
    if (couche !== "all" && repo.category !== couche) return false;
    return true;
  }).length;

  function selectCouche(id: CategoryId | "all") {
    const href = id === "all" ? "/#catalogue" : `/?couche=${id}#catalogue`;
    router.replace(href, { scroll: false });
    setPage(1);
  }

  return (
    <section id="catalogue" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
      <h2 className="text-3xl tracking-tight sm:text-4xl">Catalogue des {catalog.repos.length} dépôts</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Les archivés sont masqués. La recherche porte sur le nom et la description GitHub.
      </p>

      {requested && !known ? (
        <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm" role="status">
          La couche « {requested} » ne fait pas partie de cette carte. Affichage de tous les dépôts.
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
          <div className="space-y-1">
            <label htmlFor="filtre-depot" className="text-sm font-medium">
              Filtrer par nom ou description
            </label>
            <Input
              id="filtre-depot"
              type="search"
              value={query}
              placeholder="lipstick, ofono, mic…"
              onValueChange={(value) => {
                setQuery(value);
                setPage(1);
              }}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="tri-depot" className="text-sm font-medium">
              Trier
            </label>
            <select
              id="tri-depot"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SortId);
                setPage(1);
              }}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {sorts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              variant={showArchived ? "default" : "outline"}
              aria-pressed={showArchived}
              onClick={() => {
                setShowArchived((value) => !value);
                setPage(1);
              }}
            >
              {showArchived ? "Archivés affichés" : "Afficher les archivés"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Couches">
          <Button
            type="button"
            size="sm"
            variant={couche === "all" ? "default" : "outline"}
            aria-pressed={couche === "all"}
            onClick={() => selectCouche("all")}
          >
            Toutes
          </Button>
          {catalog.categories.map((category) => (
            <Button
              key={category.id}
              type="button"
              size="sm"
              variant={couche === category.id ? "default" : "outline"}
              aria-pressed={couche === category.id}
              onClick={() => selectCouche(category.id)}
            >
              {category.label}
              <span className="font-mono text-[0.7rem] opacity-80">
                {showArchived ? category.count : category.active}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} dépôt{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
        {hiddenArchived > 0 ? ` · ${hiddenArchived} archivés masqués` : ""}
        {filtered.length > 0
          ? ` · page ${safePage} sur ${pageCount}`
          : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border px-4 py-10 text-center">
          <p className="text-lg">Aucun dépôt pour cette recherche.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Élargis le filtre, ou réaffiche les dépôts archivés.
          </p>
          <Button
            type="button"
            className="mt-4"
            variant="outline"
            onClick={() => {
              setQuery("");
              setShowArchived(true);
              selectCouche("all");
            }}
          >
            Réinitialiser
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <caption className="sr-only">
                Dépôts de l’organisation sailfishos correspondant aux filtres
              </caption>
              <thead className="bg-card/80 text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">Dépôt</th>
                  <th scope="col" className="px-3 py-2 font-medium">Couche</th>
                  <th scope="col" className="px-3 py-2 font-medium">Langage</th>
                  <th scope="col" className="px-3 py-2 font-medium">Étoiles</th>
                  <th scope="col" className="px-3 py-2 font-medium">Dernier envoi</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((repo) => (
                  <tr key={repo.name} className="border-t border-border align-top">
                    <th scope="row" className="px-3 py-3 font-normal">
                      <ExternalLink
                        href={repo.url}
                        className="font-mono text-foam no-underline hover:underline"
                      >
                        {repo.name}
                      </ExternalLink>
                      {repo.archived ? (
                        <Badge variant="outline" className="ml-2 align-middle">
                          archivé
                        </Badge>
                      ) : null}
                      <p className="mt-1 max-w-xl font-sans text-xs leading-relaxed text-muted-foreground">
                        {repo.description || "Pas de description publiée."}
                      </p>
                    </th>
                    <td className="px-3 py-3 text-muted-foreground">
                      {labels.get(repo.category)}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {repo.language ?? "empaquetage"}
                    </td>
                    <td className="px-3 py-3 tabular-nums">{repo.stars}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                      {formatParis(repo.pushed)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
            >
              Page précédente
            </Button>
            <p className="text-sm text-muted-foreground">
              {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} sur {filtered.length}
            </p>
            <Button
              type="button"
              variant="outline"
              disabled={safePage >= pageCount}
              onClick={() => setPage(safePage + 1)}
            >
              Page suivante
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
