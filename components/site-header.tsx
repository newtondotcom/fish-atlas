import { ExternalLink } from "@/components/external-link";

const links = [
  { href: "#assemblage", label: "Assemblage" },
  { href: "#couches", label: "Couches" },
  { href: "#depots", label: "Dépôts clés" },
  { href: "#ailleurs", label: "Hors organisation" },
  { href: "#catalogue", label: "Catalogue" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="#contenu" className="group">
          <span className="block font-heading text-lg leading-none tracking-tight">
            Carte Sailfish OS
          </span>
          <span className="text-xs text-muted-foreground">
            github.com/sailfishos
          </span>
        </a>
        <nav aria-label="Sections" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <ExternalLink
            href="https://github.com/orgs/sailfishos/repositories"
            className="text-foam no-underline hover:underline"
          >
            Organisation
          </ExternalLink>
        </nav>
      </div>
    </header>
  );
}
