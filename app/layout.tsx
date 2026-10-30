import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Carte des dépôts Sailfish OS",
  description:
    "Où se construit Sailfish OS : mic assemble l’image, l’OBS compile les RPM, et les 964 dépôts de github.com/sailfishos sont les paquets.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${body.variable} ${display.variable} ${mono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
