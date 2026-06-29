// app/layout.tsx — VideoNova Studio
// Layout racine de l'application

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    template: "%s | VideoNova Studio",
    default: "VideoNova Studio — Montage vidéo en ligne",
  },
  description:
    "Créez, montez et exportez vos vidéos professionnelles directement dans votre navigateur. Gratuit, simple et puissant.",
  keywords: ["montage vidéo", "éditeur vidéo en ligne", "créer une vidéo", "formateur", "pédagogique"],
  openGraph: {
    title: "VideoNova Studio",
    description: "Montage vidéo professionnel en ligne",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-inter bg-gray-950 text-gray-50 antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
