import { cn } from "cn";
import type { ReactNode } from "react";

export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn("underline-offset-4 hover:underline", className)}
    >
      {children}
      <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
    </a>
  );
}
