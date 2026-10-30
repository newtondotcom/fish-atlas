const parisDate = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const parisDateTime = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatParis(iso: string | null): string {
  if (!iso) return "date inconnue";
  return parisDate.format(new Date(iso));
}

export function formatParisDateTime(iso: string): string {
  return `${parisDateTime.format(new Date(iso))} (heure de Paris)`;
}
