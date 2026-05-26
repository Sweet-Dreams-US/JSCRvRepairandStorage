import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { BUSINESS } from "@/lib/business";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${BUSINESS.name} — ${BUSINESS.tagline}`,
    template: `%s | ${BUSINESS.name}`,
  },
  description: BUSINESS.about,
  openGraph: {
    title: BUSINESS.name,
    description: BUSINESS.about,
    siteName: BUSINESS.name,
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
      className={`${inter.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
