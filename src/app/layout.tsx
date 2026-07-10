import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/providers/session-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "AutoSutra Shop | India's Automotive Store",
    template: "%s | AutoSutra Shop",
  },
  description:
    "AutoSutra Shop is India's automotive store for car and bike accessories, care products, and dealer essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <TooltipProvider>
            <Header />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Footer />
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
