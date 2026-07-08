import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { BUSINESS } from "@/lib/business";

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://jscrvrepair.com",
  ),
  title: {
    default: `${BUSINESS.name} — ${BUSINESS.tagline}`,
    template: `%s | ${BUSINESS.name}`,
  },
  description: BUSINESS.about,
  alternates: { canonical: "/" },
  openGraph: {
    title: BUSINESS.name,
    description: BUSINESS.about,
    siteName: BUSINESS.name,
    url: "/",
    locale: "en_US",
    type: "website",
  },
  applicationName: BUSINESS.name,
  keywords: [
    "RV repair",
    "RV storage",
    "RV maintenance",
    "Leesburg Indiana",
    "Kosciusko County",
    "Warsaw RV",
    "5th wheel repair",
    "motorhome service",
    "boat storage",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-cream font-sans text-ink antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
