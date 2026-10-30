import { patterns, pipeline } from "@/lib/content";

export function PipelineSection({ indexed }: { indexed: number }) {
  return (
    <section id="assemblage" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
      <h2 className="text-3xl tracking-tight sm:text-4xl">De la source à l’image</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Quatre étapes, dans l’ordre où un paquet devient un morceau du système
        flashé sur l’appareil.
      </p>
      <ol className="mt-8 grid gap-4 lg:grid-cols-4">
        {pipeline.map((item) => (
          <li key={item.step} className="flex flex-col rounded-2xl border border-border bg-card/60 p-4">
            <span className="font-mono text-xs text-sand">{item.step}</span>
            <h3 className="mt-2 text-2xl leading-tight">{item.title}</h3>
            <p className="mt-1 font-mono text-xs text-foam">{item.where}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-2xl border border-border bg-card/40 p-4 sm:p-6">
        <h3 className="text-2xl">Les patterns qui remplissent l’image</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Documentés par Jolla. Le relevé des {indexed} dépôts ne contient aucun
          dépôt <span className="font-mono text-foreground">patterns-sailfish-*</span>.
          Sur un port, le pattern d’adaptation est généré dans le droid-config,
          dans l’organisation mer-hybris. Depuis Sailfish OS 3.4, les anciens
          fichiers de patterns YAML ont été remplacés par ces méta-paquets.
        </p>
        <ul className="mt-4 divide-y divide-border">
          {patterns.map((pattern) => (
            <li key={pattern.name} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] sm:gap-6">
              <code className="text-sm break-all text-foam">{pattern.name}</code>
              <span className="text-sm text-muted-foreground">{pattern.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
