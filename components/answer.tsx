import { ExternalLink } from "@/components/external-link";
import { formatParisDateTime } from "@/lib/format";
import type { Stats } from "@/lib/types";

const rows = [
  {
    step: "Sources",
    place: "github.com/sailfishos",
    detail: "Un dépôt public par paquet RPM. Un tag Git déclenche le build.",
  },
  {
    step: "Compilation",
    place: "build.sailfishos.org",
    detail: "L’Open Build Service produit les RPM, puis les promeut de devel vers testing, puis release.",
  },
  {
    step: "Sélection",
    place: "patterns-sailfish-*",
    detail:
      "Méta-paquets qui décident du contenu de l’image. Aucun dépôt public de l’organisation ne porte ces noms.",
  },
  {
    step: "Image",
    place: "sailfishos/mic",
    detail: "mic lit le kickstart de l’appareil et écrit le rootfs flashable.",
  },
  {
    step: "Téléphone Android",
    place: "mer-hybris + HADK",
    detail:
      "libhybris, droid-hal et le droid-config vivent hors de cette organisation. Le Platform SDK appelle ensuite mic.",
  },
  {
    step: "Noyau",
    place: "adaptation matérielle",
    detail:
      "Le système ne fournit pas le noyau. Dans cette organisation, kernel-adaptation-pc couvre le PC.",
  },
];

export function Answer({ stats }: { stats: Stats }) {
  return (
    <section id="contenu" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-12 pb-6 sm:px-6 sm:pt-16">
      <p className="text-sm font-semibold tracking-[0.18em] text-foam uppercase">
        Relevé du {formatParisDateTime(stats.fetchedAt)}
      </p>
      <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] font-medium tracking-tight text-balance sm:text-6xl">
        Sailfish OS se construit comme une distribution, paquet par paquet.
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
        L’organisation publie {stats.claimedPublicRepos} dépôts publics. L’index
        de recherche GitHub en a renvoyé {stats.indexed} lors de ce relevé, dont{" "}
        {stats.archived} archivés. L’image du système sort de l’enchaînement
        suivant : l’OBS compile les RPM, les patterns les sélectionnent,{" "}
        <ExternalLink href="https://github.com/sailfishos/mic" className="text-foam">
          mic
        </ExternalLink>{" "}
        assemble le rootfs.
      </p>
      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Dépôts indexés", String(stats.indexed)],
          ["Archivés", String(stats.archived)],
          ["Sans langage détecté", String(stats.withoutLanguage)],
          ["Annoncés par l’org", String(stats.claimedPublicRepos)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-card/70 px-4 py-3">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="font-heading text-3xl tracking-tight">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
        {stats.withoutLanguage} dépôts n’exposent pas de langage à GitHub : ce
        sont surtout des empaquetages, un fichier spec et des patches, parfois
        un sous-module vers{" "}
        <ExternalLink href="https://github.com/sailfishos-mirror" className="text-foreground">
          sailfishos-mirror
        </ExternalLink>
        .
      </p>

      <h2 className="mt-12 text-3xl tracking-tight sm:text-4xl">Où le système est construit</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
        <table className="hidden w-full text-left text-sm sm:table">
          <caption className="sr-only">Étapes de construction de Sailfish OS</caption>
          <thead className="bg-card/80 text-left text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">Étape</th>
              <th scope="col" className="px-4 py-2 font-medium">Lieu</th>
              <th scope="col" className="px-4 py-2 font-medium">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.step} className="border-b border-border last:border-0">
                <th scope="row" className="w-[22%] px-4 py-3 align-top font-semibold whitespace-nowrap">
                  {row.step}
                </th>
                <td className="px-4 py-3 align-top font-mono text-xs text-foam sm:text-sm">
                  {row.place}
                </td>
                <td className="hidden px-4 py-3 align-top text-muted-foreground sm:table-cell">
                  {row.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="space-y-3 px-4 py-4 sm:hidden">
          {rows.map((row) => (
            <li key={row.step}>
              <p className="font-semibold">{row.step}</p>
              <p className="font-mono text-xs text-foam">{row.place}</p>
              <p className="text-sm text-muted-foreground">{row.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
