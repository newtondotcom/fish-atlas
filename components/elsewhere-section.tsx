import { ExternalLink } from "@/components/external-link";
import { elsewhere, merHybrisCores, sources } from "@/lib/content";

export function ElsewhereSection() {
  return (
    <section id="ailleurs" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
      <h2 className="text-3xl tracking-tight sm:text-4xl">Hors de l’organisation</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        L’image d’un téléphone ne sort pas de github.com/sailfishos seule. La
        compilation, le HAL Android et une partie de l’interface sont ailleurs.
      </p>
      <ul className="mt-8 grid gap-4 lg:grid-cols-2">
        {elsewhere.map((place) => (
          <li key={place.title} className="rounded-2xl border border-border bg-card/50 p-4">
            <p className="font-mono text-xs text-sand">{place.meta}</p>
            <h3 className="mt-1 text-2xl">
              <ExternalLink href={place.href} className="text-foreground">
                {place.title}
              </ExternalLink>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{place.text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-2xl border border-border p-4">
        <h3 className="text-xl">Dépôts mer-hybris qui ferment la chaîne</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {merHybrisCores.map((repo) => (
            <li key={repo.name}>
              <ExternalLink
                href={repo.href}
                className="inline-flex rounded-full border border-border px-3 py-1 font-mono text-xs text-foam no-underline hover:bg-accent"
              >
                {repo.name}
              </ExternalLink>
            </li>
          ))}
        </ul>
      </div>
      <footer className="mt-10 border-t border-border pt-6">
        <h2 className="text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Sources du relevé
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {sources.map((source) => (
            <li key={source.href}>
              <ExternalLink href={source.href}>{source.label}</ExternalLink>
            </li>
          ))}
        </ul>
      </footer>
    </section>
  );
}
